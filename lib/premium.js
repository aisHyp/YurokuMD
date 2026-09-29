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
 *  Sistem Premium & Limit harian.
 *  Data disimpan di library/database/premium.json dan library/database/limit.json
 */
import { modul } from '../module.js';

const { fs, path } = modul;

const dbDir = path.join(process.cwd(), "library", "database");
const premiumPath = path.join(dbDir, "premium.json");
const limitPath = path.join(dbDir, "limit.json");

function ensureDb() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(premiumPath)) fs.writeFileSync(premiumPath, JSON.stringify([], null, 2));
  if (!fs.existsSync(limitPath)) fs.writeFileSync(limitPath, JSON.stringify([], null, 2));
}

function readJSON(file, fallback) {
  ensureDb();
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJSON(file, data) {
  ensureDb();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function toJid(numberOrJid) {
  const raw = String(numberOrJid || "");

  if (raw.endsWith("@lid")) {
    console.warn(
      `[premium] Menerima JID @lid mentah (${raw}) yang belum di-resolve ke nomor asli. ` +
      `Cek pemanggilan resolvePn() sebelum fungsi premium/limit dipanggil.`
    );
  }

  const n = raw.replace(/[^0-9]/g, "");
  return n + "@s.whatsapp.net";
}

function loadPremium() {
  return readJSON(premiumPath, []);
}

function savePremium(data) {
  writeJSON(premiumPath, data);
}

function getPremiumEntry(jidOrNumber) {
  const jid = toJid(jidOrNumber);
  const db = loadPremium();
  const entry = db.find((v) => v.jid === jid);
  if (!entry) return null;
  if (entry.expired < Date.now()) return null;
  return entry;
}

function isPremium(jidOrNumber) {
  return getPremiumEntry(jidOrNumber) !== null;
}

function addPremium(jidOrNumber, days) {
  const jid = toJid(jidOrNumber);
  const db = loadPremium();
  const now = Date.now();
  const durasiMs = Number(days) * 24 * 60 * 60 * 1000;
  let entry = db.find((v) => v.jid === jid);

  if (entry) {
    const basis = entry.expired > now ? entry.expired : now;
    entry.expired = basis + durasiMs;
  } else {
    entry = { jid, expired: now + durasiMs, addedAt: now };
    db.push(entry);
  }

  savePremium(db);
  return entry;
}

function delPremium(jidOrNumber) {
  const jid = toJid(jidOrNumber);
  let db = loadPremium();
  const before = db.length;
  db = db.filter((v) => v.jid !== jid);
  savePremium(db);
  return db.length < before;
}

function getWIBDateString() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
}

function loadLimit() {
  return readJSON(limitPath, []);
}

function saveLimitDb(data) {
  writeJSON(limitPath, data);
}

function getLimitEntry(jidOrNumber) {
  const jid = toJid(jidOrNumber);
  const today = getWIBDateString();
  const db = loadLimit();
  let entry = db.find((v) => v.jid === jid);

  if (!entry) {
    entry = {
      jid,
      maxLimit: global.limitDefault || 25,
      used: 0,
      lastReset: today,
    };
    db.push(entry);
    saveLimitDb(db);
    return entry;
  }

  if (entry.lastReset !== today) {
    entry.used = 0;
    entry.lastReset = today;
    saveLimitDb(db);
  }

  return entry;
}

function getRemainingLimit(jidOrNumber) {
  const entry = getLimitEntry(jidOrNumber);
  const sisa = entry.maxLimit - entry.used;
  return { ...entry, remaining: sisa < 0 ? 0 : sisa };
}

function useLimit(jidOrNumber, amount = 1) {
  const jid = toJid(jidOrNumber);
  const entry = getLimitEntry(jid);
  const db = loadLimit();
  const target = db.find((v) => v.jid === jid);

  if (target.used + amount > target.maxLimit) {
    return { success: false, remaining: target.maxLimit - target.used };
  }

  target.used += amount;
  saveLimitDb(db);
  return { success: true, remaining: target.maxLimit - target.used };
}

function addLimit(jidOrNumber, amount) {
  const jid = toJid(jidOrNumber);
  getLimitEntry(jid);
  const db = loadLimit();
  const target = db.find((v) => v.jid === jid);
  target.maxLimit += Number(amount);
  saveLimitDb(db);
  return target;
}

export {
  toJid,
  isPremium,
  getPremiumEntry,
  addPremium,
  delPremium,
  getLimitEntry,
  getRemainingLimit,
  useLimit,
  addLimit,
};
