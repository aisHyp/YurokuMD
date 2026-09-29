import fs from "fs";
import path from "path";

const dbDir = "./library/database";
const botlistPath = path.join(dbDir, "botlist.json");

function ensureFile() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(botlistPath)) {
    fs.writeFileSync(botlistPath, JSON.stringify({ jids: [] }, null, 2));
  }
}
ensureFile();

function load() {
  try {
    ensureFile();
    return JSON.parse(fs.readFileSync(botlistPath, "utf8"));
  } catch (e) {
    return { jids: [] };
  }
}

function save(data) {
  ensureFile();
  fs.writeFileSync(botlistPath, JSON.stringify(data, null, 2));
}

export function addBotJid(jid) {
  const data = load();
  if (data.jids.includes(jid)) return false;
  data.jids.push(jid);
  save(data);
  return true;
}

export function removeBotJid(jid) {
  const data = load();
  if (!data.jids.includes(jid)) return false;
  data.jids = data.jids.filter((x) => x !== jid);
  save(data);
  return true;
}

export function listBotJids() {
  return load().jids;
}

export function isKnownBot(jid) {
  return load().jids.includes(jid);
}
