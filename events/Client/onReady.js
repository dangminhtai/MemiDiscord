import { Events } from 'discord.js';

/**
 * @param {import('discord.js').Client} client
 */
export default (client) => {
    client.once(Events.ClientReady, () => {
        console.log(`Bot đã đăng nhập dưới tên ${client.user.tag}`);
    });
};
