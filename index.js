import dotenv from 'dotenv'
dotenv.config()
import { Client, GatewayIntentBits, Partials, Events, Collection } from 'discord.js'
import path from "path";
import { fileURLToPath } from "url";
import { loadCommands, deployCommands } from './deployCommands.js'
import { connectDB } from './db.js';
import * as source from './message/handleMess.js'
import onReady from './events/Client/onReady.js';
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

client.on(Events.MessageCreate, async message => {
    try {
        await source.handleMess(message);
    } catch (error) {
        console.error('❌ Lỗi khi xử lý tin nhắn:', error);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Có lỗi xảy ra khi thực hiện lệnh này 🐰', ephemeral: true });
    }
});



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
