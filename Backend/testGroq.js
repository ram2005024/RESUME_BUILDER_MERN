import "dotenv/config";
import { groq } from "./config/Groq.js";

const response = await groq.chat.completions.create({
  model: process.env.GROQ_MODEL,
  messages: [
    {
      role: "user",
      content: "Say hello in one sentence.",
    },
  ],
});

console.log(response.choices[0].message.content);
