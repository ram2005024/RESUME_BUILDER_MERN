import { prisma } from "../config/dbConfig.js";
import { groq } from "../config/Groq.js";
import { PDFParse } from "pdf-parse";

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
// UPLOAD PDF → EXTRACT TEXT → GROQ → CREATE RESUME
// ======================================================

export const generateResume = async (req, res) => {
  try {
    // --------------------------------------------------
    // 1. AUTHENTICATION
    // --------------------------------------------------

    const userID = req.userID;

    if (!userID) {
      return res.status(401).json({
        message: "Please login first",
        success: false,
      });
    }

    // --------------------------------------------------
    // 2. GET TITLE
    // --------------------------------------------------

    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Resume title is required",
        success: false,
      });
    }

    // --------------------------------------------------
    // 3. CHECK FILE
    // --------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file",
        success: false,
      });
    }

    // --------------------------------------------------
    // 4. GET PDF BUFFER
    // --------------------------------------------------

    const buffer = req.file.buffer;

    console.log("FILE NAME:", req.file.originalname);
    console.log("FILE SIZE:", req.file.size);
    console.log("FILE TYPE:", req.file.mimetype);

    // --------------------------------------------------
    // 5. EXTRACT PDF TEXT
    // --------------------------------------------------

    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    const fileText = result.text?.trim();

    console.log("========== PDF RESULT ==========");
    console.log("TEXT LENGTH:", fileText?.length);
    console.log("TEXT:", fileText);
    console.log("================================");

    // --------------------------------------------------
    // 6. CHECK EXTRACTED TEXT
    // --------------------------------------------------

    if (!fileText) {
      return res.status(400).json({
        message:
          "Could not extract text from this PDF. Please upload a text-based PDF.",
        success: false,
      });
    }

    // --------------------------------------------------
    // 7. PROMPT
    // --------------------------------------------------

    const prompt = `
You are a professional resume parser.

Extract information from the provided resume text and return
ONLY valid JSON.

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
5. If information is missing, use an empty string.
6. If an array has no information, return [].
7. skills must be an array of strings.
8. education must be an array.
9. experience must be an array.
10. project must be an array.
11. is_current must be true or false.
12. Preserve the actual information from the resume.
13. Do not hallucinate dates, companies, skills, or education.
`;

    // --------------------------------------------------
    // 8. SEND TO GROQ
    // --------------------------------------------------

    console.log("Sending resume text to Groq...");

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

    // --------------------------------------------------
    // 9. GET GROQ RESPONSE
    // --------------------------------------------------

    const output = response.choices[0]?.message?.content;

    console.log("========== GROQ OUTPUT ==========");
    console.log(output);
    console.log("=================================");

    if (!output) {
      return res.status(500).json({
        message: "Groq did not return any response",
        success: false,
      });
    }

    // --------------------------------------------------
    // 10. JSON STRING → JAVASCRIPT OBJECT
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 11. CREATE RESUME
    // --------------------------------------------------

    const resume = await prisma.resume.create({
      data: {
        userID,

        title: title.trim(),

        skills: resumeEntries.skills ?? [],

        professional_summary: resumeEntries.professional_summary ?? "",

        personal_info: resumeEntries.personal_info ?? {},

        experience:
          resumeEntries.experience?.length > 0
            ? {
                create: resumeEntries.experience,
              }
            : undefined,

        project:
          resumeEntries.project?.length > 0
            ? {
                create: resumeEntries.project,
              }
            : undefined,

        education:
          resumeEntries.education?.length > 0
            ? {
                create: resumeEntries.education,
              }
            : undefined,
      },
    });

    // --------------------------------------------------
    // 12. SUCCESS
    // --------------------------------------------------

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
