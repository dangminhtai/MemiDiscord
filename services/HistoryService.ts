//services/HistoryService.ts
import ChatHistory from "../models/chatHistory.js";

export class HistoryService {
    async getHistory(userId: string, scope: string, guildId?: string, channelId?: string) {
        const query: any = { userId, scope };
        if (guildId) query.guildId = guildId;
        if (channelId) query.channelId = channelId;

        const doc = await ChatHistory.findOne(query);
        return doc ? doc.messages : [];
    }

    async saveMessage(userId: string, scope: string, message: any, guildId?: string, channelId?: string) {
        const query: any = { userId, scope };
        if (guildId) query.guildId = guildId;
        if (channelId) query.channelId = channelId;

        await ChatHistory.updateOne(query, { $push: { messages: message } }, { upsert: true });
    }
}
