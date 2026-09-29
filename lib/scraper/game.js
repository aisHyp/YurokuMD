/*═══════════════════════════════════════════════════════
 *  ⚔  Lunar Saurus Empire
 *═══════════════════════════════════════════════════════
 *  🌐  Website     : https://saurusdev.cloud
 *  ⌨︎  Developer   : https://www.youtube.com/@sauruskinggwuw
 *  ▶︎  YouTube     : https://www.youtube.com/@sauruskinggwuw
 *  📡  Saluran WA  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *  ✈︎  Telegram    : @lordsaurus
 *
 *  ⚠︎  Mohon untuk tidak menghapus watermark ini
 *═══════════════════ © 2026 Lunar Saurus ─════════════════════
 */

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
 *  Engine game tebak-tebakan (caklontong, family100, tebakgambar, dst).
 *  Dataset ada di ./library/game/*.json.
 *
 *  Cara main:
 *   - Bot kirim soal. Pemain BALAS (reply) pesan soal itu dengan jawabannya.
 *   - Tiap chat cuma boleh punya 1 game aktif (tebak-tebakan).
 *   - Waktu 60 detik (family100 90 detik). .nyerah untuk menyerah.
 *
 *  Sesi disimpan per-chat di global.gameSessions dan jawaban ditangkap oleh
 *  hook "GAME SESSION HOOK" di yuroku.js (di luar blok isCmd), karena jawaban
 *  dikirim tanpa prefix.
 */
import fs from 'fs';
import axios from 'axios';
import { isPremium, addLimit } from '../premium.js';

global.gameSessions = global.gameSessions || {};

