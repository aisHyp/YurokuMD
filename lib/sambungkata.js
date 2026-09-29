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
 *  Sambung Kata multiplayer (grup). Pemain bergiliran menyambung kata dari
 *  1-2 huruf terakhir kata sebelumnya.
 *
 *  .sambungkata2 create | join | start <kata> | end
 *  Jawaban dikirim tanpa prefix, ditangkap hook "SAMBUNG KATA SESSION HOOK"
 *  di yuroku.js.
 *
 *  Catatan: bot TIDAK memeriksa KBBI, hanya aturan sambung & duplikasi kata.
 */

const TIME_LIMIT = 30000;
const MAX_ERRORS = 3;
const MIN_WORD = 3;

const sessions = new Map();

function num(jid) {
  return String(jid || '').split('@')[0].split(':')[0];
}
function same(a, b) {
  return num(a) === num(b);
}

function lastLetters(word) {
  const w = word.toLowerCase();
  const out = [];
  if (w.length >= 1) out.push(w.slice(-1));
  if (w.length >= 2) out.push(w.slice(-2));
  return out;
}

function nextPlayer(session, current) {
  const i = session.players.findIndex((p) => same(p, current));
  return session.players[(i + 1) % session.players.length];
}

function clearSession(chatId) {
  const s = sessions.get(chatId);
  if (s?.timeout) clearTimeout(s.timeout);
  sessions.delete(chatId);
}

async function kirim(russyuroku, chatId, text, mentions = []) {
  return russyuroku.sendMessage(chatId, { text, mentions });
}

function startTimer(russyuroku, chatId, session) {
  clearTimeout(session.timeout);
  session.timeout = setTimeout(() => onTimeout(russyuroku, chatId), TIME_LIMIT);
}

async function kalah(russyuroku, chatId, session, pemain, teks) {
  teks += `\n\n❌ Batas kesalahan tercapai (${MAX_ERRORS}). *@${num(pemain)}* kalah!\n\n*Permainan Sambung Kata selesai!*`;
  clearSession(chatId);
  return kirim(russyuroku, chatId, teks, session.players);
}

async function salahJawab(russyuroku, chatId, session, alasan) {
  session.errors++;
  const pemain = session.currentPlayer;
  let teks = `${alasan}\nKesalahan game: ${session.errors}/${MAX_ERRORS}.`;
  if (session.errors >= MAX_ERRORS) return kalah(russyuroku, chatId, session, pemain, teks);

  const wajib = lastLetters(session.currentWord);
  teks += `\n\nKamu masih punya kesempatan!\nKata harus berawalan *${wajib.join('* atau *')}*\n*Waktu ${TIME_LIMIT / 1000} detik dimulai!*`;
  startTimer(russyuroku, chatId, session);
  return kirim(russyuroku, chatId, teks, session.players);
}

async function onTimeout(russyuroku, chatId) {
  const session = sessions.get(chatId);
  if (!session || session.status !== 'playing') return;

  session.errors++;
  const pemain = session.currentPlayer;
  let teks = `⏳ *Waktu @${num(pemain)} habis!* Kata sebelumnya: *${session.currentWord.toUpperCase()}*.\nKesalahan game: ${session.errors}/${MAX_ERRORS}.`;
  if (session.errors >= MAX_ERRORS) return kalah(russyuroku, chatId, session, pemain, teks);

  session.currentPlayer = nextPlayer(session, pemain);
  const wajib = lastLetters(session.currentWord);
  teks += `\n\nGiliran: *@${num(session.currentPlayer)}*\nKata harus berawalan *${wajib.join('* atau *')}*\n*Waktu ${TIME_LIMIT / 1000} detik dimulai!*`;
  startTimer(russyuroku, chatId, session);
  return kirim(russyuroku, chatId, teks, session.players);
}

