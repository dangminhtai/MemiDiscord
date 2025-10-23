//models/chatHistory.js
const mongoose = require('mongoose');

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

const chatSchema = new mongoose.Schema({
    scope: {
        type: String,
        enum: ['dm', 'guild'],
        required: true
    },
    userId: { type: String, required: true },
    username: { type: String },

    messageId: { type: String },
    guildId: { type: String },
    channelId: { type: String },

    messages: [messageSchema]
});

chatSchema.index({ scope: 1, userId: 1, guildId: 1, channelId: 1 });

module.exports = mongoose.model('ChatHistory', chatSchema);
