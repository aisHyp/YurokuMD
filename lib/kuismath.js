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
 *  .kuismath — kuis pengetahuan umum berlevel (matematika, bahasa, geografi,
 *  sejarah, seni, sains, game). Soal ada di ./library/game/kuismath.json.
 *
 *  Sesi per-USER (bukan per-chat) di global.mathQuizSessions. Jawaban dikirim
 *  tanpa prefix, ditangkap hook "KUISMATH SESSION HOOK" di yuroku.js.
 */
import fs from 'fs';
import { isPremium, addLimit } from './premium.js';

global.mathQuizSessions = global.mathQuizSessions || {};

const CATEGORIES = ['matematika', 'bahasa', 'geografi', 'sejarah', 'seni', 'sains', 'game'];
const LEVELS = ['easy', 'normal', 'hard'];

const LEVEL_CFG = {
  easy:   { total: 10, time: 5 * 60000,  points: 1, reward: 10 },
  normal: { total: 15, time: 7.5 * 60000, points: 2, reward: 25 },
  hard:   { total: 20, time: 10 * 60000, points: 3, reward: 50 },
};

let pools = null;
function loadPools() {
  if (pools) return pools;
  pools = JSON.parse(fs.readFileSync('./library/game/kuismath.json', 'utf-8'));
  return pools;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function norm(str) {
  return String(str ?? '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function toNumber(str) {
  const cleaned = String(str).replace(/[^\d.,-]/g, '').replace(',', '.');
  return parseFloat(cleaned);
}

function buatSoal(category, level) {
  const pool = loadPools()[category]?.[level];
  if (!pool || pool.length === 0) return [];
  const cfg = LEVEL_CFG[level];
  return shuffle(pool)
    .slice(0, cfg.total)
    .map((q, i) => ({
      number: i + 1,
      question: q.q,
      answer: norm(q.a),
      points: cfg.points,
    }));
}

function cekJawaban(userInput, answer) {
  const u = norm(userInput);
  const a = norm(answer);
  if (!u) return false;
  if (u === a || u.replace(/\s+/g, '') === a.replace(/\s+/g, '')) return true;

  const angka = /^-?\d+([.,]\d+)?$/;
  if (angka.test(u) && angka.test(a)) {
    return Math.abs(toNumber(u) - toNumber(a)) < 0.01;
  }
  return false;
}

function teksSoal(session) {
  const q = session.questions[session.currentQuestion];
  const sisa = Math.max(0, Math.ceil((session.timeLimit - (Date.now() - session.startTime)) / 1000));
  return (
    `📝 *SOAL ${session.currentQuestion + 1}/${session.questions.length}*\n\n` +
    `Kategori: ${session.category.toUpperCase()}\n` +
    `Level: ${session.level.toUpperCase()}\n\n` +
    `❓ ${q.question}\n\n` +
    `🎯 Poin: ${q.points}\n` +
    `⏱️ Sisa waktu: ${sisa} detik\n\n` +
    `💬 Kirim jawabanmu langsung di chat ini\n` +
    `⏹️ Ketik *stop* untuk berhenti`
  );
}

function teksBantuan(prefix) {
  return (
    `🧮 *KUIS PENGETAHUAN UMUM*\n\n` +
    `Kategori:\n` +
    `• matematika\n• bahasa\n• geografi\n• sejarah\n• seni\n• sains\n• game\n\n` +
    `Level:\n` +
    `• easy — 10 soal, 5 menit, hadiah ${LEVEL_CFG.easy.reward} limit\n` +
    `• normal — 15 soal, 7,5 menit, hadiah ${LEVEL_CFG.normal.reward} limit\n` +
    `• hard — 20 soal, 10 menit, hadiah ${LEVEL_CFG.hard.reward} limit\n\n` +
    `Contoh:\n` +
    `${prefix}kuismath matematika easy\n` +
    `${prefix}kuismath game hard\n` +
    `${prefix}kuismath mulai\n` +
    `${prefix}kuismath batal\n\n` +
    `_Hadiah didapat kalau skor akhir ≥ 80%_`
  );
}

export async function handleKuisMath(m, { russyuroku, text, prefix, isCreator }) {
  const sender = m.sender;
  const sesi = global.mathQuizSessions;

  if (!text) return m.reply(teksBantuan(prefix));

  const parts = text.toLowerCase().trim().split(/\s+/).filter(Boolean);

  if (parts[0] === 'mulai') {
    const s = sesi[sender];
    if (!s) return m.reply(`❌ Tidak ada kuis yang disiapkan! Ketik *${prefix}kuismath [kategori] [level]* dulu.`);
    if (s.started) return m.reply('⚠️ Kuis sudah berjalan, jawab soal yang sedang tampil.');
    s.started = true;
    s.startTime = Date.now();
    await m.reply(
      `🚀 *KUIS DIMULAI!*\n\n` +
      `📚 Kategori: ${s.category.toUpperCase()}\n` +
      `🎯 Level: ${s.level.toUpperCase()}\n` +
      `📊 Total soal: ${s.questions.length}\n` +
      `⏱️ Waktu: ${Math.round(s.timeLimit / 60000 * 10) / 10} menit\n` +
      `🎁 Hadiah: ${s.reward} limit\n\n` +
      `Selamat mengerjakan! 💪`
    );
    await new Promise((r) => setTimeout(r, 1500));
    return russyuroku.sendMessage(m.chat, { text: teksSoal(s) }, { quoted: m });
  }

  if (parts[0] === 'batal' || parts[0] === 'stop') {
    if (!sesi[sender]) return m.reply('❌ Tidak ada kuis yang aktif!');
    delete sesi[sender];
    return m.reply('✅ Kuis berhasil dibatalkan.');
  }

  if (parts.length < 2) {
    return m.reply(`❌ Format salah! Gunakan: *${prefix}kuismath [kategori] [level]*\nContoh: ${prefix}kuismath game easy`);
  }

  const [category, level] = parts;
  if (!CATEGORIES.includes(category)) {
    return m.reply(`❌ Kategori tidak valid! Pilih: ${CATEGORIES.join(', ')}`);
  }
  if (!LEVELS.includes(level)) {
    return m.reply(`❌ Level tidak valid! Pilih: ${LEVELS.join(', ')}`);
  }
  if (sesi[sender]) {
    return m.reply(`⚠️ Kamu masih punya kuis aktif! Ketik *${prefix}kuismath batal* untuk membatalkan.`);
  }

  const questions = buatSoal(category, level);
  if (questions.length === 0) {
    return m.reply(`❌ Soal untuk *${category}* level *${level}* belum tersedia.`);
  }

  const cfg = LEVEL_CFG[level];
  sesi[sender] = {
    category,
    level,
    questions,
    currentQuestion: 0,
    score: 0,
    started: false,
    startTime: Date.now(),
    timeLimit: cfg.time,
    reward: cfg.reward,
    answers: [],
    confirmStop: false,
    chat: m.chat,
  };

  return m.reply(
    `🧮 *KUIS ${category.toUpperCase()} — ${level.toUpperCase()}*\n\n` +
    `⏱️ Waktu: ${Math.round(cfg.time / 60000 * 10) / 10} menit\n` +
    `📊 Soal: ${questions.length} pertanyaan\n` +
    `🎁 Hadiah: ${cfg.reward} limit\n\n` +
    `Ketik *${prefix}kuismath mulai* untuk memulai!\n` +
    `Ketik *${prefix}kuismath batal* untuk membatalkan.`
  );
}

function selesai(m, s, senderPn, isCreator, alasan) {
  const maxScore = s.questions.reduce((sum, q) => sum + q.points, 0);
  const pct = maxScore > 0 ? Math.round((s.score / maxScore) * 100) : 0;
  const benar = s.answers.filter((a) => a.correct).length;
  const dijawab = s.answers.length;
  const detik = Math.floor((Date.now() - s.startTime) / 1000);

  let t = alasan === 'waktu' ? `⏰ *WAKTU HABIS!*\n\n` : `🎊 *KUIS SELESAI!*\n\n`;
  t += `📚 Kategori: ${s.category.toUpperCase()}\n🎯 Level: ${s.level.toUpperCase()}\n`;
  t += `📊 Skor: ${s.score}/${maxScore} (${pct}%)\n`;
  t += `⏱️ Waktu: ${Math.floor(detik / 60)}:${String(detik % 60).padStart(2, '0')}\n\n`;
  t += `✅ Benar: ${benar}\n❌ Salah: ${dijawab - benar}\n`;
  if (s.questions.length - dijawab > 0) t += `⏭️ Tidak dijawab: ${s.questions.length - dijawab}\n`;
  t += `\n`;

  if (pct >= 80) {
    if (!isCreator && !isPremium(senderPn)) {
      try {
        addLimit(senderPn, s.reward);
        t += `🏆 *SELAMAT!*\nKamu mendapat hadiah *${s.reward} limit*! 🧠✨`;
      } catch {
        t += `🏆 *SELAMAT!* Skormu bagus! 🧠✨`;
      }
    } else {
      t += `🏆 *SELAMAT!* Skormu bagus! (limit kamu sudah unlimited 😎)`;
    }
  } else if (pct >= 60) {
    t += `👍 *Bagus!*\nHampir dapat hadiah, tingkatkan lagi!`;
  } else {
    t += `💪 *Terus berlatih!*\nCoba level yang lebih mudah dulu.`;
  }
  return t;
}

export async function handleKuisMathAnswer(m, { russyuroku, senderPnJid, isCreator }) {
  const s = global.mathQuizSessions[m.sender];
  if (!s || !s.started || m.chat !== s.chat || !m.text) return false;

  const input = String(m.text).trim();
  const lower = input.toLowerCase();

  if (Date.now() - s.startTime >= s.timeLimit) {
    const hasil = selesai(m, s, senderPnJid, isCreator, 'waktu');
    delete global.mathQuizSessions[m.sender];
    await m.reply(hasil);
    return true;
  }

  if (s.confirmStop) {
    if (['ya', 'y'].includes(lower)) {
      delete global.mathQuizSessions[m.sender];
      await m.reply('✅ Kuis dibatalkan.');
    } else if (['tidak', 'n', 'no', 'lanjut'].includes(lower)) {
      s.confirmStop = false;
      await russyuroku.sendMessage(m.chat, { text: teksSoal(s) }, { quoted: m });
    } else {
      await m.reply('❌ Ketik *ya* untuk membatalkan atau *tidak* untuk melanjutkan.');
    }
    return true;
  }

  if (['stop', 'berhenti'].includes(lower)) {
    s.confirmStop = true;
    await m.reply('⚠️ *YAKIN MAU BERHENTI?*\n\nKetik *ya* untuk membatalkan kuis\nKetik *tidak* untuk melanjutkan');
    return true;
  }

  const q = s.questions[s.currentQuestion];
  const benar = cekJawaban(input, q.answer);
  if (benar) s.score += q.points;
  s.answers.push({ number: q.number, correct: benar });

  s.currentQuestion++;

  if (s.currentQuestion >= s.questions.length) {
    const hasil = selesai(m, s, senderPnJid, isCreator, 'selesai');
    delete global.mathQuizSessions[m.sender];
    await m.reply(hasil);
    return true;
  }

  const umpanBalik = benar ? '✅ *Benar!*' : `❌ *Salah!* Jawaban: *${q.answer}*`;
  await russyuroku.sendMessage(m.chat, { text: `${umpanBalik}\n\n${teksSoal(s)}` }, { quoted: m });
  return true;
}