async function create(m, { russyuroku, senderPnJid, prefix }) {
  if (sessions.has(m.chat)) {
    return m.reply(`❌ Game Sambung Kata sudah ada di grup ini. Ketik *${prefix}sambungkata2 join* untuk bergabung.`);
  }
  const sender = senderPnJid || m.sender;
  sessions.set(m.chat, {
    status: 'pending',
    creator: sender,
    players: [sender],
    currentWord: null,
    usedWords: new Set(),
    currentPlayer: null,
    errors: 0,
    timeout: null,
  });
  return kirim(
    russyuroku,
    m.chat,
    `🎲 *Game Sambung Kata Dibuat!*\n\n👤 Pembuat: *@${num(sender)}*\n\n` +
      `Ketik *${prefix}sambungkata2 join* untuk bergabung.\n` +
      `Minimal 2 pemain untuk memulai.\n\n` +
      `Setelah cukup, ketik *${prefix}sambungkata2 start <kata_pertama>*`,
    [sender]
  );
}

async function join(m, { russyuroku, senderPnJid, prefix }) {
  const s = sessions.get(m.chat);
  if (!s) return m.reply(`❌ Tidak ada game aktif. Ketik *${prefix}sambungkata2 create* untuk membuat game baru.`);
  if (s.status !== 'pending') return m.reply('❌ Game sudah dimulai, tidak bisa bergabung sekarang.');
  const sender = senderPnJid || m.sender;
  if (s.players.some((p) => same(p, sender))) return m.reply('ℹ️ Kamu sudah bergabung dalam permainan ini.');

  s.players.push(sender);
  return kirim(
    russyuroku,
    m.chat,
    `✅ *@${num(sender)}* bergabung! (${s.players.length} pemain)\n\n` +
      `Ketik *${prefix}sambungkata2 start <kata_pertama>* untuk memulai.`,
    s.players
  );
}

async function start(m, args, { russyuroku, senderPnJid, prefix }) {
  const s = sessions.get(m.chat);
  if (!s) return m.reply(`❌ Tidak ada game aktif. Ketik *${prefix}sambungkata2 create* dulu.`);
  if (s.status === 'playing') return m.reply('❌ Game sudah berjalan.');
  const sender = senderPnJid || m.sender;
  if (!same(s.creator, sender)) {
    return kirim(russyuroku, m.chat, `❌ Hanya pembuat game (@${num(s.creator)}) yang bisa memulai.`, [s.creator]);
  }
  if (s.players.length < 2) {
    return m.reply(`❌ Minimal 2 pemain. Saat ini baru ${s.players.length}.`);
  }

  const kata = String(args[0] || '').toLowerCase().trim();
  if (kata.length < MIN_WORD) {
    return m.reply(`❌ Kata pertama minimal ${MIN_WORD} huruf. Contoh: *${prefix}sambungkata2 start batu*`);
  }

  s.status = 'playing';
  s.currentWord = kata;
  s.usedWords.add(kata);
  s.currentPlayer = s.players[Math.floor(Math.random() * s.players.length)];
  startTimer(russyuroku, m.chat, s);

  const wajib = lastLetters(kata);
  return kirim(
    russyuroku,
    m.chat,
    `🌟 *Game Sambung Kata Dimulai!*\nPemain: ${s.players.length} orang\nKata pertama: *${kata.toUpperCase()}*\n\n` +
      `Giliran pertama: *@${num(s.currentPlayer)}*\n` +
      `Kata harus berawalan *${wajib.join('* atau *')}*\n\n` +
      `_Bot hanya memeriksa aturan sambung & duplikasi, bukan KBBI._\n*Waktu ${TIME_LIMIT / 1000} detik dimulai!*`,
    s.players
  );
}

async function end(m, { senderPnJid, isAdmins, isCreator }) {
  const s = sessions.get(m.chat);
  if (!s) return m.reply('❌ Tidak ada game aktif.');
  const sender = senderPnJid || m.sender;
  if (!same(s.creator, sender) && !isAdmins && !isCreator) {
    return m.reply(`❌ Hanya pembuat game (@${num(s.creator)}), admin grup, atau owner yang bisa mengakhiri game.`, m.chat, { mentions: [s.creator] });
  }
  clearSession(m.chat);
  return m.reply('✅ Game Sambung Kata telah diakhiri.');
}

