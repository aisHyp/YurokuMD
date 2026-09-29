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
 *
 *  Sistem Ulang Tahun per grup. Data disimpan di library/database/ultah.json:
 *    { "<idgrup>@g.us": { "<jid>": "DD/MM" } }
 */
import fs from 'fs';
import path from 'path';

const dbDir = path.join(process.cwd(), 'library', 'database');
const dbPath = path.join(dbDir, 'ultah.json');

function ensureDb() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

export function loadUltahDB() {
  ensureDb();
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

export function saveUltahDB(data) {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function parseDDMM(text) {
  const match = String(text || '').trim().match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (!match) return null;

  const day = parseInt(match[1]);
  const month = parseInt(match[2]);
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;
  if (month === 2 && day > 29) return null;
  if ([4, 6, 9, 11].includes(month) && day > 30) return null;

  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
}

export function getDaysUntil(dateStr) {
  const [day, month] = dateStr.split('/').map(Number);
  const now = new Date();
  const currentYear = now.getFullYear();
  let nextBirthday = new Date(currentYear, month - 1, day);

  if (now.getDate() === day && now.getMonth() === month - 1) return 0;
  if (now > nextBirthday) nextBirthday = new Date(currentYear + 1, month - 1, day);

  const diffTime = nextBirthday.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

const BIRTHDAY_MESSAGES = [
  'wih @{name} hari ini ultah! 🎂\nSemoga panjang umur, sehat selalu, makin sukses, dan bahagia selalu ya! 🎉',
  '@{name} hari ini ultah! 🎊\nSelamat ya! Semoga semua mimpi jadi nyata dan dilimpahkan kebahagiaan! 💫',
  'Happy birthday @{name}! 🎈\nSemoga makin dewasa, makin sukses, dan makin bahagia! 🎁',
  'Selamat ulang tahun @{name}! 🎂\nSemoga rezeki lancar, kesehatan terjaga, dan selalu dalam lindungan Tuhan. 🙏',
  'HBD @{name}! 🎉\nSemoga segala kebaikan bertambah. Sehat dan bahagia selalu! 💐',
];

export function getRandomBirthdayMessage(name) {
  const msg = BIRTHDAY_MESSAGES[Math.floor(Math.random() * BIRTHDAY_MESSAGES.length)];
  return msg.replace('{name}', name);
}

/**
 * Cek semua grup di database, kirim ucapan ke yang ulang tahun hari ini.
 * Dipanggil oleh cron/interval harian dari index.js.
 */
export async function checkBirthdaysToday(sock) {
  const db = loadUltahDB();
  for (const groupId of Object.keys(db)) {
    for (const [jid, date] of Object.entries(db[groupId] || {})) {
      try {
        if (getDaysUntil(date) === 0) {
          const name = jid.split('@')[0];
          await sock.sendMessage(groupId, {
            text: getRandomBirthdayMessage(`${name}`),
            mentions: [jid],
          });
        }
      } catch (e) {
        console.error('[checkBirthdaysToday]', e?.message || e);
      }
    }
  }
}
