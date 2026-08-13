import { prisma } from "../config/dbConfig.js";
import { groq } from "../config/Groq.js";

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
// GENERATE RESUME
//
// FRONTEND
// PDF
//   ↓
// PDF.js
//   ↓
// extractedText
//   ↓
// POST { text, title }
//   ↓
// THIS CONTROLLER
//   ↓
// GROQ
//   ↓
// PRISMA
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
    // 2. GET DATA FROM FRONTEND
    // ==================================================

    const { title, text } = req.body;

    // ==================================================
    // 3. VALIDATE TITLE
    // ==================================================

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Resume title is required",
        success: false,
      });
    }

    // ==================================================
    // 4. VALIDATE EXTRACTED TEXT
    // ==================================================

    const fileText = text?.trim();

    if (!fileText) {
      return res.status(400).json({
        message: "Resume text is required",
        success: false,
      });
    }

    if (fileText.length < 20) {
      return res.status(400).json({
        message: "Resume text is too short",
        success: false,
      });
    }

    console.log("=================================");
    console.log("RESUME TEXT RECEIVED");
    console.log("TEXT LENGTH:", fileText.length);
    console.log("=================================");

    // ==================================================
    // 5. GROQ PROMPT
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
    // 6. SEND RESUME TEXT TO GROQ
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
    // 7. GET GROQ OUTPUT
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
    // 8. PARSE GROQ JSON
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
    // 9. SAVE TO DATABASE
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
    // 10. SUCCESS
    // ==================================================

    console.log("=================================");
    console.log("RESUME CREATED SUCCESSFULLY");
    console.log("RESUME ID:", resume.id);
    console.log("=================================");

    return res.status(201).json({
      message: "Resume generated successfully",
      success: true,
      resume,
    });
  } catch (error) {
    // ==================================================
    // 11. ERROR
    // ==================================================

    console.error("Generate resume error:", error);

    return res.status(error.status || 500).json({
      message: error.message || "Failed to generate resume",
      success: false,
    });
  }
};
