//handle/AIChat.ts
import { GoogleGenAI } from "@google/genai";
import { systemPrompt } from "../config/systemPrompt/vn.js";
import dotenv from "dotenv";
import { ChatHistoryService } from "./services/chatHistory.js";

dotenv.config();

export class AIChatService {
    private ai: GoogleGenAI;
    private historyService: ChatHistoryService;

    constructor() {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        this.historyService = new ChatHistoryService();
    }

    async generateReply(userId: string, content: string, scope: 'dm' | 'guild', guildId?: string, channelId?: string) {
        const history = await this.historyService.getHistory(userId, scope, guildId, channelId);

        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content }
        ];

        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: messages,
            config: {
                temperature: 1.5
            }
        });

        const reply = response.text;

        await this.historyService.saveMessage(userId, scope, { role: 'user', content }, guildId, channelId);
        await this.historyService.saveMessage(userId, scope, { role: 'assistant', content: reply }, guildId, channelId);

        return reply;
    }
}
