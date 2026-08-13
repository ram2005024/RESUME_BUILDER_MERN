import { prisma } from "../config/dbConfig.js";
import { groq } from "../config/Groq.js";
import { PDFParse } from "pdf-parse";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "canvas";
import { createWorker } from "tesseract.js";

// ======================================================
// OCR FALLBACK
// PDF → IMAGE → OCR → TEXT
// ======================================================

const extractTextWithOCR = async (buffer) => {
  console.log("=================================");
  console.log("TEXT EXTRACTION FAILED");
  console.log("STARTING OCR...");
  console.log("=================================");

  const worker = await createWorker("eng");

  let extractedText = "";

  try {
    // --------------------------------------------------
    // LOAD PDF
    // --------------------------------------------------

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      disableWorker: true,
    });

    const pdfDocument = await loadingTask.promise;

    console.log("PDF PAGES:", pdfDocument.numPages);

    // --------------------------------------------------
    // PROCESS EACH PAGE
    // --------------------------------------------------

    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
      console.log(`OCR PROCESSING PAGE ${pageNumber}...`);

      const page = await pdfDocument.getPage(pageNumber);

      // Higher scale = better OCR
      const viewport = page.getViewport({
        scale: 2,
      });

      // ------------------------------------------------
      // CREATE CANVAS
      // ------------------------------------------------

      const canvas = createCanvas(
        Math.ceil(viewport.width),
        Math.ceil(viewport.height),
      );

      const context = canvas.getContext("2d");

      // ------------------------------------------------
      // RENDER PDF PAGE → CANVAS
      // ------------------------------------------------

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      // ------------------------------------------------
      // CANVAS → PNG
      // ------------------------------------------------

      const imageBuffer = canvas.toBuffer("image/png");

      console.log(`PAGE ${pageNumber} IMAGE SIZE: ${imageBuffer.length} bytes`);

      // ------------------------------------------------
      // OCR
      // ------------------------------------------------

      const result = await worker.recognize(imageBuffer);

      const text = result.data.text || "";

      console.log(`PAGE ${pageNumber} OCR TEXT LENGTH: ${text.length}`);

      console.log("---------------------------------");
      console.log(text);
      console.log("---------------------------------");

      extractedText += text + "\n";

      page.cleanup();
    }

    await pdfDocument.destroy();

    return extractedText.trim();
  } catch (error) {
    console.error("OCR ERROR:", error);

    throw error;
  } finally {
    await worker.terminate();

    console.log("=================================");
    console.log("OCR FINISHED");
    console.log("=================================");
  }
};

// ======================================================
// ENHANCE TEXT
// ======================================================

export const enhanceText = async (req, res) => {
  try {
    const { text } = req.body;

    const sendingText = text?.trim();

    if (!sendingText) {
      return res.status(400).json({
        message: "Please provide the text",
        success: false,
      });
    }

    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL,

      messages: [
        {
          role: "system",
          content:
            "Summarize the following text into a concise, professional summary of 2–3 sentences. Highlight the person's key skills, achievements, and professional identity in a way that sounds polished and suitable for a resume or LinkedIn profile. Avoid repetition and keep the tone confident and formal.",
        },
        {
          role: "user",
          content: sendingText,
        },
      ],

      temperature: 0.2,
    });

    const responseText = response.choices[0]?.message?.content;

    console.log("GROQ RESPONSE:", responseText);

    if (!responseText) {
      return res.status(500).json({
        message: "No response from Groq",
        success: false,
      });
    }

    return res.json({
      success: true,
      responseText,
    });
  } catch (error) {
    console.error("Enhance text error:", error);

    return res.status(error.status || 500).json({
      message: error.message || "Failed to generate enhanced text",
      success: false,
    });
  }
};

// ======================================================
// UPLOAD PDF
// → NORMAL TEXT EXTRACTION
// → OCR FALLBACK
// → GROQ
// → PRISMA
// ======================================================

