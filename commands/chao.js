//commands/chao.js
import { SlashCommandBuilder } from 'discord.js';
import { botName } from '../config/bot.js';

export const data = new SlashCommandBuilder()
    .setName('chao')
    .setDescription(`Lệnh chào cho bot ${botName}`);

export async function execute(interaction) {
    await interaction.reply({
        content: `Mình chào bạn, mình là ${botName} 🐰`,
        ephemeral: true,
    });
}
