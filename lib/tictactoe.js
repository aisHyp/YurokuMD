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
 *  Tic Tac Toe 2 pemain (grup). Main dengan mengetik angka 1-9 langsung di
 *  chat (tanpa prefix), ditangkap hook "TICTACTOE SESSION HOOK" di yuroku.js.
 */

const TIMEOUT_MS = 15 * 60 * 1000;
const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
const SYMBOL = { X: '❌', O: '⭕', ' ': '⬜' };

const games = new Map();

function normJid(jid) {
  const raw = String(jid || '');
  const user = raw.split('@')[0].split(':')[0];
  const server = raw.endsWith('@lid') ? 'lid' : 's.whatsapp.net';
  return `${user}@${server}`;
}
function num(jid) {
  return String(jid || '').split('@')[0].split(':')[0];
}

function checkWinner(board) {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] !== ' ' && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function boardText(board) {
  let out = '';
  for (let i = 0; i < 9; i++) {
    out += SYMBOL[board[i]];
    if ((i + 1) % 3 === 0 && i < 8) out += '\n';
  }
  return out;
}

function findPlayerSymbol(game, jid) {
  const j = normJid(jid);
  if (normJid(game.players.X) === j) return 'X';
  if (normJid(game.players.O) === j) return 'O';
  return null;
}

function endGame(chatId) {
  const g = games.get(chatId);
  if (g?.timer) clearTimeout(g.timer);
  games.delete(chatId);
}

export async function handleNewGame(m, { russyuroku, args, prefix, senderPnJid, groupMetadata }) {
  if (!m.isGroup) return m.reply('❌ Game ini hanya untuk *grup*!');
  if (games.has(m.chat)) return m.reply('⚠️ Masih ada game Tic Tac Toe yang aktif di grup ini!\nSelesaikan dulu atau ketik *.tttresign*');

  let target = m.mentionedJid?.[0] || null;
  if (!target && m.quoted?.sender) target = m.quoted.sender;
  if (!target && args[0]) {
    const nomor = args[0].replace(/[^0-9]/g, '');
    if (nomor.length >= 10) target = `${nomor}@s.whatsapp.net`;
  }
  if (!target) return m.reply(`Tag lawan mainmu! Contoh: *${prefix}ttt @user*`);

  if (String(target).endsWith('@lid')) {
    target = await russyuroku.resolvePn(target, groupMetadata).catch(() => target);
  }
  const pengirim = senderPnJid || m.sender;

  if (normJid(pengirim) === normJid(target)) return m.reply('❌ Tidak bisa main sendiri!');
  if (normJid(target) === normJid(russyuroku.user.id)) return m.reply('❌ Aku tidak ikut main, ajak manusia ya 😅');

  const game = {
    board: Array(9).fill(' '),
    players: { X: pengirim, O: target },
    turn: 'X',
    moves: 0,
    chat: m.chat,
    timer: null,
  };
  game.timer = setTimeout(() => {
    if (games.get(m.chat) === game) {
      games.delete(m.chat);
      russyuroku.sendMessage(m.chat, {
        text: `⏰ Game @${num(game.players.X)} vs @${num(game.players.O)} dibatalkan (tidak ada aktivitas 15 menit).`,
        mentions: [game.players.X, game.players.O],
      }).catch(() => {});
    }
  }, TIMEOUT_MS);
  games.set(m.chat, game);

  return russyuroku.sendMessage(
    m.chat,
    {
      text:
        `🎮 *TIC TAC TOE*\n\n` +
        `❌ Player X: @${num(game.players.X)}\n` +
        `⭕ Player O: @${num(game.players.O)}\n\n` +
        `${boardText(game.board)}\n\n` +
        `Posisi:\n1️⃣2️⃣3️⃣\n4️⃣5️⃣6️⃣\n7️⃣8️⃣9️⃣\n\n` +
        `Giliran: @${num(game.players.X)} (❌)\n` +
        `Ketik angka *1-9* untuk jalan`,
      mentions: [game.players.X, game.players.O],
    },
    { quoted: m }
  );
}

