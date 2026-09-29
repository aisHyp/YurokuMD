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
 *  .sambungkata2 create|join|start <kata>|end — Sambung Kata multiplayer.
 *  (Command .sambungkata = versi 1 pemain dari game-tebak.js)
 */
import { handleSambungKata } from '../lib/sambungkata.js';

let handler = async (m, ctx) => {
  await handleSambungKata(m, ctx);
};

handler.command = ['sambungkata2', 'sk'];
handler.tags = ['game'];
handler.help = ['sambungkata2'];

export default handler;
