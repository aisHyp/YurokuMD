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
 *  Game tebak-tebakan: caklontong, family100, tebakgambar, tebaklagu, dst.
 *  Logic ada di lib/game.js, dataset di library/game/*.json.
 *  Jawab dengan BALAS (reply) pesan soal dari bot.
 */
import { startGame, GAME_LIST } from '../lib/scraper/game.js';

let handler = async (m, ctx) => {
  await startGame(ctx.command.toLowerCase(), m, ctx);
};

handler.command = GAME_LIST;
handler.tags = ['game'];
handler.help = GAME_LIST;

export default handler;
