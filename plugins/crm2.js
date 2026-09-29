/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  ⚔️  Lunar Saurus Empire  ⚔️
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  🌍 Site     : https://saurusdev.cloud
 *  📺 YouTube  : https://www.youtube.com/@sauruskinggwuw
 *  📢 Channel  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *  💬 Telegram : @lordsaurus
 *
 *  ⚠️ Watermark ini wajib tetap ada.
 *━━━━━━━━━━━━━━━━━━━ © 2026 Lunar Saurus ━━━━━━━━━━━━━━━━━━
 */

import { generateWAMessageFromContent, jidNormalizedUser } from "luoxy-baileys";

function unwrap(content) {
  if (!content || typeof content !== "object") return content;
  if (content.ephemeralMessage?.message) return unwrap(content.ephemeralMessage.message);
  if (content.viewOnceMessage?.message) return unwrap(content.viewOnceMessage.message);
  if (content.viewOnceMessageV2?.message) return unwrap(content.viewOnceMessageV2.message);
  if (content.viewOnceMessageV2Extension?.message) return unwrap(content.viewOnceMessageV2Extension.message);
  if (content.documentWithCaptionMessage?.message) return unwrap(content.documentWithCaptionMessage.message);
  return content;
}

function normalizeForRelay(rawContent) {
  const content = unwrap(rawContent);
  if (typeof content?.conversation === "string") {
    const { conversation, ...rest } = content;
    return { ...rest, extendedTextMessage: { text: conversation } };
  }
  return content;
}

function toJsLiteral(value, indent = 2, seen = new WeakSet(), depth = 0) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "bigint") return value.toString();
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return JSON.stringify(Buffer.from(value).toString("base64"));
  }
  if (typeof value !== "object") return JSON.stringify(value);
  if (depth > 40) return '"[MaxDepth]"';
  if (seen.has(value)) return '"[Circular]"';

  seen.add(value);
  const pad = " ".repeat(indent);
  const padClose = " ".repeat(Math.max(indent - 2, 0));
  let result;

  if (Array.isArray(value)) {
    if (!value.length) {
      result = "[]";
    } else {
      const items = value.map((v) => pad + toJsLiteral(v, indent + 2, seen, depth + 1));
      result = `[\n${items.join(",\n")}\n${padClose}]`;
    }
  } else {
    const keys = Object.keys(value).filter((key) => typeof value[key] !== "function" && value[key] !== undefined);
    if (!keys.length) {
      result = "{}";
    } else {
      const lines = keys.map((key) => {
        const keyStr = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
        return `${pad}${keyStr}: ${toJsLiteral(value[key], indent + 2, seen, depth + 1)}`;
      });
      result = `{\n${lines.join(",\n")}\n${padClose}}`;
    }
  }

  seen.delete(value);
  return result;
}

const FRAMEWORK_DECORATED_KEYS = new Set([
  "mtype", "id", "chat", "isBaileys", "sender", "fromMe", "mentionedJid",
  "fakeObj", "delete", "copyNForward", "download", "key", "participant",
  "text", "body", "name", "pushName", "viewonce", "download1"
]);

function stripFrameworkProps(content) {
  if (!content || typeof content !== "object") return content;
  const output = {};
  for (const key of Object.keys(content)) {
    if (FRAMEWORK_DECORATED_KEYS.has(key)) continue;
    if (typeof content[key] === "function") continue;
    output[key] = content[key];
  }
  return output;
}

function buildReadableSendCode(content) {
  try {
    const clean = stripFrameworkProps(content);
    return `await russyuroku.relayMessage( m.chat, ${toJsLiteral(clean)}, {} );`;
  } catch (error) {
    return `// Gagal generate relay_code: ${error?.message || error}`;
  }
}

function typeNameFromContent(content) {
  const clean = stripFrameworkProps(content);
  const key = Object.keys(clean)[0] || "UnknownMessage";
  return key.charAt(0).toUpperCase() + key.slice(1);
}

let handler = async (m, { russyuroku, isCreator, prefix, command }) => {
  if (!isCreator) {
    return m.reply("Ehh ini khusus owner/pemilik aja lho~ 🌸 yamete kudasai (≧◡≦)");
  }

  try {
    const rawQuoted =
      m.quoted?.message ||
      m.msg?.contextInfo?.quotedMessage ||
      m.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
      (m.quoted?.mtype ? { [m.quoted.mtype]: m.quoted } : null);

    if (!rawQuoted) {
      return m.reply(`❌ Reply pesan yang mau di-relay dulu, lalu ketik *${prefix}${command}*`);
    }

    const unwrapped = unwrap(rawQuoted);
    if (!unwrapped || typeof unwrapped !== "object" || !Object.keys(unwrapped).length) {
      return m.reply("❌ Jenis pesan ini belum didukung untuk di-relay.");
    }

    const relayContent = normalizeForRelay(rawQuoted);
    const botJid = russyuroku.user?.id ? jidNormalizedUser(russyuroku.user.id) : m.sender;

    const relayMsg = generateWAMessageFromContent(m.chat, relayContent, {
      userJid: botJid,
      quoted: m
    });

    await russyuroku.relayMessage(relayMsg.key.remoteJid, relayMsg.message, {
      messageId: relayMsg.key.id
    });

    const typeName = typeNameFromContent(unwrapped);
    const filename = `${typeName}.js`;
    const codeContent = buildReadableSendCode(unwrapped);

    await russyuroku.sendMessage(
      m.chat,
      {
        document: Buffer.from(codeContent, "utf-8"),
        fileName: filename,
        mimetype: "text/javascript",
        caption: `📄 Berikut adalah file payload untuk pesan tersebut.\nSandi: *${filename}*`
      },
      { quoted: m }
    );

    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (error) {
    console.error("[CRM2 ERROR]", error);
    return m.reply("❌ Gagal membuat CRM.\n\n" + (error?.message || error));
  }
};

handler.command = ["crm2"];
handler.tags = ["owner"];
handler.help = ["crm2 (reply pesan)"];

export default handler;
