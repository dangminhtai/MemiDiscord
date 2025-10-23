import { Events } from "discord.js";
import * as source from '../../message/handleMess.js'
export default (client) => {
    client.on(Events.MessageCreate, async message => {
        if (message.author.bot) return;

        try {
            await source.handleMess(message);
        } catch (error) {
            console.error("❌ Lỗi khi xử lý tin nhắn:", error);
        }
    });
}