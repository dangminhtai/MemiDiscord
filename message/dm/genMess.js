import { AIChat } from "../../structure/AIChat.js";
import { ChannelType } from "discord.js";

const aiChat = new AIChat();

export async function execute(message) {
    if (message.author.bot || message.channel.type !== ChannelType.DM) return;

    const userId = message.author.id;
    const history = "";

    try {
        const response = await aiChat.genReply(`${message.content}\n${history}`, userId);
        if (response) await message.channel.send(response);
    } catch (err) {
        console.error(`[DMCommand] Failed to send AI response:`, err);
    }
}
