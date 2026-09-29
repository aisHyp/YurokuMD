import fs from "fs";
import path from "path";

const dbDir = "./library/database";
const globalTogglesPath = path.join(dbDir, "globaltoggles.json");

function ensureFile() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(globalTogglesPath)) {
    fs.writeFileSync(globalTogglesPath, JSON.stringify({ onlyGroupMode: false, autoCorrect: false }, null, 2));
  }
}
ensureFile();

function readAll() {
  try {
    ensureFile();
    return JSON.parse(fs.readFileSync(globalTogglesPath, "utf8"));
  } catch (e) {
    return { onlyGroupMode: false, autoCorrect: false };
  }
}

function writeAll(data) {
  ensureFile();
  fs.writeFileSync(globalTogglesPath, JSON.stringify(data, null, 2));
}

export function isOnlyGroupMode() {
  return readAll().onlyGroupMode === true;
}

export function setOnlyGroupMode(value) {
  const all = readAll();
  all.onlyGroupMode = value;
  writeAll(all);
  return all;
}

export function isAutoCorrectOn() {
  return readAll().autoCorrect === true;
}

export function setAutoCorrect(value) {
  const all = readAll();
  all.autoCorrect = value;
  writeAll(all);
  return all;
}
