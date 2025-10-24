// events/dmHandler.js
import { ChannelType } from "discord.js";
import { AIChat } from "../../structure/AIChat.js";

const aiChat = new AIChat();

export async function execute(message) {
    if (message.author.bot || message.channel.type !== ChannelType.DM) return;

    const userId = message.author.id;
    const username = message.author.username;
    const content = message.content?.trim() || "";
    const attachments = [...message.attachments.values()]; // array of Attachment

    try {
        await message.channel.sendTyping();

        const reply = await aiChat.genReply(content, userId, username, attachments);
        if (reply) await message.channel.send(reply);
    } catch (err) {
        console.error("[DMHandler] Failed to send AI response:", err);
        try { await message.channel.send("Có lỗi khi xử lý. Thử gửi lại sau."); } catch (e) { /* ignore */ }
    }
}
