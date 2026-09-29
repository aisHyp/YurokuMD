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
import { getChatToggles } from "./toggles.js";
import { isKnownBot } from "./botlist.js";

const dbDir = "./library/database";
const badwordsPath = path.join(dbDir, "badwords.json");

function ensureBadwords() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(badwordsPath)) {
    fs.writeFileSync(badwordsPath, JSON.stringify({ words: [] }, null, 2));
  }
}
ensureBadwords();

export function loadBadwords() {
  try {
    ensureBadwords();
    return JSON.parse(fs.readFileSync(badwordsPath, "utf8"));
  } catch (e) {
    return { words: [] };
  }
}

export function saveBadwords(data) {
  ensureBadwords();
  fs.writeFileSync(badwordsPath, JSON.stringify(data, null, 2));
}

export function addBadword(word) {
  const data = loadBadwords();
  const w = word.toLowerCase().trim();
  if (!w || data.words.includes(w)) return false;
  data.words.push(w);
  saveBadwords(data);
  return true;
}

export function removeBadword(word) {
  const data = loadBadwords();
  const w = word.toLowerCase().trim();
  if (!data.words.includes(w)) return false;
  data.words = data.words.filter((x) => x !== w);
  saveBadwords(data);
  return true;
}

function isToxic(text) {
  if (!text) return false;
  const { words: badwords } = loadBadwords();
  if (!badwords.length) return false;
  const words = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  for (const w of words) {
    const clean = w.replace(/[^a-z0-9]/gi, "");
    if (clean && badwords.includes(clean)) return true;
  }
  return false;
}

const linkRegex = /(https?:\/\/[^\s]+|chat\.whatsapp\.com\/[^\s]+|wa\.me\/[^\s]+)/i;
const ytLinkRegex = /(youtube\.com|youtu\.be)/i;
const ytChannelLinkRegex = /youtube\.com\/(channel\/|c\/|@)/i;
const waChannelLinkRegex = /whatsapp\.com\/channel\//i;
const waGroupLinkRegex = /chat\.whatsapp\.com\//i;

const promoKeywords = [
  "open order", "open po", "promo", "diskon", "cod ", "gratis ongkir",
  "jual ", "dijual", "reseller", "dropship", "restock", "flash sale",
];
function isPromo(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return promoKeywords.some((kw) => lower.includes(kw));
}

async function isOwnGroupInviteLink(russyuroku, text, chatId) {
  try {
    const code = await russyuroku.groupInviteCode(chatId);
    return new RegExp(`chat\\.whatsapp\\.com/${code}`, "i").test(text);
  } catch {
    return false;
  }
}

function bumpWarn(chatId, userId, fitur) {
  if (!global.moderationWarn) global.moderationWarn = {};
  const key = `${chatId}:${userId}:${fitur}`;
  global.moderationWarn[key] = (global.moderationWarn[key] || 0) + 1;
  return global.moderationWarn[key];
}

function resetWarn(chatId, userId, fitur) {
  if (!global.moderationWarn) return;
  delete global.moderationWarn[`${chatId}:${userId}:${fitur}`];
}

const MAX_WARN = 3;

async function enforce({ russyuroku, m, fitur, mode, label, senderPnJid, isBotAdmins }) {
  const mentions = [m.sender];

  if (isBotAdmins) {
    try {
      await russyuroku.sendMessage(m.chat, { delete: m.key });
    } catch (e) {}
  }

  if (mode === "kick") {
    const count = bumpWarn(m.chat, senderPnJid, fitur);
    if (count >= MAX_WARN) {
      resetWarn(m.chat, senderPnJid, fitur);
      await russyuroku.sendMessage(
        m.chat,
        { text: `🚨 @${m.sender.split("@")[0]} kena *${label}* ${MAX_WARN}x dan dikeluarkan dari grup.`, mentions },
        { quoted: m }
      );
      if (isBotAdmins) {
        try {
          await russyuroku.groupParticipantsUpdate(m.chat, [senderPnJid], "remove");
        } catch (e) {}
      }
    } else {
      await russyuroku.sendMessage(
        m.chat,
        { text: `⚠️ @${m.sender.split("@")[0]} terdeteksi *${label}*!\nPeringatan: ${count}/${MAX_WARN}. Pesan dihapus.`, mentions },
        { quoted: m }
      );
    }
  } else {
    await russyuroku.sendMessage(
      m.chat,
      { text: `🗑️ @${m.sender.split("@")[0]} pesan dihapus karena *${label}* aktif di grup ini.`, mentions },
      { quoted: m }
    );
  }
  return true;
}

