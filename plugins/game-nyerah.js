/*╔═══════════════════════════════════════════════════════╗
 *║  🦖  LORD SAURUS EMPIRE
 *╟───────────────────────────────────────────────────────╢
 *║  🌐 Web      : https://saurusdev.cloud
 *║  ▶︎ YouTube  : https://www.youtube.com/@sauruskinggwuw
 *║  📡 Saluran  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *║  ✈︎ Telegram : @lordsaurus
 *║
 *║  ⚠︎ Jangan hapus watermark ini ya!
 *╚═══════════════════ © 2026 Lunar Saurus ═════════════════╝
 *
 *  .nyerah — menyerah dari game tebak-tebakan yang sedang berjalan di chat.
 */
import { giveUp } from '../lib/scraper/game.js';

let handler = async (m, ctx) => {
  await giveUp(m, ctx);
};

handler.command = ['nyerah', 'menyerah'];
handler.tags = ['game'];
handler.help = ['nyerah'];

export default handler;
