import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { systemPrompt } from "../config/systemPrompt/vn.js";
dotenv.config();

export class AIChat {
    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
        this.model = 'gemini-2.5-flash-lite';
    }

    async genReply(content, userID = null) {
        try {
            const response = await this.ai.models.generateContent({
                model: this.model,
                contents: content,
                config: {
                    systemInstruction: systemPrompt,
                    temperature: 2
                }
            });
            return response.text;
        } catch (err) {
            console.error(`[AIChatService] Error generating reply:`, err);
            return 'Có lỗi xảy ra khi xử lý yêu cầu.';
        }
    }
}
