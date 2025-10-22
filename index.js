import dotenv from 'dotenv'
dotenv.config()
import { Client, GatewayIntentBits, Partials, Events, Collection } from 'discord.js'
import path from "path";
import { fileURLToPath } from "url";
import { loadCommands, deployCommands } from './deployCommands.js'
import { genReply } from './config/geminiConfig.js';
import { connectDB } from './db.js';
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

client.once(Events.ClientReady, () => {
    console.log(`Bot đã đăng nhập dưới tên ${client.user.tag}`);
});

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    await message.channel.sendTyping();

    const res = await genReply(message.content);
    if (res) {
        message.channel.send(res);
    } else {
        console.log('genReply trả về undefined');
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
