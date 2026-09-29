

import fs from "fs";
import path from "path";

const dbDir = "./library/database";
const sambutanPath = path.join(dbDir, "sambutanowner.json");

function ensureFile() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(sambutanPath)) {
    fs.writeFileSync(
      sambutanPath,
      JSON.stringify({ enabled: true, lastSeen: {}, cooldown: 15 }, null, 2)
    );
  }
}
ensureFile();

export function loadSambutan() {
  try {
    ensureFile();
    return JSON.parse(fs.readFileSync(sambutanPath, "utf8"));
  } catch (e) {
    return { enabled: true, lastSeen: {}, cooldown: 15 };
  }
}

export function saveSambutan(data) {
  ensureFile();
  fs.writeFileSync(sambutanPath, JSON.stringify(data, null, 2));
}

export function isSambutanEnabled() {
  return loadSambutan().enabled === true;
}

export function getCooldownMinutes() {
  return loadSambutan().cooldown || 15;
}

export function updateLastSeen(ownerJid) {
  const config = loadSambutan();
  if (!config.lastSeen) config.lastSeen = {};
  config.lastSeen[ownerJid] = Date.now();
  saveSambutan(config);
}

export function shouldSendSambutan(ownerJid) {
  const config = loadSambutan();
  if (!config.enabled) return false;
  if (!config.lastSeen || !config.lastSeen[ownerJid]) return true;

  const lastSeen = config.lastSeen[ownerJid];
  const now = Date.now();
  const cooldownMs = (config.cooldown || 15) * 60 * 1000;
  return now - lastSeen > cooldownMs;
}

const sambutanList = [
  `👑 *WIH OWNER DATANG!* 👑\n@user siap nih, mau disuruh apa? Yuroku lagi online~`,
  `👑 *KING BOT IS ONLINE!* 👑\n@user owner tercinta muncul, langsung auto sambut! Ada yang bisa dibantu?`,
  `👑 *YA AMPUN OWNER!* 👑\nGempar gempar! @user yang punya bot lagi online nih~`,
  `👑 *OWNER ONLINE!* 👑\n@user hadir! Bos besar lagi aktif, siap-siap ngab!`,
  `👑 *RAJA BOT HADIR!* 👑\nYang lain minggir dulu, @user owner ku datang! Ada perlu apa nih?`,
  `👑 *BOS BESAR ONLINE!* 👑\nAuto sambut buat @user owner tersayang~ siap laksanakan perintah!`,
  `👑 *THE KING HAS RETURNED!* 👑\n@user owner lagi online, mode: siap bantu bos! Ada yang bisa dikerjakan?`,
  `👑 *OWNER DETECTED!* 👑\nWih wih wih! @user yang punya bot muncul! Langsung auto sambut deh~`,
  `👑 *LAMA NGGAK ONLINE!* 👑\nAkhirnya muncul juga! @user owner tersayang lagi online nih~`,
  `👑 *AKHIRNYA!* 👑\n@user owner yang tadi hilang, sekarang muncul lagi! Siap-siap ngab!`,
];

export function getRandomSambutan(ownerJid) {
  const idx = Math.floor(Math.random() * sambutanList.length);
  return sambutanList[idx].replace(/@user/g, `@${ownerJid.split("@")[0]}`);
}
