import { prisma } from "../config/dbConfig.js";
import { openai } from "../config/OpenAi.js";
import { PDFParse } from "pdf-parse";

//------ Enhance text using OpenAI
export const enhanceText = async (req, res) => {
  try {
    const { text } = req.body;
    const sendingText = text?.trim();

    if (!sendingText) {
      return res.json({
        message: "Please provide the text",
        success: false,
      });
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPEN_AI_MODEL,
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
    });

    const responseText = response.choices[0].message.content;

    console.log(responseText);

    if (!responseText) {
      return res.json({
        success: false,
        message: "No response from OpenAI",
      });
    }

    return res.json({
      success: true,
      responseText,
    });
  } catch (error) {
    console.error("Enhance text error:", error);

    return res.json({
      message: "Failed to generate the enhanced text",
      success: false,
    });
  }
};

//------ Upload PDF → Extract text → OpenAI → Create Resume
export const generateResume = async (req, res) => {
  try {
    const userID = req.userID;
    const { title } = req.body;

    // Check authentication
    if (!userID) {
      return res.status(401).json({
        message: "Please login first",
        success: false,
      });
    }

    // Check title
    if (!title?.trim()) {
      return res.json({
        message: "Resume title is required",
        success: false,
      });
    }

    // Check uploaded file
    if (!req.file) {
      return res.json({
        message: "Please upload a PDF file",
        success: false,
      });
    }

    // Get PDF buffer
    const buffer = req.file.buffer;

    // Extract text from PDF
    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    const fileText = result.text?.trim();

    console.log("FILE NAME:", req.file.originalname);
    console.log("EXTRACTED TEXT:", fileText);
    console.log("TEXT LENGTH:", fileText?.length);

    // Make sure PDF contains text
    if (!fileText) {
      return res.json({
        message:
          "Could not extract text from this PDF. Please upload a text-based PDF.",
        success: false,
      });
    }

    // Prompt for OpenAI
    const prompt = `
I have extracted the text from a PDF resume.

Convert the provided resume text into structured JSON using exactly this structure:

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

Rules:
- Return ONLY valid JSON.
- Do not include markdown.
- If information is missing, use an empty string or empty array.
- Do not invent information.
- Dates must be valid ISO date strings if a date is actually available.
- If a date is unavailable, use an empty string.
`;

    // Send extracted text to OpenAI
    const response = await openai.chat.completions.create({
      model: process.env.OPEN_AI_MODEL,
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
      response_format: {
        type: "json_object",
      },
      temperature: 0.1,
    });

    const output = response.choices[0].message.content;

    console.log("OPENAI OUTPUT:", output);

    if (!output) {
      return res.json({
        message: "OpenAI did not return any response",
        success: false,
      });
    }

    // Convert JSON string → JavaScript object
    const resumeEntries = JSON.parse(output);

    // Create resume in database
    const resume = await prisma.resume.create({
      data: {
        userID,
        title: title.trim(),

        skills: resumeEntries.skills ?? [],

        professional_summary: resumeEntries.professional_summary ?? "",

        personal_info: resumeEntries.personal_info ?? {},

        experience: resumeEntries.experience?.length
          ? {
              create: resumeEntries.experience,
            }
          : undefined,

        project: resumeEntries.project?.length
          ? {
              create: resumeEntries.project,
            }
          : undefined,

        education: resumeEntries.education?.length
          ? {
              create: resumeEntries.education,
            }
          : undefined,
      },
    });

    return res.json({
      message: "Resume uploaded successfully",
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Generate resume error:", error);

    return res.status(500).json({
      message: error.message || "Failed to generate resume",
      success: false,
    });
  }
};
