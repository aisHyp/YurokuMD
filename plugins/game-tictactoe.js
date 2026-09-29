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
 *  Tic Tac Toe 2 pemain (grup).
 *   .ttt @user     -> mulai
 *   angka 1-9      -> jalan (tanpa prefix, lewat hook di yuroku.js)
 *   .tttresign     -> menyerah
 *   .tttboard      -> lihat papan
 *   .tttclean      -> (owner) bersihkan game yang nyangkut
 */
import { handleNewGame, handleResign, handleBoard, handleClean } from '../lib/tictactoe.js';

let handler = async (m, ctx) => {
  switch (ctx.command.toLowerCase()) {
    case 'tictactoe':
    case 'ttt':
    case 'tttplay':
      return handleNewGame(m, ctx);
    case 'tttresign':
    case 'tttsurrender':
      return handleResign(m, ctx);
    case 'tttboard':
    case 'tttstatus':
      return handleBoard(m, ctx);
    case 'tttclean':
    case 'tttcleanup':
      if (!ctx.isCreator) return m.reply(global.mess.creator);
      return handleClean(m, ctx);
  }
};

handler.command = [
  'tictactoe', 'ttt', 'tttplay',
  'tttresign', 'tttsurrender',
  'tttboard', 'tttstatus',
  'tttclean', 'tttcleanup',
];
handler.tags = ['game'];
handler.help = ['tictactoe'];

export default handler;
