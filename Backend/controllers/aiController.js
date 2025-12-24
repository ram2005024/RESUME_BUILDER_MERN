import { prisma } from "../config/dbConfig.js";
import { openai } from "../config/OpenAi.js";
//------For enhancing the text using ai
export const enhanceText = async (req, res) => {
  try {
    const { text } = req.body;

    const sendingText = text.trim();

    if (!sendingText)
      return res.json({ message: "Please provide the text", success: false });
    const response = await openai.chat.completions.create({
      model: process.env.GEMINI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Summarize the following text into a concise, professional summary of 2–3 sentences.Highlight the person’s key skills, achievements, and professional identity in a way that sounds polished and suitable for a resume or LinkedIn profile. Avoid repetition and keep the tone confident and formal.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const responseText = response.choices[0].message.content;
    console.log(responseText);
    if (responseText) return res.json({ success: true, responseText });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Failed to generate the enhanced text",
      success: false,
    });
  }
};
//-------------------------Handle file uplaod and convert to resume------------------
export const generateResume = async (req, res) => {
  const userID = req.userID;
  const { title, fileText } = req.body;
  if (!userID && !fileText)
    return res.json({
      message: "Can't upload resume.Try again",
      success: false,
    });
  const prompt = `You are a professional resume generator. 

Input: a resume text or description of the person's profile.

Task: Extract all information and structure it into JSON with the following keys:

{
  "personal_info": {
    "full_name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "professional_summary": "",
  "skills": [],
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": true/false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}

Rules:
- Return valid JSON only.
- Dates should be in "YYYY-MM" or "YYYY" format.
- If any field is missing, use empty string or empty array.
- Skills should be an array of strings.
- Experience, education, and project can have multiple objects.
`;
  try {
    const response = await openai.chat.completions.create({
      model: process.env.GEMINI_MODEL,
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
      response_format: { type: "json_object" },
    });
    const output = response.choices[0].message.content;
    console.log(output);
    const resumeEntries = JSON.parse(output);
    const resume = await prisma.resume.create({
      data: {
        userID: userID,
        title: title,
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
    console.log(error);
    return res.json({ message: error.message, success: false });
  }
};
