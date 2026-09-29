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
 *  .kuismath [kategori] [level] — kuis pengetahuan umum berlevel.
 */
import { handleKuisMath } from '../lib/kuismath.js';

let handler = async (m, ctx) => {
  await handleKuisMath(m, ctx);
};

handler.command = ['kuismath', 'mathquiz', 'mathchallenge'];
handler.tags = ['game'];
handler.help = ['kuismath'];

export default handler;
