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
 *  Fitur Welcome & Left (sambutan anggota baru / pamit anggota keluar).
 *  Data per grup disimpan di library/database/welcome.json:
 *
 *    { "<idgrup>@g.us": {
 *        welcome: true|false,        // sambutan anggota masuk aktif?
 *        left: true|false,           // pamit anggota keluar aktif?
 *        welcomeText: "…@user…@group…",
 *        leftText: "…@user…@group…"
 *    } }
 *
 *  Placeholder teks:
 *    @user   -> tag anggota
 *    @group  -> nama grup
 *    @count  -> jumlah anggota grup sekarang
 *
 *  Command-nya ada di plugins/welcome.js. Handler event dipasang lewat
 *  attachWelcome(sock) (bot utama di index.js & sub-bot di lib/jadibot.js).
 */
import { modul } from '../module.js';
import { createCanvas, loadImage } from 'canvas';

const { fs, path } = modul;

const dbDir = path.join(process.cwd(), 'library', 'database');
const dbPath = path.join(dbDir, 'welcome.json');

export const DEFAULT_WELCOME =
  'Halo @user 👋\nSelamat datang di *@group*!\nKamu member ke-*@count*. Semoga betah ya~';
export const DEFAULT_LEFT =
  'Yah, @user telah keluar dari *@group* 👋\nSampai jumpa lagi!';

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

export function getWelcomeConfig(groupId) {
  const d = readAll()[groupId] || {};
  return {
    welcome: d.welcome === true,
    left: d.left === true,
    welcomeText: typeof d.welcomeText === 'string' && d.welcomeText.trim() ? d.welcomeText : null,
    leftText: typeof d.leftText === 'string' && d.leftText.trim() ? d.leftText : null,
  };
}

export function setWelcomeConfig(groupId, patch) {
  const all = readAll();
  all[groupId] = { ...(all[groupId] || {}), ...patch };

  for (const k of ['welcomeText', 'leftText']) {
    if (all[groupId][k] === null || all[groupId][k] === undefined) delete all[groupId][k];
  }
  writeAll(all);
  return getWelcomeConfig(groupId);
}

export function renderText(template, { userJid, groupName, count }) {
  const number = String(userJid || '').split('@')[0].split(':')[0];
  return String(template)
    .replace(/@user/gi, `@${number}`)
    .replace(/@group/gi, groupName || 'grup')
    .replace(/@count/gi, String(count ?? '-'));
}

async function safeLoadImage(src) {
  if (!src) return null;
  try {
    return await loadImage(src);
  } catch {
    return null;
  }
}

function fitText(ctx, text, maxWidth) {
  let t = String(text || '');
  if (ctx.measureText(t).width <= maxWidth) return t;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
  return t + '…';
}

async function drawCard(sock, { userJid, title, subtitle, groupName, bgUrl, accent, gradient }) {
  const W = 1200;
  const H = 600;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const bg = await safeLoadImage(bgUrl);
  if (bg) {
    ctx.drawImage(bg, 0, 0, W, H);
  } else {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, gradient[0]);
    g.addColorStop(1, gradient[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.42)';
  ctx.fillRect(0, 0, W, H);

  let pfpUrl = null;
  try {
    pfpUrl = await sock.profilePictureUrl(userJid, 'image');
  } catch {}
  let pfp = await safeLoadImage(pfpUrl);
  if (!pfp) pfp = await safeLoadImage(global.fallbackPfp);

  const size = 190;
  const cx = W / 2;
  const cy = 165;
  const r = size / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 8;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 24;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if (pfp) {
    ctx.drawImage(pfp, cx - r, cy - r, size, size);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(cx - r, cy - r, size, size);
  }
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 76px sans-serif';
  ctx.fillText(title, cx, cy + r + 95);

  ctx.fillStyle = accent;
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(fitText(ctx, groupName, W - 160), cx, cy + r + 150);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '30px sans-serif';
  ctx.fillText(subtitle, cx, cy + r + 200);

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 110, cy + r + 225);
  ctx.lineTo(cx + 110, cy + r + 225);
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

export function createWelcomeCard(sock, { userJid, groupName, count }) {
  return drawCard(sock, {
    userJid,
    title: 'WELCOME',
    subtitle: `Member ke-${count}`,
    groupName,
    bgUrl: global.image?.welcome,
    accent: '#FFD700',
    gradient: ['#667eea', '#764ba2'],
  });
}

export function createLeftCard(sock, { userJid, groupName }) {
  return drawCard(sock, {
    userJid,
    title: 'GOODBYE',
    subtitle: 'Sampai jumpa lagi',
    groupName,
    bgUrl: global.image?.left,
    accent: '#FF6B6B',
    gradient: ['#ff6b6b', '#556270'],
  });
}

async function resolveMember(sock, participant, metadata) {

  const raw = typeof participant === 'string' ? participant : participant?.id || participant?.jid || '';
  if (!raw) return '';
  if (typeof participant === 'object') {
    const pn = participant.phoneNumber || participant.jid;
    if (pn && !String(pn).endsWith('@lid')) return String(pn);
  }
  if (!raw.endsWith('@lid')) return raw;
  try {
    const pn = await sock.resolvePn?.(raw, metadata);
    return pn || raw;
  } catch {
    return raw;
  }
}

function idOf(participant) {
  return typeof participant === 'string' ? participant : participant?.id || participant?.jid || '';
}

async function handleUpdate(sock, update) {
  const { id: groupId, participants, action } = update || {};
  if (!groupId || !groupId.endsWith('@g.us') || !Array.isArray(participants)) return;
  if (action !== 'add' && action !== 'remove') return;

  const cfg = getWelcomeConfig(groupId);
  if (action === 'add' && !cfg.welcome) return;
  if (action === 'remove' && !cfg.left) return;

  const botIds = [sock.user?.id, sock.user?.lid]
    .filter(Boolean)
    .map((j) => String(j).split('@')[0].split(':')[0]);

  let metadata = global.groupCache?.get?.(groupId);
  if (!metadata || !metadata.subject) {
    metadata = await sock.groupMetadata(groupId).catch(() => null);
  }
  if (!metadata) return;

  const groupName = metadata.subject || 'grup';
  const count = metadata.participants?.length ?? 0;

  for (const p of participants) {
    const rawId = idOf(p);
    if (!rawId) continue;
    if (botIds.includes(rawId.split('@')[0].split(':')[0])) continue;

    const userJid = await resolveMember(sock, p, metadata);
    const isJoin = action === 'add';
    const template = isJoin ? cfg.welcomeText || DEFAULT_WELCOME : cfg.leftText || DEFAULT_LEFT;
    const caption = renderText(template, { userJid, groupName, count });

    try {
      let buffer = null;
      try {
        buffer = isJoin
          ? await createWelcomeCard(sock, { userJid, groupName, count })
          : await createLeftCard(sock, { userJid, groupName });
      } catch (err) {
        console.error('[welcome] gagal bikin kartu, kirim teks saja:', err?.message || err);
      }

      const mentions = [userJid];
      if (buffer) {
        await sock.sendMessage(groupId, { image: buffer, caption, mentions });
      } else {
        await sock.sendMessage(groupId, { text: caption, mentions });
      }
    } catch (err) {
      console.error(`[welcome] gagal kirim ${action}:`, err?.message || err);
    }
  }
}

export function attachWelcome(sock) {
  sock.ev.on('group-participants.update', async (update) => {
    try {
      await handleUpdate(sock, update);
    } catch (err) {
      console.error('[welcome] error handler:', err?.message || err);
    }
  });
}