export const generateResume = async (req, res) => {
  try {
    // ==================================================
    // 1. AUTHENTICATION
    // ==================================================

    const userID = req.userID;

    if (!userID) {
      return res.status(401).json({
        message: "Please login first",
        success: false,
      });
    }

    // ==================================================
    // 2. TITLE
    // ==================================================

    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Resume title is required",
        success: false,
      });
    }

    // ==================================================
    // 3. FILE
    // ==================================================

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file",
        success: false,
      });
    }

    const buffer = req.file.buffer;

    console.log("=================================");
    console.log("FILE NAME:", req.file.originalname);
    console.log("FILE SIZE:", req.file.size);
    console.log("FILE TYPE:", req.file.mimetype);
    console.log("=================================");

    // ==================================================
    // 4. NORMAL PDF TEXT EXTRACTION
    // ==================================================

    let fileText = "";

    try {
      console.log("Trying normal PDF text extraction...");

      const parser = new PDFParse({
        data: buffer,
      });

      const result = await parser.getText();

      await parser.destroy();

      fileText = result.text?.trim() || "";

      console.log("=================================");
      console.log("NORMAL PDF TEXT LENGTH:", fileText.length);
      console.log("NORMAL PDF TEXT:");
      console.log(fileText);
      console.log("=================================");
    } catch (error) {
      console.error("Normal PDF extraction failed:", error.message);
    }

    // ==================================================
    // 5. OCR FALLBACK
    // ==================================================

    if (fileText.length < 100) {
      console.log("Not enough text extracted. Switching to OCR...");

      fileText = await extractTextWithOCR(buffer);

      console.log("=================================");
      console.log("FINAL OCR TEXT LENGTH:", fileText.length);
      console.log("FINAL OCR TEXT:");
      console.log(fileText);
      console.log("=================================");
    }

    // ==================================================
    // 6. CHECK FINAL TEXT
    // ==================================================

    if (!fileText || fileText.length < 20) {
      return res.status(400).json({
        message: "Could not extract readable text from this PDF.",
        success: false,
      });
    }

    // ==================================================
    // 7. GROQ PROMPT
    // ==================================================

    const prompt = `
You are a professional resume parser.

Extract information from the provided resume text.

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "professional_summary": "",
  "personal_info": {
    "name": "",
    "email": "",
    "phone": "",
    "address": ""
  },
  "skills": [],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ]
}

RULES:

1. Return ONLY valid JSON.
2. Do not return markdown.
3. Do not return explanations.
4. Do not invent information.
5. Preserve the actual information from the resume.
6. If information is missing, use an empty string.
7. If an array has no information, return [].
8. skills must be an array of strings.
9. education must be an array.
10. experience must be an array.
11. project must be an array.
12. is_current must be true or false.
13. Do not hallucinate dates.
14. Do not hallucinate companies.
15. Do not hallucinate skills.
16. Do not hallucinate education.
`;

    // ==================================================
    // 8. SEND TO GROQ
    // ==================================================

    console.log("=================================");
    console.log("SENDING RESUME TEXT TO GROQ...");
    console.log("TEXT LENGTH:", fileText.length);
    console.log("=================================");

    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL,

      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: fileText,
        },
      ],

      temperature: 0.1,

      response_format: {
        type: "json_object",
      },
    });

    // ==================================================
    // 9. GROQ OUTPUT
    // ==================================================

    const output = response.choices[0]?.message?.content;

    console.log("=================================");
    console.log("GROQ OUTPUT:");
    console.log(output);
    console.log("=================================");

    if (!output) {
      return res.status(500).json({
        message: "Groq did not return any response",
        success: false,
      });
    }

    // ==================================================
    // 10. PARSE JSON
    // ==================================================

    let resumeEntries;

    try {
      resumeEntries = JSON.parse(output);
    } catch (error) {
      console.error("Invalid JSON returned by Groq:", output);

      return res.status(500).json({
        message: "Groq returned invalid JSON",
        success: false,
      });
    }

    // ==================================================
    // 11. SAVE TO DATABASE
    // ==================================================

    const resume = await prisma.resume.create({
      data: {
        userID,

        title: title.trim(),

        skills: Array.isArray(resumeEntries.skills) ? resumeEntries.skills : [],

        professional_summary: resumeEntries.professional_summary || "",

        personal_info: resumeEntries.personal_info || {},

        experience:
          Array.isArray(resumeEntries.experience) &&
          resumeEntries.experience.length > 0
            ? {
                create: resumeEntries.experience,
              }
            : undefined,

        project:
          Array.isArray(resumeEntries.project) &&
          resumeEntries.project.length > 0
            ? {
                create: resumeEntries.project,
              }
            : undefined,

        education:
          Array.isArray(resumeEntries.education) &&
          resumeEntries.education.length > 0
            ? {
                create: resumeEntries.education,
              }
            : undefined,
      },
    });

    // ==================================================
    // 12. SUCCESS
    // ==================================================

    console.log("=================================");
    console.log("RESUME CREATED SUCCESSFULLY");
    console.log("RESUME ID:", resume.id);
    console.log("=================================");

    return res.status(201).json({
      message: "Resume uploaded successfully",
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Generate resume error:", error);

    return res.status(error.status || 500).json({
      message: error.message || "Failed to generate resume",
      success: false,
    });
  }
};
