import { AIChat } from "../../structure/AIChat.js";
import { ChannelType } from "discord.js";

const aiChat = new AIChat();

export async function execute(message) {
    if (message.author.bot || message.channel.type !== ChannelType.DM) return;

    const userId = message.author.id;
    const username = message.author.username;
    try {
        await message.channel.sendTyping();
        const reply = await aiChat.genReply(message.content, userId, username);
        if (reply) await message.channel.send(reply);
    } catch (err) {
        console.error(`Failed to send AI response:`, err);
    }
}
