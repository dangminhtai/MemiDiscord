// structure/AIChat.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import DMChatHistory from "../models/DMChatHistory.js";
import { systemPrompt } from "../config/systemPrompt/vn.js";
dotenv.config();

export class AIChat {
    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
        this.model = "gemini-2.5-flash-lite";
        this.temperature = 0.1;
        this.maxOutputTokens = 500;
        this.maxHistory = 10;
        this.maxStoredMessages = 50;
    }

    async getHistory(userId) {
        const chat = await DMChatHistory.findOne({ userId });
        if (!chat || !chat.messages.length) return [];
        const limitedMessages = chat.messages.slice(-this.maxHistory);
        return limitedMessages.map(msg => ({
            role: msg.role === "assistant" ? "model" : msg.role,
            parts: [{ text: msg.content }]
        }));
    }

    async pushMessage(userId, role, content, username = null) {
        let chat = await DMChatHistory.findOne({ userId });
        if (!chat) chat = new DMChatHistory({ userId, username, messages: [] });

        chat.messages.push({ role, content });
        if (chat.messages.length > this.maxStoredMessages) {
            chat.messages = chat.messages.slice(-this.maxStoredMessages);
        }
        await chat.save();
    }

    async genReply(userMessage, userId, username = null) {
        try {
            await this.pushMessage(userId, "user", userMessage, username);
            const contextContents = await this.getHistory(userId);
            const contents = [
                ...contextContents,
                { role: "user", parts: [{ text: userMessage }] }
            ];
            const result = await this.ai.models.generateContent({
                model: this.model,
                contents: contents,
                config: {
                    systemInstruction: systemPrompt,
                    temperature: this.temperature,
                    maxOutputTokens: this.maxOutputTokens
                }
            });

            await this.pushMessage(userId, "assistant", result.text);
            return result.text;
        } catch (err) {
            console.error("[AIChatService] Error generating reply:", err);
            return;
        }
    }
}
