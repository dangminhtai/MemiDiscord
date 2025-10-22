import { ChannelType } from "discord.js";
import * as dm from './dm/genMess.js';
import * as server from './server/genMess.js';

export async function handleMess(message) {
    if (message.author.bot) return;
    if (message.channel.type === ChannelType.DM) {
        return dm.execute(message);
    } else if (message.guild) {
        return server.execute(message);
    }
}