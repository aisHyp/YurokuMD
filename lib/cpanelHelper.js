/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  ⚔️  Lunar Saurus Empire  ⚔️
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  🌍 Site     : https://saurusdev.cloud
 *  📺 YouTube  : https://www.youtube.com/@sauruskinggwuw
 *  📢 Channel  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *  💬 Telegram : @lordsaurus
 *
 *  ⚠️ Watermark ini wajib tetap ada.
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  Helper panel Pterodactyl: database user/panel, API client,
 *  reminder & auto-suspend/cleanup panel expired.
 */
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as logger from './logger.js';
import { isPremium } from './premium.js';

const DB_DIR = path.join(process.cwd(), 'library/database');
const DB_USERS = path.join(DB_DIR, 'panel_users.json');
const DB_PANELS = path.join(DB_DIR, 'panel_panels.json');
const DB_NOTIF = path.join(DB_DIR, 'panel_notif.json');

export const DAY_MS = 24 * 60 * 60 * 1000;
export const fallbackPrefix = typeof global.prefix === 'string' ? global.prefix : '.';

export function ensureDB() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  for (const f of [DB_USERS, DB_PANELS, DB_NOTIF]) {
    if (!fs.existsSync(f)) fs.writeFileSync(f, '[]', 'utf8');
  }
}

function readJSON(file) {
  ensureDB();
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  ensureDB();
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

export const loadPanelDB = () => readJSON(DB_PANELS);
export const savePanelDB = (db) => writeJSON(DB_PANELS, db);
export const loadUsersDB = () => readJSON(DB_USERS);
export const saveUsersDB = (db) => writeJSON(DB_USERS, db);
export const loadNotifDB = () => readJSON(DB_NOTIF);
export const saveNotifDB = (db) => writeJSON(DB_NOTIF, db);

export function upsertPanel(serverId, patch) {
  const db = loadPanelDB();
  const idx = db.findIndex((x) => String(x.serverId) === String(serverId));
  if (idx >= 0) db[idx] = { ...db[idx], ...patch, serverId: Number(serverId) || serverId };
  else db.push({ ...patch, serverId: Number(serverId) || serverId });
  savePanelDB(db);
  return db;
}

export function normalizePhone(n) {
  n = String(n || '').replace(/\D/g, '');
  if (n.startsWith('0')) n = '62' + n.slice(1);
  if (!n.startsWith('62')) n = '62' + n;
  return n;
}

export function toServerName(username) {
  let up = String(username || '').toUpperCase().trim();
  if (up.endsWith('STORE') && !up.includes(' ')) up = up.replace(/STORE$/, ' STORE');
  return up;
}

export function daysLeftFromExpiry(expiresAt) {
  const exp = Number(expiresAt || 0);
  if (!exp) return 0;
  return Math.ceil((exp - Date.now()) / DAY_MS);
}

export function panelConfigured() {
  return !!(global.domain && global.apikey && global.nestid && global.egg && global.loc);
}

export const panelActor = (m, senderPnJid) => senderPnJid || m.sender;

export function guardPanel(m, { isCreator, senderPnJid } = {}) {
  if (!isCreator && !isPremium(panelActor(m, senderPnJid))) return global.mess.prem;
  if (!panelConfigured()) {
    return 'Maaf, pengaturan panel belum lengkap. Isi *domain, apikey, nestid, egg, loc* di settings.js dulu.';
  }
  return null;
}

const baseUrl = () => String(global.domain || '').replace(/\/+$/, '');

async function fetchApi(method, endpoint, body) {
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl()}/api/application${endpoint}`;
  try {
    const res = await axios({
      method,
      url,
      data: body ?? undefined,
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${global.apikey}`,
        Accept: 'application/vnd.pterodactyl.v1+json',
        'Content-Type': 'application/json',
      },
      validateStatus: () => true,
    });
    return { ok: res.status >= 200 && res.status < 300, status: res.status, data: res.data };
  } catch (e) {
    return { ok: false, status: 0, data: { errors: [{ detail: e.message }] } };
  }
}

export const apiGET = (endpoint) => fetchApi('GET', endpoint);
export const apiPOST = (endpoint, body = null) => fetchApi('POST', endpoint, body);
export const apiDELETE = (endpoint) => fetchApi('DELETE', endpoint);
export const apiPATCH = (endpoint, body) => fetchApi('PATCH', endpoint, body);

export async function apiGetAll(endpoint) {
  const sep = endpoint.includes('?') ? '&' : '?';
  const items = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await apiGET(`${endpoint}${sep}per_page=100&page=${page}`);
    if (!res.ok) return { ok: false, status: res.status, items: [] };
    items.push(...(res.data?.data || []));
    totalPages = res.data?.meta?.pagination?.total_pages || 1;
    page++;
  } while (page <= totalPages && page <= 50);
  return { ok: true, status: 200, items };
}

export function apiErrorText(res) {
  const e = res?.data?.errors?.[0];
  return e?.detail || e?.code || (typeof res?.data === 'string' ? res.data.slice(0, 200) : `HTTP ${res?.status}`);
}

