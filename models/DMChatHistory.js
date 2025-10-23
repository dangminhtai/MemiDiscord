import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }

}, { _id: false });

const chat = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    username: { type: String },
    messageId: { type: String },
    messages: [messageSchema]
});

export default mongoose.model("DMChatHistory", chat);