function bantuan(prefix) {
  return (
    `*🧩 SAMBUNG KATA (MULTIPLAYER) 🧩*\n\n` +
    `Perintah:\n` +
    `1. *${prefix}sambungkata2 create* — buat sesi baru\n` +
    `2. *${prefix}sambungkata2 join* — bergabung\n` +
    `3. *${prefix}sambungkata2 start <kata>* — mulai (min. 2 pemain)\n` +
    `4. *${prefix}sambungkata2 end* — akhiri game\n\n` +
    `Saat bermain, kirim kata jawabanmu langsung tanpa prefix (misal: *tukang*)\n\n` +
    `*Aturan:*\n` +
    `• Ambil *1 atau 2 huruf terakhir* kata sebelumnya (batu → *tu* atau *u*)\n` +
    `• Kata minimal ${MIN_WORD} huruf & tidak boleh diulang\n` +
    `• Maksimal *${MAX_ERRORS} kesalahan* per game\n` +
    `• Batas waktu *${TIME_LIMIT / 1000} detik* per giliran`
  );
}

export async function handleSambungKata(m, ctx) {
  if (!m.isGroup) return m.reply('❌ Fitur ini hanya bisa digunakan di *dalam grup*.');

  const args = ctx.args || [];
  const aksi = (args[0] || '').toLowerCase();

  switch (aksi) {
    case 'create': return create(m, ctx);
    case 'join':   return join(m, ctx);
    case 'start':  return start(m, args.slice(1), ctx);
    case 'end':    return end(m, ctx);
    default:       return m.reply(bantuan(ctx.prefix));
  }
}

export async function handleWordSubmission(m, { russyuroku, senderPnJid }) {
  if (!m.isGroup) return false;
  const s = sessions.get(m.chat);
  if (!s || s.status !== 'playing') return false;

  const sender = senderPnJid || m.sender;
  if (!same(s.currentPlayer, sender)) return false;

  const teks = String(m.text || '').trim();

  if (!/^[a-zA-Z]+$/.test(teks)) return false;

  const kata = teks.toLowerCase();
  const wajib = lastLetters(s.currentWord);

  if (kata.length < MIN_WORD) {
    clearTimeout(s.timeout);
    await salahJawab(russyuroku, m.chat, s, `❌ Kata minimal ${MIN_WORD} huruf.`);
    return true;
  }
  if (s.usedWords.has(kata)) {
    clearTimeout(s.timeout);
    await salahJawab(russyuroku, m.chat, s, `❌ Kata *${kata.toUpperCase()}* sudah digunakan!`);
    return true;
  }

  if (!wajib.some((h) => kata.startsWith(h))) {
    clearTimeout(s.timeout);
    await salahJawab(
      russyuroku,
      m.chat,
      s,
      `❌ Kata *${kata.toUpperCase()}* tidak nyambung! Harus berawalan *${wajib.join('* atau *')}* dari *${s.currentWord.toUpperCase()}*.`
    );
    return true;
  }

  const pemainSebelum = s.currentPlayer;
  s.currentWord = kata;
  s.usedWords.add(kata);
  s.currentPlayer = nextPlayer(s, pemainSebelum);
  startTimer(russyuroku, m.chat, s);

  const wajibBaru = lastLetters(kata);
  await kirim(
    russyuroku,
    m.chat,
    `✅ Benar dari *@${num(pemainSebelum)}*: *${kata.toUpperCase()}*\n\n` +
      `Giliran: *@${num(s.currentPlayer)}*\n` +
      `Kata harus berawalan *${wajibBaru.join('* atau *')}*\n*Waktu ${TIME_LIMIT / 1000} detik dimulai!*`,
    s.players
  );
  return true;
}
