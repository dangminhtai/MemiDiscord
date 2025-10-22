import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';
import { pathToFileURL } from 'url';
import { commandChanges } from './utils/compareCommands.js';

async function loadCommands(dir, client) {
    const commandsToDeploy = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            const subCommands = await loadCommands(fullPath, client);
            commandsToDeploy.push(...subCommands);
        } else if (file.isFile() && file.name.endsWith('.js')) {
            const modulePath = pathToFileURL(fullPath).href;
            const commandModule = await import(modulePath);
            const cmd = commandModule.default ?? commandModule;

            if ('data' in cmd && 'execute' in cmd) {
                client?.commands?.set(cmd.data.name, cmd);
                const needsDeploy = await commandChanges(cmd);
                if (needsDeploy) commandsToDeploy.push(cmd.data.toJSON());
            }
        }
    }

    return commandsToDeploy;
}

async function deployCommands(commands) {
    if (commands.length === 0) return;

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log(`✅ Successfully deployed ${data.length} command(s).`);
    } catch (error) {
        console.error('❌ Error during deployment:', error);
    }
}

export { loadCommands, deployCommands };
