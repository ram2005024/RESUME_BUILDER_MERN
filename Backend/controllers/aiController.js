import fetch from "node-fetch";
import { prisma } from "../config/dbConfig.js";

export const generateResume = async (req, res) => {
  const userID = req.userID;
  const { title, fileText } = req.body;

  if (!userID || !fileText) {
    return res.json({
      message: "Can't upload resume. Try again",
      success: false,
    });
  }

  const prompt = `
I have extracted the text from the pdf and I am providing text from that pdf.
You must convert it into structured JSON with this format:

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
- Dates must be valid ISO date strings (fit Prisma datetime).
- If data is missing, leave fields empty.
- Output ONLY the JSON object, no explanations.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }, { text: fileText }],
            },
          ],
        }),
      },
    );

    const data = await response.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      return res.json({ message: "No response from Gemini", success: false });
    }

    const resumeEntries = JSON.parse(output);

    const resume = await prisma.resume.create({
      data: {
        userID,
        title,
        skills: resumeEntries.skills ?? [],
        professional_summary: resumeEntries.professional_summary ?? "",
        personal_info: resumeEntries.personal_info ?? {},
        experience: resumeEntries.experience?.length
          ? { create: resumeEntries.experience }
          : undefined,
        project: resumeEntries.project?.length
          ? { create: resumeEntries.project }
          : undefined,
        education: resumeEntries.education?.length
          ? { create: resumeEntries.education }
          : undefined,
      },
    });

    return res.json({
      message: "Uploaded successfully",
      success: true,
      resume,
    });
  } catch (error) {
    console.error(error);
    return res.json({ message: error.message, success: false });
  }
};
