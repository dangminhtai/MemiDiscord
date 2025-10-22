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

const chat = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    username: { type: String },
    messageId: { type: String },
    messages: [messageSchema]
});
module.exports = mongoose.model('DMMessage', chat);