export async function handleMove(m, { russyuroku, senderPnJid }) {
  if (!m.isGroup) return false;
  const game = games.get(m.chat);
  if (!game) return false;

  const teks = String(m.text || '').trim();
  if (!/^[1-9]$/.test(teks)) return false;

  const simbol = findPlayerSymbol(game, senderPnJid || m.sender);
  if (!simbol) return false;
  if (simbol !== game.turn) return false;

  const pos = parseInt(teks, 10) - 1;
  if (game.board[pos] !== ' ') {
    await m.reply('❌ Kotak itu sudah terisi, pilih yang lain!');
    return true;
  }

  game.board[pos] = simbol;
  game.moves++;

  clearTimeout(game.timer);
  game.timer = setTimeout(() => {
    if (games.get(m.chat) === game) {
      games.delete(m.chat);
      russyuroku.sendMessage(m.chat, {
        text: `⏰ Game @${num(game.players.X)} vs @${num(game.players.O)} dibatalkan (tidak ada aktivitas 15 menit).`,
        mentions: [game.players.X, game.players.O],
      }).catch(() => {});
    }
  }, TIMEOUT_MS);

  const pemenang = checkWinner(game.board);
  const mentions = [game.players.X, game.players.O];

  if (pemenang) {
    const jidMenang = game.players[pemenang];
    const papan = boardText(game.board);
    endGame(m.chat);
    await russyuroku.sendMessage(m.chat, { text: `🎉 @${num(jidMenang)} MENANG!\n\n${papan}`, mentions }, { quoted: m });
    return true;
  }

  if (game.moves >= 9) {
    const papan = boardText(game.board);
    endGame(m.chat);
    await russyuroku.sendMessage(m.chat, { text: `🤝 *SERI!*\n\n${papan}`, mentions }, { quoted: m });
    return true;
  }

  game.turn = game.turn === 'X' ? 'O' : 'X';
  const berikut = game.players[game.turn];
  await russyuroku.sendMessage(
    m.chat,
    {
      text: `🎮 *TIC TAC TOE*\n\n${boardText(game.board)}\n\nGiliran: @${num(berikut)} (${SYMBOL[game.turn]})\nKetik angka *1-9*`,
      mentions: [berikut],
    },
    { quoted: m }
  );
  return true;
}

export async function handleResign(m, { senderPnJid } = {}) {
  if (!m.isGroup) return m.reply('❌ Hanya untuk grup!');
  const game = games.get(m.chat);
  if (!game) return m.reply('❌ Tidak ada game Tic Tac Toe yang aktif di grup ini.');

  const simbol = findPlayerSymbol(game, senderPnJid || m.sender);
  if (!simbol) return m.reply('❌ Kamu bukan pemain di game ini!');

  const pemenang = simbol === 'X' ? game.players.O : game.players.X;
  const pecundang = game.players[simbol];
  endGame(m.chat);
  return m.reply(`🏳️ @${num(pecundang)} menyerah!\n🎉 @${num(pemenang)} menang!`, m.chat, {
    mentions: [pecundang, pemenang],
  });
}

export async function handleBoard(m) {
  if (!m.isGroup) return m.reply('❌ Hanya untuk grup!');
  const game = games.get(m.chat);
  if (!game) return m.reply('❌ Tidak ada game Tic Tac Toe yang aktif di grup ini.');

  return m.reply(
    `🎮 *TIC TAC TOE*\n\n` +
      `❌ X: @${num(game.players.X)}\n⭕ O: @${num(game.players.O)}\n\n` +
      `${boardText(game.board)}\n\n` +
      `Giliran: @${num(game.players[game.turn])} (${SYMBOL[game.turn]})\n` +
      `Langkah: ${game.moves}/9`,
    m.chat,
    { mentions: [game.players.X, game.players.O] }
  );
}

export async function handleClean(m) {
  if (!games.has(m.chat)) return m.reply('ℹ️ Tidak ada game Tic Tac Toe di chat ini.');
  endGame(m.chat);
  return m.reply('✅ Game Tic Tac Toe di chat ini dibersihkan.');
}
