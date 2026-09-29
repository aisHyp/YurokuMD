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
 *  Sistem Warn per grup. Data disimpan di library/database/warn.json:
 *    { "<idgrup>@g.us": {
 *        "<jid>": { count, name, warnings: [{ timestamp, warnedBy, warnedByName, reason }] }
 *    } }
 */
import fs from 'fs';
import path from 'path';

const dbDir = path.join(process.cwd(), 'library', 'database');
const dbPath = path.join(dbDir, 'warn.json');

function ensureDb() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

export function loadWarnDB() {
  ensureDb();
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

export function saveWarnDB(data) {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function getMaxWarn() {
  return parseInt(global.warnGrup) || 4;
}
