// structure/AIChat.js
import { GoogleGenAI, createPartFromUri } from "@google/genai";
import dotenv from "dotenv";
import mime from "mime-types";
import fs from "fs";
import path from "path";
import DMChatHistory from "../models/DMChatHistory.js";
import { systemPrompt } from "../config/systemPrompt/vn.js";

dotenv.config();

export class AIChat {
    constructor() {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        this.textModel = "gemini-2.5-flash-lite"; // text-only
        this.multiModel = "gemini-2.0-flash"; // multimodal
        this.temperature = 0.1;
        this.maxOutputTokens = 500;
        this.maxHistory = 10;
        this.maxStoredMessages = 50;
        this.tempDir = "./temp";
    }

    /* ---------- DB helpers (giữ logic gốc) ---------- */
    async getHistory(userId) {
        const chat = await DMChatHistory.findOne({ userId });
        if (!chat || !chat.messages.length) return [];
        const limitedMessages = chat.messages.slice(-this.maxHistory);
        // Trả về mảng object ban đầu để không phá cấu trúc cũ
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

    /* ---------- utils: download -> upload ---------- */
    async ensureTempDir() {
        if (!fs.existsSync(this.tempDir)) fs.mkdirSync(this.tempDir, { recursive: true });
    }

    async downloadAttachmentToLocal(fileUrl) {
        await this.ensureTempDir();
        const filename = path.basename(new URL(fileUrl).pathname) || `file_${Date.now()}`;
        const filePath = path.join(this.tempDir, `${Date.now()}_${filename}`);

        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`Không tải được file (${res.status})`);
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
        return filePath;
    }

    async uploadLocalFileToGemini(localFilePath) {
        const mimeType = mime.lookup(localFilePath) || "application/octet-stream";
        const uploaded = await this.ai.files.upload({
            file: localFilePath,
            config: {
                displayName: path.basename(localFilePath),
                mimeType,
            },
        });

        // chờ processing
        let status;
        do {
            status = await this.ai.files.get({ name: uploaded.name });
            if (status.state === "PROCESSING") await new Promise(r => setTimeout(r, 2000));
        } while (status.state === "PROCESSING");

        if (status.state === "FAILED") throw new Error("Upload thất bại.");
        return status; // { uri, mimeType, name, ... }
    }

    async cleanupLocal(filePath) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    }

    /* ---------- core: genReply (sửa) ---------- */
    /**
     * userMessage: string (may be empty)
     * attachments: array of Discord Attachment objects (or objects having .url, .name, .contentType)
     */
    async genReply(userMessage, userId, username = null, attachments = []) {
        try {
            // Save user text if present
            if (userMessage && userMessage.trim()) {
                await this.pushMessage(userId, "user", userMessage, username);
            }

            // Lấy history dạng ban đầu
            const contextContents = await this.getHistory(userId);
            // Chuyển history thành mảng string (một phần quan trọng)
            const historyTexts = contextContents
                .map(c => (c.parts && c.parts[0] && c.parts[0].text) ? c.parts[0].text : "")
                .filter(t => !!t);

            // Nếu không có attachments: xử lý text-only (dùng model nhẹ)
            if (!attachments || attachments.length === 0) {
                const contentsFlat = [...historyTexts, userMessage || ""];
                const res = await this.ai.models.generateContent({
                    model: this.textModel,
                    contents: contentsFlat,
                    config: {
                        systemInstruction: systemPrompt,
                        temperature: this.temperature,
                        maxOutputTokens: this.maxOutputTokens,
                    },
                });

                const replyText = res.text?.trim() || "";
                await this.pushMessage(userId, "assistant", replyText);
                return replyText;
            }

            // Có attachments: tải -> upload -> tạo parts (text prompt string + file parts)
            const uploadedStatuses = [];
            for (const att of attachments) {
                try {
                    const localPath = await this.downloadAttachmentToLocal(att.url);
                    const status = await this.uploadLocalFileToGemini(localPath);
                    uploadedStatuses.push(status);
                    await this.cleanupLocal(localPath);
                } catch (e) {
                    console.error("[AIChat] upload error for attachment:", att.name, e.message || e);
                }
            }

            if (!uploadedStatuses.length) {
                const errMsg = "Không upload được tệp đính kèm. Kiểm tra quyền truy cập hoặc thử gửi lại.";
                await this.pushMessage(userId, "assistant", errMsg);
                return errMsg;
            }

            // Build a FLAT contents array: history strings -> userMessage string -> then file parts
            const contentsFlat = [...historyTexts];
            if (userMessage && userMessage.trim()) contentsFlat.push(userMessage);

            for (const s of uploadedStatuses) {
                // createPartFromUri returns a Part compatible with the SDK; append directly
                contentsFlat.push(createPartFromUri(s.uri, s.mimeType));
            }

            const res = await this.ai.models.generateContent({
                model: this.multiModel,
                contents: contentsFlat,
                config: {
                    systemInstruction: systemPrompt,
                    temperature: this.temperature,
                    maxOutputTokens: this.maxOutputTokens,
                },
            });

            const replyText = res.text?.trim() || "";
            await this.pushMessage(userId, "assistant", replyText);
            return replyText;
        } catch (err) {
            console.error("[AIChat] Error generating reply:", err);
            return "Có lỗi xảy ra khi xử lý yêu cầu.";
        }
    }
}
