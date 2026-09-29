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
 *  .tebakbom — pilih petak 1-10, hindari 3 bom. Logic di lib/tebakbom.js.
 */
import { startTebakBom } from '../lib/tebakbom.js';

let handler = async (m, ctx) => {
  await startTebakBom(m, ctx);
};

handler.command = ['tebakbom'];
handler.tags = ['game'];
handler.help = ['tebakbom'];

export default handler;
