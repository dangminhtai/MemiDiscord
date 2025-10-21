import { systemPrompt } from "./systemPrompt/vn";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config()
const ai = new GoogleGenAI(
    {
        apiKey: process.env.GEMINI_API_KEY
    }
);
async function genReply(content) {
    const response = await ai.models.generateContent(
        {
            model: 'gemini-2.5-flash-lite',
            contents: content,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.1,
            }
        }
    );
    console.log('Phản hồi nhận được', response.text);
}

export { genReply };