export const suspendServer = async (id) => (await apiPOST(`/servers/${id}/suspend`)).ok;
export const unsuspendServer = async (id) => (await apiPOST(`/servers/${id}/unsuspend`)).ok;
export const deleteServer = async (id) => (await apiDELETE(`/servers/${id}/force`)).ok;
export const deleteUser = async (id) => (await apiDELETE(`/users/${id}`)).ok;
export const checkServerExists = async (id) => (await apiGET(`/servers/${id}`)).ok;

export async function getServerAllocations(nodeId) {
  const res = await apiGET(`/nodes/${nodeId}/allocations`);
  return res.ok ? res.data?.data || [] : [];
}

export function getNotifState(serverId) {
  const db = loadNotifDB();
  return { db, state: db.find((x) => String(x.serverId) === String(serverId)) || null };
}

export function hasSent(serverId, key) {
  const { state } = getNotifState(serverId);
  return !!state && Array.isArray(state.sent) && state.sent.includes(String(key));
}

export function markSent(serverId, key) {
  const { db, state } = getNotifState(serverId);
  const k = String(key);
  if (!state) {
    db.push({ serverId: Number(serverId) || serverId, sent: [k], updatedAt: Date.now() });
  } else {
    const sent = Array.isArray(state.sent) ? state.sent : [];
    if (!sent.includes(k)) sent.push(k);
    state.sent = sent;
    state.updatedAt = Date.now();
  }
  saveNotifDB(db);
}

export function clearNotifState(serverId) {
  saveNotifDB(loadNotifDB().filter((x) => String(x.serverId) !== String(serverId)));
}

export function buildReminderText({ daysLeft, serverName, serverId, mentionTag }) {
  if (daysLeft > 0) {
    const lines = [
      `Halo Kak ${mentionTag}, panel *${serverName}* kamu akan expired dalam waktu *${daysLeft} hari*.`,
      'Pastikan kamu segera melakukan perpanjangan ya agar data tetap aman.',
      `Untuk renew, silakan gunakan perintah *${fallbackPrefix}renew ${serverId}* atau hubungi admin.`,
      `— ${global.namabot || 'Bot'}`,
    ];
    if (daysLeft === 7) lines[1] = 'Waktu masih cukup, namun kami sarankan untuk segera memperpanjang.';
    if (daysLeft === 5) lines[1] = 'Masa aktif hampir habis, jangan sampai lupa ya.';
    if (daysLeft === 3) lines[1] = 'Hanya tersisa 3 hari. Segera renew untuk menghindari penangguhan.';
    if (daysLeft === 1) lines[1] = 'Peringatan terakhir: Panel kamu akan expired besok.';
    return lines.join('\n');
  }

  return [
    `Pemberitahuan untuk Kak ${mentionTag},`,
    `Masa aktif panel *${serverName}* kamu telah *EXPIRED*.`,
    'Saat ini server telah di-suspend. Apabila ingin mengaktifkannya kembali, silakan lakukan perpanjangan.',
    `Ketik: *${fallbackPrefix}renew ${serverId}* atau hubungi admin.`,
  ].join('\n');
}

async function checkAndSuspendExpiredServers(sock) {
  if (!panelConfigured()) return;
  const panelDB = loadPanelDB();
  let updated = false;

  for (const p of panelDB) {
    if (!p.expiresAt) continue;
    if (daysLeftFromExpiry(p.expiresAt) > 0 || p.suspended) continue;

    if (await checkServerExists(p.serverId)) {
      if (!(await suspendServer(p.serverId))) continue;
      p.suspended = true;
      updated = true;

      const ownerPhone = normalizePhone(p.owner || '');
      if (ownerPhone && sock) {
        try {
          const jid = `${ownerPhone}@s.whatsapp.net`;
          const teks = buildReminderText({
            daysLeft: 0,
            serverName: p.name || 'Unnamed',
            serverId: p.serverId,
            mentionTag: `@${ownerPhone}`,
          });
          await sock.sendMessage(jid, { text: teks, mentions: [jid] });
        } catch {  }
      }
    }
  }

  if (updated) savePanelDB(panelDB);
}

async function checkAndCleanupExpiredServers() {
  if (!panelConfigured()) return;
  const CLEANUP_DAYS = 14;
  const now = Date.now();
  const expiredDaysOf = (p) => Math.floor((now - p.expiresAt) / DAY_MS);

  const removedIds = new Set();
  for (const p of loadPanelDB()) {
    if (!p.expiresAt || !p.suspended || expiredDaysOf(p) <= CLEANUP_DAYS) continue;

    const exists = await checkServerExists(p.serverId);
    if (!exists || (await deleteServer(p.serverId))) {
      removedIds.add(String(p.serverId));
      clearNotifState(p.serverId);
    }
  }

  if (removedIds.size) {

    savePanelDB(loadPanelDB().filter((p) => !removedIds.has(String(p.serverId))));
  }
}

let expirationInterval = null;
let cleanupInterval = null;

export function startExpirationWatcher(sock) {
  if (expirationInterval) clearInterval(expirationInterval);
  if (cleanupInterval) clearInterval(cleanupInterval);

  expirationInterval = setInterval(() => {
    checkAndSuspendExpiredServers(sock).catch((e) => logger.error('[cpanel] suspend watcher:', e?.message || e));
  }, 60 * 1000);

  cleanupInterval = setInterval(() => {
    checkAndCleanupExpiredServers().catch((e) => logger.error('[cpanel] cleanup watcher:', e?.message || e));
  }, 3600 * 1000);
}
