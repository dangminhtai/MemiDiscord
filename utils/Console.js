import 'colors';
import fs from 'fs';

const LOG_PATH = './terminal.log';

if (!fs.existsSync(LOG_PATH)) fs.writeFileSync(LOG_PATH, '');

export const info = (...message) => {
    const time = new Date().toLocaleTimeString();
    let fileContent = fs.readFileSync(LOG_PATH, 'utf-8');

    console.info(`[${time}]`.gray, '[Info]'.blue, message.join(' '));
    fileContent += [`[${time}]`, '[Info]', message.join(' ')].join(' ') + '\n';

    fs.writeFileSync(LOG_PATH, fileContent, 'utf-8');
};

/**
 * @param {string[]} message 
 */
export const success = (...message) => {
    const time = new Date().toLocaleTimeString();
    let fileContent = fs.readFileSync(LOG_PATH, 'utf-8');

    console.info(`[${time}]`.gray, '[OK]'.green, message.join(' '));
    fileContent += [`[${time}]`, '[OK]', message.join(' ')].join(' ') + '\n';

    fs.writeFileSync(LOG_PATH, fileContent, 'utf-8');
};

/**
 * @param {string[]} message 
 */
export const error = (...message) => {
    const time = new Date().toLocaleTimeString();
    let fileContent = fs.readFileSync(LOG_PATH, 'utf-8');

    console.error(`[${time}]`.gray, '[Error]'.red, message.join(' '));
    fileContent += [`[${time}]`, '[Error]', message.join(' ')].join(' ') + '\n';

    fs.writeFileSync(LOG_PATH, fileContent, 'utf-8');
};

export const warn = (...message) => {
    const time = new Date().toLocaleTimeString();
    let fileContent = fs.readFileSync(LOG_PATH, 'utf-8');

    console.warn(`[${time}]`.gray, '[Warning]'.yellow, message.join(' '));
    fileContent += [`[${time}]`, '[Warning]', message.join(' ')].join(' ') + '\n';

    fs.writeFileSync(LOG_PATH, fileContent, 'utf-8');
};
