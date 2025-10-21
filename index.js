import dotenv from 'dotenv'
dotenv.config()
import { Client, GatewayIntentBits, Partials, Events, Collection } from 'discord.js'
import { botName } from './config/bot.js';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
client.commands = new Collection();

function getAllCommandFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllCommandFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith(".js")) {
            arrayOfFiles.push(fullPath);
        }
    }
    return arrayOfFiles;
}

async function loadCommands() {
    const commands = [];
    const commandFiles = getAllCommandFiles(path.join(__dirname, "commands"));

    for (const file of commandFiles) {
        try {
            const commandModule = await import(`file://${file}`);
            const command = commandModule.default || commandModule;

            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
                console.log(`[SUCCESS] Đã load lệnh: ${command.data.name}`);
            } else {
                console.warn(`[WARNING] Thiếu "data" hoặc "execute" trong lệnh: ${file}`);
            }
        } catch (err) {
            console.error(`[ERROR] Lỗi khi load lệnh từ: ${file}`, err);
        }
    }
}

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
client.login(process.env.DISCORD_TOKEN)
