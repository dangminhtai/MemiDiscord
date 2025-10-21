import dotenv from 'dotenv'
dotenv.config()
import { Client, GatewayIntentBits, Partials } from 'discord.js'
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
client.once('ready', () => {
    console.log(`Bot đã đăng nhập dưới tên ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return //Nếu tác giả nhắn tin nhắn này là bot thì không làm gì cả
    if (message.content == 'Chào') {
        message.channel.send(`Chào bạn ạ, mình là ${botName} 🐰`);
    }
});

client.login(process.env.DISCORD_TOKEN)
