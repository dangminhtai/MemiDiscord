import { genReply } from "../../config/geminiConfig.js";
import { ChannelType } from 'discord.js';

export async function execute(message) {
    if (message.author.bot || message.channel.type !== ChannelType.DM) return;

    const userId = message.author.id;
    const history = '';
    try {
        const response = await genReply(userId, `${message.content}\n${history}`);
        if (response) await message.channel.send(response);
    } catch (err) {
        console.error(`Failed to send AI response: ${err}`);
    }
}
