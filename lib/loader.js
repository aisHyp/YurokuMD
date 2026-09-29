/*═══════════════════════════════════════════════════════
 *  ⚔  Lunar Saurus Empire
 *═══════════════════════════════════════════════════════
 *  🌐  Website     : https://saurusdev.cloud
 *  ⌨︎  Developer   : https://www.youtube.com/@sauruskinggwuw
 *  ▶︎  YouTube     : https://www.youtube.com/@sauruskinggwuw
 *  📡  Saluran WA  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *  ✈︎  Telegram    : @lordsaurus
 *
 *  ⚠︎  Mohon untuk tidak menghapus watermark ini
 *═══════════════════ © 2026 Lunar Saurus ─════════════════════
 */

import { modul } from '../module.js';
const { fs } = modul;
import { color } from './color.js'

async function uncache(modulePath) {
    return true;
}

async function nocache(modulePath, cb = () => {}) {
    console.log(color('Module', 'blue'), color(`'${modulePath} is up to date!'`, 'cyan'))
    fs.watchFile(modulePath, async () => {
        fs.unwatchFile(modulePath);
        await uncache(modulePath);
        cb(modulePath);
    })
}

export {
    uncache,
    nocache
}
