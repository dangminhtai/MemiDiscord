import dotenv from 'dotenv'
dotenv.config()
import { Client, GatewayIntentBits, Partials, Events, SlashCommandBuilder } from 'discord.js'
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

const botName = 'Memi';
client.once(Events.ClientReady, () => {
    console.log(`Bot đã đăng nhập dưới tên ${client.user.tag}`);
});

client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return //Nếu tác giả nhắn tin nhắn này là bot thì không làm gì cả
    if (message.content == 'Chào') {
        message.channel.send(
            `Chào bạn ạ, mình là ${botName} 🐰`);
    }
});

// Thử tạo 1 commands mới
export const data = new SlashCommandBuilder()
    .setName('chao')
    .setNSFW(false)
    .setDescription(`Lệnh chào cho bot ${botName}`)

export async function execute(interaction) {
    await interaction.reply(
        {
            content: 'Mình chào bạn',
            ephemeral: true
        }
    );

}
client.login(process.env.DISCORD_TOKEN)
