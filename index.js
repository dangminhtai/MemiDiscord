import dotenv from 'dotenv'
dotenv.config()
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js'
import path from "path";
import { fileURLToPath } from "url";
import { loadCommands, deployCommands } from './deployCommands.js'
import { connectDB } from './db.js';

import onReady from './events/Client/onReady.js';
import messageCreate from './events/Client/messageCreate.js';
import interactionCreate from './events/Client/interactionCreate.js';
// import { info, success, error, warn } from './utils/logger.js';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
client.commands = new Collection()
onReady(client);
messageCreate(client);
interactionCreate(client);



async function main() {
    try {
        await connectDB();
        const commandsPath = path.join(__dirname, 'commands')
        const commands = await loadCommands(commandsPath, client);
        await deployCommands(commands);
        await client.login(process.env.DISCORD_TOKEN);
    } catch (err) {
        console.error('Lỗi khi kết nối và khởi động BOT', err);
    }
}
main();