export const GAME_CONFIG = {
  caklontong:      { file: 'caklontong.json',      title: 'CAK LONTONG',       map: (d) => ({ soal: d.soal, jawaban: d.jawaban, info: d.deskripsi }) },
  asahotak:        { file: 'asahotak.json',        title: 'ASAH OTAK',         map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },
  susunkata:       { file: 'susunkata.json',       title: 'SUSUN KATA',        map: (d) => ({ soal: `${d.soal}\n📂 Tipe: ${d.tipe}`, jawaban: d.jawaban }) },
  siapakahaku:     { file: 'siapakahaku.json',     title: 'SIAPAKAH AKU',      map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },
  tebakkata:       { file: 'tebakkata.json',       title: 'TEBAK KATA',        map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },
  tebakkalimat:    { file: 'tebakkalimat.json',    title: 'TEBAK KALIMAT',     map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },
  lengkapikalimat: { file: 'lengkapikalimat.json', title: 'LENGKAPI KALIMAT',  map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },
  tebaklirik:      { file: 'tebaklirik.json',      title: 'TEBAK LIRIK',       map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },
  tebakjorok:      { file: 'tebakjorok.json',      title: 'TEBAK JOROK',       map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },
  tebakhewan:      { file: 'tebakhewan.json',      title: 'TEBAK HEWAN',       map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },
  tebakinggris:    { file: 'tebakinggris.json',    title: 'TEBAK INGGRIS',     map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },
  tekateki:        { file: 'tekateki.json',        title: 'TEKA-TEKI',         map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },
  kuis:            { file: 'kuis.json',            title: 'KUIS CEPAT',        map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },
  tebakkah:        { file: 'tebakkah.json',        title: 'TEBAK RANDOM',      map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },

  tebakgambar:     { file: 'tebakgambar.json',     title: 'TEBAK GAMBAR',      map: (d) => ({ soal: 'Tebak gambar ini!', jawaban: d.jawaban, image: d.img, info: d.deskripsi }) },
  tebakbendera:    { file: 'tebakbendera.json',    title: 'TEBAK BENDERA',     map: (d) => ({ soal: 'Bendera negara apakah ini?', jawaban: d.name, image: d.img }) },
  tebaklogo:       { file: 'tebaklogo.json',       title: 'TEBAK LOGO',        map: (d) => ({ soal: d.deskripsi || 'Logo apakah ini?', jawaban: d.jawaban, image: d.img }) },
  tebakgame:       { file: 'tebakgame.json',       title: 'TEBAK GAME',        map: (d) => ({ soal: 'Game apakah ini?', jawaban: d.jawaban, image: d.img }) },
  tebakhero:       { file: 'tebakhero.json',       title: 'TEBAK HERO ML',     map: (d) => ({ soal: 'Hero Mobile Legends apakah ini?', jawaban: d.jawaban, image: d.img, info: d.deskripsi, imageAfter: d.fullimg }) },
  tebakgenshin:    { file: 'tebakgenshin.json',    title: 'TEBAK GENSHIN',     map: (d) => ({ soal: 'Karakter Genshin Impact siapakah ini?', jawaban: d.jawaban, image: d.img, info: d.desk }) },
  tebakanime:      { file: 'tebakanime.json',      title: 'TEBAK ANIME',       map: (d) => ({ soal: 'Karakter anime siapakah ini?', jawaban: d.jawaban, image: d.img, info: d.desk }) },
  tebakmakanan:    { file: 'tebakmakanan.json',    title: 'TEBAK MAKANAN',     map: (d) => ({ soal: d.deskripsi || 'Makanan apakah ini?', jawaban: d.jawaban, image: d.img }) },

  tebaklagu:       { file: 'tebaklagu.json',       title: 'TEBAK LAGU',        map: (d) => ({ soal: `Tebak judul lagu ini!\n🎤 Artis: ${d.artis}`, jawaban: d.jawaban, audio: d.soal }) },

  family100:       { file: 'family100.json',       title: 'FAMILY 100',        type: 'multi', time: 90000, map: (d) => ({ soal: d.soal, jawaban: d.jawaban }) },

  tebakjkt:        { api: 'https://api.siputzx.my.id/api/games/tebakjkt', title: 'TEBAK JKT48', type: 'api', map: (d) => ({ soal: 'Member JKT48 siapakah ini?', jawaban: d.jawaban || d.name, image: d.gambar || d.img }) },
  tebakff:         { api: 'https://api.siputzx.my.id/api/games/karakter-freefire', title: 'TEBAK FREE FIRE', type: 'api', map: (d) => ({ soal: 'Karakter Free Fire siapakah ini?', jawaban: d.name, image: d.gambar }) },
};

export const GAME_LIST = Object.keys(GAME_CONFIG);

const DEFAULT_TIME = 60000;
const REWARD_MIN = 1;
const REWARD_MAX = 5;

const dataCache = {};

function loadDataset(file) {
  if (dataCache[file]) return dataCache[file];
  const raw = fs.readFileSync(`./library/game/${file}`, 'utf-8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`Dataset ${file} kosong atau bukan array.`);
  }
  dataCache[file] = data;
  return data;
}

