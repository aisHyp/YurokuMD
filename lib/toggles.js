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



import fs from "fs";
import path from "path";

const dbDir = "./library/database";
const togglesPath = path.join(dbDir, "toggles.json");

export const KNOWN_TOGGLES = {
  antilink: "Anti Link",
  antilinkall: "Anti Link All",
  antilinkyt: "Anti Link YouTube",
  antilinkytch: "Anti Link Channel YouTube",
  antilinkch: "Anti Link Saluran WA",
  antilinkgroup: "Anti Link Grup WA",
  antitagall: "Anti Tag All",
  antitagsw: "Anti Tag Status WA",
  antispam: "Anti Spam",
  antibadword: "Anti Badword",
  antidelete: "Anti Delete",
  antilokasi: "Anti Lokasi",
  antikontak: "Anti Kontak",
  antipromosi: "Anti Promosi",
  antibot: "Anti Bot",
  onlyadmin: "Only Admin Mode",
  mute: "Mute Bot",
};

export const MODERATION_FEATURES = {
  antilink: "Anti Link",
  antitoxic: "Anti Toxic",
  antispam: "Anti Spam (Flood)",
  antitagall: "Anti Tag All",
  antifoto: "Anti Foto",
  antivideo: "Anti Video",
  antiaudio: "Anti Audio",
  antidokumen: "Anti Dokumen",
  antisticker: "Anti Sticker",
};

function ensureFile() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(togglesPath)) {
    fs.writeFileSync(togglesPath, JSON.stringify({}, null, 2));
  }
}
ensureFile();

function readAll() {
  try {
    ensureFile();
    return JSON.parse(fs.readFileSync(togglesPath, "utf8"));
  } catch (e) {
    return {};
  }
}

function writeAll(data) {
  ensureFile();
  fs.writeFileSync(togglesPath, JSON.stringify(data, null, 2));
}

export function getChatToggles(chatId) {
  const all = readAll();
  return all[chatId] || {};
}

export function isToggleOn(chatId, name) {
  return getChatToggles(chatId)[name] === true;
}

export function setToggle(chatId, name, value) {
  const all = readAll();
  if (!all[chatId]) all[chatId] = {};
  all[chatId][name] = value;
  writeAll(all);
  return all[chatId];
}

export function setModerationMode(chatId, fitur, mode) {
  const all = readAll();
  if (!all[chatId]) all[chatId] = {};
  delete all[chatId][`${fitur}:delete`];
  delete all[chatId][`${fitur}:kick`];
  if (mode === "delete" || mode === "kick") {
    all[chatId][`${fitur}:${mode}`] = true;
  }
  writeAll(all);
  return all[chatId];
}

export function getModerationMode(chatId, fitur) {
  const t = getChatToggles(chatId);
  if (t[`${fitur}:kick`]) return "kick";
  if (t[`${fitur}:delete`]) return "delete";
  return "off";
}
