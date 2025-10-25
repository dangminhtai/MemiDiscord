import { Message as MyMessage } from "../../structure/Message.js";
import { AIChat } from "../../structure/AIChat.js";
import { ChannelType } from "discord.js";
const ai = new AIChat();
export async function execute(message) {
    if (message.author.bot || message.channel.type !== ChannelType.DM) return;

    const msg = new MyMessage(message);
    const msgType = msg.getMessageType();
    const userId = message.author.id;
    const username = message.author.username;

    try {
        await message.channel.sendTyping();
        const reply = await ai.genReply(msg.getText(), userId, username, msgType);
        if (reply) await message.channel.send(reply);
    }
    catch (err) {
        console.error('Có lỗi khi gửi phản hồi', err);
    }

};