export function normalize(str) {
  return String(str ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function jidNumber(jid) {
  return String(jid || '').split('@')[0];
}

function tampilJawaban(jawaban) {
  return Array.isArray(jawaban) ? jawaban.join(', ') : String(jawaban);
}

function beriHadiah(senderPn, isCreator) {
  if (isCreator || isPremium(senderPn)) return 0;
  const reward = Math.floor(Math.random() * (REWARD_MAX - REWARD_MIN + 1)) + REWARD_MIN;
  try {
    addLimit(senderPn, reward);
    return reward;
  } catch {
    return 0;
  }
}

function endSession(chatId) {
  const s = global.gameSessions[chatId];
  if (s?.timeout) clearTimeout(s.timeout);
  delete global.gameSessions[chatId];
}

export async function startGame(gameType, m, { russyuroku, isCreator }) {
  const config = GAME_CONFIG[gameType];
  if (!config) return m.reply('❌ Tipe game tidak valid.');

  if (!m.isGroup) {
    return m.reply('❌ Game ini hanya bisa dimainkan di *dalam grup*.');
  }
  if (global.gameSessions[m.chat]) {
    return m.reply('⚠️ Masih ada game yang berlangsung di chat ini!\nSelesaikan dulu atau ketik *.nyerah*');
  }

  global.gameSessions[m.chat] = { gameType, loading: true };

  try {
    let raw;
    if (config.type === 'api') {
      const res = await axios.get(config.api, { timeout: 15000 });
      const body = res.data;
      if (!body || body.status !== true || !body.data) {
        throw new Error('Respons API tidak valid.');
      }
      raw = body.data;
    } else {
      raw = pickRandom(loadDataset(config.file));
    }

    const q = config.map(raw);
    if (!q || !q.soal) throw new Error('Soal tidak valid.');

    const isMulti = config.type === 'multi';
    const jawabanList = (Array.isArray(q.jawaban) ? q.jawaban : [q.jawaban])
      .map((j) => String(j ?? '').trim())
      .filter(Boolean);
    if (jawabanList.length === 0) throw new Error('Soal tidak punya jawaban.');

    const waktu = config.time || DEFAULT_TIME;
    const detik = Math.round(waktu / 1000);

    let caption = `🎮 *${config.title}*\n\n${q.soal}\n\n`;
    if (isMulti) {
      caption += `📋 Ada *${jawabanList.length}* jawaban. Tebak sebanyak-banyaknya!\n`;
    }
    caption += `⏳ Waktu: ${detik} detik\n`;
    caption += `📌 *Balas (reply) pesan ini dengan jawabanmu!*\n`;
    caption += `> ketik *.nyerah* untuk menyerah`;

    let sent;
    if (q.image) {
      try {
        sent = await russyuroku.sendMessage(m.chat, { image: { url: q.image }, caption }, { quoted: m });
      } catch (e) {

        sent = await russyuroku.sendMessage(m.chat, { text: caption }, { quoted: m });
      }
    } else if (q.audio) {
      try {
        await russyuroku.sendMessage(m.chat, { audio: { url: q.audio }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m });
      } catch (e) {
        caption += '\n\n⚠️ Audio gagal dimuat, coba lagi nanti.';
      }
      sent = await russyuroku.sendMessage(m.chat, { text: caption }, { quoted: m });
    } else {
      sent = await russyuroku.sendMessage(m.chat, { text: caption }, { quoted: m });
    }

    global.gameSessions[m.chat] = {
      gameType,
      title: config.title,
      soal: q.soal,
      info: q.info || null,
      image: q.image || null,
      imageAfter: q.imageAfter || null,
      jawaban: jawabanList,
      multi: isMulti,
      terjawab: isMulti ? new Set() : null,
      penebak: isMulti ? {} : null,
      messageId: sent.key.id,
      startTime: Date.now(),
      timeout: setTimeout(() => timeUp(m.chat, russyuroku, m), waktu),
    };
  } catch (e) {
    console.error(`[GAME ERROR] ${gameType}:`, e.message);
    delete global.gameSessions[m.chat];
    return m.reply(`❌ Gagal memulai game *${config.title}*. Coba lagi nanti.`);
  }
}

async function timeUp(chatId, russyuroku, m) {
  const s = global.gameSessions[chatId];
  if (!s || s.loading) return;

  let teks = `⏰ *Waktu habis!*\n\n`;
  if (s.multi) {
    const belum = s.jawaban.filter((j) => !s.terjawab.has(normalize(j)));
    teks += `Terjawab: ${s.terjawab.size}/${s.jawaban.length}\n`;
    if (belum.length) teks += `Yang belum tertebak: *${belum.join(', ')}*`;
  } else {
    teks += `Jawabannya adalah: *${tampilJawaban(s.jawaban)}*`;
  }
  if (s.info) teks += `\n\n💡 ${s.info}`;

  delete global.gameSessions[chatId];
  try {
    await russyuroku.sendMessage(chatId, { text: teks }, { quoted: m });
  } catch {}
}

export async function giveUp(m, { russyuroku }) {
  const s = global.gameSessions[m.chat];
  if (!s || s.loading) {
    return m.reply('❌ Tidak ada game yang sedang berlangsung.');
  }
  let teks = `🏳️ *Yah, menyerah...*\n\n`;
  if (s.multi) {
    const belum = s.jawaban.filter((j) => !s.terjawab.has(normalize(j)));
    teks += `Terjawab: ${s.terjawab.size}/${s.jawaban.length}\n`;
    if (belum.length) teks += `Yang belum tertebak: *${belum.join(', ')}*`;
  } else {
    teks += `Jawabannya adalah: *${tampilJawaban(s.jawaban)}*`;
  }
  if (s.info) teks += `\n\n💡 ${s.info}`;
  endSession(m.chat);
  return m.reply(teks);
}

export async function handleGameAnswer(m, { russyuroku, senderPnJid, isCreator }) {
  const s = global.gameSessions[m.chat];
  if (!s || s.loading || !m.isGroup) return false;

  if (!m.quoted || m.quoted.id !== s.messageId) return false;

  const userText = normalize(m.text);
  if (!userText) return false;

  if (s.multi) {
    const kena = s.jawaban.find(
      (j) => !s.terjawab.has(normalize(j)) && normalize(j) === userText
    );

    if (!kena) {

      const sudah = s.jawaban.some((j) => s.terjawab.has(normalize(j)) && normalize(j) === userText);
      if (sudah) await m.reply('ℹ️ Jawaban itu sudah ditebak, cari yang lain!');
      else await m.reply('❌ *Salah!* Coba jawaban lain.');
      return true;
    }

    s.terjawab.add(normalize(kena));
    s.penebak[senderPnJid] = (s.penebak[senderPnJid] || 0) + 1;

    if (s.terjawab.size >= s.jawaban.length) {

      const ranking = Object.entries(s.penebak).sort((a, b) => b[1] - a[1]);
      let teks = `🎉 *SEMUA JAWABAN TERTEBAK!*\n\n`;
      teks += s.jawaban.map((j, i) => `${i + 1}. ${j}`).join('\n');
      teks += `\n\n🏆 *Peringkat:*\n`;
      const mentions = [];
      const hadiahTeks = [];
      for (const [jid, jml] of ranking) {
        mentions.push(jid);
        const hadiah = beriHadiah(jid, false);
        teks += `• @${jidNumber(jid)} — ${jml} jawaban${hadiah ? ` (+${hadiah} limit)` : ''}\n`;
      }
      endSession(m.chat);
      await russyuroku.sendMessage(m.chat, { text: teks.trim(), mentions }, { quoted: m });
      return true;
    }

    await russyuroku.sendMessage(
      m.chat,
      {
        text: `✅ *Benar!* "${kena}" — @${jidNumber(senderPnJid)}\n📊 Terjawab: ${s.terjawab.size}/${s.jawaban.length}`,
        mentions: [senderPnJid],
      },
      { quoted: m }
    );
    return true;
  }

  const benar = s.jawaban.some((j) => normalize(j) === userText);
  if (!benar) {
    await m.reply('❌ *Jawaban salah!* Coba lagi.');
    return true;
  }

  const hadiah = beriHadiah(senderPnJid, isCreator);
  let teks = `✅ *Jawaban Benar!*\nJawabannya: *${tampilJawaban(s.jawaban)}*\n\nSelamat @${jidNumber(senderPnJid)}! 🎉`;
  if (hadiah) teks += `\n🎁 Hadiah: *+${hadiah} limit*`;
  if (s.info) teks += `\n\n💡 ${s.info}`;

  const imageAfter = s.imageAfter;
  endSession(m.chat);

  await russyuroku.sendMessage(m.chat, { text: teks, mentions: [senderPnJid] }, { quoted: m });
  if (imageAfter) {
    try {
      await russyuroku.sendMessage(m.chat, { image: { url: imageAfter } });
    } catch {}
  }
  return true;
}