export async function runModeration(m, ctx) {
  const { russyuroku, senderPnJid, isBotAdmins } = ctx;
  if (!m.isGroup) return false;

  const toggles = getChatToggles(m.chat);
  const text = m.text || "";

  const linkMode = toggles["antilink:kick"] ? "kick" : toggles["antilink:delete"] ? "delete" : null;
  if (linkMode && text && linkRegex.test(text)) {
    const isOwnLink = await isOwnGroupInviteLink(russyuroku, text, m.chat);
    if (!isOwnLink) {
      return enforce({ russyuroku, m, fitur: "antilink", mode: linkMode, label: "Anti Link", senderPnJid, isBotAdmins });
    }
  }

  if (toggles["antilinkall"] === true && text && linkRegex.test(text)) {
    return enforce({ russyuroku, m, fitur: "antilinkall", mode: "delete", label: "Anti Link All", senderPnJid, isBotAdmins });
  }

  if (toggles["antilinkyt"] === true && text && ytLinkRegex.test(text)) {
    return enforce({ russyuroku, m, fitur: "antilinkyt", mode: "delete", label: "Anti Link YouTube", senderPnJid, isBotAdmins });
  }

  if (toggles["antilinkytch"] === true && text && ytChannelLinkRegex.test(text)) {
    return enforce({ russyuroku, m, fitur: "antilinkytch", mode: "delete", label: "Anti Link Channel YouTube", senderPnJid, isBotAdmins });
  }

  if (toggles["antilinkch"] === true && text && waChannelLinkRegex.test(text)) {
    return enforce({ russyuroku, m, fitur: "antilinkch", mode: "delete", label: "Anti Link Saluran WA", senderPnJid, isBotAdmins });
  }

  if (toggles["antilinkgroup"] === true && text && waGroupLinkRegex.test(text)) {
    const isOwnLink = await isOwnGroupInviteLink(russyuroku, text, m.chat);
    if (!isOwnLink) {
      return enforce({ russyuroku, m, fitur: "antilinkgroup", mode: "delete", label: "Anti Link Grup", senderPnJid, isBotAdmins });
    }
  }

  if (toggles["antibot"] === true && isKnownBot(m.sender)) {
    return enforce({ russyuroku, m, fitur: "antibot", mode: "delete", label: "Anti Bot", senderPnJid, isBotAdmins });
  }

  if (toggles["antipromosi"] === true && isPromo(text)) {
    return enforce({ russyuroku, m, fitur: "antipromosi", mode: "delete", label: "Anti Promosi", senderPnJid, isBotAdmins });
  }

  if (toggles["antitagsw"] === true && m.mtype === "groupStatusMentionMessage") {
    return enforce({ russyuroku, m, fitur: "antitagsw", mode: "delete", label: "Anti Tag Status WA", senderPnJid, isBotAdmins });
  }

  const toxicMode = toggles["antitoxic:kick"] ? "kick" : toggles["antitoxic:delete"] ? "delete" : null;
  if (toxicMode && isToxic(text)) {
    return enforce({ russyuroku, m, fitur: "antitoxic", mode: toxicMode, label: "Anti Toxic", senderPnJid, isBotAdmins });
  }

  if (toggles["antibadword"] === true && isToxic(text)) {
    return enforce({ russyuroku, m, fitur: "antibadword", mode: "delete", label: "Anti Badword", senderPnJid, isBotAdmins });
  }

  if (toggles["antilokasi"] === true && (m.mtype === "locationMessage" || m.mtype === "liveLocationMessage")) {
    return enforce({ russyuroku, m, fitur: "antilokasi", mode: "delete", label: "Anti Lokasi", senderPnJid, isBotAdmins });
  }

  if (toggles["antikontak"] === true && (m.mtype === "contactMessage" || m.mtype === "contactsArrayMessage")) {
    return enforce({ russyuroku, m, fitur: "antikontak", mode: "delete", label: "Anti Kontak", senderPnJid, isBotAdmins });
  }

  const tagallMode = toggles["antitagall:kick"] ? "kick" : toggles["antitagall:delete"] ? "delete" : null;
  if (tagallMode) {
    const lower = text.toLowerCase();
    const isKeyword = lower.includes("@everyone") || lower.includes("@all") || lower.includes("@grup") || lower.includes("@semua");
    const isHighMention = (m.mentionedJid || []).length >= 8;
    if (isKeyword || isHighMention) {
      return enforce({ russyuroku, m, fitur: "antitagall", mode: tagallMode, label: "Anti Tag All", senderPnJid, isBotAdmins });
    }
  }

  const spamMode = toggles["antispam:kick"] ? "kick" : toggles["antispam:delete"] ? "delete" : null;
  if (spamMode) {
    if (!global.spamTracker) global.spamTracker = {};
    const key = `${m.chat}:${senderPnJid}`;
    const now = Date.now();
    const last = global.spamTracker[key] || { time: 0, count: 0 };
    const diff = now - last.time;
    const nextCount = diff < 2000 ? last.count + 1 : 1;
    global.spamTracker[key] = { time: now, count: nextCount };
    if (nextCount >= 3) {
      global.spamTracker[key] = { time: now, count: 0 };
      return enforce({ russyuroku, m, fitur: "antispam", mode: spamMode, label: "Anti Spam", senderPnJid, isBotAdmins });
    }
  }

  const mediaTypes = {
    antifoto: "imageMessage",
    antivideo: "videoMessage",
    antiaudio: "audioMessage",
    antidokumen: "documentMessage",
    antisticker: "stickerMessage",
  };
  for (const [fitur, mtype] of Object.entries(mediaTypes)) {
    const mode = toggles[`${fitur}:kick`] ? "kick" : toggles[`${fitur}:delete`] ? "delete" : null;
    if (mode && m.mtype === mtype) {
      const label = {
        antifoto: "Anti Foto",
        antivideo: "Anti Video",
        antiaudio: "Anti Audio",
        antidokumen: "Anti Dokumen",
        antisticker: "Anti Sticker",
      }[fitur];
      return enforce({ russyuroku, m, fitur, mode, label, senderPnJid, isBotAdmins });
    }
  }

  return false;
}
