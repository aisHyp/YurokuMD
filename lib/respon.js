

import fs from "fs";
import path from "path";

const dbDir = "./library/database";
const responDir = path.join(dbDir, "respon");
const responIndexPath = path.join(dbDir, "respon.json");

function ensure() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(responDir)) fs.mkdirSync(responDir, { recursive: true });
  if (!fs.existsSync(responIndexPath)) {
    fs.writeFileSync(responIndexPath, JSON.stringify([], null, 2));
  }
}
ensure();

function readIndex() {
  try {
    ensure();
    return JSON.parse(fs.readFileSync(responIndexPath, "utf8"));
  } catch (e) {
    return [];
  }
}

function writeIndex(list) {
  ensure();
  fs.writeFileSync(responIndexPath, JSON.stringify(list, null, 2));
}

export function listRespon() {
  return readIndex();
}

export function findRespon(cmd) {
  const key = cmd.toLowerCase().trim();
  return readIndex().find((e) => e.cmd === key) || null;
}

export function addRespon(entry) {
  const cmd = entry.cmd.toLowerCase().trim();
  const list = readIndex();
  if (list.find((e) => e.cmd === cmd)) {
    return { ok: false, reason: `Cmd *${cmd}* sudah ada. Hapus dulu pakai .delrespon kalau mau ganti.` };
  }

  let filename = null;
  if (entry.mediaBuffer) {
    filename = `${cmd.replace(/[^a-z0-9_-]/gi, "_")}_${Date.now()}.${entry.mediaExt || "bin"}`;
    fs.writeFileSync(path.join(responDir, filename), entry.mediaBuffer);
  }

  const record = {
    cmd,
    mtype: entry.mtype,
    text: entry.text || null,
    caption: entry.caption || null,
    mimetype: entry.mimetype || null,
    filename,
    createdAt: Date.now(),
  };

  list.push(record);
  writeIndex(list);
  return { ok: true, record };
}

export function deleteRespon(cmd) {
  const key = cmd.toLowerCase().trim();
  const list = readIndex();
  const idx = list.findIndex((e) => e.cmd === key);
  if (idx === -1) return { ok: false, reason: `Cmd *${key}* tidak ditemukan.` };

  const [removed] = list.splice(idx, 1);
  if (removed.filename) {
    const filePath = path.join(responDir, removed.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  writeIndex(list);
  return { ok: true };
}

export function clearRespon() {
  const list = readIndex();
  const total = list.length;
  for (const e of list) {
    if (e.filename) {
      const filePath = path.join(responDir, e.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }
  writeIndex([]);
  return total;
}

export function getResponMediaBuffer(record) {
  if (!record.filename) return null;
  const filePath = path.join(responDir, record.filename);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}
