import mongoose from "mongoose";

const messagePartSchema = new mongoose.Schema({
    type: { type: String, enum: ["text", "audio", "image", "file"], required: true },
    text: { type: String },
    mimeType: { type: String },
    data: { type: String }, // base64 hoặc URL upload
}, { _id: false });

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    parts: [messagePartSchema],
    timestamp: { type: Date, default: Date.now },
}, { _id: false });

const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    username: { type: String },
    messageId: { type: String },
    messages: [messageSchema],
});

export default mongoose.model("DMChatHistory", chatSchema);
