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
 *  Tebak Bom: 10 petak, 3 bom, 3 nyawa. Pilih angka 1-10 (tanpa prefix).
 *  Harus membuka 7 petak aman untuk menang.
 *
 *  Perbaikan dari versi lama yang ada di yuroku.js:
 *   - Timer 2 menit pakai setTimeout. Versi lama memakai `await sleep(120000)`
 *     di dalam handler command, yang menahan handler selama 2 menit penuh.
 *   - Sesi per (chat + user), bukan per user saja, jadi angka yang diketik di
 *     grup lain tidak ikut tertangkap.
 *   - Pengacakan Fisher-Yates (versi lama pakai sort(random) yang bias).
 *   - Angka 10 tidak lagi bentrok dengan Tic Tac Toe (1-9): kalau ada game
 *     Tic Tac Toe aktif di chat itu, urutan hook di yuroku.js mengurusnya.
 */

const TIME_LIMIT = 120000;
const BOARD_START = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const BOMBS = 3;
const SAFE_NEEDED = 7;
const LIVES = 3;

global.tebakbomSessions = global.tebakbomSessions || {};
const sessions = global.tebakbomSessions;

const keyOf = (chat, sender) => `${chat}|${String(sender).split(':')[0]}`;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function endSession(key) {
  const s = sessions[key];
  if (s?.timeout) clearTimeout(s.timeout);
  delete sessions[key];
}

export function hasBombSession(chat, sender) {
  return !!sessions[keyOf(chat, sender)];
}

export async function startTebakBom(m, { russyuroku, senderPnJid }) {
  const key = keyOf(m.chat, senderPnJid || m.sender);
  if (sessions[key]) return m.reply('Masih ada sesi yang belum diselesaikan!');

  const petak = shuffle([
    ...Array(BOMBS).fill(2),
    ...Array(BOARD_START.length - BOMBS).fill(0),
  ]);

  const s = {
    petak,
    board: [...BOARD_START],
    pick: 0,
    nyawa: Array(LIVES).fill('❤️'),
    timeout: null,
  };
  s.timeout = setTimeout(async () => {
    if (sessions[key] !== s) return;
    delete sessions[key];
    try {
      await russyuroku.sendMessage(m.chat, { text: '_Waktu tebakbom habis_' }, { quoted: m });
    } catch {}
  }, TIME_LIMIT);
  sessions[key] = s;

  return m.reply(
    `*TEBAK BOM*\n\n${s.board.join('')}\n\n` +
      `Pilih lah nomor tersebut! dan jangan sampai terkena Bom!\n` +
      `Bomb : ${BOMBS}\nNyawa : ${s.nyawa.join('')}\n` +
      `Buka *${SAFE_NEEDED}* petak aman untuk menang.`
  );
}

export async function handleBombPick(m, { senderPnJid }) {
  const key = keyOf(m.chat, senderPnJid || m.sender);
  const s = sessions[key];
  if (!s) return false;

  const teks = String(m.text || '').trim();
  if (!/^\d{1,2}$/.test(teks)) return false;
  const pilih = parseInt(teks, 10);
  if (pilih < 1 || pilih > 10) return false;

  const idx = pilih - 1;
  if (s.board[idx] === '💥' || s.board[idx] === '✅') {
    await m.reply('Petak itu sudah dipilih, pilih yang lain!');
    return true;
  }

  if (s.petak[idx] === 2) {
    s.nyawa.pop();
    s.board[idx] = '💥';
    if (s.nyawa.length <= 0) {
      await m.reply(`💥 *BOOM!* Kamu Kalah!\n\n${s.board.join('')}\n\nJumlah bom: ${BOMBS}`);
      endSession(key);
      return true;
    }
    await m.reply(`💥 Kena Bom!\n\n${s.board.join('')}\n\nNyawa Tersisa : ${s.nyawa.join('')}`);
    return true;
  }

  s.board[idx] = '✅';
  s.pick++;
  if (s.pick >= SAFE_NEEDED) {
    await m.reply(`🎉 *SELAMAT!* Kamu Berhasil Lolos Dari Semua Bom!\n\n${s.board.join('')}`);
    endSession(key);
    return true;
  }
  await m.reply(
    `✅ Aman!\n\n${s.board.join('')}\n\nNyawa : ${s.nyawa.join('')}\nSisa Aman : ${SAFE_NEEDED - s.pick}`
  );
  return true;
}
