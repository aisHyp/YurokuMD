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
 *  Sistem Level/XP per grup, dari chat aktif. Data disimpan di
 *  library/database/level.json:
 *    { "<idgrup>@g.us": { "<jid>": { level, xp, messages, lastXpTime } } }
 *
 *  XP nambah tiap kirim pesan (bukan command) dengan cooldown 60 detik,
 *  biar gak bisa spam buat naik level cepat. Kalau jeda lebih dari 5 menit,
 *  dapat bonus XP 1.5x.
 */
import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

const dbDir = path.join(process.cwd(), 'library', 'database');
const dbPath = path.join(dbDir, 'level.json');

const XP_COOLDOWN = 60000;
const BASE_XP_PER_MESSAGE = 15;

function ensureDb() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

function readAll() {
  ensureDb();
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function getXPToNextLevel(level) {
  return Math.floor(100 + (level - 1) * 50);
}

export function makeProgressBar(current, total, size = 15) {
  if (total === 0) return `[${'░'.repeat(size)}] 0%`;
  const progress = Math.floor((current / total) * size);
  const percent = Math.floor((current / total) * 100);
  return `[${'█'.repeat(progress)}${'░'.repeat(size - progress)}] ${percent}%`;
}

export function getUserLevel(groupId, userId) {
  const db = readAll();
  return db[groupId]?.[userId] || { level: 1, xp: 0, messages: 0 };
}

export function getGroupLeaderboard(groupId) {
  const db = readAll();
  return Object.entries(db[groupId] || {})
    .map(([jid, d]) => ({ jid, ...d }))
    .sort((a, b) => b.level - a.level || b.xp - a.xp);
}

export function getAutoLevelConfig(groupId) {
  const db = readAll();
  return {
    autolevel: db[groupId]?.__config?.autolevel === true,
    autolevelMessage: db[groupId]?.__config?.autolevelMessage || null,
  };
}

export function setAutoLevelConfig(groupId, patch) {
  const db = readAll();
  if (!db[groupId]) db[groupId] = {};
  if (!db[groupId].__config) db[groupId].__config = {};
  db[groupId].__config = { ...db[groupId].__config, ...patch };
  writeAll(db);
}

/**
 * Nambahin XP ke user setelah kirim pesan biasa (bukan command).
 * Return { leveledUp, level, xp, xpNeeded } atau null kalau kena cooldown.
 */
export function addUserXP(groupId, userId) {
  const db = readAll();
  if (!db[groupId]) db[groupId] = {};
  if (!db[groupId][userId]) {
    db[groupId][userId] = { level: 1, xp: 0, messages: 0, lastXpTime: 0 };
  }

  const user = db[groupId][userId];
  user.messages += 1;

  const now = Date.now();
  const sinceLast = now - (user.lastXpTime || 0);
  if (sinceLast < XP_COOLDOWN) {
    writeAll(db);
    return null;
  }

  const xpGain = sinceLast > 300000 ? Math.floor(BASE_XP_PER_MESSAGE * 1.5) : BASE_XP_PER_MESSAGE;
  user.xp += xpGain;
  user.lastXpTime = now;

  let leveledUp = false;
  while (user.xp >= getXPToNextLevel(user.level)) {
    user.xp -= getXPToNextLevel(user.level);
    user.level += 1;
    leveledUp = true;
  }

  writeAll(db);
  return {
    leveledUp,
    level: user.level,
    xp: user.xp,
    messages: user.messages,
    xpNeeded: getXPToNextLevel(user.level),
  };
}

async function safeLoadImage(src) {
  if (!src) return null;
  try {
    return await loadImage(src);
  } catch {
    return null;
  }
}

export async function generateLevelCard(userName, level, xp, xpNeeded, messages, avatarUrl, rank = null) {
  const W = 1000;
  const H = 420;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const bg = await safeLoadImage(global.image?.canvas);
  if (bg) {
    ctx.drawImage(bg, 0, 0, W, H);
  } else {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#232526');
    g.addColorStop(1, '#414345');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, W, H);

  const accent = '#FFD700';
  const size = 180;
  const cx = 130;
  const cy = H / 2;
  const r = size / 2;

  let avatar = await safeLoadImage(avatarUrl);
  if (!avatar) avatar = await safeLoadImage(global.fallbackPfp);

  ctx.beginPath();
  ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 18;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if (avatar) {
    ctx.drawImage(avatar, cx - r, cy - r, size, size);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(cx - r, cy - r, size, size);
  }
  ctx.restore();

  const textX = 260;
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 8;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 46px sans-serif';
  ctx.fillText(userName, textX, 130);

  ctx.fillStyle = accent;
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText(`Level ${level}${rank ? `  •  Rank #${rank}` : ''}`, textX, 180);

  ctx.fillStyle = '#DDDDDD';
  ctx.font = '26px sans-serif';
  ctx.fillText(`${xp} / ${xpNeeded} XP`, textX, 225);
  ctx.fillText(`${messages} pesan terkirim`, textX, 260);

  ctx.shadowBlur = 0;

  // progress bar
  const barX = textX;
  const barY = 300;
  const barW = W - textX - 60;
  const barH = 26;
  const pct = Math.max(0, Math.min(1, xp / xpNeeded));

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 13);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(barH, barW * pct), barH, 13);
  ctx.fill();

  return canvas.toBuffer('image/png');
}
