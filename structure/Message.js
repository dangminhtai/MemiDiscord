// structure/Message.js
class Message {
    constructor(message) {
        this.message = message;
    }

    getText() {
        return this.message.content;
    }

    getAttachments() {
        return Array.from(this.message.attachments.values());
    }

    analyze() {
        const result = {
            hasText: this.hasText(),
            hasURL: this.hasURL(),
            images: [],
            audios: [],
            documents: [],
        };

        for (const att of this.getAttachments()) {
            const type = att.contentType || "";
            if (type.startsWith("image")) result.images.push(type);
            else if (type.startsWith("audio")) result.audios.push(type);
            else if (type.startsWith("application")) result.documents.push(type);
        }

        return result;
    }

    hasText() {
        return this.message.content.trim().length > 0;
    }

    hasURL() {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return urlRegex.test(this.message.content);
    }

    getMessageType() {
        const a = this.analyze();

        if (a.hasText && a.images.length === 0 && a.audios.length === 0 && a.documents.length === 0)
            return "text";
        if (!a.hasText && a.images.length > 0)
            return "image";
        if (a.hasText && a.images.length > 0)
            return "text+image";
        if (a.audios.length > 0)
            return "audio";
        if (a.documents.length > 0)
            return "document";
        return "unknown";
    }
}

export { Message };
