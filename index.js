import dotenv from 'dotenv'
dotenv.config()
import { Client, GatewayIntentBits, Partials, Events, Collection } from 'discord.js'
import { botName } from './config/bot.js';
import path from "path";
import { fileURLToPath } from "url";
import { loadCommands, deployCommands } from './deploy-commands.js'

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

client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return
    if (message.content == 'Chào') {
        message.channel.send(
            `Chào bạn ạ, mình là ${botName} 🐰`);
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

const commandsPath = path.join(__dirname, 'commands')
const commands = await loadCommands(commandsPath, client);
await deployCommands(commands);

client.login(process.env.DISCORD_TOKEN)
