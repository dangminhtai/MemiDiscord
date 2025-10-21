//commands/chao.js
import { SlashCommandBuilder } from 'discord.js';
import { botName } from '../config/bot.js';

export const data = new SlashCommandBuilder()
    .setName('hello')
    .setDescription(`Lệnh chào cho bot ${botName}`);

export async function execute(interaction) {
    await interaction.reply({
        content: `Chào bạn, mình là ${botName} 🐰`,
        ephemeral: true,
    });
}
