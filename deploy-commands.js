//deploy-commands.js
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';
import { pathToFileURL } from 'url';

async function loadCommands(dir, client) {
    const commands = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            const subCommands = await loadCommands(fullPath, client);
            commands.push(...subCommands);
        } else if (file.isFile() && file.name.endsWith('.js')) {
            const modulePath = pathToFileURL(fullPath).href;
            const command = await import(modulePath);
            const cmd = command.default ?? command;

            if ('data' in cmd && 'execute' in cmd) {
                client?.commands?.set(cmd.data.name, cmd);
                commands.push(cmd.data.toJSON());
            }
        }
    }
    return commands;
}

async function deployCommands(commands) {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
        const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log(`✅ Successfully deployed ${data.length} global commands.`);
    } catch (error) {
        console.error('❌ Error during global command deployment:', error);
    }
}


export { loadCommands, deployCommands }