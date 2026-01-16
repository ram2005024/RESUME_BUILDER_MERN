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
  console.log(fileText);
  const prompt = `
I have extracted the text from the pdf and i am providing text from that pdf and You are the one who make this into structured JSON.

Instructions:
- Analyze text and extract resume information.
- Output ONLY a JSON object in the following format, starting from professional_summary:

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
- For date make it should fit the prisma create in date field .I should not get invalid date make date like date object no raw date.I should fit for datetime type.I will convert into format later
- If the text contains resume data, fill the fields accurately.
- If the text is random or fields are missing, leave them empty.
- Do not output anything except the JSON object.
- Do not add explanations, comments, or text outside the JSON.
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
      temperature: 0.1,
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
