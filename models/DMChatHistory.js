// models/DMChatHistory.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
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

const dmChatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    username: {
        type: String
    },
    messages: [messageSchema]
});

const DMChatHistory = mongoose.model("DMChatHistory", dmChatSchema);
export default DMChatHistory;
