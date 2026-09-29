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

import "./settings.js";
import {
  clockString,
  parseMention,
  isUrl,
  sleep,
  runtime,
  getBuffer,
  jsonformat,
  capital,
  previewAd,
} from "./lib/myfunc.js";
import uploader from "./lib/upload.js";
import { addUserXP, getAutoLevelConfig, getXPToNextLevel, getGroupLeaderboard, generateLevelCard } from "./lib/level.js";
import { guard, collectAdminIds, smsg, serializeAccess } from "./source/message.js";
import { getEmojiMixUrl } from "./lib/scraper/emojikitchen.js";
import {
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType,
  delay,
  Button,
  ButtonV2,
} from "luoxy-baileys";
import crypto from "crypto";
import FormData from "form-data";
import { Primbon } from "scrape-primbon";
const primbon = new Primbon();
import QRCode from "qrcode";
import JavaScriptObfuscator from "javascript-obfuscator";
import { modul } from "./module.js";
import { exec, execSync } from "child_process";
import writecanvas from "writecanvas";

import { color, bgcolor } from "./lib/color.js";
import path from "path";
import util from "util";
import * as logger from "./lib/logger.js";
import {
  toJid,
  isPremium,
  getPremiumEntry,
  addPremium,
  delPremium,
  getRemainingLimit,
  useLimit,
  addLimit,
} from "./lib/premium.js";
const {
  os,
  axios,
  baileys,
  chalk,
  cheerio,
  fs,
  process,
  moment,
  fileTypeFromBuffer,
  parsePhoneNumber,
} = modul;
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { startSubBot, deleteSubBot, listSubBots, listRentbotFolders } from './lib/jadibot.js';
import {
  handleSessionReply as handleAkinatorReply,
  startSession as startAkinatorSession,
  stopSession as stopAkinatorSession,
} from './plugins/akinator.js';
import {
  getSession as getTempMailSession,
  createSession as createTempMailSession,
  refreshSession as refreshTempMailSession,
  clearSession as clearTempMailSession,
} from './lib/scraper/tempmail.js';
import { applyAudioEffect, applyVolumeEffect, webpToVideo } from './lib/convert.js';
import { handleGameAnswer } from './lib/scraper/game.js';
import { handleBombPick, startTebakBom } from './lib/tebakbom.js';
import { handleKuisMathAnswer } from './lib/kuismath.js';
import { handleMove as handleTttMove } from './lib/tictactoe.js';
import { handleWordSubmission as handleSambungKataWord } from './lib/sambungkata.js';
import {
  loadSambutan,
  saveSambutan,
  getRandomSambutan,
  updateLastSeen,
  shouldSendSambutan,
} from './lib/sambutanowner.js';
import { KNOWN_TOGGLES, MODERATION_FEATURES, getChatToggles, isToggleOn, setToggle, setModerationMode, getModerationMode } from './lib/toggles.js';
import { cacheIncoming, handleRevoke } from './lib/antidelete.js';
import { isOnlyGroupMode, isAutoCorrectOn, setOnlyGroupMode, setAutoCorrect } from './lib/globaltoggles.js';
import { suggestCommand } from './lib/autocorrect.js';
import { runModeration, addBadword, removeBadword, loadBadwords } from './lib/moderation.js';
import { addBotJid, removeBotJid, listBotJids } from './lib/botlist.js';
import { drawBrat, CHAR_TEMPLATES, HD_TEMPLATES } from './lib/scraper/brat.js';
import { tiktokSearchVideo } from './lib/scraper/tiktoksearch.js';
import { soundcloudSearch } from './lib/scraper/soundcloudsearch.js';
import { wikipediaSearch } from './lib/scraper/wikipediasearch.js';
import { listRespon, findRespon, addRespon, deleteRespon, clearRespon, getResponMediaBuffer } from './lib/respon.js';

const readFile = util.promisify(fs.readFile);

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

const yy1 = "`";
const yy2 = "```";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let pluginsCache = [];
let pluginsSignatureCache = "";

function pluginsSignature(directory) {
  const files = fs.readdirSync(directory).filter((f) => f.endsWith(".js"));
  return files.map((f) => `${f}:${fs.statSync(path.join(directory, f)).mtimeMs}`).join("|");
}

async function loadPlugins(directory) {
  const plugins = [];
  const files = fs.readdirSync(directory).filter((f) => f.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(directory, file);
    try {
      const plugin = await import(`file://${filePath}?update=${Date.now()}`);
      const handler = plugin.default || plugin;
      if (handler && Array.isArray(handler.command)) plugins.push(handler);
    } catch (error) {
      logger.warn(`Gagal memuat plugin di ${filePath}: ${error.message}`);
    }
  }
  return plugins;
}

async function getPlugins() {
  const directory = path.resolve(__dirname, "plugins");
  const signature = pluginsSignature(directory);
  if (pluginsCache.length && signature === pluginsSignatureCache) return pluginsCache;

  pluginsSignatureCache = signature;
  pluginsCache = await loadPlugins(directory);
  return pluginsCache;
}

export default async function mainHandler(russyuroku, m, chatUpdate, store) {
try {
  const cachedGroupMeta = async (jid) => {
    const cache = global.groupCache
    const cached = cache?.get(jid)
    if (cached) return cached
    const meta = await russyuroku.groupMetadata(jid)
    cache?.set(jid, meta)
    return meta
  }

  async function groupStatus(sock, jid, content) {
    const { backgroundColor } = content;
    delete content.backgroundColor;

    const inside = await generateWAMessageContent(content, {
      upload: sock.waUploadToServer,
      backgroundColor
    });

    const messageSecret = crypto.randomBytes(32);

    const msg = generateWAMessageFromContent(
      jid,
      {
        messageContextInfo: { messageSecret },
        groupStatusMessageV2: {
          message: {
            ...inside,
            messageContextInfo: { messageSecret }
          }
        }
      },
      {}
    );

    await sock.relayMessage(jid, msg.message, {
      messageId: msg.key.id
    });

    return msg;
  }

  async function appenTextMessage(text, chatUpdate) {
    let messages = await generateWAMessage(
      m.chat,
      {
        text: text,
        mentions: m.mentionedJid,
      },
      {
        userJid: russyuroku.user.id,
        quoted: m.quoted && m.quoted.fakeObj,
      },
    );
    messages.key.fromMe = areJidsSameUser(m.sender, russyuroku.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    russyuroku.ev.emit("messages.upsert", msg);
  }
  const { type, quotedMsg, mentioned, now, fromMe } = m;
  let body = !m.message
    ? ""
    : m.mtype === "interactiveResponseMessage"
      ? JSON.parse(
          m.message.interactiveResponseMessage?.nativeFlowResponseMessage
            ?.paramsJson || "{}",
        ).id || ""
      : m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
          ? m.message.imageMessage?.caption
          : m.mtype == "videoMessage"
            ? m.message.videoMessage?.caption
            : m.mtype == "extendedTextMessage"
              ? m.message.extendedTextMessage?.text
              : m.mtype == "buttonsResponseMessage"
                ? m.message.buttonsResponseMessage?.selectedButtonId
                : m.mtype == "listResponseMessage"
                  ? m.message.listResponseMessage?.singleSelectReply
                      ?.selectedRowId
                  : m.mtype == "templateButtonReplyMessage"
                    ? m.message.templateButtonReplyMessage?.selectedId
                    : m.mtype == "messageContextInfo"
                      ? m.message.buttonsResponseMessage?.selectedButtonId ||
                        m.message.listResponseMessage?.singleSelectReply
                          ?.selectedRowId ||
                        m.text
                      : m.mtype === "editedMessage"
                        ? (m.message.editedMessage?.message?.protocolMessage
                            ?.editedMessage?.extendedTextMessage?.text ??
                          m.message.editedMessage?.message?.protocolMessage
                            ?.editedMessage?.conversation ??
                          m.message.protocolMessage?.editedMessage
                            ?.extendedTextMessage?.text ??
                          m.message.protocolMessage?.editedMessage
                            ?.conversation ??
                          "")
                        : m.mtype === "protocolMessage"
                          ? (m.message.protocolMessage?.editedMessage
                              ?.extendedTextMessage?.text ??
                            m.message.protocolMessage?.editedMessage
                              ?.conversation ??
                            "")
                          : "";

  body = body || "";

  cacheIncoming(m);
  if (m.mtype === "protocolMessage" && m.message?.protocolMessage?.type === 0) {
    handleRevoke(russyuroku, m).catch(() => {});
  }

const randomThumbUrl = global.image.menu

const budy = (typeof m.text == 'string' ? m.text : '.')
const prefixChars = global.prefix || '.'
const prefixCharClass = prefixChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
const prefixRegex = new RegExp(`^[${prefixCharClass}]`)
const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.'
  const chath = body;
  const pes = body;
  const messagesC = pes.slice(0).trim();
  const content = JSON.stringify(m.message || {});
  const isCmd = body.startsWith(prefix);
  const from = m.key.remoteJid;
  const messagesD = body.slice(0).trim().split(/ +/).shift().toLowerCase();
  const command = body
    .replace(prefix, "")
    .trim()
    .split(/ +/)
    .shift()
    .toLowerCase();
  const args = body.trim().split(/ +/).slice(1);
  const pushname = m.pushName || "Anomali";
  const q = args.join(" ");
  const text = q;
  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || "";
  const qmsg = quoted.msg || quoted;
  const isMedia = /image|video|sticker|audio/.test(mime);
  const isImage = type == "imageMessage";
  const isVideo = type == "videoMessage";
  const isAudio = type == "audioMessage";
  const isSticker = type == "stickerMessage";
  const isQuotedImage =
    type === "extendedTextMessage" && content.includes("imageMessage");
  const isQuotedLocation =
    type === "extendedTextMessage" && content.includes("locationMessage");
  const isQuotedVideo =
    type === "extendedTextMessage" && content.includes("videoMessage");
  const isQuotedSticker =
    type === "extendedTextMessage" && content.includes("stickerMessage");
  const isQuotedAudio =
    type === "extendedTextMessage" && content.includes("audioMessage");
  const isQuotedContact =
    type === "extendedTextMessage" && content.includes("contactMessage");
  const isQuotedDocument =
    type === "extendedTextMessage" && content.includes("documentMessage");
  const sender = m.isGroup
    ? m.key.participant
      ? m.key.participant
      : m.participant
    : m.key.remoteJid;
  const isGroup = m.chat.endsWith('@g.us')
  const groupMetadata = m.isGroup
    ? await cachedGroupMeta(m.chat).catch((e) => {})
    : "";

  const senderPnJid = sender.endsWith('@lid')
    ? await russyuroku.resolvePn(sender, groupMetadata, { chatId: m.chat }).catch(() => sender)
    : sender;
  const senderNumber = senderPnJid.split("@")[0];
  const participants =
    m.isGroup && groupMetadata ? groupMetadata.participants : [];

  // Tulis balik hasil resolve LID->nomor asli ke m.sender & m.key.participant.
  // Tanpa ini, banyak fitur yang membaca m.sender langsung (bukan senderPnJid)
  // akan tetap dapat LID mentah dan bisa salah/rusak saat addressingMode grup = 'lid'.
  if (sender.endsWith('@lid') && senderPnJid && senderPnJid !== sender && !senderPnJid.endsWith('@lid')) {
    m.sender = senderPnJid;
    if (m.key) m.key.participant = senderPnJid;
    if (m.isGroup) m.participant = senderPnJid;
  }

  await serializeAccess(russyuroku, m, groupMetadata, senderPnJid);
  const groupAdmins = m.isGroup ? collectAdminIds(participants) : [];
  const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : [];
  const groupOwner = m.isGroup && groupMetadata ? groupMetadata.owner : [];
  const groupMembership =
    m.isGroup && groupMetadata ? groupMetadata.membership : [];
  const groupMembers =
    m.isGroup && groupMetadata ? groupMetadata.participants : [];
  const isCreator = m.isCreator;
  const isOwner = m.isOwner;
  const isPrivate = m.isPrivate;
  const isBotAdmins = m.isBotAdmin;
  const isGroupAdmins = m.isAdmin;
  const isAdmins = m.isAdmin;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
  const deviceinfo = /^3A/.test(m.id) ? 'ɪᴏs' : m.id.startsWith('3EB') ? 'ᴡᴇʙ' : /^.{21}/.test(m.id) ? 'ᴀɴᴅʀᴏɪᴅ' : /^.{18}/.test(m.id) ? 'ᴅᴇsᴋᴛᴏᴘ' : 'ᴜɴᴋɴᴏᴡ';
  const ments = (text) => {return text.match('@') ? [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : []}
  const froms = m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false) : false;
  const mentionUser = [
    ...new Set([
      ...(m.mentionedJid || []),
      ...(m.quoted ? [m.quoted.sender] : []),
    ]),
  ];
  const mentionByTag =
    type == "extendedTextMessage" &&
    m.message.extendedTextMessage.contextInfo != null
      ? m.message.extendedTextMessage.contextInfo.mentionedJid
      : [];
  const mentionByReply =
    type == "extendedTextMessage" &&
    m.message.extendedTextMessage.contextInfo != null
      ? m.message.extendedTextMessage.contextInfo.participant || ""
      : "";
  const numberQuery =
    q.replace(new RegExp("[()+-/ +/]", "gi"), "") + "@s.whatsapp.net";
  const usernya = mentionByReply ? mentionByReply : mentionByTag[0];
  const Input = mentionByTag[0]
    ? mentionByTag[0]
    : mentionByReply
      ? mentionByReply
      : q
        ? numberQuery
        : false;

const pentingPath = path.join(process.cwd(), "library", "database", "penting.json")
let penting = JSON.parse(fs.readFileSync(pentingPath))

function savePenting() {
  fs.writeFileSync(pentingPath, JSON.stringify(penting, null, 2))
}

  const xtime = moment.tz("Asia/Jakarta").format("HH:mm:ss");
  const xdate = moment.tz("Asia/Jakarta").format("DD/MM/YYYY");
  const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss");
  if (time2 < "23:59:00") {
    var timewisher = `Selamat Malam`;
  }
  if (time2 < "19:00:00") {
    var timewisher = `Selamat Malam`;
  }
  if (time2 < "18:00:00") {
    var timewisher = `Selamat Sore`;
  }
  if (time2 < "15:00:00") {
    var timewisher = `Selamat Siang`;
  }
  if (time2 < "11:00:00") {
    var timewisher = `Selamat Pagi`;
  }
  if (time2 < "05:00:00") {
    var timewisher = `Selamat Pagi`;
  }

  let sekarang = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
  );

  function tanggal(ms) {
    return new Date(ms).getDate().toString().padStart(2, "0");
  }
  function bulan(ms) {
    return (new Date(ms).getMonth() + 1).toString().padStart(2, "0");
  }
  function tahun(ms) {
    return new Date(ms).getFullYear();
  }

  function formatJam(date) {
    let jam = date.getHours().toString().padStart(2, "0");
    let menit = date.getMinutes().toString().padStart(2, "0");
    let detik = date.getSeconds().toString().padStart(2, "0");
    return `${jam}:${menit}:${detik}`;
  }

  let futureDescription = `
📅 *Update Kurs:* ${tanggal(sekarang.getTime())}/${bulan(sekarang.getTime())}/${tahun(sekarang.getTime())}
🕰 *Waktu Jakarta (WIB):* ${formatJam(sekarang)}`

const qtutkentut = { key:{ remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' }, message:{ newsletterAdminInviteMessage: { newsletterJid: global.idSaluran, newsletterName: 'ᴠᴇʀɪғɪᴄᴀᴛɪᴏɴ', caption: `${namabot} Made By ${ownername}`, inviteExpiration: 0}}}

const qtext = {
  key: {
    remoteJid: "status@broadcast",
    participant: "0@s.whatsapp.net"
  },
  message: {
    extendedTextMessage: {
      text: global.namabot
    }
  }
};

const qloc = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {locationMessage: {name: `${global.namabot} by ${ownername}`,jpegThumbnail: ""}}}

const qlocJpm = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {locationMessage: {name: `${global.namabot} Made By ${ownername}`,jpegThumbnail: ""}}}

const qtoko = {key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? {remoteJid: "status@broadcast"} : {})}, message: {"productMessage": {"product": {"productImage": {"mimetype": "image/jpeg", "jpegThumbnail": ""}, "title": `Payment By ${ownername}`, "description": null, "currencyCode": "IDR", "priceAmount1000": "999999999999999", "retailerId": `Powered By ${ownername}`, "productImageCount": 1}, "businessOwnerJid": `0@s.whatsapp.net`}}}

var ppuser
try {
ppuser = await russyuroku.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = global.noProfileImg
}
const qlive = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {liveLocationMessage: {caption: `ꪎ ${global.ownername}`,jpegThumbnail: ""}}}

const reply = async (teks, mentions = [m.sender]) => {
  return russyuroku.sendMessage(m.chat, {
    document: fs.readFileSync("./package.json"),
    fileName: global.namabot,
    mimetype: "image/png",
    fileLength: 10000,
    pageCount: 100, headerType: 1, viewOnce: true, jpegThumbnail: (typeof global.pathThumbHeader === 'string' && global.pathThumbHeader && fs.existsSync(global.pathThumbHeader)) ? fs.readFileSync(global.pathThumbHeader) : fs.readFileSync("./source/media/foto/imgdokumen.jpg"),
    caption: teks,
    contextInfo: {
      mentionedJid: mentions,
      isForwarded: true,
      forwardingScore: 9999,
      businessMessageForwardInfo: { businessOwnerJid: global.ownernumber + "@s.whatsapp.net" },
      forwardedNewsletterMessageInfo: {
        newsletterName: global.nameSaluran,
        newsletterJid: global.idSaluran
      }
    }
  }, { quoted: m });
}

const reply2 = (teks) => {
russyuroku.sendMessage(from, { text : teks }, { quoted : m })
}

const example = async (teks) => {
  await russyuroku.sendMessage(m.chat, {
    react: { text: '✖️', key: m.key }
  });

  const commander = `• *Example:* ${prefix+command} ${teks}`;

  return russyuroku.sendMessage(m.chat, {
    text: commander,
    ...previewAd({
      title: `Dame dayo !!!!`,
      body: `Runtime : ${runtime(process.uptime())}`,
      thumbnail: global.image.reply,
      sourceUrl: global.web,
      mention: [m.sender],
      forward: true,
      largerThumbnail: false,
    }),
  }, { quoted: m });
};

const larang = async () => {
  await russyuroku.sendMessage(m.chat, {
    react: { text: '✖️', key: m.key }
  });

  return russyuroku.sendMessage(m.chat, {
    text: mess.creator,
    ...previewAd({
      title: `- Prohibition Message -`,
      body: `Command ${prefix+command} From ${pushname}`,
      thumbnail: global.image.info,
      sourceUrl: global.web,
      mention: [m.sender],
      forward: true,
      largerThumbnail: false,
    }),
  }, { quoted: qlocJpm });
};

if (m.message) {
    const isOwnBotReply = fromMe && areJidsSameUser(m.sender, russyuroku.user.id);

    logger.newMessage({
        time: moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss'),
        msgType: isOwnBotReply ? `[BOT REPLY] ${budy ? budy : m.mtype}` : (budy ? budy : m.mtype),
        senderLabel: isOwnBotReply ? (global.namabot || 'Bot (auto-reply)') : pushname,
        senderJid: isOwnBotReply ? russyuroku.user.id : m.sender,
        locationLabel: (m.isGroup
            ? `${chalk.blue('Group:')} ${chalk.yellow(groupName)} ${chalk.gray(`(${m.chat})`)}`
            : chalk.blue('Private Chat')) +

            (russyuroku !== global.russyurokuMain && global.russyurokuMain
                ? ` ${chalk.magenta('[via jadibot +' + String(russyuroku.user?.id || '').split(':')[0].split('@')[0] + ']')}`
                : ''),
        isOwner: isOwnBotReply ? true : isCreator,
    });
}

  async function sendconnMessage(chatId, message, options = {}) {
    let generate = await generateWAMessage(chatId, message, options);
    let type2 = getContentType(generate.message);
    if ("contextInfo" in options)
      generate.message[type2].contextInfo = options?.contextInfo;
    if ("contextInfo" in message)
      generate.message[type2].contextInfo = message?.contextInfo;
    return await russyuroku.relayMessage(chatId, generate.message, {
      messageId: generate.key.id,
    });
  }

  function GetType(Data) {
    return new Promise((resolve, reject) => {
      let Result, Status;
      if (Buffer.isBuffer(Data)) {
        Result = new Buffer.from(Data).toString("base64");
        Status = 0;
      } else {
        Status = 1;
      }
      resolve({
        status: Status,
        result: Result,
      });
    });
  }

  function randomId() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  function monospace(string) {
    return '```' + string + '```'
}

function monospa(string) {
    return '`' + string + '`'
}

function getRandomFile(ext) {
return `${Math.floor(Math.random() * 10000)}${ext}`;
}

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

function randomImageUrl(nama) {
  const file = path.join(__dirname, "data", "randomimage", `${nama}.json`);
  if (!fs.existsSync(file)) throw new Error(`Database ${nama}.json tidak ditemukan`);
  const urls = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(urls) || !urls.length) throw new Error(`Database ${nama}.json kosong`);
  return pickRandom(urls);
}

function randomNomor(min, max = null){
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}

function generateRandomPassword() {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*';
const length = 10;
let password = '';
for (let i = 0; i < length; i++) {
const randomIndex = Math.floor(Math.random() * characters.length);
password += characters[randomIndex];
}
return password;
}

function generateRandomNumber(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

const prefixOperator = {
  telkomsel: ['0811', '0812', '0813', '0821', '0822', '0852', '0853', '0823'],
  indosat: ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
  xl: ['0817', '0818', '0819', '0859', '0877', '0878'],
  axis: ['0838', '0831', '0832', '0833'],
  tri: ['0895', '0896', '0897', '0898', '0899'],
  smartfren: ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'],
  byu: ['0851']
};

function detectOperator(nomor) {
  const prefix = nomor.slice(0, 4);
  for (let [operator, daftar] of Object.entries(prefixOperator)) {
    if (daftar.includes(prefix)) {
      return operator.charAt(0).toUpperCase() + operator.slice(1);
    }
  }
  return 'Tidak diketahui';
}

function makeProgressBar(current, total, length = 20) {
  const progress = Math.floor((current / total) * length);
  const bar = "▓".repeat(progress) + "░".repeat(length - progress);
  return `[${bar}] ${Math.floor((current / total) * 100)}%`;
}

async function listbut2(m, teks, listnye, qtext) {
let msg = generateWAMessageFromContent(m.chat, {
viewOnceMessage: {
message: {
"messageContextInfo": {
"deviceListMetadata": {},
"deviceListMetadataVersion": 2
},
interactiveMessage: proto.Message.InteractiveMessage.create({
contextInfo: {
mentionedJid: [typeof senderPnJid !== 'undefined' ? senderPnJid : m.sender],
forwardingScore: 999999,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: idSaluran,
newsletterName: nameSaluran,
serverMessageId: 145
}
},
body: proto.Message.InteractiveMessage.Body.create({
text: teks
}),
footer: proto.Message.InteractiveMessage.Footer.create({
text: `${namabot} By ${ownername}`
}),
header: proto.Message.InteractiveMessage.Header.create({
title: ``,
thumbnailUrl: "",
gifPlayback: true,
subtitle: "",
hasMediaAttachment: true,
...(await prepareWAMessageMedia({ image: { url: randomThumbUrl } }, { upload: russyuroku.waUploadToServer })),
}),
gifPlayback: true,
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: [
{
"name": "single_select",
"buttonParamsJson": JSON.stringify(listnye)
}],
}), })}
}}, {quoted: qtext})
await russyuroku.relayMessage(msg.key.remoteJid, msg.message, {
messageId: msg.key.id
})
}

const isOwnEcho = fromMe && areJidsSameUser(m.sender, russyuroku.user.id);

if (isCreator && !isOwnEcho) {
  try {
    if (shouldSendSambutan(m.sender)) {
      const sambutan = getRandomSambutan(m.sender);
      await reply(sambutan, [m.sender]);
      updateLastSeen(m.sender);
    }
  } catch (err) {
    logger.error('[sambutowner] Error saat mengirim sambutan:', err);
  }
}

if (m.isGroup && !isOwnEcho && !isCreator && !isAdmins) {
  try {
    const handled = await runModeration(m, { russyuroku, senderPnJid, isBotAdmins });
    if (handled) return;
  } catch (err) {
    logger.error('[moderasi] Error saat memproses pesan:', err);
  }
}

if (!isCmd && !isOwnEcho && m.text) {
  try {
    const found = findRespon(body.toLowerCase().trim());
    if (found) {
      if (found.mtype === 'text') {
        await reply(found.text || '');
      } else {
        const buf = getResponMediaBuffer(found);
        if (buf) {
          const payload = { caption: found.caption || undefined, mimetype: found.mimetype || undefined };
          if (found.mtype === 'imageMessage') payload.image = buf;
          else if (found.mtype === 'videoMessage') payload.video = buf;
          else if (found.mtype === 'audioMessage') { payload.audio = buf; payload.ptt = false; }
          else if (found.mtype === 'stickerMessage') { delete payload.caption; delete payload.mimetype; payload.sticker = buf; }
          else if (found.mtype === 'documentMessage') { payload.document = buf; payload.fileName = found.filename || 'file'; }
          await russyuroku.sendMessage(m.chat, payload, { quoted: m });
        } else if (found.text) {
          await reply(found.text);
        }
      }
      return;
    }
  } catch (err) {
    logger.error('[autorespon] Error saat memproses respon:', err);
  }
}

if (!isCmd && !isOwnEcho && m.text) {
  try {
    const consumed = await handleAkinatorReply(m, { russyuroku });
    if (consumed) return;
  } catch (err) {
    logger.error('[akinator] Error saat memproses jawaban sesi:', err);
  }
}

if (!isCmd && !isOwnEcho && m.text) {
  const gameCtx = { russyuroku, senderPnJid, isCreator, isAdmins, isBotAdmins, groupMetadata };
  const hooks = [
    ['tictactoe', () => handleTttMove(m, gameCtx)],
    ['sambungkata2', () => handleSambungKataWord(m, gameCtx)],
    ['tebakbom', () => handleBombPick(m, gameCtx)],
    ['kuismath', () => handleKuisMathAnswer(m, gameCtx)],
    ['game', () => handleGameAnswer(m, gameCtx)],
  ];
  for (const [nama, jalankan] of hooks) {
    try {
      if (await jalankan()) return;
    } catch (err) {
      logger.error(`[${nama}] Error saat memproses jawaban:`, err);
    }
  }
}

if (!isCmd && m.isGroup && !m.key.fromMe && m.text) {
  try {
    const cfg = getAutoLevelConfig(m.chat);
    const result = addUserXP(m.chat, m.sender);
    if (result?.leveledUp && cfg.autolevel) {
      const name = m.pushName || m.sender.split('@')[0];
      russyuroku.sendMessage(m.chat, {
        text: (cfg.autolevelMessage || '🎉 Selamat @{tag}, kamu naik ke *Level {level}*!')
          .replace('{tag}', name)
          .replace('{level}', result.level)
          .replace('{name}', name),
        mentions: [m.sender],
      }).catch(() => {});
    }
  } catch (e) {
    logger.error('[LevelXP] Gagal menambah XP:', e?.message || e);
  }
}

if (isCmd) {
    const plugins = await getPlugins();
    const pluginContext = { russyuroku, prefix, command, reply, text, isGroup: m.isGroup, isPrivate, isCreator, isOwner, isAdmins, isGroupAdmins, guard, mess: global.mess, example, sender, senderPnJid, senderNumber, pushname, args, runtime, sleep, getBuffer, isBotAdmins, isCmd, qtext, randomNomor, monospace, pickRandom, getRandomFile, penting, axios, fs, uploader, isUrl };

    const bebasLimit = ["ceklimit", "cekprem", "buylimit", "buyprem", "addprem", "addlimit", "delprem", "menu", "allmenu", "welcome", "left", "setwelcome", "setleft", "resetwelcome", "resetleft", "cekwelcome"];
    const matchedPlugin = plugins.find((plugin) => plugin.command.includes(command.toLowerCase()));

    let commandDikenal = !!matchedPlugin;
    if (!commandDikenal) {
      try {
        const isiCaseFile = fs.readFileSync(__filename, "utf8");
        const daftarCase = new Set(
          [...isiCaseFile.matchAll(/case\s+["'`]([a-z0-9_-]+)["'`]\s*:/gi)].map((v) => v[1].toLowerCase())
        );
        commandDikenal = daftarCase.has(command.toLowerCase());
      } catch {}
    }

    if (commandDikenal && !isCreator && !isPremium(m.sender) && !bebasLimit.includes(command.toLowerCase())) {
      const cekLimit = getRemainingLimit(m.sender);
      if (cekLimit.remaining <= 0) {
        await russyuroku.sendMessage(m.chat, {
          text: `⏳ Limit harianmu sudah habis (${cekLimit.maxLimit}/hari).\n\nLimit reset otomatis tiap jam 00.00 WIB.\nMau limit lebih banyak? Ketik *${prefix}buylimit* atau *${prefix}buyprem*.`,
        }, { quoted: m });
        return;
      }
    }

    if (matchedPlugin) {
        await matchedPlugin(m, pluginContext);
        if (!isCreator && !isPremium(m.sender) && !bebasLimit.includes(command.toLowerCase())) {
          useLimit(m.sender);
        }
        return;
    }

    if (commandDikenal && !isCreator && !isPremium(m.sender) && !bebasLimit.includes(command.toLowerCase())) {
      useLimit(m.sender);
    }

const menureply = async (teks) => {
  let totalCase = 0;
  try {
    const caseFile = path.join(__dirname, "yuroku.js");
    const content = fs.readFileSync(caseFile, "utf8");
    totalCase = (content.match(/case\s+["'`]/g) || []).length;
  } catch {}

  let totalPlugin = 0;
  try {
    const pluginsDir = path.join(__dirname, "plugins");
    totalPlugin = fs.readdirSync(pluginsDir).filter((f) => f.endsWith(".js")).length;
  } catch {}

  const totalFitur = totalCase + totalPlugin;
  const modeBot = global.owneronly ? "Self" : "Public";
  const waktuSekarang = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const jamNow = new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

  const statusUserMenu = isCreator ? "Owner" : isPremium(m.sender) ? "Premium" : "Free";

  let menuText = `\`Hai Kak ${pushname || "Kak"}\`🎗

◤───「 \`INFO USER\` 」──✦
> ⎆ Nama : ${pushname || "Tanpa Nama"}
> ⎆ Role  : ${statusUserMenu}
> ⎆ Mode  : ${modeBot}
> ⎆ Owner : ${global.ownername}
◣─────────────✦

◤───「 \`INFO BOT\` 」──✦
> ⎆ Runtime : ${runtime(process.uptime())}
> ⎆ Versi   : ${global.version}
> ⎆ Fitur   : ${totalFitur}
> ⎆ Jam     : ${jamNow} WIB
◣─────────────✦

*_Jangan Di Spam Ya Agar Botnya Bisa Aktif 24 Jam Dan Tidak Terkena Blokir Spam🍁_*

${global.menuLegend}

${teks}
_Ketik ${prefix}menu untuk kembali ke daftar kategori_`;

  await russyuroku.sendMessage(m.chat, {
    image: { url: randomThumbUrl },
    caption: menuText,
    ...previewAd({
      title: `© ${global.namabot} - v${global.version}`,
      body: `Made by ${global.ownername}.`,
      thumbnail: randomThumbUrl,
      sourceUrl: global.web,
      mention: [m.sender],
      forward: true,
      largerThumbnail: true,
    }),
  }, { quoted: qtutkentut });

  if (global.vnMenu) {
    try {
      await russyuroku.sendMessage(m.chat, {
        audio: { url: global.vnMenu },
        mimetype: "audio/mp4",
        ptt: true,
      }, { quoted: qtutkentut });
    } catch {}
  }
};

async function ephotoMaker(url, texk) {
  const form = new FormData();
  const gT = await axios.get(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    },
  });
  const $ = cheerio.load(gT.data);
  const token = $("input[name=token]").val();
  const build_server = $("input[name=build_server]").val();
  const build_server_id = $("input[name=build_server_id]").val();
  form.append("text[]", texk);
  form.append("token", token);
  form.append("build_server", build_server);
  form.append("build_server_id", build_server_id);

  const res = await axios({
    url,
    method: "POST",
    data: form,
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
      cookie: gT.headers["set-cookie"]?.join("; "),
      ...form.getHeaders(),
    },
  });

  const $$ = cheerio.load(res.data);
  const json = JSON.parse($$("input[name=form_value_input]").val());
  json["text[]"] = json.text;
  delete json.text;

  const { data } = await axios.post(
    "https://en.ephoto360.com/effect/create-image",
    new URLSearchParams(json),
    {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        cookie: gT.headers["set-cookie"].join("; "),
      },
    }
  );

  return build_server + data.image;
}

const ephotoLinks = {
  glitchtext: "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html",
  writetext: "https://en.ephoto360.com/write-text-on-wet-glass-online-589.html",
  advancedglow: "https://en.ephoto360.com/advanced-glow-effects-74.html",
  typographytext: "https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html",
  pixelglitch: "https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html",
  neonglitch: "https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html",
  flagtext: "https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html",
  flag3dtext: "https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html",
  deletingtext: "https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html",
  blackpinkstyle: "https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html",
  glowingtext: "https://en.ephoto360.com/create-glowing-text-effects-online-706.html",
  underwatertext: "https://en.ephoto360.com/3d-underwater-text-effect-online-682.html",
  logomaker: "https://en.ephoto360.com/free-bear-logo-maker-online-673.html",
  cartoonstyle: "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html",
  papercutstyle: "https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html",
  watercolortext: "https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html",
  effectclouds: "https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html",
  blackpinklogo: "https://en.ephoto360.com/create-blackpink-logo-online-free-607.html",
  gradienttext: "https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html",
  summerbeach: "https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html",
  luxurygold: "https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html",
  multicoloredneon: "https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html",
  sandsummer: "https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html",
  galaxywallpaper: "https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html",
  "1917style": "https://en.ephoto360.com/1917-style-text-effect-523.html",
  makingneon: "https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html",
  royaltext: "https://en.ephoto360.com/royal-text-effect-online-free-471.html",
  freecreate: "https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html",
  galaxystyle: "https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html",
  lighteffects: "https://en.ephoto360.com/create-light-effects-green-neon-online-429.html",
};

switch (command) {
case "menu": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "🌸", key: m.key },
  });

  let totalCase = 0;
  try {
    const content = fs.readFileSync(path.join(__dirname, "yuroku.js"), "utf8");
    totalCase = (content.match(/case\s+["'`]/g) || []).length;
  } catch {}

  let totalPlugin = 0;
  try {
    totalPlugin = fs.readdirSync(path.join(__dirname, "plugins")).filter((f) => f.endsWith(".js")).length;
  } catch {}

  const totalFitur = totalCase + totalPlugin;
  const modeBot = global.owneronly ? "Private" : "Public";
  const prem = isPremium(m.sender);
  const statusUser = isCreator ? "👑 Owner" : prem ? "💎 Premium" : "🍃 Free";
  const limitData = getRemainingLimit(m.sender);
  const limitInfo = isCreator || prem ? "Unlimited" : `${limitData.remaining}/${limitData.maxLimit}`;

  let barLimit = "■■■■■■■■■■";
  if (!(isCreator || prem) && limitData.maxLimit > 0) {
    const isi = Math.max(0, Math.min(10, Math.round((limitData.remaining / limitData.maxLimit) * 10)));
    barLimit = "■".repeat(isi) + "□".repeat(10 - isi);
  }

  const jamWib = Number(new Date().toLocaleString("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", hour12: false })) % 24;
  const sapaan = jamWib < 4 ? "Selamat dini hari" : jamWib < 11 ? "Selamat pagi" : jamWib < 15 ? "Selamat siang" : jamWib < 18 ? "Selamat sore" : "Selamat malam";
  const hariIni = new Date().toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const jamIni = new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false });

  const daftarKategori = (global.menuKategori || []).map((k) => `> ${k.judul}`).join("\n");

  const bodyDashboard = `\`Hai Kak ${pushname || "Kak"}\`🎗

◤───「 \`INFO USER\` 」──✦
> ⎆ Nama : ${pushname || "Tanpa Nama"}
> ⎆ Role : ${statusUser}
> ⎆ Mode : ${modeBot}
> ⎆ Limit : ${limitInfo}
> ⎆ ${barLimit}
◣─────────────✦

◤───「 \`INFO BOT\` 」──✦
> ⎆ Owner   : ${global.ownername}
> ⎆ Versi   : ${global.version}
> ⎆ Fitur   : ${totalFitur}
> ⎆ Runtime : ${runtime(process.uptime())}
> ⎆ Waktu   : ${hariIni}
> ⎆ Jam     : ${jamIni} WIB
◣─────────────✦

*_Jangan Di Spam Ya Agar Botnya Bisa Aktif 24 Jam Dan Tidak Terkena Blokir Spam🍁_*

Kategori:
${daftarKategori}

⚠️ ʙᴏᴛ ɪɴɪ ꜱᴇᴅᴀɴɢ ᴅɪᴋᴇᴍʙᴀɴɢᴋᴀɴ.
ᴊɪᴋᴀ ᴛᴇʀᴊᴀᴅɪ ʙᴜɢ ᴀᴛᴀᴜ ᴋᴇꜱᴀʟᴀʜᴀɴ, ᴍᴏʜᴏɴ ᴘᴇɴɢᴇʀᴛɪᴀɴ 🙏
ᴅᴜᴋᴜɴɢᴀɴᴍᴜ ꜱᴀɴɢᴀᴛ ʙᴇʀᴀʀᴛɪ ʙᴀɢɪ ᴋᴀᴍɪ ❤️

_Klik tombol di bawah untuk membuka daftar menu_`;

  const rowKategori = (global.menuKategori || []).map((k) => ({
    header: "",
    title: `${k.judul}`,
    description: `${k.total} fitur`,
    id: `${prefix}${k.key}`,
  }));

  const sectionsMenu = [
    {
      title: "",
      highlight_label: "",
      rows: [{ header: "", title: "Semua Menu", description: "Tampilkan seluruh daftar fitur", id: `${prefix}allmenu` }],
    },
    {
      title: "Pilih salah satu kategori",
      highlight_label: "",
      rows: rowKategori,
    },
  ];

  const listMenu = {
    title: "Pilih Menu",
    sections: [
      {
        title: "Daftar Kategori",
        rows: [
          { title: "Semua Menu", description: "Tampilkan seluruh daftar fitur", id: `${prefix}allmenu` },
          ...rowKategori.map(({ title, description, id }) => ({ title, description, id })),
        ],
      },
    ],
  };

  try {
    await listbut2(m, bodyDashboard, listMenu, qtutkentut);
  } catch (error) {
    console.error("\n[ERROR MENU]:", error);

    await new ButtonV2(russyuroku)
      .setTitle(`${sapaan}, ${pushname || "Kak"}`)
      .setSubtitle(statusUser)
      .setBody(bodyDashboard)
      .setFooter(`© ${global.namabot} - v${global.version} - ${global.ownername}`)
      .setThumbnail(randomThumbUrl)
      .addRawButton({
        buttonText: { displayText: "Buka Menu" },
        buttonId: `${prefix}allmenu`,
        type: 1,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify({ title: "Pilih menu di sini", sections: sectionsMenu }),
        },
      })
      .addButton("Semua Menu", `${prefix}allmenu`)
      .send(m.chat, { quoted: qtutkentut });
  }

  if (global.vnMenu) {
    try {
      await russyuroku.sendMessage(m.chat, {
        audio: { url: global.vnMenu },
        mimetype: "audio/mp4",
        ptt: true,
      }, { quoted: qtutkentut });
    } catch {}
  }
}
break

case "allmenu": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.allmenu);
}
break

case "menuowner": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menuowner);
}
break

case "menugroup": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menugroup);
}
break

case "menubroadcast": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menubroadcast);
}
break

case "menufun": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menufun);
}
break

case "menugame": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menugame);
}
break

case "menustore": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menustore);
}
break

case "menustk": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menustk);
}
break

case "menustalker": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menustalker);
}
break

case "menurandom": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menurandom);
}
break

case "menucpanel": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menucpanel);
}
break

case "menuanime": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menuanime);
}
break

case "menuprimbon": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menuprimbon);
}
break

case "menusearch": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menusearch);
}
break

case "menudownload": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menudownload);
}
break

case "menumaker": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menumaker);
}
break

case "menutolls": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menutolls);
}
break

case "menusticker": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });
  await menureply(global.menusticker);
}
break

case "akinator": case "aki": {
  await russyuroku.sendMessage(m.chat, {
    react: { text: "🔮", key: m.key },
  });

  const sub = String(text || '').trim().toLowerCase();
  const CONTROL_STOP_CASE = ['batal', 'stop', 'berhenti', 'cancel', 'keluar'];

  if (CONTROL_STOP_CASE.includes(sub)) {
    await stopAkinatorSession(m, { russyuroku });
    break;
  }

  if (global.akinatorSessions?.[m.chat]) {
    await russyuroku.sendMessage(m.chat, {
      text: `⚠️ Masih ada sesi Akinator aktif di chat ini.\n\nBalas pertanyaan yang ada, ketik *balik* untuk mundur, atau *${prefix}akinator batal* untuk menyudahi dulu.`,
    }, { quoted: m });
    break;
  }

  await startAkinatorSession(m, { russyuroku, prefix });
}
break

case "cekprem": {
  let target = mentionUser[0] || (q ? toJid(q) : senderPnJid);
  if (target.endsWith('@lid')) {
    target = await russyuroku.resolvePn(target, groupMetadata).catch(() => target);
  }

  if (target.endsWith('@lid')) {
    return reply(`⚠️ Gagal mengenali nomor asli @${target.split("@")[0]} (LID belum ter-resolve). Coba lagi sebentar, atau cek pakai nomor langsung: ${prefix}cekprem 628xxxxxxxxxx`);
  }

  const nomorTarget = target.split("@")[0];
  const prem = getPremiumEntry(target);

  if (!prem) {
    await russyuroku.sendMessage(m.chat, {
      text: `❌ @${nomorTarget} bukan member premium.`,
      mentions: [target],
    }, { quoted: m });
  } else {
    const tglExp = moment(prem.expired).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss");
    await russyuroku.sendMessage(m.chat, {
      text: `✅ *Status Premium*\n\n👤 User : @${nomorTarget}\n📅 Exp  : ${tglExp} WIB`,
      mentions: [target],
    }, { quoted: m });
  }
}
break

case "ceklimit": {
  let target = mentionUser[0] || (q ? toJid(q) : senderPnJid);
  if (target.endsWith('@lid')) {
    target = await russyuroku.resolvePn(target, groupMetadata).catch(() => target);
  }

  if (target.endsWith('@lid')) {
    return reply(`⚠️ Gagal mengenali nomor asli @${target.split("@")[0]} (LID belum ter-resolve). Coba lagi sebentar, atau cek pakai nomor langsung: ${prefix}ceklimit 628xxxxxxxxxx`);
  }

  const nomorTarget = target.split("@")[0];

  if (isCreator || isPremium(target)) {
    await russyuroku.sendMessage(m.chat, {
      text: `👤 User : @${nomorTarget}\n🔋 Limit : ∞ Unlimited (${isPremium(target) ? "Premium" : "Owner"})`,
      mentions: [target],
    }, { quoted: m });
  } else {
    const lim = getRemainingLimit(target);
    await russyuroku.sendMessage(m.chat, {
      text: `👤 User : @${nomorTarget}\n🔋 Limit : ${lim.remaining}/${lim.maxLimit}\n♻️ Reset : Tiap 00.00 WIB`,
      mentions: [target],
    }, { quoted: m });
  }
}
break

case "buyprem": {
  if (m.isGroup) {
    await russyuroku.sendMessage(m.chat, {
      text: `❌ Pembelian premium cuma bisa dilakukan di chat pribadi bot ya.`,
    }, { quoted: m });
    return;
  }

  if (!global.qris) {
    await russyuroku.sendMessage(m.chat, {
      text: `❌ QRIS belum diset owner. Hubungi ${global.ownername} (${global.ownernumber}) langsung ya.`,
    }, { quoted: m });
    return;
  }

  await russyuroku.sendMessage(m.chat, {
    image: { url: global.qris },
    caption: `💎 *BELI PREMIUM*\n\n💰 Harga : Rp${Number(global.hargaPrem).toLocaleString("id-ID")} / hari\n\nScan QR di atas, lalu kirim bukti transfer ke owner:\n📞 wa.me/${global.ownernumber}\n\nSertakan nominal & durasi hari yang kamu mau. Setelah dikonfirmasi, owner akan aktifkan premiummu.`,
  }, { quoted: m });
}
break

case "buylimit": {
  if (m.isGroup) {
    await russyuroku.sendMessage(m.chat, {
      text: `❌ Pembelian limit cuma bisa dilakukan di chat pribadi bot ya.`,
    }, { quoted: m });
    return;
  }

  if (!global.qris) {
    await russyuroku.sendMessage(m.chat, {
      text: `❌ QRIS belum diset owner. Hubungi ${global.ownername} (${global.ownernumber}) langsung ya.`,
    }, { quoted: m });
    return;
  }

  await russyuroku.sendMessage(m.chat, {
    image: { url: global.qris },
    caption: `🔋 *BELI LIMIT*\n\n💰 Harga : Rp${Number(global.hargaLimit).toLocaleString("id-ID")} / paket\n\nScan QR di atas, lalu kirim bukti transfer ke owner:\n📞 wa.me/${global.ownernumber}\n\nSertakan nominal & jumlah limit yang kamu mau. Setelah dikonfirmasi, owner akan tambahkan limitmu.`,
  }, { quoted: m });
}
break

case "addprem": {
  if (!isCreator) return reply(global.mess.creator);

  let target = mentionUser[0] || (args[0] ? toJid(args[0]) : false);
  const jumlahHari = mentionUser[0] ? Number(args[0]) : Number(args[1]);

  if (!target || !jumlahHari || isNaN(jumlahHari)) {
    return reply(`❌ Format salah.\n\nContoh:\n${prefix}addprem @user 20\n${prefix}addprem 628123456789 20`);
  }

  if (target.endsWith('@lid')) {
    target = await russyuroku.resolvePn(target, groupMetadata).catch(() => target);
  }

  if (target.endsWith('@lid')) {
    return reply(`⚠️ Gagal mengenali nomor asli @${target.split("@")[0]} (LID belum ter-resolve). Coba pakai nomor langsung: ${prefix}addprem 628xxxxxxxxxx ${jumlahHari}`);
  }

  const nomorTarget = target.split("@")[0];
  const entry = addPremium(target, jumlahHari);
  const tglExp = moment(entry.expired).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss");
  const tglAdd = moment(entry.addedAt || Date.now()).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss");

  await russyuroku.sendMessage(m.chat, {
    text: `✅ Succes added @${nomorTarget} to premium ${jumlahHari} Days\n\n📅 Tanggal prem : ${tglAdd}\n📅 Exp : ${tglExp}`,
    mentions: [target],
  }, { quoted: m });
}
break

case "delprem": {
  if (!isCreator) return reply(global.mess.creator);

  let target = mentionUser[0] || (args[0] ? toJid(args[0]) : false);
  if (!target) {
    return reply(`❌ Format salah.\n\nContoh:\n${prefix}delprem @user\n${prefix}delprem 628123456789`);
  }

  if (target.endsWith('@lid')) {
    target = await russyuroku.resolvePn(target, groupMetadata).catch(() => target);
  }

  if (target.endsWith('@lid')) {
    return reply(`⚠️ Gagal mengenali nomor asli @${target.split("@")[0]} (LID belum ter-resolve). Coba pakai nomor langsung: ${prefix}delprem 628xxxxxxxxxx`);
  }

  const nomorTarget = target.split("@")[0];
  const berhasil = delPremium(target);

  await russyuroku.sendMessage(m.chat, {
    text: berhasil
      ? `✅ @${nomorTarget} berhasil dihapus dari premium.`
      : `❌ @${nomorTarget} bukan member premium.`,
    mentions: [target],
  }, { quoted: m });
}
break

case "addlimit": {
  if (!isCreator) return reply(global.mess.creator);

  let target = mentionUser[0] || (args[0] ? toJid(args[0]) : false);
  const jumlahLimit = mentionUser[0] ? Number(args[0]) : Number(args[1]);

  if (!target || !jumlahLimit || isNaN(jumlahLimit)) {
    return reply(`❌ Format salah.\n\nContoh:\n${prefix}addlimit @user 100\n${prefix}addlimit 628123456789 100`);
  }

  if (target.endsWith('@lid')) {
    target = await russyuroku.resolvePn(target, groupMetadata).catch(() => target);
  }

  if (target.endsWith('@lid')) {
    return reply(`⚠️ Gagal mengenali nomor asli @${target.split("@")[0]} (LID belum ter-resolve). Coba pakai nomor langsung: ${prefix}addlimit 628xxxxxxxxxx ${jumlahLimit}`);
  }

  const nomorTarget = target.split("@")[0];
  const entry = addLimit(target, jumlahLimit);

  await russyuroku.sendMessage(m.chat, {
    text: `✅ Limit bertambah ${jumlahLimit}\n\n👤 User : @${nomorTarget}\n🔋 Limit sekarang : ${entry.maxLimit} / hari`,
    mentions: [target],
  }, { quoted: m });
}
break

case "upswgc":
case "swgc":
case "swgrup": {
  let targetGid = m.chat;
  let caption = text.replace(new RegExp(`^${prefix + command}\\s*`, "i"), "").trim();

  if (!m.isGroup) {
    const sep = caption.indexOf("|");
    if (sep === -1 || !caption.slice(0, sep).trim()) {
      return example(`idgc|teks\n\nContoh: 120363xxxxxxxxx@g.us|Halo semua!\n(dipakai di private chat, di grup cukup .${command} teks)`);
    }
    targetGid = caption.slice(0, sep).trim();
    if (!targetGid.endsWith("@g.us")) targetGid += "@g.us";
    caption = caption.slice(sep + 1).trim();
  }

  const qmsg = m.quoted ? m.quoted : m;
  const mime = (qmsg.msg || qmsg).mimetype || "";

  try {
    if (!mime && !caption) {
      return example(m.isGroup ? `Halo semua (opsional reply media)` : `idgc|teks`);
    }
    let payload = {};

    if (/image/.test(mime)) {
      const buffer = await qmsg.download();
      payload = {
        image: buffer,
        caption
      };
    }
    else if (/video/.test(mime)) {
      const buffer = await qmsg.download();
      payload = {
        video: buffer,
        caption
      };
    }
    else if (/audio/.test(mime)) {
      const buffer = await qmsg.download();
      payload = {
        audio: buffer,
        mimetype: "audio/mp4"
      };
    }
    else if (caption) {
      payload = {
        text: caption
      };
    }

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    await groupStatus(russyuroku, targetGid, payload);

    reply("✅ Status grup berhasil diposting.");

  } catch (err) {
    console.error("upswgc error:", err);
    reply("❌ Gagal upload status grup.", err);
  }
}
break
case "emojimix": {
  if (!text) return example("😭+😂");

  let [emoji1, emoji2] = text.split("+");
  if (!emoji1 || !emoji2) return example("😭+😂");

  await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } });

  try {
    const imgUrl = await getEmojiMixUrl(emoji1, emoji2);

    if (!imgUrl) {
      return m.reply("❌ Kombinasi emoji ini tidak didukung Emoji Kitchen.");
    }

    const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(res.data);

    const tempFile = `./library/database/emojimix-${Date.now()}.png`;
    await fs.promises.writeFile(tempFile, buffer);

    await russyuroku.sendImageAsSticker(
      m.chat,
      tempFile,
      m,
      { packname: global.packname, author: global.author }
    );

    try { fs.unlinkSync(tempFile); } catch {}

  } catch (err) {
    console.error("emojimix cmd error:", err);
    reply("❌ Gagal membuat emoji mix.");
  }
}
break
case "iqc":
case "iphonequoted": {
    if (!global.apisaurus || !global.apikeysaurus) {
        return reply('⚠️ Fitur ini belum dikonfigurasi. Hubungi Owner.')
    }

    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
    const hasImage = /^image\//.test(mime)

    let teks = ''
    if (m.quoted && m.quoted.text) {
        teks = m.quoted.text.replace(/\b\d{1,2}:\d{2}\b/, '').trim()
    }
    if (!teks && text) {
        const parts = text.split('|')
        if (parts.length >= 2) {
            teks = parts.slice(1).join('|').trim()
        } else if (parts.length === 1 && !/^\d{1,2}:\d{2}$/.test(parts[0].trim())) {
            teks = parts[0].trim()
        }
    }

    if (!teks) {
        return reply(
`╭━━━「 📱 *iPhone Quoted Chat* 」
│
│ Buat bubble chat aesthetic ala iPhone
│ dari teks, gambar, atau keduanya.
│
├━━━「 ✨ *3 Cara Pakai* 」
│
│ ⌨️ *1. Ketik teks*
│    ${prefix}${command} Halo semua
│
│ 🖼️ *2. Reply image + ketik teks*
│    Reply foto → ${prefix}${command} Ini fotoku
│
│ 🎨 *3. Reply teks*
│    Reply pesan → ${prefix}${command}
│
├━━━「 💡 *Contoh Lain* 」
│
│ ⏰ ${prefix}${command} 11:55 | Selamat pagi
│ 💬 ${prefix}${command} Ngopi dulu ya ☕
│
├━━━「 ⚠️ *Catatan* 」
│
│ Teks *wajib diisi*, baik itu via
│ argumen command maupun reply pesan.
│
╰━━━「 🚀 *Powered by ${global.namabot || 'Yuroku MD'}* 」`.trim()
        )
    }

    let imageUrl = null
    if (hasImage) {
        await russyuroku.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
        try {
            const buf = await q.download()
            if (buf) {
                const FormData = (await import('form-data')).default

                try {
                    const form = new FormData()
                    form.append('file', buf, { filename: 'img.jpg', contentType: mime })
                    form.append('expiry', '5h')

                    const up = await axios.post(
                        'https://uploads.saurusdev.cloud/api/temp-upload',
                        form,
                        {
                            headers: form.getHeaders(),
                            timeout: 60000,
                            maxBodyLength: Infinity,
                            maxContentLength: Infinity,
                            validateStatus: () => true
                        }
                    )
                    if (up?.data?.success && up?.data?.url) imageUrl = up.data.url
                } catch (e) {
                    console.warn('[iqc] temp upload gagal:', e?.message || e)
                }

                if (!imageUrl) {
                    const form = new FormData()
                    form.append('file', buf, { filename: 'img.jpg', contentType: mime })

                    const up = await axios.post(
                        'https://uploads.saurusdev.cloud/api/upload',
                        form,
                        {
                            headers: form.getHeaders(),
                            timeout: 60000,
                            maxBodyLength: Infinity,
                            maxContentLength: Infinity,
                            validateStatus: () => true
                        }
                    )
                    if (up?.data?.success && up?.data?.url) imageUrl = up.data.url
                }
            }
        } catch (e) {
            console.error('[iqc] upload error:', e?.message || e)
        }
    }

    const wib = new Date(Date.now() + 7 * 60 * 60 * 1000)
    const waktu = String(wib.getUTCHours()).padStart(2, '0') + ':' +
                  String(wib.getUTCMinutes()).padStart(2, '0')

    await russyuroku.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    try {
        let apiUrl = `${global.apisaurus}/api/maker/iqc?apikey=${encodeURIComponent(global.apikeysaurus)}`
        apiUrl += `&text=${encodeURIComponent(teks)}`
        apiUrl += `&time=${encodeURIComponent(waktu)}`
        if (imageUrl) apiUrl += `&imageUrl=${encodeURIComponent(imageUrl)}`

        const res = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 30000,
            validateStatus: () => true
        })

        if (res.status !== 200) {
            let errBody = ''
            try { errBody = Buffer.from(res.data).toString('utf8').slice(0, 300) } catch {}
            console.error('[iqc] API error', res.status, errBody)
            throw new Error(`API ${res.status}`)
        }

        const ctype = res.headers?.['content-type'] || ''
        if (!/^image\//.test(ctype)) {
            let errBody = ''
            try { errBody = Buffer.from(res.data).toString('utf8').slice(0, 300) } catch {}
            throw new Error(`Bukan gambar: ${ctype} — ${errBody}`)
        }

        await russyuroku.sendMessage(m.chat, {
            image: Buffer.from(res.data),
            caption: global.mess?.done || '✅ Selesai.'
        }, { quoted: m })

        await russyuroku.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
        console.error('[iqc] error:', e?.message || e)
        await russyuroku.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(global.mess?.error || '❌ Terjadi kesalahan.')
    }
}
break
case "jpmch": {
  if (!isCreator) return larang()
  if (!text && !m.quoted) return example(`Halo semua!\nKirim media + caption (opsional)`)

  const qmsg = m.quoted ? m.quoted : m
  const mime = (qmsg.msg || qmsg).mimetype || ""
  let mediaPath, broadcastMsg

  if (/image|video|audio|document/.test(mime)) {
    mediaPath = await russyuroku.downloadAndSaveMediaMessage(qmsg)
  }

  const allCh = await russyuroku.getFollowedChannels()

  let validChannels = []
  for (const ch of allCh) {
    if (
      ch &&
      ch.state === "ACTIVE" &&
      ch.viewer_metadata &&
      ch.viewer_metadata.view_role === "ADMIN" &&
      !penting.blacklistJpm.includes(ch.id)
    ) {
      validChannels.push(ch.id)
    }
  }

  if (validChannels.length === 0) {
    return reply(`❌ Tidak ada channel aktif yang memenuhi kriteria (role: admin, mute: off, tidak di blacklist).`)
  }

  if (mediaPath) {
    if (/image/.test(mime)) broadcastMsg = { image: fs.readFileSync(mediaPath), caption: text || "" }
    if (/video/.test(mime)) broadcastMsg = { video: fs.readFileSync(mediaPath), caption: text || "" }
    if (/audio/.test(mime)) broadcastMsg = { audio: fs.readFileSync(mediaPath), mimetype: "audio/mpeg", ptt: true }
    if (/document/.test(mime)) {
      broadcastMsg = {
        document: fs.readFileSync(mediaPath),
        mimetype: qmsg.mimetype,
        fileName: `file_${Date.now()}`
      }
    }
  } else {
    broadcastMsg = { text }
  }

  const qmeta = {
    key: {
      participant: `13135550002@s.whatsapp.net`,
      ...(botNumber ? { remoteJid: `status@broadcast` } : {})
    },
    message: {
      contactMessage: {
        displayName: `Yuroku MD JPM Channel: ${mediaPath ? mime : "Text"}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=13135550002:+62 852-9802-7445\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        sendEphemeral: true
      }
    }
  }

  const processMsg = await russyuroku.sendMessage(
    m.chat,
    {
      text: `⏳ *Memproses JPM Channel...*\nJumlah Channel: ${validChannels.length}\nTipe: ${mediaPath ? mime : "Text"}`
    },
    { quoted: m }
  )

  let sentCount = 0
  for (const id of validChannels) {
    try {
      await russyuroku.sendMessage(id, broadcastMsg, { quoted: qmeta })
      sentCount++
    } catch (e) {
      console.log(`[Gagal kirim ke CH] ${id}`, e)
    }
    await sleep(global.delayJpm || 4000)
  }

  if (mediaPath) fs.unlinkSync(mediaPath)

  await russyuroku.sendMessage(
    m.chat,
    {
      text: `✅ *JPM Channel Selesai!*\nBerhasil terkirim ke *${sentCount}* channel dari total ${validChannels.length}.`,
      edit: processMsg.key
    }
  )
}
break
case "getpp": {
  const args = text?.trim()
  if (!m.quoted && !m.mentionedJid?.length && !args) {
    return example(
      `Tag, reply, atau masukkan nomor target.\n\n` +
      `Contoh:\n` +
      `• *${prefix + command} @user*\n` +
      `• *${prefix + command}* (reply pesan)\n` +
      `• *${prefix + command} 62xxxxxx*`
    )
  }

  await russyuroku.sendMessage(m.chat, { react: { text: "🔍", key: m.key } })

  try {
    let target

    if (m.quoted) {
      target = m.quoted.sender
    } else if (m.mentionedJid?.length) {
      target = m.mentionedJid[0]
    } else {

      let no = args.replace(/[^0-9]/g, "")

      if (!no) {
        await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        return reply("❌ Nomor tidak valid.")
      }

      if (no.startsWith("0")) {
        no = "62" + no.slice(1)
      } else if (no.startsWith("8")) {
        no = "62" + no
      } else if (!no.startsWith("62")) {
        no = "62" + no
      }

      if (no.length < 10 || no.length > 15) {
        await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        return reply(`❌ Nomor tidak valid: ${no}`)
      }

      target = no + "@s.whatsapp.net"
    }

    const no = target.split("@")[0]
    let pp

    try {
      pp = await russyuroku.profilePictureUrl(target, "image")
    } catch {
      await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
      return reply("❌ User tidak punya foto profil atau disembunyikan.")
    }

    await russyuroku.sendMessage(
      m.chat,
      {
        image: { url: pp },
        caption: `✅ Foto profil @${no}`,
        mentions: [target],
      },
      { quoted: m }
    )

    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (err) {
    console.error("[getpp] error:", err)
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    reply("❌ Gagal mengambil foto profil.")
  }
}
break

case "cekidgc": {
    if (!isCreator) return larang()

    await russyuroku.sendMessage(m.chat, { react: { text: "👥", key: m.key } })

    try {
        const getGroups = await russyuroku.groupFetchAllParticipating()
        const groups = Object.values(getGroups)

        let teks = `👥 *LIST GROUP BOT*\n\nTotal Group: ${groups.length}\n\n`
        for (const g of groups) {
            teks += `◉ Nama: ${g.subject}\n◉ ID: ${g.id}\n◉ Member: ${g.participants?.length || 0}\n\n`
        }

        reply(teks)
    } catch (err) {
        console.error(err)
        reply(`❌ Gagal mengambil daftar group: ${err.message}`)
    }
}
break

case "waifu": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })

    try {
        let res = await axios.get("https://weeb-api.vercel.app/waifu", {
            responseType: "arraybuffer"
        })
        let buffer = Buffer.from(res.data)

        await russyuroku.sendMessage(
            m.chat,
            { image: buffer, caption: "✅ *Random Waifu Pic* 💮" },
            { quoted: m }
        )
    } catch (err) {
        console.error(err)
        reply(`❌ Error: ${err.message}`)
    }
}
break

case "cosba":
case "cosplayba": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })

    try {
        let res = await axios.get("https://api.ryuu-dev.offc.my.id/random/cosplay-ba", {
            responseType: "arraybuffer"
        })
        let buffer = Buffer.from(res.data)

        await russyuroku.sendMessage(
            m.chat,
            { image: buffer, caption: "✅ *Random Blue Archive Cosplay*" },
            { quoted: m }
        )
    } catch (err) {
        console.error(err)
        reply(`❌ Error: ${err.message}`)
    }
}
break

case "bluearchive":
case "ba": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })

    try {
        let res = await axios.get("https://api.siputzx.my.id/api/r/blue-archive", {
            responseType: "arraybuffer"
        })
        let buffer = Buffer.from(res.data)

        await russyuroku.sendMessage(
            m.chat,
            { image: buffer, caption: "✅ *Random Blue Archive Waifu*" },
            { quoted: m }
        )
    } catch (err) {
        console.error(err)
        reply(`❌ Error: ${err.message}`)
    }
}
break

case "pinterest":
case "pin": {
    if (!text) return example(`Masukkan query!\n\n*Contoh:* ${prefix + command} cosplay`)

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    try {
        const { data } = await axios.get(
            `https://api-faa.my.id/faa/pinterest?q=${encodeURIComponent(text)}`,
            { timeout: 30000 }
        )

        if (!data?.status || !Array.isArray(data.result) || !data.result.length) {
            await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
            return reply("❌ Tidak ada hasil ditemukan.")
        }

        const images = data.result
            .filter((u) => typeof u === "string" && /^https?:\/\//i.test(u) && !/\.heic(\?|$)/i.test(u))
            .slice(0, 10)

        if (!images.length) {
            await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
            return reply("❌ Tidak ada gambar yang bisa ditampilkan.")
        }

        let builder = russyuroku.messageBuilder(m.chat, { quoted: m })
            .setType("Carousel")
            .setBody(`📌 *Pinterest*\n🔎 Hasil pencarian: *${text}*`)
            .setFooter(global.foother || "")

        for (let i = 0; i < images.length; i++) {
            const card = await new Button(russyuroku)
                .setTitle(`📌 ${text} • ${i + 1}/${images.length}`)
                .setBody(`Hasil Pinterest untuk: ${text}`)
                .setImage(images[i])
                .addUrl("Buka Gambar", images[i], true)
                .toCard()

            builder = builder.addCard(card)
        }

        await builder.send()
        await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
    } catch (err) {
        console.error("[pinterest] error:", err)
        await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        reply(`❌ Error: ${err.message}`)
    }
}
break

case "randommeme": {
    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    try {
        const res = await axios.get("https://api-faa.my.id/faa/meme", { responseType: "arraybuffer", timeout: 30000 })
        if (!String(res.headers["content-type"] || "").startsWith("image/")) throw new Error("Respon meme bukan gambar")

        await russyuroku.sendMessage(m.chat, { image: Buffer.from(res.data), caption: "🤣 Random Meme" }, { quoted: m })
        await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
    } catch (e) {
        console.warn("[randommeme] API online gagal, fallback ke data/randomimage/antiwork.json:", e.message)
        try {
            await russyuroku.sendMessage(m.chat, { image: { url: randomImageUrl("antiwork") }, caption: "🤣 Random Meme (Offline Fallback)" }, { quoted: m })
            await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
        } catch (err) {
            console.error("[randommeme] error:", err)
            await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
            reply("❌ Gagal mengambil meme.")
        }
    }
}
break

case "randomblackpink":
case "randomprofile":
case "randomprofil":
case "randomcecan":
case "randomcogan":
case "randomcosplay": {

    const RANDOM_IMG = {
        randomblackpink: ["blackpink", "📸 Random Blackpink"],
        randomprofile:   ["profil",    "📸 Random Profile"],
        randomprofil:    ["profil",    "📸 Random Profile"],
        randomcecan:     ["cecan",     "📸 Random Cecan"],
        randomcogan:     ["cogan",     "📸 Random Cogan"],
        randomcosplay:   ["cosplay",   "📸 Random Cosplay"],
    }
    const [dbName, caption] = RANDOM_IMG[command.toLowerCase()]

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
    try {
        await russyuroku.sendMessage(m.chat, { image: { url: randomImageUrl(dbName) }, caption }, { quoted: m })
        await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
    } catch (e) {
        console.error(`[${command}] error:`, e)
        await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        reply("❌ Gagal mengambil gambar.")
    }
}
break

case "capcut": {
    if (!text) return example(`https://www.capcut.com/tv2/ZSSCR6UFU/`);
    if (!/^https?:\/\/(www\.)?capcut\.com\/.+/i.test(text)) {
        return reply("❌ URL CapCut tidak valid.");
    }

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        const apiUrl = `https://api.siputzx.my.id/api/d/capcutv2?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data || !data.data.medias.length) {
            return reply("❌ Gagal mengambil media dari CapCut.");
        }

        const { title, thumbnail, medias } = data.data;

        let media = medias.find(m => /HD No Watermark/i.test(m.quality)) || medias[0];

        await russyuroku.sendMessage(
            m.chat,
            {
                video: { url: media.url },
                caption: `✅ *CapCut Template*\n\n🎬 Judul: ${title}\n💾 Kualitas: ${media.quality}\n📦 Size: ${media.formattedSize}`
            },
            { quoted: m }
        );

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break

case "twitter":
case "twitdl": {
    if (!text) return example(`https://twitter.com/9GAG/status/1661175429859012608`);
    if (!/^https?:\/\/(www\.)?(twitter|x)\.com\/.+/i.test(text)) {
        return reply("❌ URL Twitter/X tidak valid.");
    }

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        const apiUrl = `https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data || !data.data.downloadLink) {
            return reply("❌ Gagal mengambil media dari Twitter.");
        }

        const { downloadLink, imgUrl, videoTitle, videoDescription } = data.data;

        await russyuroku.sendMessage(
            m.chat,
            {
                video: { url: downloadLink },
                caption: `✅ *Twitter Video Downloaded*\n\n🎬 Title: ${videoTitle || "-"}\n📝 Desc: ${videoDescription || "-"}`
            },
            { quoted: m }
        );

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break

case "igdl": {
    if (!text) return example(`https://www.instagram.com/reel/DMNiqN2TV3v/`);

    if (!/^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/.+/i.test(text)) {
        return reply("❌ URL Instagram tidak valid.");
    }

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        const apiUrl = `https://api-faa.my.id/faa/igdl?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result || !data.result.url || !data.result.url.length) {
            return reply("❌ Gagal mengambil media dari Instagram.");
        }

        const { url: medias, metadata } = data.result;

        for (let mediaUrl of medias) {
            if (metadata.isVideo || mediaUrl.includes(".mp4")) {

                await russyuroku.sendMessage(
                    m.chat,
                    {
                        video: { url: mediaUrl },
                        caption: `✅ Instagram Video berhasil didownload.\n\n👤 ${metadata.username}\n❤️ ${metadata.like}\n💬 ${metadata.comment}`
                    },
                    { quoted: m }
                );
            } else {

                await russyuroku.sendMessage(
                    m.chat,
                    {
                        image: { url: mediaUrl },
                        caption: `✅ Instagram Photo berhasil didownload.\n\n👤 ${metadata.username}\n❤️ ${metadata.like}\n💬 ${metadata.comment}`
                    },
                    { quoted: m }
                );
            }

            await sleep(1500);
        }

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break

case "tempmail": {
    const sub = String(text || '').trim().toLowerCase();

    if (!sub || sub === "create" || sub === "buat" || sub === "new") {
        await russyuroku.sendMessage(m.chat, { react: { text: "📧", key: m.key } });
        try {
            const existing = getTempMailSession(m.sender);
            if (existing) {
                return reply(`⚠️ Kamu sudah punya email aktif:\n\n📧 *${existing.email}*\n\nPakai *${prefix}tempmail inbox* buat cek pesan, atau *${prefix}tempmail delete* buat bikin baru.`);
            }

            const result = await createTempMailSession(m.sender);

            return russyuroku.sendMessage(m.chat, {
                text: `✅ *Temp Email Dibuat!*\n\n📧 Email: *${result.email.address}*\n\nCek pesan masuk pakai:\n${prefix}tempmail inbox\n\natau langsung:\n${prefix}tempmail email`,
                ...previewAd({
                    title: `TempMail — ${global.namabot}`,
                    body: result.email.address,
                    thumbnail: global.image.reply,
                    sourceUrl: global.web,
                    mention: [m.sender],
                    forward: true,
                    largerThumbnail: false,
                }),
            }, { quoted: m });
        } catch (err) {
            console.error(err);
            return reply(`❌ Gagal membuat temp email: ${err.message}`);
        }
    }

    if (sub === "inbox" || sub === "email" || sub === "cek" || sub === "check" || sub === "refresh") {
        await russyuroku.sendMessage(m.chat, { react: { text: "📥", key: m.key } });
        try {
            const session = getTempMailSession(m.sender);
            if (!session) {
                return reply(`❌ Kamu belum punya email aktif.\n\nBuat dulu pakai *${prefix}tempmail create*`);
            }

            const inboxResult = await refreshTempMailSession(m.sender);

            if (!inboxResult || !inboxResult.messages || inboxResult.messages.total === 0) {
                return reply(`📭 *Inbox Kosong*\n\n📧 Email: ${session.email}\n\nBelum ada pesan masuk. Coba cek lagi nanti pakai *${prefix}tempmail inbox*`);
            }

            const list = inboxResult.messages.list
                .map((msg, i) => `${i + 1}. *${msg.subject || "(tanpa subjek)"}*\n   📤 Dari: ${msg.from || "-"}\n   🕒 ${msg.time || "-"}`)
                .join("\n\n");

            let teks = `📥 *Inbox TempMail*\n\n📧 Email: ${session.email}\n📊 Total pesan: ${inboxResult.messages.total}\n\n${list}`;

            const first = inboxResult.messages.list[0];
            if (first?.detail?.body?.text) {
                const preview = first.detail.body.text.length > 500
                    ? first.detail.body.text.slice(0, 500) + "..."
                    : first.detail.body.text;
                teks += `\n\n───────────────\n✉️ *Isi Pesan Terbaru:*\n${preview}`;
            }

            return russyuroku.sendMessage(m.chat, {
                text: teks,
                ...previewAd({
                    title: `TempMail Inbox — ${global.namabot}`,
                    body: session.email,
                    thumbnail: global.image.reply,
                    sourceUrl: global.web,
                    mention: [m.sender],
                    forward: true,
                    largerThumbnail: false,
                }),
            }, { quoted: m });
        } catch (err) {
            console.error(err);
            return reply(`❌ Gagal mengambil inbox: ${err.message}`);
        }
    }

    if (sub === "delete" || sub === "del" || sub === "hapus" || sub === "reset") {
        const existing = getTempMailSession(m.sender);
        if (!existing) {
            return reply(`❌ Kamu belum punya email aktif.`);
        }
        clearTempMailSession(m.sender);
        return reply(`🗑️ Email *${existing.email}* berhasil dihapus dari sesi.\n\nBuat baru pakai *${prefix}tempmail create*`);
    }

    return example(`create | inbox | email | delete`);
}
break

case "spotify": {
    if (!text) return example(`https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh`);
    if (!/^https?:\/\/(open|play)\.spotify\.com\/.+/i.test(text)) {
        return reply("❌ URL Spotify tidak valid.");
    }

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        const apiUrl = `https://api.siputzx.my.id/api/d/spotifyv2?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) return reply("❌ Gagal mengambil detail lagu dari Spotify.");

        const track = data.data;

        let cap = `🎶 *Spotify Downloader*\n\n`;
        cap += `🎵 Judul: *${track.songTitle}*\n`;
        cap += `👤 Artis: *${track.artist}*\n`;
        cap += `🔗 [Link Asli](${track.url})\n\n`;
        cap += `✅ Lagu berhasil didownload!`;

        await russyuroku.sendMessage(
            m.chat,
            {
                audio: { url: track.mp3DownloadLink },
                mimetype: "audio/mpeg",
                fileName: `${track.songTitle}.mp3`,
                ptt: false
            },
            { quoted: m }
        );

        await russyuroku.sendMessage(
            m.chat,
            {
                image: { url: track.coverImage },
                caption: cap
            },
            { quoted: m }
        );

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break

case "mediafire": {
  if (!text) return example(`https://www.mediafire.com/file/iojnikfucf67q74/Base_Bot_Simpel.zip/file`);
  if (!/^https?:\/\/(www\.)?mediafire\.com\/.+/i.test(text)) {
    return reply("❌ URL MediaFire tidak valid.");
  }

  await russyuroku.sendMessage(m.chat, { react: { text: "📥", key: m.key } });

  try {
    const apiUrl = `https://api-faa.my.id/faa/mediafire?url=${encodeURIComponent(text)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result) {
      return reply("❌ Gagal mengambil file dari MediaFire.");
    }

    const file = data.result;

    let cap = `📥 *MediaFire Downloader*\n\n`;
    cap += `📌 Nama File: *${file.filename}*\n`;
    cap += `📦 Ukuran: *${file.size}*\n`;
    cap += `📂 Tipe: ${file.mime}\n\n`;
    cap += `⏬ File sedang dikirim...`;

    await russyuroku.sendMessage(m.chat, {
      document: { url: file.download_url },
      fileName: file.filename,
      mimetype: "application/zip",
      caption: cap
    }, { quoted: m });

  } catch (err) {
    console.error("mediafire cmd error:", err);
    reply("❌ Terjadi kesalahan saat download file MediaFire.");
  }
}
break

case "tt-dl":
case "tt":
case "tiktok": {
    if (!text) return example(`https://vt.tiktok.com/ZSBhtXeVr/`);
    if (!/^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\/.+/i.test(text)) {
        return reply("❌ URL TikTok tidak valid.");
    }

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        const { data } = await axios.get("https://tiktok-scraper7.p.rapidapi.com", {
            headers: {
                "Accept-Encoding": "gzip",
                "Connection": "Keep-Alive",
                "Host": "tiktok-scraper7.p.rapidapi.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
                "X-RapidAPI-Host": "tiktok-scraper7.p.rapidapi.com",
                "X-RapidAPI-Key": "ca5c6d6fa3mshfcd2b0a0feac6b7p140e57jsn72684628152a"
            },
            params: { url: text, hd: "1" }
        });

        const res = data.data;
        if (!res || !res.hdplay) return reply("❌ Gagal mengambil data video TikTok.");

        let cap = `✅ *Tiktok Downloader*\n\n`;
        cap += `🎥 Judul: ${res.title || "-"}\n`;
        cap += `👤 Author: ${res.author?.nickname || "-"} (@${res.author?.unique_id || "-"})\n`;
        cap += `🌎 Region: ${res.region}\n`;
        cap += `▶️ Play Count: ${res.play_count}\n❤️ Likes: ${res.digg_count}\n💬 Comments: ${res.comment_count}\n🔄 Share: ${res.share_count}`;

        await russyuroku.sendMessage(
            m.chat,
            {
                video: { url: res.hdplay },
                caption: cap
            },
            { quoted: m }
        );

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break

case "toimg": {
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || "";
    if (!/webp/.test(mime)) return example(" Sambil Kirim atau reply sticker untuk diubah jadi gambar.");

    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } });

    try {
        let mediaPath = await russyuroku.downloadAndSaveMediaMessage(quoted);
        let url = await uploader.auto(mediaPath);

        if (!url) {
            if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
            return reply("❌ Gagal upload sticker.");
        }

        await russyuroku.sendMessage(
            m.chat,
            { image: { url }, caption: `✅ *Sticker berhasil diubah jadi gambar*\n📎 URL: ${url}` },
            { quoted: m }
        );

        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break

case "autojpm": {
  if (!isCreator) return larang()

  let [cmd, ...args] = text.split(" ")
  cmd = cmd ? cmd.toLowerCase() : null

  if (!cmd) {
    let list = penting.autoJpm.messages.map((m, i) => `${i + 1}. ${m.caption || m.text || "(media tanpa teks)"}`).join("\n") || "- kosong -"
    return reply(
`*AUTO JPM SYSTEM*

Status: ${penting.autoJpm.status ? "ON" : "OFF"}
Interval: ${penting.autoJpm.interval} ${penting.autoJpm.type}
Pesan tersimpan:
${list}

Command:
.autojpm on
.autojpm off
.autojpm add <teks/caption> (reply gambar/video jika ada media)
.autojpm del <nomor/all>
.autojpm set <angka> menit/jam/hari`
    )
  }

  if (cmd === "on") {
    if (penting.autoJpm.status) return reply("✖️ Auto JPM sudah aktif.")
    if (!penting.autoJpm.interval || !penting.autoJpm.messages.length) {
      return reply("✖️ Set interval dan tambah pesan dulu!")
    }
    penting.autoJpm.status = true
    savePenting()
    reply("✅ Auto JPM berhasil diaktifkan.")
  }

  else if (cmd === "off") {
    penting.autoJpm.status = false
    savePenting()
    reply("✅ Auto JPM dimatikan.")
  }

  else if (cmd === "add") {
  let qmsg = m.quoted ? m.quoted : m
  let mime = (qmsg.msg || qmsg).mimetype || ''
  let caption = args.join(" ")
  let tmpDir = path.join(process.cwd(), "tmp", "autojpm")
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

  if (/image|video/.test(mime)) {
    let ext = mime.split("/")[1] || "bin"
    let fileName = `autojpm_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`
    let filePath = path.join(tmpDir, fileName)

    let buffer = await qmsg.download()
    fs.writeFileSync(filePath, buffer)

    penting.autoJpm.messages.push({
      type: /image/.test(mime) ? "image" : "video",
      path: filePath,
      caption
    })
  } else {
    penting.autoJpm.messages.push({
      type: "text",
      text: caption
    })
  }
  penting.autoJpm._lastRun = 0

  savePenting()
  reply("✅ Pesan berhasil ditambahkan ke Auto JPM.")
}

  else if (cmd === "del") {
    let idx = args[0]
    if (!idx) return reply("✖️ Masukkan nomor pesan atau 'all'.")
    if (idx === "all") {
      penting.autoJpm.messages = []
    } else {
      idx = parseInt(idx) - 1
      if (isNaN(idx) || idx < 0 || idx >= penting.autoJpm.messages.length) {
        return reply("✖️ Nomor tidak valid.")
      }
      penting.autoJpm.messages.splice(idx, 1)
    }
    savePenting()
    reply("✅ Pesan berhasil dihapus.")
  }

  else if (cmd === "set") {
    let num = parseInt(args[0])
    let unit = (args[1] || "").toLowerCase()
    if (isNaN(num) || num <= 0) return reply("✖️ Masukkan angka yang valid.")
    if (!["menit","jam","hari","minute","hour","day"].includes(unit)) {
      return reply("✖️ Gunakan satuan menit/jam/hari.")
    }

    penting.autoJpm.interval = num
    penting.autoJpm.type = unit.startsWith("m") ? "minute" : unit.startsWith("j") ? "hour" : "day"
    savePenting()
    reply(`✅ Interval diatur ke ${num} ${penting.autoJpm.type}.`)
  }
}
break

case "remini": case "hd": {
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || "";
    if (!/image/.test(mime)) return example(" Sambil kirim atau reply gambar untuk di-HD-in.");

    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } });

    try {
        let mediaPath = await russyuroku.downloadAndSaveMediaMessage(quoted);
        let url = await uploader.auto(mediaPath);

        let apiUrl = `https://api-faa.my.id/faa/hdv2?url=${encodeURIComponent(url)}`;
        let { data } = await axios.get(apiUrl);

        if (!data.status || !data.result) {
            if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
            return reply(`❌ Gagal memproses gambar: ${data.message || 'Unknown error'}`);
        }

        await russyuroku.sendMessage(
            m.chat,
            { image: { url: data.result }, caption: `✅ *Successful Upscale 4k Quality*\n📎 URL: ${data.result}` },
            { quoted: m }
        );

        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break

case "tourl": {
    if (!m.quoted) return example(`Reply media yang mau diupload.\nContoh: *${prefix+command}*`);
    let mime = (m.quoted.msg || m.quoted).mimetype || "";
    if (!mime) return reply("Media tidak ditemukan.");

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        let mediaPath = await russyuroku.downloadAndSaveMediaMessage(m.quoted);
        let url = await uploader.auto(mediaPath);
        await reply(`✅ *Berhasil Upload*\n\n📎 *URL:* ${url}`);
        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    } catch (err) {
        console.error(err);
        reply(`❌ Gagal upload: ${err.message}`);
    }
}
break

case "glitchtext":
case "writetext":
case "advancedglow":
case "typographytext":
case "pixelglitch":
case "neonglitch":
case "flagtext":
case "flag3dtext":
case "deletingtext":
case "blackpinkstyle":
case "glowingtext":
case "underwatertext":
case "logomaker":
case "cartoonstyle":
case "papercutstyle":
case "watercolortext":
case "effectclouds":
case "blackpinklogo":
case "gradienttext":
case "summerbeach":
case "luxurygold":
case "multicoloredneon":
case "sandsummer":
case "galaxywallpaper":
case "1917style":
case "makingneon":
case "royaltext":
case "freecreate":
case "galaxystyle":
case "lighteffects": {
  if (!text) return example(`Masukkan teksnya!\nContoh: ${prefix + command} ${global.namabot}`);
  await russyuroku.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });
  try {
    const link = ephotoLinks[command.toLowerCase()];
    const hasil = await ephotoMaker(link, text);
    await russyuroku.sendMessage(m.chat, { image: { url: hasil }, caption: `✅ *Berhasil membuat ${command}*` }, { quoted: m });
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal membuat efek: ${err.message}`);
  }
}
break

case "qr": {
  if (!text) return example(`Masukkan teks atau link!\nContoh: ${prefix + command} https://saurusdev.cloud`);
  try {
    const buffer = await QRCode.toBuffer(text);
    await russyuroku.sendMessage(m.chat, { image: buffer, caption: `📷 QR Code untuk:\n${text}` }, { quoted: m });
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal membuat QR Code: ${err.message}`);
  }
}
break

case "stickmeme": {
  let quoted = m.quoted ? m.quoted : m;
  let mime = (quoted.msg || quoted).mimetype || "";
  if (!/image/.test(mime)) return example(`Kirim/reply gambar dengan caption ${prefix + command} teksatas|teksbawah`);
  if (!text || !text.includes("|")) return example(`Format: ${prefix + command} teksatas|teksbawah`);

  await russyuroku.sendMessage(m.chat, { react: { text: "🖼️", key: m.key } });
  try {
    let [atas, bawah] = text.split("|");
    atas = atas.trim() || "-";
    bawah = (bawah || "").trim() || "-";

    let mediaPath = await russyuroku.downloadAndSaveMediaMessage(quoted);
    let url = await uploader.auto(mediaPath);
    let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${encodeURIComponent(url)}`;

    await russyuroku.sendImageAsSticker(m.chat, meme, m, {
      packname: global.packname,
      author: global.author,
    });

    if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal membuat sticker meme: ${err.message}`);
  }
}
break

case "ttp": {
  if (!text) return example(`Masukkan teksnya!\nContoh: ${prefix + command} ${global.namabot}`);
  try {
    const size = text.length > 20 ? 60 : text.length > 10 ? 80 : 100;
    const canvasTtp = createCanvas(512, 512);
    const ctx = canvasTtp.getContext("2d");
    ctx.clearRect(0, 0, canvasTtp.width, canvasTtp.height);
    ctx.font = `bold ${size}px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const words = text.split(" ");
    const lineHeight = size * 1.5;
    let lines = [];
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine + word + " ";
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > canvasTtp.width - 20 && currentLine !== "") {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());

    const startY = canvasTtp.height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, canvasTtp.width / 2, startY + i * lineHeight);
    });

    const buffer = canvasTtp.toBuffer();
    await russyuroku.sendImageAsSticker(m.chat, buffer, m, {
      packname: global.packname,
      author: global.author,
    });
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal membuat sticker: ${err.message}`);
  }
}
break

case "ebinary": {
  if (!text) return example(`Masukkan teks yang mau diubah ke binary!\nContoh: ${prefix + command} halo`);
  const hasil = text.split("").map((char) => char.charCodeAt(0).toString(2)).join(" ");
  reply(`\`\`\`「 ENCODE BINARY 」\`\`\`\n*• Teks:*\n${text}\n*• Binary:*\n${hasil}`);
}
break

case "dbinary": {
  if (!text) return example(`Masukkan kode binary yang mau diubah ke teks!\nContoh: ${prefix + command} 01101000 01101001`);
  try {
    const hasil = text.split(" ").map((bin) => String.fromCharCode(parseInt(bin, 2))).join("");
    if (!hasil || /\uFFFD|NaN/.test(hasil)) throw new Error("Format binary tidak valid.");
    reply(`\`\`\`「 DECODE BINARY 」\`\`\`\n*• Binary:*\n${text}\n*• Teks:*\n${hasil}`);
  } catch (err) {
    reply(`❌ Format binary tidak valid. Pisahkan tiap 8-bit dengan spasi.`);
  }
}
break

case "fliptext": {
  if (!text) return example(`Masukkan teksnya!\nContoh: ${prefix + command} ${global.namabot}`);
  const flip = text.split("").reverse().join("");
  reply(`\`\`\`「 FLIP TEXT 」\`\`\`\n*• Normal:*\n${text}\n*• Flip:*\n${flip}`);
}
break

case "myip": {
  try {
    const { data } = await axios.get("https://api.ipify.org?format=json");
    reply(`🔎 *IP Publik Server Bot:*\n${data.ip}`);
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal mengambil IP: ${err.message}`);
  }
}
break

case "tinyurl": {
  if (!text) return example(`Masukkan link yang mau dipendekkan!\nContoh: ${prefix + command} https://saurusdev.cloud`);
  try {
    const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`);
    reply(`✅ *Berhasil memendekkan link!*\n\n🔗 ${data}`);
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal memendekkan link: ${err.message}`);
  }
}
break

case "web2zip": {
  if (!text) return example(`Masukkan link website yang mau di-clone!\nContoh: ${prefix + command} https://example.com`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🌐", key: m.key } });

  try {
    const targetUrl = text.startsWith("http://") || text.startsWith("https://") ? text : `https://${text}`;

    const { data: startData } = await axios.post(
      "https://copier.saveweb2zip.com/api/copySite",
      {
        url: targetUrl,
        renameAssets: true,
        saveStructure: true,
        alternativeAlgorithm: false,
        mobileVersion: false,
      },
      {
        headers: {
          accept: "*/*",
          "content-type": "application/json",
          origin: "https://saveweb2zip.com",
          referer: "https://saveweb2zip.com/",
          "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
        },
      }
    );

    if (!startData.md5) throw new Error("Gagal memulai proses cloning website.");

    let attempts = 0;
    let status;
    while (attempts < 60) {
      const { data: proc } = await axios.get(`https://copier.saveweb2zip.com/api/getStatus/${startData.md5}`, {
        headers: {
          accept: "*/*",
          "content-type": "application/json",
          origin: "https://saveweb2zip.com",
          referer: "https://saveweb2zip.com/",
          "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
        },
      });
      if (proc.isFinished) { status = proc; break; }
      attempts++;
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (!status) throw new Error("Timeout, proses terlalu lama.");
    if (status.errorCode !== 0) return reply(`❌ *Gagal Clone Website*\n\nError: ${status.errorText}`);

    const downloadUrl = `https://copier.saveweb2zip.com/api/downloadArchive/${status.md5}`;
    await russyuroku.sendMessage(m.chat, {
      document: { url: downloadUrl },
      mimetype: "application/zip",
      fileName: `${targetUrl.replace(/https?:\/\//, "").replace(/[\/\\?%*:|"<>]/g, "_")}.zip`,
      caption: `✅ *Website berhasil di-clone!*\n🌐 URL: ${targetUrl}\n📂 Total File: ${status.copiedFilesAmount}`,
    }, { quoted: m });
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal clone website: ${err.message}`);
  }
}
break

case "readviewonce": {
  if (!m.quoted) return example(`Reply pesan sekali lihat (view once) dengan caption *${prefix + command}*`);
  const q = m.quoted;
  const mimeQ = (q.msg || q).mimetype || "";
  if (!mimeQ) return reply("❌ Pesan yang di-reply bukan media.");

  await russyuroku.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

  try {
    const mediaPath = await russyuroku.downloadAndSaveMediaMessage(q);
    const caption = "`Pesan sekali lihat berhasil dibuka`";

    if (/image/.test(mimeQ)) {
      await russyuroku.sendMessage(m.chat, { image: { url: mediaPath }, caption }, { quoted: m });
    } else if (/video/.test(mimeQ)) {
      await russyuroku.sendMessage(m.chat, { video: { url: mediaPath }, caption }, { quoted: m });
    } else if (/audio/.test(mimeQ)) {
      await russyuroku.sendMessage(m.chat, { audio: { url: mediaPath }, mimetype: "audio/mp4", ptt: true }, { quoted: m });
    } else {
      return reply("❌ Tipe media tidak didukung.");
    }

    if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal membuka pesan sekali lihat: ${err.message}`);
  }
}
break

case "toonce": {
  if (!m.quoted) return example(`Reply gambar/video dengan caption *${prefix + command}* untuk dijadikan pesan sekali lihat`);
  const q = m.quoted;
  const mimeQ = (q.msg || q).mimetype || "";
  if (!/image|video/.test(mimeQ)) return reply("❌ Reply gambar atau video.");

  await russyuroku.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

  try {
    const mediaPath = await russyuroku.downloadAndSaveMediaMessage(q);
    if (/image/.test(mimeQ)) {
      await russyuroku.sendMessage(m.chat, { image: { url: mediaPath }, caption: "Ini dia!", viewOnce: true }, { quoted: m });
    } else {
      await russyuroku.sendMessage(m.chat, { video: { url: mediaPath }, caption: "Ini dia!", viewOnce: true }, { quoted: m });
    }
    if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal membuat sekali lihat: ${err.message}`);
  }
}
break

case "togif": {
  if (!m.quoted) return example(`Reply sticker dengan caption *${prefix + command}* untuk diubah jadi GIF/video`);
  const q = m.quoted;
  const mimeQ = (q.msg || q).mimetype || "";
  if (!/webp/.test(mimeQ)) return reply("❌ Reply sticker (webp).");

  await russyuroku.sendMessage(m.chat, { react: { text: "🔄", key: m.key } });

  try {
    const media = await russyuroku.downloadMediaMessage(q);
    const videoBuffer = await webpToVideo(media);
    await russyuroku.sendMessage(m.chat, { video: videoBuffer, gifPlayback: true, caption: "✅ Berhasil diubah jadi GIF" }, { quoted: m });
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal mengubah ke GIF: ${err.message}`);
  }
}
break

case "say":
case "tts": {
  if (!text) return example(`Masukkan teksnya!\nContoh: ${prefix + command} halo semua`);
  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=id&client=tw-ob`;
    await russyuroku.sendMessage(m.chat, {
      audio: { url: ttsUrl },
      mimetype: "audio/mp4",
      ptt: true,
      fileName: `${command}.mp3`,
    }, { quoted: m });
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal membuat suara: ${err.message}`);
  }
}
break

case "cekkhodam": {
  if (!text) return example(`Masukkan nama yang mau dicek khodamnya!\nContoh: ${prefix + command} ${pushname || "Kak"}`);
  try {
    const khodamList = ["Macan Tutul", "Gajah Sumatera", "Orangutan", "Harimau Putih", "Badak Jawa", "Pocong", "Kuntilanak", "Genderuwo", "Wewe Gombel", "Kuyang", "Elang Jawa", "Burung Cendrawasih", "Tuyul", "Sundel Bolong", "Jenglot", "Kucing Hutan", "Ayam Cemani", "Cicak", "Burung Merak", "Kuda Lumping", "Buaya Muara", "Banteng Jawa", "Monyet Ekor Panjang", "Siluman Ular", "Beruang Madu", "Serigala", "Rajawali", "Kambing Etawa", "Kelelawar", "Burung Hantu", "Ikan Cupang"];
    const dampingList = ["1 tahun lalu", "2 tahun lalu", "3 tahun lalu", "4 tahun lalu", "lahir"];
    const khodam = khodamList[Math.floor(Math.random() * khodamList.length)];
    const damping = dampingList[Math.floor(Math.random() * dampingList.length)];
    const hasil = `Khodam ${text}, adalah ${khodam}, mendampingi sejak ${damping}`;

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(hasil)}&tl=id&client=tw-ob`;
    await russyuroku.sendMessage(m.chat, {
      audio: { url: ttsUrl },
      mimetype: "audio/mp4",
      ptt: true,
    }, { quoted: m });
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal cek khodam: ${err.message}`);
  }
}
break

case "alkitab": {
  if (!text) return example(`Masukkan ayat yang mau dicari!\nContoh: ${prefix + command} kejadian 1:1`);
  try {
    const { data } = await axios.get(`https://alkitab.me/search?q=${encodeURIComponent(text)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36" },
    });
    const $ = cheerio.load(data);
    let hasil = $(".verse").first().text().trim() || $("body").text().trim().slice(0, 1000);
    if (!hasil) return reply("❌ Ayat tidak ditemukan.");
    reply(`📖 *Alkitab*\n\n${hasil}`);
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal mencari ayat: ${err.message}`);
  }
}
break

case "lyrics": {
  if (!text) return example(`Masukkan judul lagu!\nContoh: ${prefix + command} Bohemian Rhapsody`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🎵", key: m.key } });
  try {
    const { data } = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(text)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36" },
    });
    if (!data || !data[0]) return reply("❌ Lirik tidak ditemukan.");
    const song = data[0];
    const lyricsRaw = song.plainLyrics || song.syncedLyrics;
    if (!lyricsRaw) return reply("❌ Lirik tidak tersedia untuk lagu ini.");
    const cleanLyrics = lyricsRaw.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, "").trim();
    reply(`🎵 *${song.trackName} - ${song.artistName}*\n\n${cleanLyrics.slice(0, 3500)}`);
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal mengambil lirik: ${err.message}`);
  }
}
break

case "take":
case "setwm": {
  let quotedT = m.quoted ? m.quoted : m;
  let mimeT = (quotedT.msg || quotedT).mimetype || "";
  if (!/image|video/.test(mimeT)) return example(`Kirim/reply gambar atau video dengan caption *${prefix + command} packname|author*`);

  await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } });

  try {
    const parts = (text || "").split("|");
    const packname = parts[0]?.trim() || global.packname || global.namabot;
    const author = parts[1]?.trim() || global.author || global.ownername;

    const mediaPath = await russyuroku.downloadAndSaveMediaMessage(quotedT);

    if (/image/.test(mimeT)) {
      await russyuroku.sendImageAsSticker(m.chat, mediaPath, m, { packname, author });
    } else {
      await russyuroku.sendVideoAsSticker(m.chat, mediaPath, m, { packname, author });
    }

    if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal setwm sticker: ${err.message}`);
  }
}
break

case "igstalk": {
  if (!text) return example(`Masukkan username Instagram!\nContoh: ${prefix + command} instagram`);
  const username = text.replace("@", "");
  await russyuroku.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

  try {
    const getSession = await axios.get("https://on4t.com/instagram-fake-follower-checker", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const cookies = getSession.headers["set-cookie"];
    if (!cookies) return reply("❌ Gagal mendapatkan session dari server.");
    const cookieString = cookies.map((c) => c.split(";")[0]).join("; ");

    const html = getSession.data;
    const csrfMatch = html.match(/<meta name="csrf-token" content="(.*?)"/i);
    if (!csrfMatch) return reply("❌ Gagal mendapatkan token dari website.");
    const csrfToken = csrfMatch[1];

    const response = await axios.post(
      "https://on4t.com/instagram-fake-follower-checker",
      { username },
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          Referer: "https://on4t.com/instagram-fake-follower-checker",
          "Content-Type": "application/json",
          Origin: "https://on4t.com",
          "X-CSRF-TOKEN": csrfToken,
          cookie: cookieString,
        },
      }
    );

    const d = response.data;
    if (!d || d.error) return reply("❌ Username tidak ditemukan atau akun private.");

    let caption = `📷 *Instagram Stalker*\n\n👤 Username: ${d.username || username}\n📛 Nama: ${d.full_name || "-"}\n👥 Followers: ${d.follower_count ?? "-"}\n➡️ Following: ${d.following_count ?? "-"}\n📝 Bio: ${d.biography || "-"}\n🔒 Private: ${d.is_private ? "Ya" : "Tidak"}`;

    if (d.profile_pic_url) {
      await russyuroku.sendMessage(m.chat, { image: { url: d.profile_pic_url }, caption }, { quoted: m });
    } else {
      reply(caption);
    }
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal stalking Instagram: ${err.message}`);
  }
}
break

case "igstalk2": {
  if (!text) return example(`Masukkan username Instagram!\nContoh: ${prefix + command} instagram`);
  await russyuroku.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });
  try {
    const { data } = await axios.get(`https://api-faa.my.id/faa/igstalk?username=${encodeURIComponent(text)}`);
    if (!data.status || !data.result) return reply("❌ Username tidak ditemukan.");
    const r = data.result;
    let caption = `📷 *Instagram Stalker*\n\n👤 Username: ${r.username || text}\n📛 Nama: ${r.full_name || "-"}\n👥 Followers: ${r.follower_count ?? "-"}\n➡️ Following: ${r.following_count ?? "-"}\n📝 Bio: ${r.biography || "-"}`;
    if (r.profile_pic_url) {
      await russyuroku.sendMessage(m.chat, { image: { url: r.profile_pic_url }, caption }, { quoted: m });
    } else {
      reply(caption);
    }
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal stalking Instagram: ${err.message}`);
  }
}
break

case "ttstalk": {
  if (!text) return example(`Masukkan username TikTok!\nContoh: ${prefix + command} tiktok`);
  const usernameT = text.replace("@", "");
  await russyuroku.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

  try {
    const getSession = await axios.get("https://on4t.com/tiktok-username-analyzer", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const cookies = getSession.headers["set-cookie"];
    if (!cookies) return reply("❌ Gagal mendapatkan session dari server.");
    const cookieString = cookies.map((c) => c.split(";")[0]).join("; ");

    const html = getSession.data;
    const csrfMatch = html.match(/<meta name="csrf-token" content="(.*?)"/i);
    if (!csrfMatch) return reply("❌ Gagal mendapatkan token dari website.");
    const csrfToken = csrfMatch[1];

    const response = await axios.post(
      "https://on4t.com/tiktok-username-analyzer",
      { username: usernameT },
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          Referer: "https://on4t.com/tiktok-username-analyzer",
          "Content-Type": "application/json",
          Origin: "https://on4t.com",
          "X-CSRF-TOKEN": csrfToken,
          cookie: cookieString,
        },
      }
    );

    const d = response.data;
    if (!d || d.error) return reply("❌ Username tidak ditemukan.");

    let caption = `🎵 *TikTok Stalker*\n\n👤 Username: ${d.username || usernameT}\n📛 Nama: ${d.nickname || "-"}\n👥 Followers: ${d.followerCount ?? "-"}\n❤️ Likes: ${d.heartCount ?? "-"}\n📝 Bio: ${d.signature || "-"}`;

    if (d.avatarLarger) {
      await russyuroku.sendMessage(m.chat, { image: { url: d.avatarLarger }, caption }, { quoted: m });
    } else {
      reply(caption);
    }
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal stalking TikTok: ${err.message}`);
  }
}
break

case "ffstalk": {
  if (!text || isNaN(text)) return example(`Masukkan UID Free Fire (angka)!\nContoh: ${prefix + command} 225009777`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🎮", key: m.key } });
  try {
    const { data } = await axios.get(`https://api-faa.my.id/faa/ffstalk?id=${encodeURIComponent(text)}`);
    if (!data.status || !data.result) return reply("❌ UID tidak ditemukan.");
    const r = data.result;
    reply(`🎮 *Free Fire Stalker*\n\n👤 Nickname: ${r.nickname || r.name || "-"}\n🆔 UID: ${text}\n🏆 Level: ${r.level || "-"}\n🌐 Region: ${r.region || "-"}`);
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal stalking Free Fire: ${err.message}`);
  }
}
break

case "mlstalk": {
  if (!text || !text.includes("|")) return example(`Format: ${prefix + command} uid|zone\nContoh: ${prefix + command} 1422073161|15910`);
  const [uid, zone] = text.split("|");
  if (!uid || !zone) return reply("⚠️ Format salah! Gunakan: uid|zone");

  await russyuroku.sendMessage(m.chat, { react: { text: "🎮", key: m.key } });

  try {
    const { data } = await axios.get("https://api.mobapay.com/api/app_shop", {
      headers: { "content-type": "application/json" },
      params: {
        app_id: 100000,
        game_user_key: uid.trim(),
        game_server_key: zone.trim(),
        country: "ID",
        language: "en",
        shop_id: 1001,
      },
    });

    const nickname = data?.data?.role_name || data?.role_name;
    if (!nickname) return reply("❌ UID/Zone tidak ditemukan.");
    reply(`🎮 *Mobile Legends Stalker*\n\n👤 Nickname: ${nickname}\n🆔 UID: ${uid.trim()}\n🌐 Zone: ${zone.trim()}`);
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal stalking Mobile Legends: ${err.message}`);
  }
}
break

case "npmstalk": {
  if (!text) return example(`Masukkan nama package npm!\nContoh: ${prefix + command} axios`);
  await russyuroku.sendMessage(m.chat, { react: { text: "📦", key: m.key } });
  try {
    const { data } = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(text)}`);
    const latest = data["dist-tags"]?.latest;
    const latestInfo = data.versions?.[latest];
    reply(`📦 *NPM Stalker*\n\n📛 Nama: ${data.name}\n🔖 Versi Terbaru: ${latest}\n📝 Deskripsi: ${data.description || "-"}\n👤 Author: ${latestInfo?.author?.name || data.author?.name || "-"}\n📅 Dibuat: ${data.time?.created ? new Date(data.time.created).toLocaleDateString("id-ID") : "-"}\n🔄 Update Terakhir: ${data.time?.modified ? new Date(data.time.modified).toLocaleDateString("id-ID") : "-"}\n🔗 https://npmjs.com/package/${text}`);
  } catch (err) {
    console.error(err);
    reply(`❌ Package tidak ditemukan: ${err.message}`);
  }
}
break

case "ghstalk": {
  if (!text) return example(`Masukkan username GitHub!\nContoh: ${prefix + command} torvalds`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🐙", key: m.key } });
  try {
    const { data } = await axios.get(`https://api.github.com/users/${encodeURIComponent(text)}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (data.message === "Not Found") return reply("❌ Username GitHub tidak ditemukan.");

    let caption = `🐙 *GitHub Stalker*\n\n👤 Username: ${data.login}\n📛 Nama: ${data.name || "-"}\n📝 Bio: ${data.bio || "-"}\n📦 Repos: ${data.public_repos}\n👥 Followers: ${data.followers}\n➡️ Following: ${data.following}\n📍 Lokasi: ${data.location || "-"}\n🔗 ${data.html_url}`;

    await russyuroku.sendMessage(m.chat, { image: { url: data.avatar_url }, caption }, { quoted: m });
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal stalking GitHub: ${err.message}`);
  }
}
break

case "ytstalk": {
  if (!text) return example(`Masukkan username/handle YouTube!\nContoh: ${prefix + command} mrbeast`);
  await russyuroku.sendMessage(m.chat, { react: { text: "📺", key: m.key } });
  try {
    const { data } = await axios.get(`https://api.elrayyxml.web.id/api/stalker/youtube?username=${encodeURIComponent(text)}`);
    if (!data.status) return reply("❌ Channel tidak ditemukan.");
    const channel = data.result.channel;
    reply(`📺 *YouTube Stalker*\n\n👤 Username: ${channel.username}\n📛 Nama: ${channel.name || "-"}\n🔔 Subscribers: ${channel.subscriberCount}\n🎬 Total Video: ${channel.videoCount || "-"}\n📝 Deskripsi: ${(channel.description || "-").slice(0, 200)}`);
  } catch (err) {
    console.error(err);
    reply(`❌ Gagal stalking YouTube: ${err.message}`);
  }
}
break

case "brat": {
    if (!text) return reply(`📌 Contoh: ${prefix + command} Hai kak Saya ${global.namabot}`)

    const safeText = typeof text === 'string' ? text : String(text || '')
    if (safeText.length > 100) return reply('⚠️ Maksimal 100 karakter.')

    await russyuroku.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    try {
        const listBrat = {
            title: 'Jenis Brat',
            sections: [
                {
                    title: `Daftar Brat By ${global.namabot}`,
                    rows: [
                        { title: '🌿 Klasik',     id: `${prefix}bratimg ${safeText}`,    description: 'brat versi klasik 💬' },
                        { title: '🚀 HD',         id: `${prefix}brathd ${safeText}`,     description: 'brat resolusi tinggi 🔥' },
                        { title: '🍏 Green',      id: `${prefix}bratgreen ${safeText}`,  description: 'brat tema warna hijau 🟢' },
                        { title: '👧 Cewek',      id: `${prefix}bratcewek ${safeText}`,  description: 'brat versi cewek 🎀' },
                        { title: '🎎 Anime',      id: `${prefix}bratanime ${safeText}`,  description: 'brat versi gaya anime 🚺' },
                        { title: '🎬 Video',      id: `${prefix}bratvid ${safeText}`,    description: 'brat versi video/animasi 🎥' },
                        { title: '🥋 Gojo',       id: `${prefix}bratgojo ${safeText}`,   description: 'brat template Gojo 🌀' },
                        { title: '🩸 Vermeil',    id: `${prefix}bratvermeil ${safeText}`,description: 'brat template Vermeil 🔴' },
                        { title: '🧌 Bahlil',     id: `${prefix}bratbahlil ${safeText}`, description: 'brat template Bahlil 👤' },
                        { title: '🧵 Patrick',    id: `${prefix}bratpatrick ${safeText}`,description: 'brat template Patrick 🌟' },
                        { title: '🟨 Squidward',  id: `${prefix}bratsquidward ${safeText}`, description: 'brat template Squidward 🎷' },
                        { title: '⚪ White',      id: `${prefix}bratwhite ${safeText}`,  description: 'brat template White 🤍' },
                        { title: '🎀 Chika',      id: `${prefix}bratchika ${safeText}`,  description: 'brat template Chika 💗' },
                        { title: '📘 Kobato',     id: `${prefix}bratkobato ${safeText}`, description: 'brat template Kobato 📗' },
                        { title: '😵 Menhera',    id: `${prefix}bratmenhera ${safeText}`,description: 'brat template Menhera 💊' },
                        { title: '🦋 Nezuko',     id: `${prefix}bratnezuko ${safeText}`, description: 'brat template Nezuko 🎋' },
                        { title: '🧊 Qiqi',       id: `${prefix}bratqiqi ${safeText}`,   description: 'brat template Qiqi ❄️' },
                        { title: '🎏 Ruromiya',   id: `${prefix}bratruromiya ${safeText}`,description: 'brat template Ruromiya 🎏' },
                        { title: '🍥 Umaru',      id: `${prefix}bratumaru ${safeText}`,  description: 'brat template Umaru 🍙' }
                    ]
                }
            ]
        };

        await listbut2(m, `🔘 *Pilih jenis brat*\nSilakan pilih jenis efek brat yang ingin kamu gunakan untuk teks: *${safeText}*`, listBrat, m);
        await russyuroku.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
        console.error('[brat] error:', e?.message || e)
        await russyuroku.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        reply(global.mess.error)
    }
}
break

case "brathd": {
  if (!text) return example(`Contoh: *${prefix}brathd Hai semua*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    const res = await axios.get(`https://aqul-brat.hf.space/?text=${encodeURIComponent(text)}`, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/png,image/*,*/*;q=0.8",
        "Referer": "https://aqul-brat.hf.space/",
      },
    });
    await russyuroku.sendImageAsSticker(m.chat, Buffer.from(res.data), m, {
      packname: global.packname, author: global.author,
    });
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal membuat sticker brat HD, coba lagi nanti.");
  }
}
break

case "bratanime": {
  if (!text) return example(`Contoh: *${prefix}bratanime Hai semua*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    await russyuroku.sendImageAsSticker(m.chat, `https://api.nexray.web.id/maker/bratanime?text=${encodeURIComponent(text)}`, m, {
      packname: global.packname, author: global.author,
    });
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal membuat sticker brat anime, coba lagi nanti.");
  }
}
break

case "bratvid": {
  if (!text) return example(`Contoh: *${prefix}bratvid Hai semua*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    await russyuroku.sendVideoAsSticker(m.chat, `https://api-faa.my.id/faa/bratvid?text=${encodeURIComponent(text)}`, m, {
      packname: global.packname, author: global.author,
    });
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal membuat sticker brat video, coba lagi nanti.");
  }
}
break

case "bratbahlil": {
  if (!text) return example(`Contoh: *${prefix}bratbahlil Hai semua*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    const tpl = CHAR_TEMPLATES.bratbahlil;
    const buffer = await drawBrat({
      text, bgUrl: tpl.url, centerX: tpl.centerX, centerY: tpl.centerY,
      maxWidth: tpl.maxWidth, maxHeight: tpl.maxHeight, rotationAngle: tpl.rotationAngle || 0,
      maxFontSize: tpl.maxFontSize, minFontSize: tpl.minFontSize, fontDecrement: 2,
      lineHeightMult: 1.3, textColor: "#000000",
    });
    await russyuroku.sendImageAsSticker(m.chat, buffer, m, { packname: global.packname, author: global.author });
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    console.error("[bratbahlil] error:", e);
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal membuat sticker, coba lagi nanti.");
  }
}
break

case "sticker":
case "stiker":
case "sgif":
case "s": {
  if (!/image|video|webp/.test(mime)) return example("Kirim atau reply gambar/video (maks 15 detik)");

  if (/video/.test(mime) && (qmsg?.seconds > 15)) {
    return reply("✖️ Durasi video maksimal 15 detik.");
  }

  await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } });

  let media;
  try {

    media = await russyuroku.downloadAndSaveMediaMessage(qmsg);

    if (/image|webp/.test(mime)) {
      await russyuroku.sendImageAsSticker(
        m.chat,
        media,
        m,
        { packname: global.packname, author: global.author }
      );
    } else if (/video/.test(mime)) {
      await russyuroku.sendVideoAsSticker(
        m.chat,
        media,
        m,
        { packname: global.packname, author: global.author }
      );
    } else {
      return reply("✖️ Format tidak didukung. Kirim gambar atau video pendek.");
    }

  } catch (e) {
    console.error("sticker cmd error:", e);
    reply("✖️ Terjadi kesalahan saat mengeksekusi perintah.");
  } finally {
    try { if (media && fs.existsSync(media)) fs.unlinkSync(media); } catch {}
  }
}
break

case "bratimg": {
  if (!text) return example(`Contoh: *${prefix}bratimg Hai semua*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    await russyuroku.sendImageAsSticker(m.chat, `https://api.nexray.eu.cc/maker/brat?text=${encodeURIComponent(text)}`, m, {
      packname: global.packname, author: global.author,
    });
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal membuat sticker brat, coba lagi nanti.");
  }
}
break

case "bratcewek": {
  if (!text) return example(`Contoh: *${prefix}bratcewek Hai semua*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    await russyuroku.sendImageAsSticker(m.chat, `https://api.deline.web.id/maker/cewekbrat?text=${encodeURIComponent(text)}`, m, {
      packname: global.packname, author: global.author,
    });
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal membuat sticker brat cewek, coba lagi nanti.");
  }
}
break

case "bratvid2":
case "bratgif":
case "bratvideo": {
  if (!text) return example(`Contoh: *${prefix}${command} Hai semua*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    await russyuroku.sendVideoAsSticker(m.chat, `https://api-faa.my.id/faa/bratvid?text=${encodeURIComponent(text)}`, m, {
      packname: global.packname, author: global.author,
    });
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal membuat sticker brat video, coba lagi nanti.");
  }
}
break

case "bratgreen":
case "brat2": {
  if (!text) return example(`Contoh: *${prefix}bratgreen Hai semua*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    const buffer = await drawBrat({
      text, bgColor: "#8ACE00", width: 512, height: 512,
      maxWidth: 450, maxHeight: 450, centerX: 256, centerY: 256,
      maxFontSize: 130, fontDecrement: 5, lineHeightMult: 1.1, textColor: "#000000",
    });
    await russyuroku.sendImageAsSticker(m.chat, buffer, m, { packname: global.packname, author: global.author });
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    console.error("[bratgreen] error:", e);
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal membuat sticker brat green, coba lagi nanti.");
  }
}
break

case "bratgojo":
case "bratvermeil": {
  if (!text) return example(`Contoh: *${prefix}${command} Hai semua*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    const tpl = HD_TEMPLATES[command];
    const buffer = await drawBrat({
      text, bgUrl: tpl.url, width: tpl.width, height: tpl.height,
      centerX: tpl.centerX, centerY: tpl.centerY, maxWidth: tpl.maxWidth, maxHeight: tpl.maxHeight,
      maxFontSize: tpl.maxFontSize, minFontSize: tpl.minFontSize, lineHeightMult: 1.18,
      textColor: "#111111", useCustomFont: true,
    });
    await russyuroku.sendImageAsSticker(m.chat, buffer, m, { packname: global.packname, author: global.author });
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    console.error(`[${command}] error:`, e);
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal membuat sticker, coba lagi nanti.");
  }
}
break

case "bratpatrick":
case "bratsquidward":
case "bratwhite":
case "bratchika":
case "bratkobato":
case "bratmenhera":
case "bratnezuko":
case "bratqiqi":
case "bratruromiya":
case "bratumaru": {
  if (!text) return example(`Contoh: *${prefix}${command} Hai semua*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    const tpl = CHAR_TEMPLATES[command];
    const buffer = await drawBrat({
      text, bgUrl: tpl.url, centerX: tpl.centerX, centerY: tpl.centerY,
      maxWidth: tpl.maxWidth, maxHeight: tpl.maxHeight, rotationAngle: tpl.rotationAngle || 0,
      maxFontSize: tpl.maxFontSize, minFontSize: tpl.minFontSize, fontDecrement: 2,
      lineHeightMult: 1.3, textColor: "#000000",
    });
    await russyuroku.sendImageAsSticker(m.chat, buffer, m, { packname: global.packname, author: global.author });
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    console.error(`[${command}] error:`, e);
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal membuat sticker, coba lagi nanti.");
  }
}
break

case "ptvsearch":
case "ptvs": {
  if (!text) return example(`Contoh: *${prefix}ptvsearch anime*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });
  try {
    const videos = await tiktokSearchVideo(text);
    if (!videos || !videos.length) {
      await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return reply(`❌ Tidak ditemukan video untuk: ${text}`);
    }
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    await russyuroku.sendMessage(m.chat, { video: { url: randomVideo.link }, mimetype: "video/mp4", ptv: true }, { quoted: m });
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    console.error("[ptvsearch] error:", e);
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal mencari video TikTok, coba lagi nanti.");
  }
}
break

case "soundcloud":
case "scsearch":
case "scs": {
  if (!text) return example(`Contoh: *${prefix}soundcloud Only We Know*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    const data = await soundcloudSearch(text);
    if (!data.length) {
      await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return reply(`❌ Lagu tidak ditemukan untuk: ${text}`);
    }
    const thumb = data.find((v) => v.artwork)?.artwork || null;
    const limit = Math.min(data.length, 5);
    let caption = `🎧 *HASIL PENCARIAN SOUNDCLOUD*\n\n`;
    for (let i = 0; i < limit; i++) {
      caption += `🎵 *${data[i].title}*\n🔗 ${data[i].url}\n👁️ ${data[i].plays} • ❤️ ${data[i].likes} • 💬 ${data[i].comments}\n\n`;
    }
    if (thumb) {
      await russyuroku.sendMessage(m.chat, { image: { url: thumb }, caption: caption.trim() }, { quoted: m });
    } else {
      reply(caption.trim());
    }
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    console.error("[soundcloud] error:", e);
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Gagal mencari lagu SoundCloud, coba lagi nanti.");
  }
}
break

case "wikipedia":
case "wiki":
case "wp": {
  if (!text) return example(`Contoh: *${prefix}wikipedia Indonesia*`);
  await russyuroku.sendMessage(m.chat, { react: { text: "🕕", key: m.key } });
  try {
    const r = await wikipediaSearch(text);
    if (!r) {
      await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return reply(`⚠️ Artikel tentang *${text}* tidak ditemukan di Wikipedia.`);
    }
    let caption = `📚 *WIKIPEDIA SEARCH*\n\n*Judul:* ${r.title}\n`;
    if (r.description) caption += `*Deskripsi:* ${r.description}\n`;
    caption += `\n*Ringkasan:*\n${(r.extract || "Tidak ada ringkasan tersedia.").slice(0, 1200)}\n`;
    if (Object.keys(r.infobox).length) {
      caption += `\n*Info Tambahan:*\n`;
      let count = 0;
      for (const [k, v] of Object.entries(r.infobox)) {
        if (count >= 5) break;
        caption += `- ${k}: ${v}\n`;
        count++;
      }
    }
    caption += `\n🔗 *Selengkapnya:* ${r.url}`;
    if (r.image) {
      await russyuroku.sendMessage(m.chat, { image: { url: r.image }, caption }, { quoted: m });
    } else {
      reply(caption);
    }
    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    console.error("[wikipedia] error:", e);
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("✖️ Terjadi kesalahan saat mencari artikel di Wikipedia.");
  }
}
break

case "smeme": {
  if (!/image|webp/.test(mime)) {
    return example("Kirim atau reply gambar/webp dengan teks atas|bawah");
  }

  let [atas, bawah] = text.split("|");
  if (!atas) return example("teksatas|teksbawah (teks bawah opsional)");

  await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } });

  let media, uploadedUrl, tempFile;
  try {

    media = await russyuroku.downloadAndSaveMediaMessage(qmsg);
    tempFile = media;

    uploadedUrl = await uploader.auto(tempFile);

    const apiUrl = `https://api.ryuu-dev.offc.my.id/tools/smeme?img=${encodeURIComponent(uploadedUrl)}&atas=${encodeURIComponent(atas)}&bawah=${encodeURIComponent(bawah || "")}`;
    const { data } = await axios.get(apiUrl, { responseType: "arraybuffer" });

    await russyuroku.sendImageAsSticker(
      m.chat,
      data,
      m,
      { packname: global.packname, author: global.author }
    );

  } catch (err) {
    console.error("❌ smeme cmd error:", err);
    reply(`✖️ Terjadi kesalahan saat membuat meme:\n${err.message || err}`);
  } finally {

    try {
      if (tempFile && fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    } catch (cleanupErr) {
      console.error("Gagal hapus file temp:", cleanupErr);
    }
  }
}
break

case "qc": {
  let qcText, qcName, qcSenderJid;

  if (m.quoted) {
    qcText = m.quoted.text || m.quoted.caption || "";

    if (!qcText) {
      return example("Balas pesan yang ada tulisannya, atau ketik .qc <teks>");
    }

    qcSenderJid = m.quoted.sender;
    qcName =
      (await russyuroku.getName(qcSenderJid)) ||
      qcSenderJid?.split("@")[0] ||
      "User";
  } else {
    if (!text) {
      return example("teksnya (atau reply pesan orang untuk dijadikan qc)");
    }

    qcText = text;
    qcSenderJid = m.sender;
    qcName = m.pushName || "User";
  }

  let avatarUrl;

  try {
    avatarUrl = await russyuroku.profilePictureUrl(
      qcSenderJid,
      "image"
    );
  } catch {
    avatarUrl = global.noProfileImg;
  }

  if (!avatarUrl) {
    avatarUrl = global.noProfileImg;
  }

  await russyuroku.sendMessage(m.chat, {
    react: {
      text: "✨",
      key: m.key
    }
  });

  let tempnya;

  try {

    const { data: qcData } = await axios.get(
      "https://api-faa.my.id/faa/qc-black",
      {
        params: {
          q: qcText,
          username: qcName,
          avatar: avatarUrl
        },
        headers: {
          accept: "application/json"
        },
        timeout: 30000
      }
    );

    if (!qcData?.status || !qcData?.result?.qc_image) {
      console.error("QC API:", qcData);
      return reply("✖️ API QC Black gagal membuat gambar.");
    }

    const qcImageUrl = qcData.result.qc_image;

    const { data: imageData } = await axios.get(
      qcImageUrl,
      {
        responseType: "arraybuffer",
        timeout: 30000
      }
    );

    const buffer = Buffer.from(imageData);

    if (!buffer.length) {
      return reply("✖️ Gambar QC kosong.");
    }

    tempnya = `./library/database/qc-${Date.now()}.png`;

    await fs.promises.writeFile(tempnya, buffer);

    await russyuroku.sendImageAsSticker(
      m.chat,
      tempnya,
      m,
      {
        packname: global.packname,
        author: global.author
      }
    );

  } catch (err) {
    console.error("qc-black cmd error:", err);

    reply(
      `✖️ Gagal membuat QC Black.\n${err.message || "Unknown error"}`
    );
  } finally {
    try {
      if (tempnya && fs.existsSync(tempnya)) {
        fs.unlinkSync(tempnya);
      }
    } catch {}
  }
}
break;

case "setppbot": case "setpp": {
if (!isCreator) return larang();
if (/image/g.test(mime)) {
let media = await russyuroku.downloadAndSaveMediaMessage(qmsg)
await russyuroku.updateProfilePicture(botNumber, {url: media})
await fs.unlinkSync(media)
reply("*Berhasil Mengganti Profil ✅*")
} else return example("dengan mengirim foto")
}
break

case "setnamabot": {
if (!isCreator) return larang();
if (!text) return example("teksnya")
russyuroku.updateProfileName(text)
reply("*Berhasil Mengganti Nama Bot ✅*")
}
break

case "setbio": case "setbiobot": {
if (!isCreator) return larang();
if (!text) return example("teksnya")
russyuroku.updateProfileStatus(text)
reply("*Berhasil Mengganti Bio Bot ✅*")
}
break

case "self": {
if (!isCreator) return reply(mess.creator)

global.owneronly = true
russyuroku.public = false

let file = path.join(process.cwd(), "settings.js")
let text = fs.readFileSync(file, "utf8")

text = text.replace(/global\.owneronly\s*=\s*(true|false)/, "global.owneronly = true")

fs.writeFileSync(file, text)

reply("*Berhasil Mengganti Mode ✅*\nMode Bot Beralih Ke *Self*")
}
break

case "public": {
if (!isCreator) return larang()

global.owneronly = false
russyuroku.public = true

let file = path.join(process.cwd(), "settings.js")
let text = fs.readFileSync(file, "utf8")

text = text.replace(/global\.owneronly\s*=\s*(true|false)/, "global.owneronly = false")

fs.writeFileSync(file, text)

reply("*Berhasil Mengganti Mode ✅*\nMode Bot Beralih Ke *Public*")
}
break

case "onlygroup": {
if (!isCreator) return reply(mess.creator)
if (!text) {
  return reply(`⚙️ *Mode Hanya Grup Saat Ini: ${isOnlyGroupMode() ? 'AKTIF ✅' : 'NONAKTIF ❌'}*\n\nGunakan:\n${prefix}onlygroup on - Bot hanya respon di grup\n${prefix}onlygroup off - Bot respon di PM & grup`)
}
const nilai = text.trim().toLowerCase()
if (nilai !== 'on' && nilai !== 'off') return reply(`⚠️ Gunakan *${prefix}onlygroup on* atau *${prefix}onlygroup off*`)
setOnlyGroupMode(nilai === 'on')
reply(`✅ Mode *Hanya Grup* ${nilai === 'on' ? 'diaktifkan' : 'dinonaktifkan'}.`)
}
break

case "autocorrect": {
if (!isCreator) return reply(mess.creator)
if (!text) {
  return reply(`⚙️ *Autocorrect Command Saat Ini: ${isAutoCorrectOn() ? 'AKTIF ✅' : 'NONAKTIF ❌'}*\n\nGunakan:\n${prefix}autocorrect on\n${prefix}autocorrect off`)
}
const nilai = text.trim().toLowerCase()
if (nilai !== 'on' && nilai !== 'off') return reply(`⚠️ Gunakan *${prefix}autocorrect on* atau *${prefix}autocorrect off*`)
setAutoCorrect(nilai === 'on')
reply(`✅ Autocorrect command ${nilai === 'on' ? 'diaktifkan' : 'dinonaktifkan'}.`)
}
break

case "pinchat": {
if (!isCreator) return larang()
if (m.isGroup) return reply(mess?.private || "*Fitur ini hanya bisa dipakai di chat pribadi*")
await russyuroku.chatModify({ pin: true }, m.chat)
reply("*Berhasil pin chat ini*")
}
break

case "unpinchat": {
if (!isCreator) return larang()
if (m.isGroup) return reply(mess?.private || "*Fitur ini hanya bisa dipakai di chat pribadi*")
await russyuroku.chatModify({ pin: false }, m.chat)
reply("*Berhasil unpin chat ini*")
}
break

case "getcase": {
   if (!isCreator) return larang();
   if (!text) return example("menu")

   const getcase = (cases) => {
      let data = fs.readFileSync('./yuroku.js', 'utf-8')
      let regex = new RegExp(`case ['"]${cases}['"]([\\s\\S]*?)break`, "i")
      let hasil = data.match(regex)
      return hasil ? hasil[0] : null
   }

   let result = getcase(text)
   if (!result) return reply(`❌ Case *${text}* Tidak Ditemukan`)

   await russyuroku.messageBuilder(m.chat, { quoted: m })
      .setType('AIRich')
      .setTitle(`Get Case`)
      .addText(`Nama: ${text}\nUkuran: ${result.length} karakter`)
      .addCode('javascript', result)
      .addSource([
         [global.image.favicon, 'https://saurusdev.cloud', 'Lunar Saurus'],
         [global.image.favicon, 'https://www.youtube.com/@sauruskinggwuw', 'Lunar Saurus Empire'],
      ])
      .send()
}
break

case "getplugin": {
   if (!isCreator) return larang();
   if (!text) return example("removebg")

   const pluginsDir = path.resolve(__dirname, "plugins")
   const fileName = text.replace(/\.js$/i, "").trim()
   let filePath = path.join(pluginsDir, `${fileName}.js`)

   if (!fs.existsSync(filePath)) {
      const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith(".js"))
      const matched = files.find(f => {
         const content = fs.readFileSync(path.join(pluginsDir, f), "utf-8")
         const regex = new RegExp(`command\\s*=\\s*\\[[^\\]]*['"]${fileName}['"]`, "i")
         return regex.test(content)
      })
      if (matched) filePath = path.join(pluginsDir, matched)
   }

   if (!fs.existsSync(filePath)) return reply(`❌ Plugin *${text}* Tidak Ditemukan`)

   const result = fs.readFileSync(filePath, "utf-8")
   const displayName = path.basename(filePath)

   await russyuroku.messageBuilder(m.chat, { quoted: m })
      .setType('AIRich')
      .setTitle(`Get Plugin`)
      .addText(`Nama: ${displayName}\nUkuran: ${result.length} karakter`)
      .addCode('javascript', result)
      .addSource([
         [global.image.favicon, 'https://saurusdev.cloud', 'Lunar Saurus'],
         [global.image.favicon, 'https://www.youtube.com/@sauruskinggwuw', 'Lunar Saurus Empire'],
      ])
      .send()
}
break

case "listplugin": case "listplugins": case "lp": {
   if (!isCreator) return larang();

   await russyuroku.sendMessage(m.chat, { react: { text: "📋", key: m.key } });

   const pluginsDir = path.resolve(__dirname, "plugins")
   const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith(".js")).sort()

   if (!files.length) return reply("❌ Belum ada plugin di folder plugins.")

   const allPlugins = await getPlugins()

   const grouped = {}
   const failed = []

   for (const file of files) {
      const filePath = path.join(pluginsDir, file)
      let content = ""
      try { content = fs.readFileSync(filePath, "utf-8") } catch {}

      const matchCmd = content.match(/command\s*=\s*\[([^\]]*)\]/)
      const matchTags = content.match(/tags\s*=\s*\[([^\]]*)\]/)
      const commands = matchCmd
         ? matchCmd[1].split(",").map(v => v.trim().replace(/['"`]/g, "")).filter(Boolean)
         : []
      const tags = matchTags
         ? matchTags[1].split(",").map(v => v.trim().replace(/['"`]/g, "")).filter(Boolean)
         : ["lainnya"]

      const isLoaded = allPlugins.some(p => p.command?.some(c => commands.includes(c)))
      if (!isLoaded && commands.length) {
         failed.push(file)
         continue
      }

      const tag = tags[0] || "lainnya"
      if (!grouped[tag]) grouped[tag] = []
      grouped[tag].push({ file, commands })
   }

   let teks = `📋 *Daftar Plugin Terinstall*\nTotal: ${files.length} file\n\n`

   for (const tag of Object.keys(grouped).sort()) {
      teks += `╭─「 *${tag.toUpperCase()}* 」\n`
      for (const p of grouped[tag]) {
         const cmdList = p.commands.length ? p.commands.join(", ") : "-"
         teks += `│ • ${p.file}\n│   ↳ ${cmdList}\n`
      }
      teks += `╰────────────\n\n`
   }

   if (failed.length) {
      teks += `⚠️ *Gagal Dimuat* (cek error dengan console/log)\n`
      teks += failed.map(f => `• ${f}`).join("\n")
      teks += "\n\n"
   }

   teks += `Ketik *${prefix}getplugin <nama>* untuk lihat source code satu plugin.`

   await russyuroku.sendMessage(m.chat, {
      text: teks.trim(),
      ...previewAd({
         title: `${global.namabot} • Plugin List`,
         body: `Total ${files.length} plugin terpasang.`,
         thumbnail: randomThumbUrl,
         sourceUrl: global.web,
         mention: [m.sender],
         forward: true,
         largerThumbnail: true,
      }),
   }, { quoted: m })
}
break

case "saveplugin": case "saveplugins": case "sp": {
   if (!isCreator) return larang();

   const isDocument = m.quoted?.mtype === "documentMessage" || m.quoted?.mimetype === "application/javascript" || m.quoted?.fileName?.endsWith?.(".js")
   const hasQuotedText = !!m.quoted?.text

   if (!m.quoted || (!isDocument && !hasQuotedText)) {
      return example("namafile.js (reply source code atau reply file .js)")
   }

   let fileName = (text || "").trim()
   if (!fileName && isDocument && m.quoted?.fileName) fileName = m.quoted.fileName
   if (!fileName) return example("namafile.js (reply source code atau reply file .js)")
   fileName = fileName.replace(/[/\\]/g, "").trim()
   if (!fileName.endsWith(".js")) fileName += ".js"

   const pluginsDir = path.resolve(__dirname, "plugins")
   const destPath = path.join(pluginsDir, fileName)

   const sudahAda = fs.existsSync(destPath)
   const overwrite = /^(overwrite|timpa|replace)$/i.test(args[args.length - 1] || "")

   if (sudahAda && !overwrite) {
      return reply(`⚠️ Plugin *${fileName}* sudah ada.\n\nKetik *${prefix}${command} ${fileName} overwrite* kalau mau menimpanya.`)
   }

   await russyuroku.sendMessage(m.chat, { react: { text: "💾", key: m.key } });

   try {
      let sourceCode
      if (isDocument) {
         const buffer = await russyuroku.downloadMediaMessage(m.quoted)
         sourceCode = buffer.toString("utf-8")
      } else {
         sourceCode = m.quoted.text
      }

      if (!sourceCode || !sourceCode.trim()) {
         return reply("❌ Isi plugin kosong, tidak jadi disimpan.")
      }

      try {
         new Function(sourceCode)
      } catch (syntaxErr) {
         return reply(`❌ Gagal menyimpan: kode punya syntax error.\n\n${syntaxErr.message}`)
      }

      fs.writeFileSync(destPath, sourceCode, "utf-8")

      pluginsSignatureCache = ""

      return reply(
         `✅ Berhasil ${sudahAda ? "menimpa" : "menyimpan"} plugin *${fileName}*\n` +
         `📦 Ukuran: ${sourceCode.length} karakter\n\n` +
         `Ketik *${prefix}listplugin* untuk lihat daftar plugin, atau *${prefix}getplugin ${fileName.replace(/\.js$/, "")}* untuk cek isinya.`
      )
   } catch (err) {
      console.error(err)
      return reply(`❌ Gagal menyimpan plugin: ${err.message}`)
   }
}
break

case 'bcgc':
case 'bcgroup': {
if (!isCreator) return larang();
if (!text) return example(`teksnya`)
  let getGroups = await russyuroku.groupFetchAllParticipating()
  let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
  let anu = groups.map(v => v.id)
reply(`Mengirim Broadcast Ke ${anu.length} Group Chat, Waktu Selesai ${anu.length * 1.5} detik`)
for (let i of anu) {
await sleep(global.delayJpm)
  let a = '```' + `\n\n${text}\n\n` + '```' + '\n\n\nʙʀᴏᴀᴅᴄᴀsᴛ'
russyuroku.sendMessage(i, {
  text: a,
   ...previewAd({
            title: `Broadcast By ${namabot}`,
            body: `Telah Terkirim Ke ${anu.length} Group`,
            thumbnail: global.image.broadcast,
            sourceUrl: global.web,
            largerThumbnail: true,
                    })
                })
                }
reply(`Sukses Mengirim Broadcast Ke ${anu.length} Group`)
}
break

case "tutor":
case "tutorial": {
let ttutor = `
📦 *PUSH KONTAK GRUP TERBUKA*
Digunakan untuk push kontak dari dalam grup itu sendiri (terbuka), tanpa ID grup.

🔸 *.pushkontak teksmu*
🔸 *.pushkontak2 teksmu*
🔸 *.pushkontak3 jeda|teksmu*

📌 *Catatan:*
- Kirim perintah langsung di dalam grup target.
- *jeda* adalah delay per kontak. Contoh: \`1000 = 1 detik\`.
- Auto-save hanya berlaku untuk *.pushkontak2* dan *.pushkontak3*.
- *pushkontak* biasa hanya mengirim tanpa simpan kontak.

📡 *PUSH KONTAK GRUP TERTUTUP*
Digunakan untuk push kontak dari luar grup, menggunakan ID grup manual.

🔸 *.pushkontakid idgc|teksmu*
🔸 *.pushkontakid2 idgc|teksmu*
🔸 *.pushkontakid3 idgc|jeda|teksmu*

📌 *Contoh:*
\`\`\`
.pushkontakid2 1203xxx@g.us|Save saya
.pushkontakid3 1203xxx@g.us|1500|Save saya
\`\`\`

📌 *Catatan:*
- Ketik *.listgc* atau *.cekidgc* untuk melihat ID grup.
- pushkontakid tidak auto-save, pushkontakid2 dan pushkontak3 auto-save.
- *pushkontakid3* paling advance karena ada delay dan nama kontak!

💾 *SAVE KONTAK (AUTO / MANUAL)*
Digunakan untuk menyimpan kontak member grup sebelum push.

🔸 *.savekontak idgc|nama* (private message)
🔸 *.savekontak nama* (dalam grup)

📌 *Contoh:*
\`\`\`
.savekontak 1203xxx@g.us|buyerku
.savekontak buyerku
\`\`\`

📣 *JPM / BROADCAST GROUP CHAT*
Digunakan untuk mengirim pesan ke seluruh grup, dengan atau tanpa tag.

🔸 *.jpm teksmu* — Kirim pesan biasa
🔸 *.jpmht teksmu* — Kirim pesan + mention semua anggota
🔸 *.bljpm on/off|<angka>* (private message)
🔸 *.bljpm on/off* (dalam grup)

*Auto Jpm Beta*
.autojpm on
.autojpm off
.autojpm add <teks/caption> (reply gambar/video jika ada media)
.autojpm del <nomor/all>
.autojpm set <angka> menit/jam/hari

📌 *Tips:*
- Kamu bisa kirim media juga, dengan reply atau caption media + cmd.
- Hindari spam *.jpmht* agar tidak mengganggu member 🙏

⚠️ *PERINGATAN DAN SARAN:*
- Jangan push terlalu cepat, bisa kena limit WhatsApp!
- Gunakan jeda minimal \`6000 ms\` (6 detik) agar lebih aman.
- Simpan kontak dulu sebelum push untuk memperbesar deliver rate & menghindari blokir.

_*© Lunar Saurus 2026*_
  `
await russyuroku.sendMessage(m.chat, {
  text: ttutor,
  ...previewAd({
    title: `© ${namabot} - v${version}`,
    body: `Runtime : ${runtime(process.uptime())}`,
    thumbnail: img,
    sourceUrl: global.web,
    mention: [m.sender],
    forward: true,
    largerThumbnail: false,
  })
}, { quoted: qtutkentut });
}
break

case 'pushkontak': {
  if (!isGroup) return reply(mess.group);
  if (!isCreator) return larang();

  const groupMetadata = await cachedGroupMeta(from);
  const participants = groupMetadata.participants;

  if (!text) return example('Save Namaku!');

  const pesan = text.trim();
  let success = 0;
  let failed = 0;
  const total = participants.length;
  let isAborted = false;

  const progMsg = await russyuroku.sendMessage(m.chat, {
    text: `*⏳ Memulai push kontak...*\nTarget: ${total} kontak\n\n⚠️ Jangan spam atau pakai command berat (seperti JPM) selama push berlangsung!`
  }, { quoted: m });

  for (let i = 0; i < participants.length; i++) {
    const member = participants[i];

    if (!russyuroku.ws?.isOpen) {
      isAborted = true;
      console.log(`⚠️  Pushkontak dihentikan di kontak ke-${i+1}: socket disconnect`);
      break;
    }

    try {
      await russyuroku.sendMessage(member.id, { text: pesan }, { quoted: qtutkentut });
      success++;
    } catch (e) {
      failed++;
      const errMsg = e.message || '';
      if (errMsg.includes('Connection Closed') || errMsg.includes('stream') || errMsg.includes('timed out')) {
        isAborted = true;
        break;
      }
    }
    await sleep(global.delayPushkontak || 1500);

    const percent = Math.floor(((i + 1) / total) * 100);
    if (percent % 20 === 0 || i + 1 === total) {
      const bar = makeProgressBar(i + 1, total);
      try {
        await russyuroku.sendMessage(m.chat, {
          text: `*Progres Push Kontak*\n${i + 1}/${total} kontak\n${bar}\n\n⚠️ Jangan spam atau jalankan command lain dulu.`
        }, { edit: progMsg.key });
      } catch {}
    }
  }

  const finalText = isAborted
    ? `*⚠️ Push Kontak Terhenti!* (koneksi putus)\nTerkirim: ${success} | Gagal: ${failed}`
    : `*✅ Push Kontak Selesai!*\n\nTotal: ${total}\nBerhasil: ${success}\nGagal: ${failed}\n\n_(Opsional: pakai *.savekontak* untuk simpan kontak)_`;

  await russyuroku.sendMessage(m.chat, { text: finalText }, { quoted: m });
}
break

case 'pushkontak2': {
  if (!isGroup) return reply(mess.group);
  if (!isCreator) return larang();

  const groupMetadata = await cachedGroupMeta(from);
  const participants = groupMetadata.participants || [];

  if (!text) return example('Save Namaku!');

  const pesan = text.trim();
  let success = 0;
  let failed = 0;
  const total = participants.length;
  let vcfList = '';
  let isAborted = false;

  const progMsg = await russyuroku.sendMessage(m.chat, {
    text: `*⏳ Memulai push kontak (mode VCF)...*\nTarget: ${total} kontak\n\n⚠️ Jangan spam atau pakai command berat selama push berlangsung!`
  }, { quoted: m });

  for (let i = 0; i < participants.length; i++) {
    const member = participants[i];

    if (!russyuroku.ws?.isOpen) { isAborted = true; break; }

    try {
      await russyuroku.sendMessage(member.id, { text: pesan }, { quoted: qtutkentut });
      success++;
      if (member.phoneNumber) {
        const nomor = member.phoneNumber.split('@')[0];
        vcfList += `BEGIN:VCARD
VERSION:3.0
FN:${global.namakontak || 'Contact'} - ${nomor}
TEL;type=CELL;type=VOICE;waid=${nomor}:+${nomor}
END:VCARD

`;
      }
    } catch (e) {
      failed++;
      const em = e.message || '';
      if (em.includes('Connection Closed') || em.includes('stream') || em.includes('timed out')) { isAborted = true; break; }
    }

    await sleep(global.delayPushkontak || 1500);

    const percent = Math.floor(((i + 1) / total) * 100);
    if (percent % 20 === 0 || i + 1 === total) {
      const bar = makeProgressBar(i + 1, total);
      try { await russyuroku.sendMessage(m.chat, { text: `*Progres Push Kontak (VCF)*\n${i + 1}/${total} kontak\n${bar}\n\n⚠️ Jangan jalankan command berat lain dulu.` }, { edit: progMsg.key }); } catch {}
    }
  }

  if (vcfList) {
    const vcfPath = `./library/database/contacts.vcf`;
    fs.writeFileSync(vcfPath, vcfList);
    await russyuroku.sendMessage(m.sender, {
      document: fs.readFileSync(vcfPath),
      fileName: `KontakGrup-${groupMetadata.subject}.vcf`,
      mimetype: 'text/x-vcard',
      caption: `*${isAborted ? '⚠️ Push Kontak Terhenti!' : '✅ Push Kontak Selesai!'}*\nGrup: ${groupMetadata.subject}\nTotal: ${total}\nBerhasil: ${success}\nGagal: ${failed}`
    }, { quoted: m });
    try { fs.unlinkSync(vcfPath); } catch {}
  }
}
break

case 'pushkontak3': {
  if (!isCreator) return larang();
  if (!text.includes('|')) return example(`jeda(ms)|pesan\n\n*Contoh:* 1000|Halo semua`);

  const [jedaStr, ...pesanArr] = text.split('|');
  const delay = Number(jedaStr.trim());
  const pesan = pesanArr.join('|').trim();
  if (isNaN(delay) || !pesan) return reply("Format salah!");

  const groupMetadata = await cachedGroupMeta(m.chat);
  const participants = groupMetadata.participants || [];
  const total = participants.length;

  let success = 0, failed = 0;
  let vcfList = '';
  let isAborted = false;

  const progMsg = await russyuroku.sendMessage(m.chat, {
    text: `*⏳ Broadcast dimulai...*\nTarget: ${total} kontak\nDelay: ${delay}ms\n\n⚠️ Jangan spam/jalankan command lain dulu.`
  }, { quoted: m });

  for (let i = 0; i < participants.length; i++) {
    const member = participants[i];

    if (!russyuroku.ws?.isOpen) { isAborted = true; break; }

    try {
      await russyuroku.sendMessage(member.id, { text: pesan }, { quoted: qtutkentut });
      success++;
      if (member.phoneNumber) {
        const nomor = member.phoneNumber.split('@')[0];
        vcfList += `BEGIN:VCARD
VERSION:3.0
FN:${global.namakontak || 'Contact'} - ${nomor}
TEL;type=CELL;type=VOICE;waid=${nomor}:+${nomor}
END:VCARD

`;
      }
    } catch (e) {
      failed++;
      const em = e.message || '';
      if (em.includes('Connection Closed') || em.includes('stream') || em.includes('timed out')) { isAborted = true; break; }
    }

    await sleep(delay);

    const percent = Math.floor(((i + 1) / total) * 100);
    if (percent % 20 === 0 || i + 1 === total) {
      const bar = makeProgressBar(i + 1, total);
      try { await russyuroku.sendMessage(m.chat, { text: `*Progres Broadcast*\n${i + 1}/${total} kontak\n${bar}\n\n⚠️ Jangan jalankan command berat lain dulu.` }, { edit: progMsg.key }); } catch {}
    }
  }

  if (vcfList) {
    const vcfPath = './library/database/push_contacts.vcf';
    fs.writeFileSync(vcfPath, vcfList);
    await russyuroku.sendMessage(m.sender, {
      document: fs.readFileSync(vcfPath),
      mimetype: 'text/x-vcard',
      fileName: 'PushKontak.vcf',
      caption: `*${isAborted ? '⚠️ Broadcast Terhenti!' : '✅ Broadcast selesai!'}*\nTotal: ${total}\nSukses: ${success}\nGagal: ${failed}`
    }, { quoted: m });
    try { fs.unlinkSync(vcfPath); } catch {}
  }
}
break

case 'pushkontakid': {
  if (!isCreator) return larang();

  const args = text.split('|');
  if (args.length < 2) return example(`<id_grup>|<pesan>\nKetik *.listgc* untuk menampilkan ID grup`);

  const groupId = args[0].trim();
  const pesan = args[1].trim();

  try {
    const groupMetadata = await cachedGroupMeta(groupId);
    const participants = groupMetadata.participants;

    let success = 0;
    let failed = 0;
    const total = participants.length;
    let vcfList = '';

    const progMsg = await russyuroku.sendMessage(m.chat, {
      text: `*⏳ Memulai push kontak...*\nTarget: ${total} anggota di grup *${groupMetadata.subject}*\n\n⚠️ Jangan spam atau jalankan command berat lain selama proses ini.`
    }, { quoted: m });

    for (let i = 0; i < participants.length; i++) {
      const member = participants[i];
      try {
        await russyuroku.sendMessage(member.id, { text: pesan }, { quoted: qtutkentut });
        success++;
        if (member.phoneNumber) {
          const nomor = member.phoneNumber.split('@')[0];
          vcfList += `BEGIN:VCARD
VERSION:3.0
FN:${global.namakontak} - ${nomor}
TEL;type=CELL;type=VOICE;waid=${nomor}:+${nomor}
END:VCARD

`;
        }

      } catch {
        failed++;
      }

      await sleep(global.delayPushkontak || 1500);

      const percent = Math.floor(((i + 1) / total) * 100);
      if (percent % 20 === 0 || i + 1 === total) {
        const bar = makeProgressBar(i + 1, total);
        await russyuroku.sendMessage(m.chat, {
          text: `*Progres Push Kontak*\n${i + 1}/${total} anggota\n${bar}\n\n⚠️ Jangan jalankan command lain dulu.`
        }, { edit: progMsg.key });
      }
    }

    const vcfPath = `./library/database/contacts.vcf`;
    fs.writeFileSync(vcfPath, vcfList);

    await russyuroku.sendMessage(m.sender, {
      document: fs.readFileSync(vcfPath),
      fileName: `Kontak-${groupMetadata.subject}.vcf`,
      mimetype: 'text/x-vcard',
      caption: `✅ Pushkontak ke *${total} member* selesai!\nBerhasil: *${success}*\nGagal: *${failed}*`
    });

    fs.unlinkSync(vcfPath);

  } catch (err) {
    console.error(err);
    return reply('❌ Gagal mengambil metadata grup. Pastikan ID grup valid dan bot masih ada di grup.');
  }
}
break

case 'pushkontakid2': {
  if (!isCreator) return larang();
  if (!text.includes('|')) return example(`idgc|jeda(ms)|pesan\n\n*Note:* 1 detik = 1000\nGunakan *.listgc* atau *.cekidgc* untuk melihat id grup`);

  const [idgc, jedaStr, ...pesanArr] = text.split('|');
  const delay = Number(jedaStr.trim());
  const pesan = pesanArr.join('|').trim();

  if (!idgc.endsWith('@g.us')) return reply("❌ ID Grup tidak valid!");
  if (isNaN(delay)) return reply("❌ Format jeda tidak valid!\nGunakan angka (contoh: 1000)");
  if (!pesan) return reply("❌ Pesan tidak boleh kosong!");

  let groupMetadata;
  try {
    groupMetadata = await cachedGroupMeta(idgc.trim());
  } catch {
    return reply("❌ Gagal ambil metadata grup! Pastikan bot masih ada di grup.");
  }

  const participants = groupMetadata.participants || [];
  const halls = participants.map(p => p.id).filter(Boolean);
  const phoneMap = {};
participants.forEach(p => {
  if (p.id && p.phoneNumber) {
    phoneMap[p.id] = p.phoneNumber;
  }
});

  const contactName = global.namakontak || "Yuroku MD Broadcast";
  let success = 0, failed = 0;
  let contacts = [];

  const progMsg = await russyuroku.sendMessage(m.chat, {
    text: `*⏳ Broadcast dimulai...*\nTarget: ${halls.length} kontak di grup *${groupMetadata.subject}*\nDelay: ${delay}ms\n\n⚠️ Jangan spam atau pakai command berat lain.`
  }, { quoted: m });

  for (let i = 0; i < halls.length; i++) {
    try {
      await russyuroku.sendMessage(halls[i], { text: pesan }, { quoted: qtutkentut });
      success++;
      contacts.push(halls[i]);
    } catch { failed++; }
    await sleep(delay);

    const percent = Math.floor(((i + 1) / halls.length) * 100);
    if (percent % 20 === 0 || i + 1 === halls.length) {
      const bar = makeProgressBar(i + 1, halls.length);
      await russyuroku.sendMessage(m.chat, {
        text: `*Progres Broadcast*\n${i + 1}/${halls.length} kontak\n${bar}\n\n⚠️ Jangan jalankan command lain dulu.`
      }, { edit: progMsg.key });
    }
  }

  try {
    const uniqueContacts = [...new Set(contacts)];
    const vcardContent = uniqueContacts.map((lid, i) => {
    const pn = phoneMap[lid];
  if (!pn) return null;

  const num = pn.split("@")[0];
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contactName} ${i + 1}`,
    `TEL;type=CELL;type=VOICE;waid=${num}:+${num}`,
    'END:VCARD', ''
  ].join('\n');
}).filter(Boolean).join('\n');

    fs.writeFileSync('./library/database/push_contacts.vcf', vcardContent, 'utf8');

    await russyuroku.sendMessage(m.sender, {
      document: fs.readFileSync('./library/database/push_contacts.vcf'),
      mimetype: 'text/vcard',
      fileName: 'contacts.vcf',
      caption: `✅ *Push Kontak Selesai!*\nTotal: ${halls.length}\nSukses: ${success}\nGagal: ${failed}`
    }, { quoted: qtutkentut });

  } catch (err) {
    console.error('❌ Gagal generate vcf:', err);
    await reply('⚠️ Push selesai, namun gagal membuat file .vcf');
  }
}
break

case 'savekontak': {
  if (!isCreator) return larang();

  const buildVcard = (list, contactName) => {
    let vcard = ''
    let no = 1

    for (let jid of list) {
      const num = jid.split('@')[0]
      vcard += `BEGIN:VCARD
VERSION:3.0
FN:${contactName} ${no}
TEL;type=CELL;type=VOICE;waid=${num}:+${num}
END:VCARD

`
      no++
    }

    return vcard
  }

  const getContacts = (participants) => {
    return [...new Set(
      participants
        .map(p => p.phoneNumber || p.id)
        .filter(jid => jid && jid.endsWith('@s.whatsapp.net') && jid !== m.sender)
    )]
  }

  if (m.isGroup && !text.includes('|')) {
    if (!text) return example("nama kontak");

    const contactName = text.trim()
    let metadata

    try {
      metadata = await cachedGroupMeta(m.chat)
    } catch (e) {
      return reply("❌ Gagal mengambil metadata grup!")
    }

    const kontakUnik = getContacts(metadata.participants)

    if (!kontakUnik.length) return reply("⚠️ Tidak ada kontak yang bisa disimpan!")

    const vcardList = buildVcard(kontakUnik, contactName)
    const filePath = './library/database/kontak-grup.vcf'

    fs.writeFileSync(filePath, vcardList)

    await russyuroku.sendMessage(m.sender, {
      document: fs.readFileSync(filePath),
      fileName: 'kontak-grup.vcf',
      mimetype: 'text/x-vcard',
      caption: `📥 *Kontak Grup Tersimpan!*\n\n👥 Grup: *${metadata.subject}*\n📁 Jumlah: *${kontakUnik.length}*\n🔖 Nama Kontak: *${contactName}*`,
    }, { quoted: m })

    await reply("✅ File kontak berhasil dikirim ke chat pribadi Anda!")
    fs.unlinkSync(filePath)
  }

  else {
    if (!text.includes('|')) {
      return example("<idgc>|<namakontak>\nKetik *.listgc* untuk menampilkan idgc")
    }

    const [idgc, contactName] = text.split('|').map(v => v.trim())
    if (!idgc || !contactName) return reply("✖️ Format salah!")

    let metadata
    try {
      metadata = await cachedGroupMeta(idgc)
    } catch (e) {
      return reply("✖️ ID grup tidak valid atau bot tidak ada di grup!")
    }

    const kontakUnik = getContacts(metadata.participants)
    if (!kontakUnik.length) return reply("⚠️ Tidak ada kontak yang bisa disimpan!")

    const vcardList = buildVcard(kontakUnik, contactName)
    const filePath = './library/database/kontak-saved.vcf'

    fs.writeFileSync(filePath, vcardList)

    await russyuroku.sendMessage(m.sender, {
      document: fs.readFileSync(filePath),
      fileName: "kontak-saved.vcf",
      mimetype: "text/x-vcard",
      caption: `*✅ Kontak Berhasil Disimpan!*\n📁 Total: *${kontakUnik.length}* kontak\n📌 Nama: *${contactName}*`,
    }, { quoted: m })

    if (m.chat !== m.sender) reply("✅ File kontak berhasil dikirim ke chat pribadi Anda!")
    fs.unlinkSync(filePath)
  }
}
break

case "jpm": {
  if (!isCreator) return larang()
  if (!text && !m.quoted) return example(`Halo semua!\nKirim media + caption (opsional)`)

  let mediaPath, broadcastMsg
  if (/image|video|audio|document/.test(mime)) {
    mediaPath = await russyuroku.downloadAndSaveMediaMessage(qmsg)
  }

  const allGroups = await russyuroku.groupFetchAllParticipating()
  const groupIDs = Object.keys(allGroups).filter(id => !penting.blacklistJpm.includes(id))
  let sentCount = 0, failCount = 0
  let isAborted = false

  if (mediaPath) {
    if (/image/.test(mime)) broadcastMsg = { image: fs.readFileSync(mediaPath), caption: text || "" }
    if (/video/.test(mime)) broadcastMsg = { video: fs.readFileSync(mediaPath), caption: text || "" }
    if (/audio/.test(mime)) broadcastMsg = { audio: fs.readFileSync(mediaPath), mimetype: "audio/mpeg", ptt: true }
    if (/document/.test(mime)) broadcastMsg = { document: fs.readFileSync(mediaPath), mimetype: qmsg.mimetype, fileName: `file_${Date.now()}` }
  } else {
    broadcastMsg = { text }
  }

  const processMsg = await russyuroku.sendMessage(
    m.chat,
    { text: `⏳ *Memproses JPM...*\nJumlah grup: ${groupIDs.length}\nTipe: ${mediaPath ? mime : "Text"}` },
    { quoted: m }
  )

  for (let i = 0; i < groupIDs.length; i++) {
    const id = groupIDs[i]

    if (!russyuroku.ws?.isOpen) {
      isAborted = true
      console.log(`⚠️  JPM dihentikan di grup ke-${i+1}: socket disconnect`)
      break
    }

    try {
      await russyuroku.sendMessage(id, broadcastMsg, { quoted: qloc })
      sentCount++
    } catch (e) {
      failCount++
      const errMsg = e.message || ''

      if (errMsg.includes('Connection Closed') || errMsg.includes('stream') || errMsg.includes('timed out')) {
        isAborted = true
        console.log(`⚠️  JPM dihentikan: ${errMsg}`)
        break
      }
    }

    if ((i + 1) % 10 === 0 || i + 1 === groupIDs.length) {
      try {
        await russyuroku.sendMessage(m.chat, {
          text: `⏳ *JPM Progress...*\n${i+1}/${groupIDs.length} grup\n✅ ${sentCount} berhasil | ❌ ${failCount} gagal`,
          edit: processMsg.key
        })
      } catch {}
    }

    await sleep(global.delayJpm || 4000)
  }

  if (mediaPath) { try { fs.unlinkSync(mediaPath) } catch {} }

  const statusText = isAborted
    ? `⚠️ *JPM Terhenti!* (koneksi terputus)\nTerkirim ke *${sentCount}* dari ${groupIDs.length} grup sebelum berhenti.`
    : `✅ *JPM Selesai!*\nBerhasil: *${sentCount}* | Gagal: *${failCount}* dari total ${groupIDs.length} grup.`

  await russyuroku.sendMessage(m.chat, { text: statusText, edit: processMsg.key })
}
break

case "jpmswgc": {
  if (!isCreator) return larang()
  if (!text && !m.quoted) return example(`Halo semua!\\nKirim media + caption (opsional)`)

  const qmsg = m.quoted ? m.quoted : m
  const mime = (qmsg.msg || qmsg).mimetype || ""
  const caption = text.replace(new RegExp(`^${prefix + command}\\s*`, "i"), "").trim()

  const allGroups = await russyuroku.groupFetchAllParticipating()
  const groupIDs = Object.keys(allGroups).filter(id => !penting.blacklistJpm.includes(id))
  let sentCount = 0, failCount = 0
  let isAborted = false

  let payload = {}
  if (/image/.test(mime)) {
    const buffer = await qmsg.download()
    payload = { image: buffer, caption }
  } else if (/video/.test(mime)) {
    const buffer = await qmsg.download()
    payload = { video: buffer, caption }
  } else if (/audio/.test(mime)) {
    const buffer = await qmsg.download()
    payload = { audio: buffer, mimetype: "audio/mp4" }
  } else if (caption) {
    payload = { text: caption }
  } else {
    return example(`Halo semua (opsional reply media)`)
  }

  const processMsg = await russyuroku.sendMessage(
    m.chat,
    { text: `⏳ *Memproses JPM Status GC...*\nJumlah grup: ${groupIDs.length}\nTipe: ${mime || "Text"}` },
    { quoted: m }
  )

  for (let i = 0; i < groupIDs.length; i++) {
    const id = groupIDs[i]

    if (!russyuroku.ws?.isOpen) {
      isAborted = true
      console.log(`⚠️  JPM Status GC dihentikan di grup ke-${i+1}: socket disconnect`)
      break
    }

    try {
      await groupStatus(russyuroku, id, { ...payload })
      sentCount++
    } catch (e) {
      failCount++
      const errMsg = e.message || ''

      if (errMsg.includes('Connection Closed') || errMsg.includes('stream') || errMsg.includes('timed out')) {
        isAborted = true
        console.log(`⚠️  JPM Status GC dihentikan: ${errMsg}`)
        break
      }
    }

    if ((i + 1) % 10 === 0 || i + 1 === groupIDs.length) {
      try {
        await russyuroku.sendMessage(m.chat, {
          text: `⏳ *JPM Status GC Progress...*\n${i+1}/${groupIDs.length} grup\n✅ ${sentCount} berhasil | ❌ ${failCount} gagal`,
          edit: processMsg.key
        })
      } catch {}
    }

    await sleep(global.delayJpm || 4000)
  }

  const statusText = isAborted
    ? `⚠️ *JPM Status GC Terhenti!* (koneksi terputus)\nTerkirim ke *${sentCount}* dari ${groupIDs.length} grup sebelum berhenti.`
    : `✅ *JPM Status GC Selesai!*\nBerhasil: *${sentCount}* | Gagal: *${failCount}* dari total ${groupIDs.length} grup.`

  await russyuroku.sendMessage(m.chat, { text: statusText, edit: processMsg.key })
}
break

case "jpmht": {
  if (!isCreator) return larang()
  if (!text && !m.quoted) return example(`Halo semua!\nKirim media + caption (opsional)`)

  let mediaPath, msgContent
  if (/image|video|audio|document/.test(mime)) {
    mediaPath = await russyuroku.downloadAndSaveMediaMessage(qmsg)
  }

  const allGroups = await russyuroku.groupFetchAllParticipating()
  const groupIDs = Object.keys(allGroups).filter(id => !penting.blacklistJpm.includes(id))
  let sentCount = 0, failCount = 0
  let isAborted = false

  const processMsg = await russyuroku.sendMessage(
    m.chat,
    { text: `⏳ *Memproses Broadcast Hidetag...*\nJumlah grup: ${groupIDs.length}\nTipe: ${mediaPath ? mime : "Text"}` },
    { quoted: m }
  )

  for (let i = 0; i < groupIDs.length; i++) {
    const id = groupIDs[i]

    if (!russyuroku.ws?.isOpen) {
      isAborted = true
      console.log(`⚠️  JPM Hidetag dihentikan di grup ke-${i+1}: socket disconnect`)
      break
    }

    const groupData = allGroups[id]
    const participants = (groupData?.participants || []).map(p => p.id)

    if (mediaPath) {
      if (/image/.test(mime)) msgContent = { image: fs.readFileSync(mediaPath), caption: text || "", mentions: participants }
      if (/video/.test(mime)) msgContent = { video: fs.readFileSync(mediaPath), caption: text || "", mentions: participants }
      if (/audio/.test(mime)) msgContent = { audio: fs.readFileSync(mediaPath), mimetype: "audio/mpeg", ptt: true, mentions: participants }
      if (/document/.test(mime)) msgContent = { document: fs.readFileSync(mediaPath), mimetype: qmsg.mimetype, fileName: `file_${Date.now()}`, mentions: participants }
    } else {
      msgContent = { text: text, mentions: participants }
    }

    try {
      await russyuroku.sendMessage(id, msgContent, { quoted: qloc })
      sentCount++
    } catch (e) {
      failCount++
      const errMsg = e.message || ''
      if (errMsg.includes('Connection Closed') || errMsg.includes('stream') || errMsg.includes('timed out')) {
        isAborted = true
        console.log(`⚠️  JPM Hidetag dihentikan: ${errMsg}`)
        break
      }
    }

    if ((i + 1) % 10 === 0 || i + 1 === groupIDs.length) {
      try {
        await russyuroku.sendMessage(m.chat, {
          text: `⏳ *Hidetag Progress...*\n${i+1}/${groupIDs.length} grup\n✅ ${sentCount} berhasil | ❌ ${failCount} gagal`,
          edit: processMsg.key
        })
      } catch {}
    }

    await sleep(global.delayJpm || 4000)
  }

  if (mediaPath) { try { fs.unlinkSync(mediaPath) } catch {} }

  const statusText = isAborted
    ? `⚠️ *Hidetag Terhenti!* (koneksi terputus)\nTerkirim ke *${sentCount}* dari ${groupIDs.length} grup.`
    : `✅ *Hidetag Broadcast Selesai!*\nBerhasil: *${sentCount}* | Gagal: *${failCount}* dari ${groupIDs.length} grup.`

  await russyuroku.sendMessage(m.chat, { text: statusText, edit: processMsg.key })
}
break

case "bljpm": {
  if (!isCreator) return larang();

  const pentingPath = path.join(process.cwd(), "library", "database", "penting.json");
  if (!fs.existsSync(pentingPath)) {
    fs.writeFileSync(pentingPath, JSON.stringify({ blacklistJpm: [] }, null, 2));
  }
  let penting = JSON.parse(fs.readFileSync(pentingPath));
  function savePenting() {
    fs.writeFileSync(pentingPath, JSON.stringify(penting, null, 2));
  }

  let [act, arg] = text.split("|").map(a => a?.trim()?.toLowerCase());

  if (act === "list") {
    if (!penting.blacklistJpm.length) return reply("✖️ Belum ada grup/channel yang di-blacklist.");

    let allGroupsList = {};
    let allChannelsList = {};
    try { allGroupsList = await russyuroku.groupFetchAllParticipating(); } catch {}
    try {
      const arr = await russyuroku.getFollowedChannels();
      allChannelsList = Object.fromEntries(arr.map((ch) => [ch.id, ch]));
    } catch {}

    let listText = `*🚫 Daftar Blacklist JPM (${penting.blacklistJpm.length}):*\n\n`;
    penting.blacklistJpm.forEach((id, i) => {
      const isChannel = id.endsWith("@newsletter");
      const name = isChannel
        ? (allChannelsList[id]?.name || "Tanpa Nama")
        : (allGroupsList[id]?.subject || "Tidak diketahui");
      listText += `${i + 1}. ${isChannel ? "📢" : "🧩"} *${name}*\n   ↳ ${id}\n`;
    });
    return reply(listText);
  }

  if (m.isGroup) {
    if (arg) {
      const targets = arg.split(",").map(x => x.trim()).filter(Boolean);
      let hasil = [];
      for (const targetID of targets) {
        if (act === "on") {
          if (!penting.blacklistJpm.includes(targetID)) {
            penting.blacklistJpm.push(targetID);
            hasil.push(`✅ ${targetID} ditambahkan ke blacklist.`);
          } else hasil.push(`⚠️ ${targetID} sudah ada di blacklist.`);
        } else if (act === "off") {
          if (penting.blacklistJpm.includes(targetID)) {
            penting.blacklistJpm = penting.blacklistJpm.filter(x => x !== targetID);
            hasil.push(`✅ ${targetID} dihapus dari blacklist.`);
          } else hasil.push(`⚠️ ${targetID} belum ada di blacklist.`);
        }
      }
      if (!hasil.length) return reply(`Gunakan:\n.bljpm on|idgc\n.bljpm off|idgc`);
      savePenting();
      return reply(hasil.join("\n"));
    }

    const gid = m.chat;
    if (act === "on") {
      if (!penting.blacklistJpm.includes(gid)) {
        penting.blacklistJpm.push(gid);
        savePenting();
        return reply(`✅ Grup ini berhasil ditambahkan ke *Blacklist JPM*.`);
      } else return reply(`✖️ Grup ini sudah ada di daftar blacklist.`);
    } else if (act === "off") {
      if (penting.blacklistJpm.includes(gid)) {
        penting.blacklistJpm = penting.blacklistJpm.filter(x => x !== gid);
        savePenting();
        return reply(`✅ Grup ini berhasil dihapus dari *Blacklist JPM*.`);
      } else return reply(`✖️ Grup ini belum ada di daftar blacklist.`);
    } else return reply(`Gunakan:\n.bljpm on\n.bljpm off\n.bljpm on|idgc\n.bljpm off|idgc\n.bljpm list`);
  }

  if (m.chat.endsWith("@newsletter")) {
    const cid = m.chat;
    if (act === "on") {
      if (!penting.blacklistJpm.includes(cid)) {
        penting.blacklistJpm.push(cid);
        savePenting();
        return reply(`✅ Channel ini berhasil ditambahkan ke *Blacklist JPM*.`);
      } else return reply(`✖️ Channel ini sudah ada di daftar blacklist.`);
    } else if (act === "off") {
      if (penting.blacklistJpm.includes(cid)) {
        penting.blacklistJpm = penting.blacklistJpm.filter(x => x !== cid);
        savePenting();
        return reply(`✅ Channel ini berhasil dihapus dari *Blacklist JPM*.`);
      } else return reply(`✖️ Channel ini belum ada di daftar blacklist.`);
    } else return reply(`Gunakan:\n.bljpm on\n.bljpm off`);
  }

  if (!m.isGroup && !m.chat.endsWith("@newsletter")) {
    const allGroups = await russyuroku.groupFetchAllParticipating();
    const groupIDs = Object.keys(allGroups);
    const allChannelsArr = await russyuroku.getFollowedChannels();
    const allChannels = Object.fromEntries(allChannelsArr.map((ch) => [ch.id, ch]));
    const channelIDs = allChannelsArr.map((ch) => ch.id);

    if (!groupIDs.length && !channelIDs.length)
      return reply("✖️ Tidak ada grup atau channel yang diikuti bot.");

    if (!act) {
      let listText = `*📋 Daftar Grup & Channel Bot:*\n\n`;

      listText += `*🧩 Grup:*\n`;
      groupIDs.forEach((id, i) => {
        const isBl = penting.blacklistJpm.includes(id);
        listText += `${i + 1}. ${allGroups[id].subject} ${isBl ? "(BL)" : ""}\n`;
      });

      if (channelIDs.length) {
        listText += `\n*📢 Channel:*\n`;
        channelIDs.forEach((id, i) => {
          const index = groupIDs.length + i + 1;
          const name = allChannels[id]?.name || "Tanpa Nama";
          const isBl = penting.blacklistJpm.includes(id);
          listText += `${index}. ${name} ${isBl ? "(BL)" : ""}\n`;
        });
      }

      listText += `\nGunakan:\n.bljpm on|1,3\n.bljpm off|2\n\nNomor sesuai urutan di atas.`;
      return reply(listText);
    }

    const idxList = arg.split(",").map(x => parseInt(x.trim()) - 1);
    const isOn = act === "on";
    const isOff = act === "off";
    let hasil = [];

    const combined = [...groupIDs, ...channelIDs];
    for (const idx of idxList) {
      if (isNaN(idx) || idx < 0 || idx >= combined.length) continue;
      const targetID = combined[idx];
      const isChannel = targetID.endsWith("@newsletter");

      if (isOn) {
        if (!penting.blacklistJpm.includes(targetID)) {
          penting.blacklistJpm.push(targetID);
          hasil.push(`✅ ${isChannel ? "Channel" : "Grup"} *${isChannel ? allChannels[targetID]?.name : allGroups[targetID]?.subject}* ditambahkan ke blacklist.`);
        } else {
          hasil.push(`⚠️ ${isChannel ? "Channel" : "Grup"} *${isChannel ? allChannels[targetID]?.name : allGroups[targetID]?.subject}* sudah ada di blacklist.`);
        }
      } else if (isOff) {
        if (penting.blacklistJpm.includes(targetID)) {
          penting.blacklistJpm = penting.blacklistJpm.filter(x => x !== targetID);
          hasil.push(`✅ ${isChannel ? "Channel" : "Grup"} *${isChannel ? allChannels[targetID]?.name : allGroups[targetID]?.subject}* dihapus dari blacklist.`);
        } else {
          hasil.push(`⚠️ ${isChannel ? "Channel" : "Grup"} *${isChannel ? allChannels[targetID]?.name : allGroups[targetID]?.subject}* belum ada di blacklist.`);
        }
      }
    }

    savePenting();
    if (!hasil.length) return reply("✖️ Tidak ada ID yang valid.");
    return reply(hasil.join("\n"));
  }
}
break

case 'listgc':
case 'listgrup': {
  if (!isCreator) return larang();

  await russyuroku.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  let gcall;
  try {
    gcall = Object.values(await russyuroku.groupFetchAllParticipating());
  } catch (e) {
    return reply("*✖️ Gagal mengambil daftar grup.*");
  }

  let teks = `╭─❐ 『 *DAFTAR GRUP* 』\n│\n`;
  gcall.forEach((group, index) => {
    const isBl = penting.blacklistJpm.includes(group.id);
    teks += `├─◆ ${index + 1}. *${group.subject}*\n`;
    teks += `│    ➤ ID     : ${group.id}\n`;
    teks += `│    ➤ Member : ${group.participants.length} orang\n`;
    teks += `│    ➤ Status : ${group.announce ? "🔒 Tertutup" : "🔓 Terbuka"}\n`;
    teks += `│    ➤ Owner  : ${group.owner ? "@" + group.owner.split('@')[0] : '✖️ Tidak Diketahui'}\n`;
    teks += `│    ➤ BL JPM : ${isBl ? "✅ Ya" : "❌ Tidak"}\n│\n`;
  });
  teks += `╰─❐ Total: *${gcall.length}* Grup`;

  russyuroku.sendMessage(m.chat, {
    text: teks,
    ...previewAd({
      title: `${gcall.length} Grup Aktif`,
      body: `Runtime : ${runtime(process.uptime())}`,
      sourceUrl: global.web,
      thumbnail: global.image.info,
      mention: [m.sender],
      largerThumbnail: true,
    })
  }, { quoted: m });
}
break

case 'cekidgc':
case 'getidgrup':
case 'idgc': {

    let coded = null
    let fromCurrentGroup = false

    if (!q) {
        if (!m.isGroup) {
            return example(
                `link grupnya\n\nContoh: ${prefix}${command} https://chat.whatsapp.com/xxxxx\nAtau ketik tanpa teks di dalam grup untuk cek ID grup ini.`
            )
        }

        fromCurrentGroup = true
    } else {
        let linkRegex = args.join(" ")

        coded = linkRegex
            .split("https://chat.whatsapp.com/")[1]
            ?.split(/[?&\s]/)[0]

        if (!coded) return reply("❌ Link tautan tidak valid!")
    }

    await russyuroku.sendMessage(m.chat, {
        react: {
            text: "🔎",
            key: m.key
        }
    })

    try {
        let res = fromCurrentGroup
            ? await russyuroku.groupMetadata(m.chat)
            : await russyuroku.groupGetInviteInfo(coded)

        if (!res || !res.id) {
            return reply(
                "❌ Gagal mengambil data grup, mungkin link invalid / sesi error"
            )
        }

        let ownerJid = res.owner || null

        if (ownerJid) {
            ownerJid = await russyuroku
                .resolvePn(ownerJid, res)
                .catch(() => ownerJid)
        }

        let teks = `╔──☉ *GROUP INFO*
│✎ *Nama* : ${res.subject || "-"}
│✎ *ID Grup* : ${res.id}
│✎ *Member* : ${res.size || res.participants?.length || 0}
│✎ *Owner* : ${ownerJid ? ownerJid.split("@")[0] : "-"}
╚────────────☉`

        let img = await prepareWAMessageMedia(
            {
                image: {
                    url: global.image.menu
                }
            },
            {
                upload: russyuroku.waUploadToServer
            }
        )

        let msgii = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },

                        interactiveMessage:
                            proto.Message.InteractiveMessage.create({

                                body:
                                    proto.Message.InteractiveMessage.Body.create({
                                        text: teks
                                    }),

                                footer:
                                    proto.Message.InteractiveMessage.Footer.create({
                                        text: global.namabot
                                    }),

                                header:
                                    proto.Message.InteractiveMessage.Header.create({
                                        title: "*Info Group*",
                                        hasMediaAttachment: true,
                                        ...img
                                    }),

                                nativeFlowMessage:
                                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                        buttons: [
                                            {
                                                name: "cta_copy",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: "SALIN ID",
                                                    id: res.id,
                                                    copy_code: res.id
                                                })
                                            },
                                            {
                                                name: "cta_url",
                                                buttonParamsJson: JSON.stringify({
                                                    display_text: global.nameSaluran,
                                                    url: global.linkSaluran,
                                                    merchant_url: global.linkSaluran
                                                })
                                            }
                                        ]
                                    }),

                                contextInfo: {
                                    stanzaId: m.key.id,
                                    participant: m.sender
                                }
                            })
                    }
                }
            },
            {
                userJid: m.sender,
                quoted: m
            }
        )

        await russyuroku.relayMessage(
            m.chat,
            msgii.message,
            {
                messageId: msgii.key.id
            }
        )

    } catch (e) {
        console.error("[cekidgc]", e)
        return reply(
            "❌ Gagal mengambil ID grup, mungkin link invalid / sesi error"
        )
    }

    break
}

case "autoread": {
if (!isCreator) return larang()
if (!text) return example("on/off\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
if (text.toLowerCase() == "on") {
if (autoread) return reply("*Autoread* Sudah Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoread = true
reply("*Berhasil Menyalakan Autoread ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else if (text.toLowerCase() == "off") {
if (!autoread) return reply("*Autoread* Sudah Tidak Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoread = false
reply("*Berhasil Mematikan Autoread ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else {
return example("on/off\n\nKetik *.statusbot* Untuk Melihat Status Settingan Bot")
}}
break

case "autoreadsw": {
if (!isCreator) return larang()
if (!text) return example("on/off\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
if (text.toLowerCase() == "on") {
if (autoreadsw) return reply("*Autoreadsw* Sudah Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoreadsw = true
reply("*Berhasil Menyalakan Autoreadsw ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else if (text.toLowerCase() == "off") {
if (!autoreadsw) return reply("*Autoread* Sudah Tidak Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoreadsw = false
reply("*Berhasil Mematikan Autoreadsw ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else {
return example("on/off\n\nKetik *.statusbot* Untuk Melihat Status Settingan Bot")
}}
break

case "autojoingc": {
    if (!isCreator) return larang()
    if (!text) return example("on/off")

    let input = text.trim().toLowerCase()
    if (input === "on") {
    if (autojoingc) return reply("*Autojoingc* Sudah Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
        autojoingc = true
        reply("✅ Fitur Auto Join GC berhasil diaktifkan.")
    } else if (input === "off") {
    if (autojoingc) return reply("*Autojoingc* Sudah Tidak Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
        autojoingc = false
        reply("✅ Fitur Auto Join GC berhasil dimatikan.")
    } else {
        return example("on/off")
    }
}
break

case "setting":
case "settingbot":
case "option":
case "statusbot": {
  if (!isCreator) return larang()

  var teks = `
*List Status Setting Bot :*

* Autoread   : ${global.autoread ? "*Aktif*" : "*Tidak Aktif*"}
* Autoreadsw : ${global.autoreadsw ? "*Aktif*" : "*Tidak Aktif*"}
* Autojoingc : ${global.autojoingc ? "*Aktif*" : "*Tidak Aktif*"}
* AutoJPM    : ${penting.autoJpm.status ? "*Aktif*" : "*Tidak Aktif*"}

*Contoh Penggunaan :*
.autoread on/off
`
  reply(teks)
}
break

case "joingc": case "join": {
if (!isCreator) return larang()
if (!text && !m.quoted) return example('linknya')
let teks = m.quoted ? m.quoted.text : text
if (!teks.includes('whatsapp.com')) return reply("Link Tautan Tidak Valid!")
let result = teks.split('https://chat.whatsapp.com/')[1]
await russyuroku.groupAcceptInvite(result).then(respon => reply("Berhasil Bergabung Ke Dalam Grup ✅")).catch(error => reply(error.toString()))
}
break
case "leavegc2": case "leave2": case "leave": case "leavegc": {
    if (!isCreator) return larang();

    if (isGroup && !args[0]) {
        await reply("Otw Bosss");
        await sleep(3000);
        return russyuroku.groupLeave(m.chat);
    }

    let gcall = Object.values(await russyuroku.groupFetchAllParticipating().catch(_ => null));
    let num = [];
    let listgc = `*Contoh Cara Penggunaan :*\nKetik *${prefix+command}* <Nomor Grup / all / tertutup>\n\n`;

    gcall.forEach((u, i) => {
        num.push(i);
        listgc += `*${i+1}.* ${u.subject}
* ID:* ${u.id}
* Total Member:* ${u.participants.length} Member
* Status Grup:* ${u.announce == true ? "Tertutup" : "Terbuka"}
* Pembuat:* ${u.owner ? u.owner.split('@')[0] : 'Sudah keluar'}\n\n`;
    });

    if (!args[0]) {
        return russyuroku.sendMessage(
            m.chat,
            {
                text: listgc,
                ...previewAd({
                    thumbnail: ppuser,
                    title: `[ ${gcall.length} Group Chat ] `,
                    body: `Runtime : ${runtime(process.uptime())}`,
                    sourceUrl: global.web,
                    mention: [m.sender],
                })
            },
            { quoted: qtutkentut }
        );
    }

    if (args[0].toLowerCase() === "all") {
        for (let gc of gcall) {
            await russyuroku.groupLeave(gc.id);
        }
        return reply(`Berhasil keluar dari semua grup ✅`);
    }

    if (args[0].toLowerCase() === "tertutup") {
        let leftCount = 0;
        for (let gc of gcall) {
            if (gc.announce && !gc.participants.find(p => p.id === russyuroku.user.id && p.admin)) {
                await russyuroku.groupLeave(gc.id);
                leftCount++;
            }
        }
        return reply(`Berhasil keluar dari ${leftCount} grup tertutup di mana bot bukan admin ✅`);
    }

    if (!num.includes(Number(args[0]) - 1)) return reply("Grup tidak ditemukan");
    let leav = Number(args[0]) - 1;
    await reply(`Berhasil keluar dari grup:\n*${gcall[leav].subject}*`);
    await russyuroku.groupLeave(gcall[leav].id);
}
break

case'cekkontol':
 if (!text) return reply('Nama nya mana yang mau di cek kontol nya')
 reply(`
╭━━━━°「 *Kontol ${text}* 」°
┃
┊• Nama : ${text}
┃• Kontol : ${pickRandom(['ih item','Belang wkwk','Muluss','Putih Mulus','Black Doff','Pink wow','Item Glossy'])}
┊• True : ${pickRandom(['perjaka','ga perjaka','udah pernah dimasukin','masih ori','jumbo'])}
┃• jembut : ${pickRandom(['lebat','ada sedikit','gada jembut','tipis','muluss'])}
┃• ukuran : ${pickRandom(['1cm','2cm','3cm','4cm','5cm','20cm','45cm','50cm','90meter','150meter','5km','gak normal'])}
╰═┅═━––––––๑`)
break
case "ambilq": {
let jsonData = JSON.stringify({ [m.quoted.mtype]: m.quoted }, null, 2)
reply(jsonData)
}
break
case "dana": {
if (global.dana == false) return reply('Payment Dana Tidak Tersedia')
let teks = `
*Nomor Dana :*
${global.dana}
*A/N :* ${an.dana}

*Note :*
Demi Keamanan Bersama, Buyyer Wajib Mengirim Bukti Pembayaran Agar Tidak Terjadi Hal Yang Tidak Di Inginkan!
`
await russyuroku.sendText(m.chat, teks, qtutkentut)
}
break
case "ovo": {
if (global.ovo == false) return reply('Payment Ovo Tidak Tersedia')
let teks = `
*Nomor Ovo :*
${global.ovo}
*A/N :* ${an.ovo}

*Note :*
Demi Keamanan Bersama, Buyyer Wajib Mengirim Bukti Pembayaran Agar Tidak Terjadi Hal Yang Tidak Di Inginkan!
`
await russyuroku.sendText(m.chat, teks, qtutkentut)
}
break
case "gopay": {
if (global.gopay == false) return reply('Payment Gopay Tidak Tersedia')
let teks = `
*Nomor Gopay :*
${global.gopay}
*A/N :* ${an.gopay}

*Note :*
Demi Keamanan Bersama, Buyyer Wajib Mengirim Bukti Pembayaran Agar Tidak Terjadi Hal Yang Tidak Di Inginkan!
`
await russyuroku.sendText(m.chat, teks, qtutkentut)
}
break
case "qris": {
  if (!global.qris) return reply('Payment QRIS Tidak Tersedia')
  reply('Memproses Mengambil QRIS, Tunggu Sebentar . . .')

  let teks = `
*Untuk Pembayaran Melalui QRIS All Payment, Silahkan Scan Foto QRIS Diatas Ini*
_WAJIB TAMBAH 500P KALAU PAKAI QRIS_
*Note :*
Demi Keamanan Bersama, Buyyer Wajib Mengirim Bukti Pembayaran Agar Tidak Terjadi Hal Yang Tidak Di Inginkan!
  `.trim()

await russyuroku.sendMessage(
    m.chat,
    {
      image: { url: global.qris },
      caption: teks
    },
    { quoted: qtutkentut }
  )
  break
}

case "send": {
  if (!isCreator) return reply(global.mess.creator);

  const cmdToRun = text.trim();
  if (!cmdToRun) {
    return reply(`❌ Format salah.\n\nContoh:\n${prefix}send .cekprem 628123456789`);
  }

  global.sendBuffer = global.sendBuffer || {};
  global.sendBuffer[m.sender] = cmdToRun;

  const allGroups = await russyuroku.groupFetchAllParticipating();
  const groupList = Object.values(allGroups);

  if (!groupList.length) return reply("❌ Bot tidak berada di grup manapun.");

  const rows = groupList.map((g) => ({
    title: g.subject,
    description: `Anggota: ${g.participants?.length || 0}`,
    id: `${prefix}sendexec_process ${g.id}`,
  }));

  const listMenu = {
    title: "📤 Pilih Grup Tujuan",
    sections: [
      {
        title: `Kirim: ${cmdToRun}`,
        rows,
      },
    ],
  };

  await listbut2(m, `📤 *Kirim Command ke Grup*\n\nCommand: *${cmdToRun}*\n\nPilih grup tujuan di bawah 👇`, listMenu, qtutkentut);
}
break

case "sendexec_process": {
  if (!isCreator) return reply(global.mess.creator);

  const targetGroupId = args[0];
  const cmdToRun = global.sendBuffer && global.sendBuffer[m.sender];

  if (!targetGroupId || !cmdToRun) {
    return reply("❌ Sesi kirim sudah kedaluwarsa. Ulangi dari awal dengan .send <command>.");
  }

  delete global.sendBuffer[m.sender];

  try {
    const fakeMsg = {
      key: {
        remoteJid: targetGroupId,
        fromMe: false,
        participant: m.sender,
        id: "SENDCMD" + Date.now(),
      },
      messageTimestamp: Math.floor(Date.now() / 1000),
      pushName: pushname,
      message: {
        conversation: cmdToRun,
      },
    };

    const fakeM = smsg(russyuroku, fakeMsg, undefined);

    await russyuroku.sendMessage(m.chat, {
      text: `✅ Mengeksekusi *${cmdToRun}* di grup terpilih...`,
    }, { quoted: m });

    await mainHandler(russyuroku, fakeM, { messages: [fakeMsg], type: "notify" }, undefined);
  } catch (err) {
    console.error("[SEND ERROR]", err);
    reply(`❌ Gagal mengeksekusi command: ${err?.message || err}`);
  }
}
break

case "jadibot": {
  if (!isCreator && !isPremium(senderPnJid || m.sender)) {
    return reply("❌ Fitur *jadibot* khusus member premium. Hubungi owner untuk upgrade.");
  }

  if (m.isGroup) {
    return reply("⚠️ Jalankan *" + prefix + "jadibot* lewat chat pribadi ke bot, supaya kode pairing tidak terlihat orang lain.");
  }

  const nomorPenyewa = String(senderPnJid || m.sender).split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
  if (!/^\d{8,15}$/.test(nomorPenyewa)) {
    return reply("❌ Nomor kamu tidak terbaca. Coba lagi beberapa saat.");
  }

  const nomorUtama = String(russyuroku.user?.id || "").split(":")[0].split("@")[0];
  if (nomorPenyewa === nomorUtama) {
    return reply("❌ Ini nomor bot utama, tidak bisa dijadikan sub-bot.");
  }

  if (listSubBots().some((b) => b.number === nomorPenyewa)) {
    return reply("Kamu sudah jadibot sebelumnya! Ketik *" + prefix + "stopjadibot* kalau mau menghentikannya.");
  }

  await reply("⏳ Menyiapkan kode pairing untuk *" + nomorPenyewa + "*...");

  try {
    const { pairingCode } = await startSubBot(nomorPenyewa, {
      parentSocket: global.russyurokuMain || russyuroku,
      getMainHandler: global.getMainHandler,
      fileTypeFromBuffer,
      parsePhoneNumber,
      axios,
    });

    if (pairingCode) {
      console.log(chalk.red.bold("[ Jadibot ] -> (+" + nomorPenyewa + ") meminta kode pairing"));
      await russyuroku.sendMessage(m.chat, {
        text:
          "*[ JADIBOT - CLONE ]*\n" +
          "Kode: *" + pairingCode + "*\n\n" +
          "Masukkan kode di WhatsApp kamu:\n" +
          "Perangkat Tertaut → Tautkan dengan nomor telepon.\n\n" +
          "_Setelah kode dimasukkan, koneksi sempat putus-nyambung sebentar, itu normal._",
      }, { quoted: m });
    } else {
      await russyuroku.sendMessage(m.chat, {
        text: "✅ Sesi jadibot kamu dipulihkan dari penyimpanan (sudah pernah login).",
      }, { quoted: m });
    }
  } catch (err) {
    console.error("[JADIBOT ERROR]", err);
    reply("❌ Gagal membuat jadibot: " + (err?.message || err));
  }
}
break

case "stopjadibot": {

  const nomorPenyewa = String(senderPnJid || m.sender).split("@")[0].split(":")[0].replace(/[^0-9]/g, "");

  try {
    const berhasil = await deleteSubBot(nomorPenyewa);
    await russyuroku.sendMessage(m.chat, {
      text: berhasil
        ? "Jadibot berhasil dihentikan dan sesi dihapus."
        : "Kamu belum menjalankan jadibot atau sudah dihentikan.",
    }, { quoted: m });
  } catch (err) {
    console.error("[STOPJADIBOT ERROR]", err);
    reply("Gagal menghentikan jadibot: " + (err?.message || err));
  }
}
break

case "delbot": {

  if (!isCreator) return reply(global.mess.creator);

  const nomorTarget = String(text || "").replace(/[^0-9]/g, "");
  if (!nomorTarget) {
    return reply("❌ Format salah.\n\nContoh:\n" + prefix + "delbot 628123456789\n\nLihat daftar: " + prefix + "listjadibot");
  }

  try {
    const berhasil = await deleteSubBot(nomorTarget);
    await russyuroku.sendMessage(m.chat, {
      text: berhasil
        ? "✅ Jadibot *" + nomorTarget + "* berhasil dihapus."
        : "❌ Tidak ditemukan sesi jadibot untuk nomor *" + nomorTarget + "*.",
    }, { quoted: m });
  } catch (err) {
    console.error("[DELBOT ERROR]", err);
    reply("❌ Gagal menghapus jadibot: " + (err?.message || err));
  }
}
break

case "listjadibot": case "listbot": {
  if (!isCreator) return reply(global.mess.creator);

  const folder = listRentbotFolders();
  if (!folder.length) return reply("Belum ada pengguna yang menyewa bot.");

  const online = new Map(listSubBots().map((b) => [b.number, b]));
  let teks = "*Rentbot List*\n\n";
  const mentions = [];
  for (const nomor of folder) {
    mentions.push(nomor + "@s.whatsapp.net");
    const st = online.get(nomor);
    teks += " × User : @" + nomor + " " + (st ? (st.connected ? "🟢" : "🟡") : "⚪") + "\n";
  }
  await russyuroku.sendMessage(m.chat, { text: teks.trim(), mentions }, { quoted: m });
}
break

      case "runtime":
      {
        let lowq = `*Telah Online Selama:*\n${runtime(
          process.uptime(),
        )}*`;
        reply(`${lowq}`);
      }
      break

case 'addcase': {
  if (!isCreator) return reply(mess.creator);
  if (!text) return reply('Mana case nya? Kirim: *.addcase* lalu tulis/reply kode `case \'namacase\': { ... } break`');

  const filePath = path.join(process.cwd(), 'yuroku.js');
  const snippetSrc = (m.quoted && m.quoted.text ? m.quoted.text : text).trim();
  const caseBaru = `${snippetSrc}\n\n`;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('[addcase] error:', err);
      return reply(`❌ Terjadi kesalahan saat membaca file: ${err.message}`);
    }

    const posisiDefault = data.lastIndexOf('default:');
    if (posisiDefault === -1) {
      return reply('❌ Tidak dapat menemukan case default di dalam file!');
    }

    const kodeBaruLengkap = data.slice(0, posisiDefault) + caseBaru + data.slice(posisiDefault);

    fs.writeFile(filePath, kodeBaruLengkap, 'utf8', (err) => {
      if (err) {
        console.error('[addcase] error:', err);
        return reply(`❌ Terjadi kesalahan saat menulis file: ${err.message}`);
      }
      reply('✅ Sukses menambahkan case!\nBot perlu di-reload/restart supaya case baru aktif.');
    });
  });
}
break

case 'delcase': {
  if (!isCreator) return reply('Fitur Khusus Owner!');
  if (!text) return reply('Mana nama case nya bang? Contoh: *.delcase halo*');

  const filePath = path.join(process.cwd(), 'yuroku.js');
  const caseNameToRemove = text.trim();

  try {
    const data = await readFile(filePath, 'utf8');
    const regex = new RegExp(`case\\s+['"\`]${caseNameToRemove}['"\`]:[\\s\\S]*?break;?`, 'g');
    const modifiedData = data.replace(regex, '');

    if (data === modifiedData) {
      return reply(`❌ Case "${caseNameToRemove}" tidak ditemukan.\n\nPastikan penulisan sudah benar dan tidak ada typo.`);
    }

    await fs.promises.writeFile(filePath, modifiedData, 'utf8');
    reply(`✅ Sukses menghapus case: *${caseNameToRemove}*\nBot perlu di-reload/restart supaya perubahan aktif.`);
  } catch (e) {
    console.error('[delcase] error:', e);
    reply(`❌ Terjadi kesalahan saat memproses file: ${e.message}`);
  }
}
break

case 'editcase': {
  if (!isCreator) return reply('Fitur Khusus Owner!');
  if (!text) return reply("Format: *.editcase namacase* lalu reply kode barunya,\natau *.editcase namacase | case 'namacase': { ... } break*");

  let caseName, newSnippet;
  if (text.includes('|')) {
    const [namePart, ...rest] = text.split('|');
    caseName = namePart.trim();
    newSnippet = rest.join('|').trim();
  } else {
    caseName = text.trim();
    newSnippet = m.quoted && m.quoted.text ? m.quoted.text.trim() : null;
  }
  if (!caseName) return reply('Nama case tidak boleh kosong.');
  if (!newSnippet) return reply('Kode pengganti tidak ditemukan. Reply pesan berisi kode barunya, atau pakai format *.editcase namacase | case ...*');

  const filePath = path.join(process.cwd(), 'yuroku.js');

  try {
    const data = await readFile(filePath, 'utf8');
    const regex = new RegExp(`case\\s+['"\`]${caseName}['"\`]:[\\s\\S]*?break;?`, 'g');

    if (!regex.test(data)) {
      return reply(`❌ Case "${caseName}" tidak ditemukan.\n\nPastikan penulisan sudah benar dan tidak ada typo.`);
    }

    regex.lastIndex = 0;
    const caseBaru = `${newSnippet}\n\nbreak`;
    const modifiedData = data.replace(regex, caseBaru);

    await fs.promises.writeFile(filePath, modifiedData, 'utf8');
    reply(`✅ Berhasil mengedit case: *${caseName}*\nBot perlu di-reload/restart supaya perubahan aktif.`);
  } catch (e) {
    console.error('[editcase] error:', e);
    reply(`❌ Terjadi error saat mengedit case: ${e.message}`);
  }
}
break

case 'listcase': {
  if (!isCreator) return reply('Fitur Khusus Owner!');

  const filePath = path.join(process.cwd(), 'yuroku.js');

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const regex = /case\s+['"]([^'"]+)['"]:/g;
    const matches = data.matchAll(regex);
    let caseNames = [];
    for (const match of matches) {
      caseNames.push(match[1]);
    }

    if (caseNames.length === 0) {
      return reply('Tidak ada case yang ditemukan.');
    }

    reply(`*Daftar Case (${caseNames.length}):*\n\n${caseNames.map((n, i) => `${i + 1}. ${n}`).join('\n')}`);
  } catch (e) {
    console.error('[listcase] error:', e);
    reply(`❌ Terjadi error saat mengambil daftar case: ${e.message}`);
  }
}
break

case 'getsc': {
  if (!isCreator) return reply(mess.creator);

  await russyuroku.sendMessage(m.chat, { text: 'Memproses backup script bot...' }, { quoted: m });

  const name = `${global.namabot.replace(/\s+/g, "_")}`;
  const zipPath = path.join(process.cwd(), `${name}.zip`);

  try {
    const ls = execSync("ls", { cwd: process.cwd() })
      .toString()
      .split("\n")
      .filter(
        (pe) =>
          pe !== "node_modules" &&
          pe !== "session" &&
          pe !== "package-lock.json" &&
          pe !== "yarn.lock" &&
          pe !== ""
      );

    execSync(`zip -r "${name}.zip" ${ls.map(f => `"${f}"`).join(" ")}`, { cwd: process.cwd() });

    await russyuroku.sendMessage(m.sender, {
      document: fs.readFileSync(zipPath),
      fileName: `${name}.zip`,
      mimetype: 'application/zip'
    }, { quoted: m });

    fs.unlinkSync(zipPath);

    if (m.chat !== m.sender) return reply('Script bot berhasil dikirim ke private chat ✅');
  } catch (e) {
    console.error('[getsc] error:', e);
    try { if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath); } catch (_) {}
    reply(`❌ Gagal membuat backup script: ${e.message}`);
  }
}
break
case 'on': {
  if (!m.isGroup) return reply(global.mess?.group || 'Fitur khusus grup.');
  if (!isCreator && !isAdmins) return reply(global.mess?.admin || 'Khusus admin!');

  const current = getChatToggles(m.chat);
  const rows = Object.entries(KNOWN_TOGGLES).map(([key, label]) => {
    const active = current[key] === true;
    return {
      title: label,
      description: `Status: ${active ? 'ON ✅' : 'OFF ❌'}`,
      id: `${prefix}${active ? 'off' : 'on'} ${key}`,
    };
  });

  const listMenu = {
    title: 'Pilih fitur untuk toggle ON/OFF',
    sections: [{ title: 'Pengaturan Grup', rows }],
  };

  try {
    await listbut2(m, `⚙️ *PENGATURAN GRUP*\n\nTap salah satu fitur di bawah untuk toggle ON/OFF.`, listMenu, qtutkentut);
  } catch (e) {
    console.error('[on] error:', e);
    reply(`❌ Gagal menampilkan panel: ${e.message}`);
  }
}
break

case 'on2':
case 'off2': {
  if (!m.isGroup) return reply(global.mess?.group || 'Fitur khusus grup.');
  if (!isCreator && !isAdmins) return reply(global.mess?.admin || 'Khusus admin!');

  const settingOrder = Object.keys(KNOWN_TOGGLES);
  const current = getChatToggles(m.chat);

  if (!text) {
    let listText = `╭─❏ *Group Settings*`;
    settingOrder.forEach((key, i) => {
      const active = current[key] === true;
      const status = active ? '🟢' : '🔴';
      const num = String(i + 1).padStart(2, ' ');
      listText += `\n│ ${num}. ${status} ${KNOWN_TOGGLES[key]}`;
    });
    listText += `\n╰──────────❏\n\n📌 *Contoh:*\n.on2 1 atau .on2 1,2,3`;
    return reply(listText);
  }

  const numbers = text.split(',').map((s) => s.trim()).filter(Boolean);
  if (!numbers.length) return reply(`❌ Masukkan nomor!\nContoh: .${command} 1 atau .${command} 1,2,3`);

  const nextVal = command === 'on2';
  const hasil = [];
  for (const numStr of numbers) {
    let key = null;
    const n = Number(numStr);
    if (!isNaN(n) && n >= 1 && n <= settingOrder.length) {
      key = settingOrder[n - 1];
    } else if (settingOrder.includes(numStr.toLowerCase())) {
      key = numStr.toLowerCase();
    } else {
      key = Object.entries(KNOWN_TOGGLES).find(([, label]) => label.toLowerCase() === numStr.toLowerCase())?.[0] || null;
    }
    if (!key) {
      hasil.push(`❓ "${numStr}" tidak dikenal`);
      continue;
    }
    setToggle(m.chat, key, nextVal);
    hasil.push(`${nextVal ? '🟢' : '🔴'} ${KNOWN_TOGGLES[key]} → ${nextVal ? 'ON' : 'OFF'}`);
  }
  reply(`*Hasil Pengaturan:*\n\n${hasil.join('\n')}`);
}
break

case 'sambutowner':
case 'autosambut': {
  if (!isCreator) return reply(global.mess?.creator || 'Fitur khusus owner!');

  const config = loadSambutan();

  if (!text) {
    return reply(`⚙️ *Auto Sambut Owner*\nStatus: ${config.enabled ? 'ON ✅' : 'OFF ❌'}\nCooldown: ${config.cooldown || 15} menit\n\nPakai: *${prefix}sambutowner on/off/set <menit>*`);
  }

  const arg = text.trim().toLowerCase();
  if (arg === 'on') {
    config.enabled = true;
    saveSambutan(config);
    reply('✅ Auto Sambut Owner *AKTIF*.');
  } else if (arg === 'off') {
    config.enabled = false;
    saveSambutan(config);
    reply('❌ Auto Sambut Owner *NONAKTIF*.');
  } else if (arg.startsWith('set ')) {
    const menit = parseInt(arg.split(' ')[1], 10);
    if (isNaN(menit) || menit < 1 || menit > 1440) return reply('❌ Masukkan angka 1-1440 menit!\nContoh: .sambutowner set 15');
    config.cooldown = menit;
    saveSambutan(config);
    reply(`✅ Cooldown diubah ke ${menit} menit.`);
  } else {
    reply(`Format tidak dikenal. Pakai: *${prefix}sambutowner on/off/set 15*`);
  }
}
break

case 'antilink':
case 'antitoxic':
case 'antispam':
case 'antitagall':
case 'antifoto':
case 'antivideo':
case 'antiaudio':
case 'antidokumen':
case 'antisticker': {
  if (!m.isGroup) return reply(global.mess?.group || 'Fitur khusus grup.');
  if (!isCreator && !isAdmins) return reply(global.mess?.admin || 'Khusus admin!');

  const fitur = command;
  const label = MODERATION_FEATURES[fitur];
  const arg = (text || '').trim().toLowerCase();

  if (!arg) {
    const mode = getModerationMode(m.chat, fitur);
    return reply(`⚙️ *${label}*\nMode sekarang: *${mode.toUpperCase()}*\n\nPakai:\n• *${prefix}${fitur} delete* — hapus pesan pelanggar\n• *${prefix}${fitur} kick* — hapus + tendang setelah ${'3'}x pelanggaran\n• *${prefix}${fitur} off* — matikan`);
  }

  if (!['delete', 'kick', 'off', 'del', 'hapus'].includes(arg)) {
    return reply(`Mode tidak dikenal. Pakai *delete*, *kick*, atau *off*.`);
  }
  const modeFinal = arg === 'del' || arg === 'hapus' ? 'delete' : arg;
  setModerationMode(m.chat, fitur, modeFinal);
  if (modeFinal === 'off') {
    reply(`❌ *${label}* dimatikan di grup ini.`);
  } else {
    reply(`✅ *${label}* diaktifkan, mode: *${modeFinal.toUpperCase()}*.\n${fitur === 'antitoxic' ? `Kata kasar dikelola lewat *${prefix}addbadword*/*${prefix}delbadword*/*${prefix}listbadword*.` : ''}`);
  }
}
break

case 'addbadword': {
  if (!isCreator && !isAdmins) return reply(global.mess?.admin || 'Khusus admin!');
  if (!text) return reply(`Contoh: *${prefix}addbadword kontol*`);
  const kata = text.trim().toLowerCase();
  const added = addBadword(kata);
  reply(added ? `✅ Kata *${kata}* ditambahkan ke daftar toxic.` : `Kata *${kata}* sudah ada di daftar.`);
}
break

case 'delbadword': {
  if (!isCreator && !isAdmins) return reply(global.mess?.admin || 'Khusus admin!');
  if (!text) return reply(`Contoh: *${prefix}delbadword kontol*`);
  const kata = text.trim().toLowerCase();
  const removed = removeBadword(kata);
  reply(removed ? `✅ Kata *${kata}* dihapus dari daftar toxic.` : `Kata *${kata}* tidak ditemukan di daftar.`);
}
break

case 'listbadword': {
  if (!isCreator && !isAdmins) return reply(global.mess?.admin || 'Khusus admin!');
  const { words } = loadBadwords();
  if (!words.length) return reply('Daftar kata toxic masih kosong.');
  reply(`*Daftar Kata Toxic (${words.length}):*\n\n${words.map((w, i) => `${i + 1}. ${w}`).join('\n')}\n\nKelola dengan *${prefix}addbadword*/*${prefix}delbadword*.`);
}
break

case 'addbotjid': {
  if (!isCreator && !isAdmins) return reply(global.mess?.admin || 'Khusus admin!');
  const target = m.mentionedJid?.[0] || (text ? `${text.replace(/[^0-9]/g, '')}@s.whatsapp.net` : null);
  if (!target) return reply(`Contoh: *${prefix}addbotjid 628xxxx* atau tag/mention akun bot-nya.`);
  const added = addBotJid(target);
  reply(added ? `✅ *${target.split('@')[0]}* ditambahkan ke daftar akun bot (untuk fitur antibot).` : `Nomor itu sudah ada di daftar bot.`);
}
break

case 'delbotjid': {
  if (!isCreator && !isAdmins) return reply(global.mess?.admin || 'Khusus admin!');
  const target = m.mentionedJid?.[0] || (text ? `${text.replace(/[^0-9]/g, '')}@s.whatsapp.net` : null);
  if (!target) return reply(`Contoh: *${prefix}delbotjid 628xxxx* atau tag/mention akun bot-nya.`);
  const removed = removeBotJid(target);
  reply(removed ? `✅ *${target.split('@')[0]}* dihapus dari daftar akun bot.` : `Nomor itu tidak ada di daftar bot.`);
}
break

case 'listbotjid': {
  if (!isCreator && !isAdmins) return reply(global.mess?.admin || 'Khusus admin!');
  const jids = listBotJids();
  if (!jids.length) return reply('Daftar akun bot (untuk antibot) masih kosong.');
  reply(`*Daftar Akun Bot / Antibot (${jids.length}):*\n\n${jids.map((j, i) => `${i + 1}. ${j.split('@')[0]}`).join('\n')}\n\nKelola dengan *${prefix}addbotjid*/*${prefix}delbotjid*.`);
}
break

case 'addrespon': {
  if (!isCreator) return reply(global.mess?.creator || 'Fitur khusus owner!');
  if (!text) return reply(`Reply pesan (teks/stiker/foto/video/audio/dokumen) dengan caption *${prefix}addrespon <kata_kunci>*`);
  if (!m.quoted) return reply('❌ Reply pesan yang mau dijadikan respon!');

  const cmd = text.toLowerCase().trim();
  const qtype = m.quoted.mtype;

  const extMap = {
    imageMessage: 'jpg',
    videoMessage: 'mp4',
    audioMessage: 'mp3',
    stickerMessage: 'webp',
    documentMessage: 'bin',
  };

  try {
    if (qtype === 'conversation' || qtype === 'extendedTextMessage' || (!extMap[qtype] && m.quoted.text)) {
      const res = addRespon({ cmd, mtype: 'text', text: m.quoted.text || '' });
      if (!res.ok) return reply(`❌ ${res.reason}`);
      return reply(`✅ Berhasil menambah respon teks untuk *${cmd}*`);
    }

    if (!extMap[qtype]) {
      return reply(`❌ Jenis pesan ini (${qtype}) belum didukung untuk respon.`);
    }

    const buf = await m.quoted.download();
    if (!buf) return reply('❌ Gagal mengunduh media yang di-reply.');

    const caption = m.quoted.text || null;
    const res = addRespon({
      cmd,
      mtype: qtype,
      mediaBuffer: buf,
      mediaExt: extMap[qtype],
      mimetype: m.quoted.mimetype || null,
      caption,
    });
    if (!res.ok) return reply(`❌ ${res.reason}`);
    reply(`✅ Berhasil menambah respon ${qtype.replace('Message', '')} untuk *${cmd}*`);
  } catch (e) {
    console.error('[addrespon] error:', e);
    reply(`❌ Gagal menambah respon: ${e.message}`);
  }
}
break

case 'delrespon': {
  if (!isCreator) return reply(global.mess?.creator || 'Fitur khusus owner!');
  if (!text) return reply(`Contoh: *${prefix}delrespon <kata_kunci>*\n\nKetik *${prefix}listrespon* untuk lihat semua.`);
  const res = deleteRespon(text);
  if (!res.ok) return reply(`❌ ${res.reason}`);
  reply(`✅ Berhasil menghapus respon *${text.toLowerCase().trim()}*`);
}
break

case 'clearrespon': {
  if (!isCreator) return reply(global.mess?.creator || 'Fitur khusus owner!');
  const total = clearRespon();
  if (total === 0) return reply('❌ Tidak ada respon untuk dibersihkan.');
  reply(`✅ Berhasil menghapus semua *${total}* respon.`);
}
break

case 'listrespon': {
  if (!isCreator) return reply(global.mess?.creator || 'Fitur khusus owner!');
  const list = listRespon();
  if (!list.length) return reply('Tidak ada respon terdaftar.');
  const iconOf = {
    imageMessage: '🖼️', videoMessage: '🎥', audioMessage: '🎵',
    stickerMessage: '🏷️', documentMessage: '📄', text: '💬',
  };
  const teks = `*📋 DAFTAR AUTO-RESPON (${list.length})*\n\n${list.map((e) => `${iconOf[e.mtype] || '💬'} ${e.cmd}`).join('\n')}`;
  reply(teks);
}
break

case 'totalfitur': {

  let totalCaseNyata = 0;
  try {
    const content = fs.readFileSync(path.join(__dirname, 'yuroku.js'), 'utf8');
    totalCaseNyata = (content.match(/case\s+["'`]/g) || []).length;
  } catch (e) {}

  let totalPluginNyata = 0;
  try {
    totalPluginNyata = fs.readdirSync(path.join(__dirname, 'plugins')).filter((f) => f.endsWith('.js')).length;
  } catch (e) {}

  const totalFiturNyata = totalCaseNyata + totalPluginNyata;
  const kategori = global.menuKategori || [];
  const totalDariKategori = kategori.reduce((sum, k) => sum + (k.total || 0), 0);

  const bodyTotal = `\`📊 Rekap Total Fitur ${global.namabot || 'YurokuMD'}\`

◤───「 \`SUMBER DATA\` 」──✦
> ⎆ Case di yuroku.js : ${totalCaseNyata}
> ⎆ File di /plugins  : ${totalPluginNyata}
> ⎆ Total Gabungan    : ${totalFiturNyata}
◣─────────────✦

◤───「 \`PER KATEGORI\` 」──✦
${kategori.map((k) => `> ${k.emoji || '▸'} ${k.judul} : ${k.total} fitur`).join('\n')}
> ── Total per kategori: ${totalDariKategori} ──
◣─────────────✦

${global.menuLegend || ''}

Tap tombol di bawah buat lompat ke kategori yang kamu mau 👇`;

  const rowKategoriTotal = kategori.map((k) => ({
    title: `${k.emoji || '▸'} ${k.judul}`,
    description: `${k.total} fitur — tap untuk buka daftarnya`,
    id: `${prefix}${k.key}`,
  }));

  const listMenuTotal = {
    title: 'Pilih Kategori',
    sections: [
      {
        title: `Total: ${totalFiturNyata} fitur di ${kategori.length} kategori`,
        rows: [
          { title: '📋 Semua Menu (teks lengkap)', description: 'Tampilkan seluruh daftar command apa adanya', id: `${prefix}allmenu` },
          ...rowKategoriTotal,
        ],
      },
    ],
  };

  try {
    await listbut2(m, bodyTotal, listMenuTotal, qtutkentut);
  } catch (error) {
    console.error('[totalfitur] error:', error);

    reply(bodyTotal);
  }
}
break

case 'bass':
case 'blown':
case 'deep':
case 'earrape':
case 'fast':
case 'fat':
case 'nightcore':
case 'reverse':
case 'robot':
case 'slow':
case 'tupai': {
    try {
        if (!/audio/.test(mime)) {
            return reply(`${global.mess.media}\nBalas audio yang ingin diubah dengan caption *${prefix + command}*`);
        }

        await russyuroku.sendMessage(m.chat, { react: { text: "🎚️", key: m.key } });

        const media = await russyuroku.downloadMediaMessage(quoted);
        const result = await applyAudioEffect(media, command, 'mp3');

        await russyuroku.sendMessage(m.chat, {
            audio: result,
            mimetype: 'audio/mpeg',
            fileName: `${command}.mp3`,
        }, { quoted: m });
    } catch (e) {
        console.error(e);
        reply(global.mess?.error || `❌ Error: ${e.message}`);
    }
}
break

case "volume": {
    try {
        if (!/audio/.test(mime)) {
            return reply(`${global.mess.media}\nBalas audio yang ingin diubah volumenya dengan caption *${prefix + command} <angka>*\nContoh: *${prefix + command} 10*`);
        }
        if (!args[0] || isNaN(args[0])) {
            return example(`Masukkan level volume (angka)!\nContoh: ${prefix + command} 10`);
        }

        await russyuroku.sendMessage(m.chat, { react: { text: "🔊", key: m.key } });

        const media = await russyuroku.downloadMediaMessage(quoted);
        const result = await applyVolumeEffect(media, args[0], 'mp3');

        await russyuroku.sendMessage(m.chat, {
            audio: result,
            mimetype: 'audio/mpeg',
            fileName: `volume.mp3`,
        }, { quoted: m });
    } catch (e) {
        console.error(e);
        reply(global.mess?.error || `❌ Error: ${e.message}`);
    }
}
break

case 'nulis': {
    reply(`*Contoh Pemakaian*\n${prefix}nuliskiri <teks>\n${prefix}nuliskanan <teks>\n${prefix}foliokiri <teks>\n${prefix}foliokanan <teks>`);
}
break

case 'nuliskanan':
case 'nuliskiri':
case 'foliokanan':
case 'foliokiri': {

    if (!text) return reply(`${global.mess.text}\nContoh: *${prefix + command}* Rajinlah belajar`);

    try {
        await russyuroku.sendMessage(m.chat, { react: { text: '✍️', key: m.key } });

        const buffer = await writecanvas(text, command);
        await russyuroku.sendMessage(m.chat, { image: buffer, caption: 'Jangan Malas Lord. Jadilah siswa yang rajin ಠ_ಠ' }, { quoted: m });

    } catch (error) {
        console.error(error);
        reply(global.mess.error);
    }
}
break

case "nomerhoki": case "nomorhoki": {
  if (!Number(text)) return reply(`Contoh: ${prefix + command} 6288292024190`)
  let anu = await primbon.nomer_hoki(Number(text))
  if (anu.status == false) return reply(anu.message)
  reply(`• *Nomor HP:* ${anu.message.nomer_hp}\n• *Angka Shuzi:* ${anu.message.angka_shuzi}\n• *Energi Positif:*\n- Kekayaan: ${anu.message.energi_positif.kekayaan}\n- Kesehatan: ${anu.message.energi_positif.kesehatan}\n- Cinta: ${anu.message.energi_positif.cinta}\n- Kestabilan: ${anu.message.energi_positif.kestabilan}\n- Persentase: ${anu.message.energi_positif.persentase}\n• *Energi Negatif:*\n- Perselisihan: ${anu.message.energi_negatif.perselisihan}\n- Kehilangan: ${anu.message.energi_negatif.kehilangan}\n- Malapetaka: ${anu.message.energi_negatif.malapetaka}\n- Kehancuran: ${anu.message.energi_negatif.kehancuran}\n- Persentase: ${anu.message.energi_negatif.persentase}`)
}
break
case "artimimpi": case "tafsirmimpi": {
  if (!text) return reply(`Contoh: ${prefix + command} belanja`)
  let anu = await primbon.tafsir_mimpi(text)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Mimpi:* ${anu.message.mimpi}\n• *Arti:* ${anu.message.arti}\n• *Solusi:* ${anu.message.solusi}`)
}
break
case "ramalanjodoh": case "ramaljodoh": {
  if (!text) return reply(`Contoh: ${prefix + command} Dika, 7, 7, 2005, Novia, 16, 11, 2004`)
  let [nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2] = text.split`,`
  let anu = await primbon.ramalan_jodoh(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Nama Anda:* ${anu.message.nama_anda.nama}\n• *Lahir Anda:* ${anu.message.nama_anda.tgl_lahir}\n• *Nama Pasangan:* ${anu.message.nama_pasangan.nama}\n• *Lahir Pasangan:* ${anu.message.nama_pasangan.tgl_lahir}\n• *Hasil:* ${anu.message.result}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "ramalanjodohbali": case "ramaljodohbali": {
  if (!text) return reply(`Contoh: ${prefix + command} Dika, 7, 7, 2005, Novia, 16, 11, 2004`)
  let [nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2] = text.split`,`
  let anu = await primbon.ramalan_jodoh_bali(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Nama Anda:* ${anu.message.nama_anda.nama}\n• *Lahir Anda:* ${anu.message.nama_anda.tgl_lahir}\n• *Nama Pasangan:* ${anu.message.nama_pasangan.nama}\n• *Lahir Pasangan:* ${anu.message.nama_pasangan.tgl_lahir}\n• *Hasil:* ${anu.message.result}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "suamiistri": {
  if (!text) return reply(`Contoh: ${prefix + command} Dika, 7, 7, 2005, Novia, 16, 11, 2004`)
  let [nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2] = text.split`,`
  let anu = await primbon.suami_istri(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Nama Suami:* ${anu.message.suami.nama}\n• *Lahir Suami:* ${anu.message.suami.tgl_lahir}\n• *Nama Istri:* ${anu.message.istri.nama}\n• *Lahir Istri:* ${anu.message.istri.tgl_lahir}\n• *Hasil:* ${anu.message.result}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "ramalancinta": case "ramalcinta": {
  if (!text) return reply(`Contoh: ${prefix + command} Dika, 7, 7, 2005, Novia, 16, 11, 2004`)
  let [nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2] = text.split`,`
  let anu = await primbon.ramalan_cinta(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Nama Anda:* ${anu.message.nama_anda.nama}\n• *Lahir Anda:* ${anu.message.nama_anda.tgl_lahir}\n• *Nama Pasangan:* ${anu.message.nama_pasangan.nama}\n• *Lahir Pasangan:* ${anu.message.nama_pasangan.tgl_lahir}\n• *Sisi Positif:* ${anu.message.sisi_positif}\n• *Sisi Negatif:* ${anu.message.sisi_negatif}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "artinama": {
  if (!text) return reply(`Contoh: ${prefix + command} Dika Ardianta`)
  let anu = await primbon.arti_nama(text)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Nama:* ${anu.message.nama}\n• *Arti:* ${anu.message.arti}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "kecocokannama": case "cocoknama": {
  if (!text) return reply(`Contoh: ${prefix + command} Dika, 7, 7, 2005`)
  let [nama, tgl, bln, thn] = text.split`,`
  let anu = await primbon.kecocokan_nama(nama, tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Nama:* ${anu.message.nama}\n• *Lahir:* ${anu.message.tgl_lahir}\n• *Life Path:* ${anu.message.life_path}\n• *Destiny:* ${anu.message.destiny}\n• *Destiny Desire:* ${anu.message.destiny_desire}\n• *Personality:* ${anu.message.personality}\n• *Persentase:* ${anu.message.persentase_kecocokan}`)
}
break
case "kecocokanpasangan": case "cocokpasangan": case "pasangan": {
  if (!text) return reply(`Contoh: ${prefix + command} Dika|Novia`)
  let [nama1, nama2] = text.split`|`
  let anu = await primbon.kecocokan_nama_pasangan(nama1, nama2)
  if (anu.status == false) return reply(anu.message)
  await russyuroku.sendMessage(m.chat, { image: { url: anu.message.gambar }, caption: `• *Nama Anda:* ${anu.message.nama_anda}\n• *Nama Pasangan:* ${anu.message.nama_pasangan}\n• *Sisi Positif:* ${anu.message.sisi_positif}\n• *Sisi Negatif:* ${anu.message.sisi_negatif}` }, { quoted: m })
}
break
case "jadianpernikahan": case "jadiannikah": {
  if (!text) return reply(`Contoh: ${prefix + command} 6, 12, 2020`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.tanggal_jadian_pernikahan(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Tanggal Pernikahan:* ${anu.message.tanggal}\n• *Karakteristik:* ${anu.message.karakteristik}`)
}
break
case "sifatusaha": {
  if (!text) return reply(`Contoh: ${prefix + command} 28, 12, 2021`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.sifat_usaha_bisnis(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Lahir:* ${anu.message.hari_lahir}\n• *Usaha:* ${anu.message.usaha}`)
}
break
case "rejeki": case "rezeki": {
  if (!text) return reply(`Contoh: ${prefix + command} 7, 7, 2005`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.rejeki_hoki_weton(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Lahir:* ${anu.message.hari_lahir}\n• *Rezeki:* ${anu.message.rejeki}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "pekerjaan": {
  if (!text) return reply(`Contoh: ${prefix + command} 7, 7, 2005`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.pekerjaan_weton_lahir(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Lahir:* ${anu.message.hari_lahir}\n• *Pekerjaan:* ${anu.message.pekerjaan}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "ramalannasib": case "ramalnasib": case "nasib": {
  if (!text) return reply(`Contoh: ${prefix + command} 7, 7, 2005`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.ramalan_nasib(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Analisa:* ${anu.message.analisa}\n• *Angka Akar:* ${anu.message.angka_akar}\n• *Sifat:* ${anu.message.sifat}\n• *Elemen:* ${anu.message.elemen}\n• *Angka Keberuntungan:* ${anu.message.angka_keberuntungan}`)
}
break
case "potensipenyakit": case "penyakit": {
  if (!text) return reply(`Contoh: ${prefix + command} 7, 7, 2005`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.cek_potensi_penyakit(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Analisa:* ${anu.message.analisa}\n• *Sektor:* ${anu.message.sektor}\n• *Elemen:* ${anu.message.elemen}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "artitarot": case "tarot": {
  if (!text) return reply(`Contoh: ${prefix + command} 7, 7, 2005`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.arti_kartu_tarot(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  await russyuroku.sendMessage(m.chat, { image: { url: anu.message.image }, caption: `• *Lahir:* ${anu.message.tgl_lahir}\n• *Simbol Tarot:* ${anu.message.simbol_tarot}\n• *Arti:* ${anu.message.arti}\n• *Catatan:* ${anu.message.catatan}` }, { quoted: m })
}
break
case "fengshui": {
  if (!text) return reply(`Contoh: ${prefix + command} Dika, 1, 2005\n\nKeterangan: Nama, gender, tahun lahir\nGender: 1 untuk laki-laki & 2 untuk perempuan`)
  let [nama, gender, tahun] = text.split`,`
  let anu = await primbon.perhitungan_feng_shui(nama, gender, tahun)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Nama:* ${anu.message.nama}\n• *Lahir:* ${anu.message.tahun_lahir}\n• *Gender:* ${anu.message.jenis_kelamin}\n• *Angka Kua:* ${anu.message.angka_kua}\n• *Kelompok:* ${anu.message.kelompok}\n• *Karakter:* ${anu.message.karakter}\n• *Sektor Baik:* ${anu.message.sektor_baik}\n• *Sektor Buruk:* ${anu.message.sektor_buruk}`)
}
break
case "haribaik": {
  if (!text) return reply(`Contoh: ${prefix + command} 7, 7, 2005`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.petung_hari_baik(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Lahir:* ${anu.message.tgl_lahir}\n• *Kala Tinantang:* ${anu.message.kala_tinantang}\n• *Info:* ${anu.message.info}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "harisangar": case "taliwangke": {
  if (!text) return reply(`Contoh: ${prefix + command} 7, 7, 2005`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.hari_sangar_taliwangke(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Lahir:* ${anu.message.tgl_lahir}\n• *Hasil:* ${anu.message.result}\n• *Info:* ${anu.message.info}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "harinaas": case "harisial": {
  if (!text) return reply(`Contoh: ${prefix + command} 7, 7, 2005`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.primbon_hari_naas(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Hari Lahir:* ${anu.message.hari_lahir}\n• *Tanggal Lahir:* ${anu.message.tgl_lahir}\n• *Hari Naas:* ${anu.message.hari_naas}\n• *Info:* ${anu.message.catatan}\n• *Catatan:* ${anu.message.info}`)
}
break
case "nagahari": case "harinaga": {
  if (!text) return reply(`Contoh: ${prefix + command} 7, 7, 2005`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.rahasia_naga_hari(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Hari Lahir:* ${anu.message.hari_lahir}\n• *Tanggal Lahir:* ${anu.message.tgl_lahir}\n• *Arah Naga Hari:* ${anu.message.arah_naga_hari}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "arahrejeki": case "arahrezeki": {
  if (!text) return reply(`Contoh: ${prefix + command} 7, 7, 2005`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.primbon_arah_rejeki(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Hari Lahir:* ${anu.message.hari_lahir}\n• *Tanggal Lahir:* ${anu.message.tgl_lahir}\n• *Arah Rezeki:* ${anu.message.arah_rejeki}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "peruntungan": {
  if (!text) return reply(`Contoh: ${prefix + command} Dika, 7, 7, 2005, 2022\n\nKeterangan: Nama, tanggal lahir, bulan lahir, tahun lahir, untuk tahun`)
  let [nama, tgl, bln, thn, untuk] = text.split`,`
  let anu = await primbon.ramalan_peruntungan(nama, tgl, bln, thn, untuk)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Nama:* ${anu.message.nama}\n• *Lahir:* ${anu.message.tgl_lahir}\n• *Peruntungan Tahun:* ${anu.message.peruntungan_tahun}\n• *Hasil:* ${anu.message.result}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "weton": case "wetonjawa": {
  if (!text) return reply(`Contoh: ${prefix + command} 7, 7, 2005`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.weton_jawa(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Tanggal:* ${anu.message.tanggal}\n• *Jumlah Neptu:* ${anu.message.jumlah_neptu}\n• *Watak Hari:* ${anu.message.watak_hari}\n• *Naga Hari:* ${anu.message.naga_hari}\n• *Jam Baik:* ${anu.message.jam_baik}\n• *Watak Kelahiran:* ${anu.message.watak_kelahiran}`)
}
break
case "sifat": case "karakter": {
  if (!text) return reply(`Contoh: ${prefix + command} Dika, 7, 7, 2005`)
  let [nama, tgl, bln, thn] = text.split`,`
  let anu = await primbon.sifat_karakter_tanggal_lahir(nama, tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Nama:* ${anu.message.nama}\n• *Lahir:* ${anu.message.tgl_lahir}\n• *Garis Hidup:* ${anu.message.garis_hidup}`)
}
break
case "keberuntungan": {
  if (!text) return reply(`Contoh: ${prefix + command} Dika, 7, 7, 2005`)
  let [nama, tgl, bln, thn] = text.split`,`
  let anu = await primbon.potensi_keberuntungan(nama, tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Nama:* ${anu.message.nama}\n• *Lahir:* ${anu.message.tgl_lahir}\n• *Hasil:* ${anu.message.result}`)
}
break
case "memancing": {
  if (!text) return reply(`Contoh: ${prefix + command} 12, 1, 2022`)
  let [tgl, bln, thn] = text.split`,`
  let anu = await primbon.primbon_memancing_ikan(tgl, bln, thn)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Tanggal:* ${anu.message.tgl_memancing}\n• *Hasil:* ${anu.message.result}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "masasubur": {
  if (!text) return reply(`Contoh: ${prefix + command} 12, 1, 2022, 28\n\nKeterangan: hari pertama menstruasi, siklus`)
  let [tgl, bln, thn, siklus] = text.split`,`
  let anu = await primbon.masa_subur(tgl, bln, thn, siklus)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Hasil:* ${anu.message.result}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "zodiak": case "zodiac": {
  if (!text) return reply(`Contoh: ${prefix + command} 7-7-2005 (format: tanggal-bulan-tahun)`)
  const zodiakTable = [
    ["capricorn", new Date(1970, 0, 1)],
    ["aquarius", new Date(1970, 0, 20)],
    ["pisces", new Date(1970, 1, 19)],
    ["aries", new Date(1970, 2, 21)],
    ["taurus", new Date(1970, 3, 21)],
    ["gemini", new Date(1970, 4, 21)],
    ["cancer", new Date(1970, 5, 22)],
    ["leo", new Date(1970, 6, 23)],
    ["virgo", new Date(1970, 7, 23)],
    ["libra", new Date(1970, 8, 23)],
    ["scorpio", new Date(1970, 9, 23)],
    ["sagittarius", new Date(1970, 10, 22)],
    ["capricorn", new Date(1970, 11, 22)]
  ].reverse()

  function getZodiacName(month, day) {
    let d = new Date(1970, month - 1, day)
    let found = zodiakTable.find(([, _d]) => d >= _d)
    return found ? found[0] : "capricorn"
  }

  let parts = text.split(/[-\/, ]+/).map(v => v.trim()).filter(Boolean)
  if (parts.length < 3) return reply(`Format salah. Contoh: ${prefix + command} 7-7-2005`)
  let [tgl, bln] = parts

  let zodiacName = getZodiacName(Number(bln), Number(tgl))
  let anu = await primbon.zodiak(zodiacName)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Zodiak:* ${anu.message.zodiak}\n• *Nomor:* ${anu.message.nomor_keberuntungan}\n• *Aroma:* ${anu.message.aroma_keberuntungan}\n• *Planet:* ${anu.message.planet_yang_mengitari}\n• *Bunga:* ${anu.message.bunga_keberuntungan}\n• *Warna:* ${anu.message.warna_keberuntungan}\n• *Batu:* ${anu.message.batu_keberuntungan}\n• *Elemen:* ${anu.message.elemen_keberuntungan}\n• *Pasangan Zodiak:* ${anu.message.pasangan_zodiak}\n• *Catatan:* ${anu.message.catatan}`)
}
break
case "shio": {
  if (!text) return reply(`Contoh: ${prefix + command} tikus`)
  let anu = await primbon.shio(text)
  if (anu.status == false) return reply(anu.message)
  reply(`• *Hasil:* ${anu.message}`)
}
break

case "styletext": case "style": {
  if (!text) return reply(`Masukkan teks yang mau diubah gaya hurufnya!\n\nContoh: ${prefix + command} Yuroku`)
  try {
    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    const { data } = await axios.get(`https://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(text)}`);
    const $ = cheerio.load(data);
    const hasil = [];
    $("table > tbody > tr").each((i, el) => {
      const name = $(el).find("td:nth-child(1) > span").text();
      const result = $(el).find("td:nth-child(2)").text().trim();
      if (name && result) hasil.push({ name, result });
    });
    if (!hasil.length) return reply("Gagal mengambil hasil style text, coba lagi nanti.");
    let out = `✨ *Style Text dari:* ${text}\n\n`;
    for (const i of hasil.slice(0, 40)) out += `*${i.name}:* ${i.result}\n\n`;
    reply(out.trim());
  } catch (err) {
    console.error("[styletext] error:", err);
    reply("Gagal mengambil style text, coba lagi nanti.");
  }
}
break
case "obfuscate": case "obfus": case "jsobfus": {
  if (!text) return reply(`Masukkan kode JavaScript yang mau di-obfuscate!\n\nContoh: ${prefix + command} console.log("halo")`)
  try {
    const result = JavaScriptObfuscator.obfuscate(text, {
      compact: false,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      stringArrayShuffle: true,
      splitStrings: true,
      stringArrayThreshold: 1,
    });
    reply(`✅ *Berhasil di-obfuscate:*\n\n\`\`\`${result.getObfuscatedCode()}\`\`\``);
  } catch (err) {
    console.error("[obfuscate] error:", err);
    reply(`Gagal obfuscate kode: ${err?.message || "Unknown error"}`);
  }
}
break
case "toqr": {
  if (!text) return reply(`Masukkan teks atau link yang mau dijadikan QR code!\n\nContoh: ${prefix + command} https://saurusdev.cloud`)
  try {
    const qrBuffer = await QRCode.toBuffer(text, { scale: 10 });
    await russyuroku.sendMessage(m.chat, { image: qrBuffer, caption: "✅ QR Code berhasil dibuat!" }, { quoted: m });
  } catch (err) {
    console.error("[toqr] error:", err);
    reply("Gagal membuat QR code, coba lagi nanti.");
  }
}
break
case "ssweb": case "ss": {
  if (!text) return reply(`Masukkan link web yang mau di-screenshot!\n\nContoh: ${prefix + command} nasa.gov`)
  try {
    await russyuroku.sendMessage(m.chat, { react: { text: "📸", key: m.key } });
    let url = text.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
    const response = await axios.get(`https://image.thum.io/get/png/fullpage/viewportWidth/2400/${url}`, { responseType: "arraybuffer" });
    await russyuroku.sendMessage(m.chat, { image: response.data, caption: `📸 *Hasil screenshot:* ${url}` }, { quoted: m });
  } catch (err) {
    console.error("[ssweb] error:", err);
    reply("Gagal mengambil screenshot, coba lagi nanti.");
  }
}
break

case "fitnah": {
  if (!text) return reply(
    `Example : ${prefix + command} pesan target|pesan mu|nomor/tag target`
  )

  try {
    await russyuroku.sendMessage(m.chat, {
      react: { text: "🎭", key: m.key }
    });

    let [teks1, teks2, teks3] = text.split("|");
    if (!teks1 || !teks2 || !teks3) {
      await russyuroku.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      return reply(`Example : ${prefix + command} pesan target|pesan mu|nomor/tag target`);
    }

    let target = teks3.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    let fakeQuoted = {
      key: {
        fromMe: false,
        participant: target,
        ...(m.isGroup ? { remoteJid: m.chat } : { remoteJid: target })
      },
      message: {
        conversation: teks1.trim()
      }
    };

    await russyuroku.sendMessage(m.chat, { text: teks2.trim() }, { quoted: fakeQuoted });

    await russyuroku.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    });

  } catch (err) {
    console.error("[fitnah] error:", err);
    await russyuroku.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    });
    reply("Gagal membuat fitnah, coba lagi nanti.");
  }
}
break
case "rate":
case "nilai": {
  try {
    await russyuroku.sendMessage(m.chat, {
      react: { text: "🎲", key: m.key }
    });

    const rate = Math.floor(Math.random() * 100);

    await russyuroku.sendMessage(m.chat, {
      text: `Rate Bot : *${rate}%*`
    }, { quoted: m });

  } catch (err) {
    console.error("[rate] error:", err);
    reply("Gagal mengambil rate, coba lagi nanti.");
  }
}
break
case "jodohku": {
  if (!m.isGroup) return reply(global.mess.group);

  try {
    await russyuroku.sendMessage(m.chat, {
      react: { text: "💘", key: m.key }
    });

    let member = (store.groupMetadata?.[m.chat]?.participants || m.metadata?.participants || []).map(a => a.phoneNumber);
    if (member.length === 0) {
      await russyuroku.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      return reply("Data member grup tidak tersedia! Harap coba lagi nanti.");
    }

    let jodoh = pickRandom(member);

    await russyuroku.sendMessage(m.chat, {
      text: `👫 Jodoh mu adalah\n@${m.sender.split("@")[0]} ❤ @${jodoh ? jodoh.split("@")[0] : "0"}`,
      mentions: [m.sender, jodoh].filter(Boolean)
    }, { quoted: m });

    await russyuroku.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    });

  } catch (err) {
    console.error("[jodohku] error:", err);
    await russyuroku.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    });
    reply("Gagal mencari jodoh, coba lagi nanti.");
  }
}
break
case "jadian": {
  if (!m.isGroup) return reply(global.mess.group);

  try {
    await russyuroku.sendMessage(m.chat, {
      react: { text: "💖", key: m.key }
    });

    let member = (store.groupMetadata?.[m.chat]?.participants || m.metadata?.participants || []).map(a => a.phoneNumber);
    if (member.length === 0) {
      await russyuroku.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      return reply("Data member grup tidak tersedia! Harap coba lagi nanti.");
    }

    let jadian1 = pickRandom(member);
    let jadian2 = pickRandom(member);

    await russyuroku.sendMessage(m.chat, {
      text: `Ciee yang Jadian💖 Jangan lupa Donasi🗿\n@${jadian1.split("@")[0]} ❤ @${jadian2.split("@")[0]}`,
      mentions: [jadian1, jadian2].filter(Boolean)
    }, { quoted: m });

    await russyuroku.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    });

  } catch (err) {
    console.error("[jadian] error:", err);
    await russyuroku.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    });
    reply("Gagal mencari jadian, coba lagi nanti.");
  }
}
break
case "coba": {
  try {
    await russyuroku.sendMessage(m.chat, {
      react: { text: "🎰", key: m.key }
    });

    let anu = [
      "Aku Monyet", "Aku Kera", "Aku Tolol", "Aku Kaya",
      "Aku Dewa", "Aku Anjing", "Aku Dongo", "Aku Raja",
      "Aku Sultan", "Aku Baik", "Aku Hitam", "Aku Suki", "Aku goblok", "Aku setan", "Aku pinter"
    ];

    const b1 = pickRandom(anu);
    const b2 = pickRandom(anu);
    try {
      await new ButtonV2(russyuroku)
        .setBody("Semoga Hoki😹")
        .setFooter(global.foother || "")
        .addButton(b1, `${prefix}teshoki`)
        .addButton(b2, `${prefix}cobacoba`)
        .send(m.chat, { quoted: m });
    } catch (btnErr) {

      console.error("[coba] button gagal, fallback teks:", btnErr?.message || btnErr);
      await russyuroku.sendMessage(m.chat, {
        text: `Semoga Hoki😹\n\n1. ${b1}\n2. ${b2}\n\nKetik *${prefix}teshoki* atau *${prefix}cobacoba* untuk coba lagi.`
      }, { quoted: m });
    }

    await russyuroku.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    });

  } catch (err) {
    console.error("[coba] error:", err);
    await russyuroku.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    });
    reply("Gagal kirim button, coba lagi nanti.");
  }
}
break
case "teshoki":
case "cobacoba": {

  const hasil = pickRandom([
    "Aku Monyet", "Aku Kera", "Aku Tolol", "Aku Kaya",
    "Aku Dewa", "Aku Anjing", "Aku Dongo", "Aku Raja",
    "Aku Sultan", "Aku Baik", "Aku Hitam", "Aku Suki", "Aku goblok", "Aku setan", "Aku pinter"
  ]);
  reply(`🎰 Hasilnya: *${hasil}*`);
}
break
case "kiss":
case "cium": {
  if (!m.isGroup) return reply(global.mess.group);
  if (!m.mentionedJid || m.mentionedJid.length < 1)
    return reply(`❌ Tag seseorang!\nContoh: *.${command} @username*`);

  const toPn = async (jid) => {
    if (jid && jid.endsWith("@lid")) {
      return await russyuroku.resolvePn(jid, groupMetadata).catch(() => jid);
    }
    return jid;
  };
  const sender = await toPn(m.sender);
  const target = await toPn(m.mentionedJid[0]);
  if (areJidsSameUser(target, sender) || target === sender)
    return reply("😆 Masa cium diri sendiri?");
  if (target.endsWith("@lid"))
    return reply(`⚠️ Gagal mengenali nomor asli @${target.split("@")[0]}. Coba lagi sebentar ya.`);

  try {
    await russyuroku.sendMessage(m.chat, { react: { text: "💋", key: m.key } });

    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const a = `@${sender.split("@")[0]}`;
    const b = `@${target.split("@")[0]}`;

    const canvas = createCanvas(1000, 600);
    const ctx = canvas.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 1000, 600);
    g.addColorStop(0, "#001F3F"); g.addColorStop(0.5, "#0074D9"); g.addColorStop(1, "#00BFFF");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1000, 600);
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1000, Math.random() * 600, Math.random() * 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fill();
    }

    const getPfp = async (jid) => {
      let url;
      try { url = await russyuroku.profilePictureUrl(jid, "image"); } catch {}
      for (const src of [url, global.fallbackPfp]) {
        if (!src) continue;
        try { return await loadImage(src); }
        catch (e) { console.error("[kiss] gagal muat gambar:", src, "-", e.message); }
      }
      throw new Error("foto profil & fallbackPfp tidak bisa dimuat");
    };
    const [senderImg, targetImg] = await Promise.all([getPfp(sender), getPfp(target)]);

    const drawCircle = (img, x, y) => {
      const r = 130;
      const grad = ctx.createRadialGradient(x, y, 80, x, y, 150);
      grad.addColorStop(0, "rgba(0,191,255,0.8)");
      grad.addColorStop(1, "rgba(0,0,128,0)");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(x, y, r + 15, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
      ctx.restore();
      ctx.strokeStyle = "#00BFFF"; ctx.lineWidth = 4;
      ctx.shadowColor = "#1E90FF"; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 0;
    };
    drawCircle(senderImg, 330, 300);
    drawCircle(targetImg, 670, 300);

    ctx.font = "120px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("💋", 500, 330);

    ctx.font = "bold 26px Segoe UI";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.textAlign = "right";
    ctx.fillText(global.namabot || "Bot", 980, 580);

    const teksVariasi = [
      `${a} mencium ${b} dengan penuh cinta 💞`,
      `${a} mencuri ciuman dari ${b} 😳💋`,
      `${a} ngasih ciuman manis ke ${b} 😚`,
      `${a} dan ${b} saling berpandangan... lalu 💋`,
      `Ciuman hangat dari ${a} untuk ${b} 🩵`,
      `${b} berusaha kabur, tapi ${a} lebih cepat 😘`,
      `${a} menatap ${b} lalu *mwaah~* 😳`,
      `${b} langsung pipinya merah setelah dicium ${a} 😳`,
      `${a} nyium ${b} di pipi 😚`,
      `${b} pura-pura marah padahal senyum 💙`,
      `${a} dan ${b} terjebak momen romantis 💞`,
      `${a} mencium ${b} di bawah hujan ☔💋`,
      `${b} malu-malu tapi senang 😳💙`,
      `Hati ${b} berdebar kencang setelah dicium ${a} 💓`,
      `${a} gak bisa tahan godaan ${b} 💋`,
      `Ciuman spontan dari ${a} bikin ${b} diam membeku 💋`,
      `${a} akhirnya nyatain perasaan lewat ciuman 💞`,
      `Ciuman pertama antara ${a} dan ${b} 🫣💋`,
      `${a} sukses bikin ${b} klepek-klepek 💞`,
      `Udara tiba-tiba jadi panas gara-gara ${a} 💋 ${b}`,
    ];
    const teks = pick(teksVariasi);

    await russyuroku.sendMessage(m.chat, {
      image: canvas.toBuffer(),
      caption: teks,
      mentions: [sender, target],
    }, { quoted: m });

    await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (err) {
    console.error("[kiss] error:", err);
    await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    reply("Gagal, coba lagi nanti.");
  }
}
break


// ═══════════════════════ QUOTES ═══════════════════════
case "quotesanime": {
    try {
        let res = await axios.get("https://katanime.vercel.app/api/getrandom?limit=1")
        let json = res.data
        if (!json.result || !json.result[0]) return reply("Gagal ambil quotes, coba lagi.")
        let { indo, character, anime } = json.result[0]
        reply(`${indo}\n\n📮 By: _${character}_\nAnime: ${anime}`)
    } catch (err) {
        console.error(err)
        reply("Gagal ambil quotes anime, coba lagi nanti.")
    }
}
break

case "quotesbucin": {
    const quotesbucin = [
    "Aku memilih untuk sendiri, bukan karena menunggu yang sempurna, tetapi butuh yang tak pernah menyerah.",
    "Seorang yang single diciptakan bersama pasangan yang belum ditemukannya.",
    "Jomblo. Mungkin itu cara Tuhan untuk mengatakan 'Istirahatlah dari cinta yang salah'.",
    "Jomblo adalah anak muda yang mendahulukan pengembangan pribadinya untuk cinta yang lebih berkelas nantinya.",
    "Aku bukan mencari seseorang yang sempurna, tapi aku mencari orang yang menjadi sempurna berkat kelebihanku.",
    "Pacar orang adalah jodoh kita yang tertunda.",
    "Jomblo pasti berlalu. Semua ada saatnya, saat semua kesendirian menjadi sebuah kebersamaan dengannya kekasih halal. Bersabarlah.",
    "Romeo rela mati untuk juliet, Jack mati karena menyelamatkan Rose. Intinya, kalau tetap mau hidup, jadilah single.",
    "Aku mencari orang bukan dari kelebihannya tapi aku mencari orang dari ketulusan hatinya.",
    "Jodoh bukan sendal jepit, yang kerap tertukar. Jadi teruslah berada dalam perjuangan yang semestinya.",
    "Kalau kamu jadi senar gitar, aku nggak mau jadi gitarisnya. Karena aku nggak mau mutusin kamu.",
    "Bila mencintaimu adalah ilusi, maka izinkan aku berimajinasi selamanya.",
    "Sayang... Tugas aku hanya mencintaimu, bukan melawan takdir.",
    "Saat aku sedang bersamamu rasanya 1 jam hanya 1 detik, tetapi jika aku jauh darimu rasanya 1 hari menjadi 1 tahun.",
    "Kolak pisang tahu sumedang, walau jarak membentang cintaku takkan pernah hilang.",
    "Aku ingin menjadi satu-satunya, bukan salah satunya.",
    "Aku tidak bisa berjanji untuk menjadi yang baik. Tapi aku berjanji akan selalu mendampingi kamu.",
    "Kalau aku jadi wakil rakyat aku pasti gagal, gimana mau mikirin rakyat kalau yang selalu ada dipikiran aku hanyalah dirimu.",
    "Lihat kebunku, penuh dengan bunga. Lihat matamu, hatiku berbunga-bunga.",
    "Berjanjilah untuk terus bersamaku sekarang, esok, dan selamanya.",
    "Rindu tidak hanya muncul karena jarak yang terpisah. Tapi juga karena keinginan yang tidak terwujud.",
    "Kamu tidak akan pernah jauh dariku, kemanapun aku pergi kamu selalu ada, karena kamu selalu di hatiku, yang jauh hanya raga kita bukan hati kita.",
    "Aku tahu dalam setiap tatapanku, kita terhalang oleh jarak dan waktu. Tapi aku yakin kalau nanti kita pasti bisa bersatu.",
    "Merindukanmu tanpa pernah bertemu sama halnya dengan menciptakan lagu yang tak pernah ternyayikan.",
    "Ada kalanya jarak selalu menjadi penghalang antara aku sama kamu, namun tetap saja di hatiku kita selalu dekat.",
    "Jika hati ini tak mampu membendung segala kerinduan, apa daya tak ada yang bisa aku lakukan selain mendoakanmu.",
    "Mungkin di saat ini aku hanya bisa menahan kerinduan ini. Sampai tiba saatnya nanti aku bisa bertemu dan melepaskan kerinduan ini bersamamu.",
    "Melalui rasa rindu yang bergejolak dalam hati, di situ terkadang aku sangat membutuhkan dekap peluk kasih sayangmu.",
    "Dalam dinginnya malam, tak kuingat lagi; Berapa sering aku memikirkanmu juga merindukanmu.",
    "Merindukanmu itu seperti hujan yang datang tiba-tiba dan bertahan lama. Dan bahkan setelah hujan reda, rinduku masih terasa.",
    "Sejak mengenalmu bawaannya aku pengen belajar terus, belajar menjadi yang terbaik buat kamu.",
    "Tahu gak perbedaan pensi sama wajah kamu? Kalau pensil tulisannya bisa dihapus, tapi kalau wajah kamu gak akan ada yang bisa hapus dari pikiran aku.",
    "Bukan Ujian Nasional besok yang harus aku khawatirkan, tapi ujian hidup yang aku lalui setelah kamu meninggalkanku.",
    "Satu hal kebahagiaan di sekolah yang terus membuatku semangat adalah bisa melihat senyumanmu setiap hari.",
    "Kamu tahu gak perbedaanya kalau ke sekolah sama ke rumah kamu? Kalo ke sekolah pasti yang di bawa itu buku dan pulpen, tapi kalo ke rumah kamu, aku cukup membawa hati dan cinta.",
    "Aku gak sedih kok kalo besok hari senin, aku sedihnya kalau gak ketemu kamu.",
    "Momen cintaku tegak lurus dengan momen cintamu. Menjadikan cinta kita sebagai titik ekuilibrium yang sempurna.",
    "Aku rela ikut lomba lari keliling dunia, asalkan engkai yang menjadi garis finishnya.",
    "PR-ku adalah merindukanmu. Lebih kuat dari Matematika, lebih luas dari Fisika, lebih kerasa dari Biologi.",
    "Cintaku kepadamu itu bagaikan metabolisme, yang gak akan berhenti sampai mati.",
    "Kalau jelangkungnya kaya kamu, dateng aku jemput, pulang aku anter deh.",
    "Makan apapun aku suka asal sama kamu, termasuk makan ati.",
    "Cinta itu kaya hukuman mati. Kalau nggak ditembak, ya digantung.",
    "Mencintaimu itu kayak narkoba: sekali coba jadi candu, gak dicoba bikin penasaran, ditinggalin bikin sakaw.",
    "Gue paling suka ngemil karena ngemil itu enak. Apalagi ngemilikin kamu sepenuhnya...",
    "Dunia ini cuma milik kita berdua. Yang lainnya cuma ngontrak.",
    "Bagi aku, semua hari itu adalah hari Selasa. Selasa di Surga bila dekat denganmu...",
    "Bagaimana kalau kita berdua jadi komplotan penjahat? Aku curi hatimu dan kamu curi hatiku.",
    "Kamu itu seperti kopi yang aku seruput pagi ini. Pahit, tapi bikin nagih.",
    "Aku sering cemburu sama lipstikmu. Dia bisa nyium kamu tiap hari, dari pagi sampai malam.",
    "Hanya mendengar namamu saja sudah bisa membuatku tersenyum seperti orang bodoh.",
    "Aku tau teman wanitamu bukan hanya satu, dan menyukaimu pun bukan hanya aku.",
    "Semenjak aku berhenti berharap pada dirimu, aku jadi tidak semangat dalam segala hal..",
    "Denganmu, jatuh cinta adalah patah hati paling sengaja.",
    "Sangat sulit merasakan kebahagiaan hidup tanpa kehadiran kamu disisiku.",
    "Melalui rasa rindu yang bergejolak dalam hati, di situ terkadang aku sangat membutuhkan dekap peluk kasih sayangmu.",
    "Sendainya kamu tahu, sampai saat ini aku masih mencintaimu.",
    "Terkadang aku iri sama layangan..talinya putus saja masih dikejar kejar dan gak rela direbut orang lain...",
    "Aku tidak tahu apa itu cinta, sampai akhirnya aku bertemu denganmu. Tapi, saat itu juga aku tahu rasanya patah hati.",
    "Mengejar itu capek, tapi lebih capek lagi menunggu\nMenunggu kamu menyadari keberadaanku...",
    "Jangan berhenti mencinta hanya karena pernah terluka. Karena tak ada pelangi tanpa hujan, tak ada cinta sejati tanpa tangisan.",
    "Aku punya sejuta alasan unutk melupakanmu, tapi tak ada yang bisa memaksaku untuk berhenti mencintaimu.",
    "Terkadang seseorang terasa sangat bodoh hanya untuk mencintai seseorang.",
    "Kamu adalah patah hati terbaik yang gak pernah aku sesali.",
    "Bukannya tak pantas ditunggu, hanya saja sering memberi harapan palsu.",
    "Sebagian diriku merasa sakit, Mengingat dirinya yang sangat dekat, tapi tak tersentuh.",
    "Hal yang terbaik dalam mencintai seseorang adalah dengan diam-diam mendo akannya.",
    "Kuharap aku bisa menghilangkan perasaan ini secepat aku kehilanganmu.",
    "Demi cinta kita menipu diri sendiri. Berusaha kuat nyatanya jatuh secara tak terhormat.",
    "Anggaplah aku rumahmu, jika kamu pergi kamu mengerti kemana arah pulang. Menetaplah bila kamu mau dan pergilah jika kamu bosan...",
    "Aku bingung, apakah aku harus kecewa atu tidak? Jika aku kecewa, emang siapa diriku baginya?\n\nKalau aku tidak kecewa, tapi aku menunggu ucapannya.",
    "Rinduku seperti ranting yang tetap berdiri.Meski tak satupun lagi dedaunan yang menemani, sampai akhirnya mengering, patah, dan mati.",
    "Kurasa kita sekarang hanya dua orang asing yang memiliki kenangan yang sama.",
    "Buatlah aku bisa membencimu walau hanya beberapa menit, agar tidak terlalu berat untuk melupakanmu.",
    "Aku mencintaimu dengan segenap hatiku, tapi kau malah membagi perasaanmu dengan orang lain.",
    "Mencintaimu mungkin menghancurkanku, tapi entah bagaimana meninggalkanmu tidak memperbaikiku.",
    "Kamu adalah yang utama dan pertama dalam hidupku. Tapi, aku adalah yang kedua bagimu.",
    "Jika kita hanya bisa dipertemukan dalam mimpi, aku ingin tidur selamanya.",
    "Melihatmu bahagia adalah kebahagiaanku, walaupun bahagiamu tanpa bersamaku.",
    "Aku terkadang iri dengan sebuah benda. Tidak memiliki rasa namun selalu dibutuhkan. Berbeda dengan aku yang memiliki rasa, namun ditinggalkan dan diabaikan...",
    "Bagaimana mungkin aku berpindah jika hanya padamu hatiku bersinggah?",
    "Kenangan tentangmu sudah seperti rumah bagiku. Sehingga setiap kali pikiranku melayang, pasti ujung-ujungnya akan selalu kembali kepadamu.",
    "Kenapa tisue bermanfaat? Karena cinta tak pernah kemarau. - Sujiwo Tejo",
    "Kalau mencintaimu adalah kesalahan, yasudah, biar aku salah terus saja.",
    "Sejak kenal kamu, aku jadi pengen belajar terus deh. Belajar jadi yang terbaik buat kamu.",
    "Ada yang bertingkah bodoh hanya untuk melihatmu tersenyum. Dan dia merasa bahagia akan hal itu.",
    "Aku bukan orang baik, tapi akan belajar jadi yang terbaik untuk kamu.",
    "Kita tidak mati, tapi lukanya yang membuat kita tidak bisa berjalan seperti dulu lagi.",
    "keberadaanmu bagaikan secangkir kopi yang aku butuhkan setiap pagi, yang dapat mendorongku untuk tetap bersemangat menjalani hari.",
    "Aku mau banget ngasih dunia ke kamu. Tapi karena itu nggak mungkin, maka aku akan kasih hal yang paling penting dalam hidupku, yaitu duniaku.",
    "Mending sing humoris tapi manis, ketimbang sok romantis tapi akhire tragis.",
    "Ben akhire ora kecewa, dewe kudu ngerti kapan waktune berharap lan kapan kudu mandeg.",
    "Aku ki wong Jowo seng ora ngerti artine 'I Love U'. Tapi aku ngertine mek 'Aku tresno awakmu'.",
    "Ora perlu ayu lan sugihmu, aku cukup mok setiani wes seneng ra karuan.",
    "Cintaku nang awakmu iku koyok kamera, fokus nang awakmu tok liyane mah ngeblur.",
    "Saben dino kegowo ngimpi tapi ora biso nduweni.",
    "Ora ketemu koe 30 dino rasane koyo sewulan.",
    "Aku tanpamu bagaikan sego kucing ilang karete. Ambyar.",
    "Pengenku, Aku iso muter wektu. Supoyo aku iso nemokne kowe lewih gasik. Ben Lewih dowo wektuku kanggo urip bareng sliramu.",
    "Aku ora pernah ngerti opo kui tresno, kajaba sak bare ketemu karo sliramu.",
    "Cinta aa ka neng moal leungit-leungit sanajan aa geus kawin deui.",
    "Kasabaran kaula aya batasna, tapi cinta kaula ka anjeun henteu aya se epna.",
    "Kanyaah akang moal luntur najan make Bayclean.",
    "Kenangan endah keur babarengan jeung anjeun ek tuluy diinget-inget nepi ka poho.",
    "Kuring moal bakal tiasa hirup sorangan, butuh bantosan jalmi sejen.",
    "Nyaahna aa ka neg teh jiga tukang bank keur nagih hutang (hayoh mumuntil).",
    "Kasabaran urang aya batasna, tapi cinta urang ka maneh moal aya beakna.",
    "Hayang rasana kuring ngarangkai kabeh kata cinta anu aya di dunya ieu, terus bade ku kuring kumpulkeun, supaya anjeun nyaho gede pisan rasa cinta kuring ka anjeun.",
    "Tenang wae neng, ari cinta Akang mah sapertos tembang krispatih; Tak lekang oleh waktu.",
    "Abdi sanes jalmi nu sampurna pikeun anjeun, sareng sanes oge nu paling alus kanggo anjeun. Tapi nu pasti, abdi jalmi hiji-hijina nu terus emut ka anjeun.",
    "Cukup jaringan aja yang hilang, kamu jangan.",
    "Sering sih dibikin makan ati. Tapi menyadari kamu masih di sini bikin bahagia lagi.",
    "Musuhku adalah mereka yang ingin memilikimu juga.",
    "Banyak yang selalu ada, tapi kalo cuma kamu yang aku mau, gimana?",
    "Jam tidurku hancur dirusak rindu.",
    "Cukup China aja yang jauh, cinta kita jangan.",
    "Yang penting itu kebahagiaan kamu, aku sih gak penting..",
    "Cuma satu keinginanku, dicintai olehmu..",
    "Aku tanpamu bagaikan ambulans tanpa wiuw wiuw wiuw.",
    "Cukup antartika aja yang jauh. Antarkita jangan."
]
    const pilih = quotesbucin[Math.floor(Math.random() * quotesbucin.length)]
    reply(typeof pilih === "string" ? pilih : (pilih.arti || pilih.arabic || JSON.stringify(pilih)))
}
break

case "quotesmotivasi": {
    const quotesmotivasi = [
"ᴊᴀɴɢᴀɴ ʙɪᴄᴀʀᴀ, ʙᴇʀᴛɪɴᴅᴀᴋ ꜱᴀᴊᴀ. ᴊᴀɴɢᴀɴ ᴋᴀᴛᴀᴋᴀɴ, ᴛᴜɴᴊᴜᴋᴋᴀɴ ꜱᴀᴊᴀ. ᴊᴀɴɢᴀɴ ᴊᴀɴᴊɪ, ʙᴜᴋᴛɪᴋᴀɴ ꜱᴀᴊᴀ.",
"ᴊᴀɴɢᴀɴ ᴘᴇʀɴᴀʜ ʙᴇʀʜᴇɴᴛɪ ᴍᴇʟᴀᴋᴜᴋᴀɴ ʏᴀɴɢ ᴛᴇʀʙᴀɪᴋ ʜᴀɴʏᴀ ᴋᴀʀᴇɴᴀ ꜱᴇꜱᴇᴏʀᴀɴɢ ᴛɪᴅᴀᴋ ᴍᴇᴍʙᴇʀɪ ᴀɴᴅᴀ ᴘᴇɴɢʜᴀʀɢᴀᴀɴ.",
"ʙᴇᴋᴇʀᴊᴀ ꜱᴀᴀᴛ ᴍᴇʀᴇᴋᴀ ᴛɪᴅᴜʀ. ʙᴇʟᴀᴊᴀʀ ꜱᴀᴀᴛ ᴍᴇʀᴇᴋᴀ ʙᴇʀᴘᴇꜱᴛᴀ. ʜᴇᴍᴀᴛ ꜱᴇᴍᴇɴᴛᴀʀᴀ ᴍᴇʀᴇᴋᴀ ᴍᴇɴɢʜᴀʙɪꜱᴋᴀɴ. ʜɪᴅᴜᴘʟᴀʜ ꜱᴇᴘᴇʀᴛɪ ᴍɪᴍᴘɪ ᴍᴇʀᴇᴋᴀ.",
"ᴋᴜɴᴄɪ ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇᴍᴜꜱᴀᴛᴋᴀɴ ᴘɪᴋɪʀᴀɴ ꜱᴀᴅᴀʀ ᴋɪᴛᴀ ᴘᴀᴅᴀ ʜᴀʟ-ʜᴀʟ ʏᴀɴɢ ᴋɪᴛᴀ ɪɴɢɪɴᴋᴀɴ, ʙᴜᴋᴀɴ ʜᴀʟ-ʜᴀʟ ʏᴀɴɢ ᴋɪᴛᴀ ᴛᴀᴋᴜᴛɪ.",
"ᴊᴀɴɢᴀɴ ᴛᴀᴋᴜᴛ ɢᴀɢᴀʟ. ᴋᴇᴛᴀᴋᴜᴛᴀɴ ʙᴇʀᴀᴅᴀ ᴅɪ ᴛᴇᴍᴘᴀᴛ ʏᴀɴɢ ꜱᴀᴍᴀ ᴛᴀʜᴜɴ ᴅᴇᴘᴀɴ ꜱᴇᴘᴇʀᴛɪ ᴀɴᴅᴀ ꜱᴀᴀᴛ ɪɴɪ.",
"ᴊɪᴋᴀ ᴋɪᴛᴀ ᴛᴇʀᴜꜱ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋɪᴛᴀ ʟᴀᴋᴜᴋᴀɴ, ᴋɪᴛᴀ ᴀᴋᴀɴ ᴛᴇʀᴜꜱ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋɪᴛᴀ ᴅᴀᴘᴀᴛᴋᴀɴ.",
"ᴊɪᴋᴀ ᴀɴᴅᴀ ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴɢᴀᴛᴀꜱɪ ꜱᴛʀᴇꜱ, ᴀɴᴅᴀ ᴛɪᴅᴀᴋ ᴀᴋᴀɴ ᴍᴇɴɢᴇʟᴏʟᴀ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ.",
"ʙᴇʀꜱɪᴋᴀᴘ ᴋᴇʀᴀꜱ ᴋᴇᴘᴀʟᴀ ᴛᴇɴᴛᴀɴɢ ᴛᴜᴊᴜᴀɴ ᴀɴᴅᴀ ᴅᴀɴ ꜰʟᴇᴋꜱɪʙᴇʟ ᴛᴇɴᴛᴀɴɢ ᴍᴇᴛᴏᴅᴇ ᴀɴᴅᴀ.",
"ᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱ ᴍᴇɴɢᴀʟᴀʜᴋᴀɴ ʙᴀᴋᴀᴛ ᴋᴇᴛɪᴋᴀ ʙᴀᴋᴀᴛ ᴛɪᴅᴀᴋ ʙᴇᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱ.",
"ɪɴɢᴀᴛʟᴀʜ ʙᴀʜᴡᴀ ᴘᴇʟᴀᴊᴀʀᴀɴ ᴛᴇʀʙᴇꜱᴀʀ ᴅᴀʟᴀᴍ ʜɪᴅᴜᴘ ʙɪᴀꜱᴀɴʏᴀ ᴅɪᴘᴇʟᴀᴊᴀʀɪ ᴅᴀʀɪ ꜱᴀᴀᴛ-ꜱᴀᴀᴛ ᴛᴇʀʙᴜʀᴜᴋ ᴅᴀɴ ᴅᴀʀɪ ᴋᴇꜱᴀʟᴀʜᴀɴ ᴛᴇʀʙᴜʀᴜᴋ.",
"ʜɪᴅᴜᴘ ʙᴜᴋᴀɴ ᴛᴇɴᴛᴀɴɢ ᴍᴇɴᴜɴɢɢᴜ ʙᴀᴅᴀɪ ʙᴇʀʟᴀʟᴜ, ᴛᴇᴛᴀᴘɪ ʙᴇʟᴀᴊᴀʀ ᴍᴇɴᴀʀɪ ᴅɪ ᴛᴇɴɢᴀʜ ʜᴜᴊᴀɴ.",
"ᴊɪᴋᴀ ʀᴇɴᴄᴀɴᴀɴʏᴀ ᴛɪᴅᴀᴋ ʙᴇʀʜᴀꜱɪʟ, ᴜʙᴀʜ ʀᴇɴᴄᴀɴᴀɴʏᴀ ʙᴜᴋᴀɴ ᴛᴜᴊᴜᴀɴɴʏᴀ.",
"ᴊᴀɴɢᴀɴ ᴛᴀᴋᴜᴛ ᴋᴀʟᴀᴜ ʜɪᴅᴜᴘᴍᴜ ᴀᴋᴀɴ ʙᴇʀᴀᴋʜɪʀ; ᴛᴀᴋᴜᴛʟᴀʜ ᴋᴀʟᴀᴜ ʜɪᴅᴜᴘᴍᴜ ᴛᴀᴋ ᴘᴇʀɴᴀʜ ᴅɪᴍᴜʟᴀɪ.",
"ᴏʀᴀɴɢ ʏᴀɴɢ ʙᴇɴᴀʀ-ʙᴇɴᴀʀ ʜᴇʙᴀᴛ ᴀᴅᴀʟᴀʜ ᴏʀᴀɴɢ ʏᴀɴɢ ᴍᴇᴍʙᴜᴀᴛ ꜱᴇᴛɪᴀᴘ ᴏʀᴀɴɢ ᴍᴇʀᴀꜱᴀ ʜᴇʙᴀᴛ.",
"ᴘᴇɴɢᴀʟᴀᴍᴀɴ ᴀᴅᴀʟᴀʜ ɢᴜʀᴜ ʏᴀɴɢ ʙᴇʀᴀᴛ ᴋᴀʀᴇɴᴀ ᴅɪᴀ ᴍᴇᴍʙᴇʀɪᴋᴀɴ ᴛᴇꜱ ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ, ᴋᴇᴍᴜᴅɪᴀɴ ᴘᴇʟᴀᴊᴀʀᴀɴɴʏᴀ.",
"ᴍᴇɴɢᴇᴛᴀʜᴜɪ ꜱᴇʙᴇʀᴀᴘᴀ ʙᴀɴʏᴀᴋ ʏᴀɴɢ ᴘᴇʀʟᴜ ᴅɪᴋᴇᴛᴀʜᴜɪ ᴀᴅᴀʟᴀʜ ᴀᴡᴀʟ ᴅᴀʀɪ ʙᴇʟᴀᴊᴀʀ ᴜɴᴛᴜᴋ ʜɪᴅᴜᴘ.",
"ꜱᴜᴋꜱᴇꜱ ʙᴜᴋᴀɴʟᴀʜ ᴀᴋʜɪʀ, ᴋᴇɢᴀɢᴀʟᴀɴ ᴛɪᴅᴀᴋ ꜰᴀᴛᴀʟ. ʏᴀɴɢ ᴛᴇʀᴘᴇɴᴛɪɴɢ ᴀᴅᴀʟᴀʜ ᴋᴇʙᴇʀᴀɴɪᴀɴ ᴜɴᴛᴜᴋ ᴍᴇʟᴀɴᴊᴜᴛᴋᴀɴ.",
"ʟᴇʙɪʜ ʙᴀɪᴋ ɢᴀɢᴀʟ ᴅᴀʟᴀᴍ ᴏʀɪꜱɪɴᴀʟɪᴛᴀꜱ ᴅᴀʀɪᴘᴀᴅᴀ ʙᴇʀʜᴀꜱɪʟ ᴍᴇɴɪʀᴜ.",
"ʙᴇʀᴀɴɪ ʙᴇʀᴍɪᴍᴘɪ, ᴛᴀᴘɪ ʏᴀɴɢ ʟᴇʙɪʜ ᴘᴇɴᴛɪɴɢ, ʙᴇʀᴀɴɪ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴛɪɴᴅᴀᴋᴀɴ ᴅɪ ʙᴀʟɪᴋ ɪᴍᴘɪᴀɴᴍᴜ.",
"ᴛᴇᴛᴀᴘᴋᴀɴ ᴛᴜᴊᴜᴀɴ ᴀɴᴅᴀ ᴛɪɴɢɢɪ-ᴛɪɴɢɢɪ, ᴅᴀɴ ᴊᴀɴɢᴀɴ ʙᴇʀʜᴇɴᴛɪ ꜱᴀᴍᴘᴀɪ ᴀɴᴅᴀ ᴍᴇɴᴄᴀᴘᴀɪɴʏᴀ.",
"ᴋᴇᴍʙᴀɴɢᴋᴀɴ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ ᴅᴀʀɪ ᴋᴇɢᴀɢᴀʟᴀɴ. ᴋᴇᴘᴜᴛᴜꜱᴀꜱᴀᴀɴ ᴅᴀɴ ᴋᴇɢᴀɢᴀʟᴀɴ ᴀᴅᴀʟᴀʜ ᴅᴜᴀ ʙᴀᴛᴜ ʟᴏɴᴄᴀᴛᴀɴ ᴘᴀʟɪɴɢ ᴘᴀꜱᴛɪ ᴍᴇɴᴜᴊᴜ ꜱᴜᴋꜱᴇꜱ.",
"ᴊᴇɴɪᴜꜱ ᴀᴅᴀʟᴀʜ ꜱᴀᴛᴜ ᴘᴇʀꜱᴇɴ ɪɴꜱᴘɪʀᴀꜱɪ ᴅᴀɴ ꜱᴇᴍʙɪʟᴀɴ ᴘᴜʟᴜʜ ꜱᴇᴍʙɪʟᴀɴ ᴘᴇʀꜱᴇɴ ᴋᴇʀɪɴɢᴀᴛ.",
"ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴛᴇᴍᴘᴀᴛ ᴘᴇʀꜱɪᴀᴘᴀɴ ᴅᴀɴ ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ ʙᴇʀᴛᴇᴍᴜ.",
"ᴋᴇᴛᴇᴋᴜɴᴀɴ ɢᴀɢᴀʟ 19 ᴋᴀʟɪ ᴅᴀɴ ʙᴇʀʜᴀꜱɪʟ ᴘᴀᴅᴀ ᴋᴇꜱᴇᴍᴘᴀᴛᴀᴍ ʏᴀɴɢ ᴋᴇ-20.",
"ᴊᴀʟᴀɴ ᴍᴇɴᴜᴊᴜ ꜱᴜᴋꜱᴇꜱ ᴅᴀɴ ᴊᴀʟᴀɴ ᴍᴇɴᴜᴊᴜ ᴋᴇɢᴀɢᴀʟᴀɴ ʜᴀᴍᴘɪʀ ᴘᴇʀꜱɪꜱ ꜱᴀᴍᴀ.",
"ꜱᴜᴋꜱᴇꜱ ʙɪᴀꜱᴀɴʏᴀ ᴅᴀᴛᴀɴɢ ᴋᴇᴘᴀᴅᴀ ᴍᴇʀᴇᴋᴀ ʏᴀɴɢ ᴛᴇʀʟᴀʟᴜ ꜱɪʙᴜᴋ ᴍᴇɴᴄᴀʀɪɴʏᴀ.",
"ᴊᴀɴɢᴀɴ ᴛᴜɴᴅᴀ ᴘᴇᴋᴇʀᴊᴀᴀɴᴍᴜ ꜱᴀᴍᴘᴀɪ ʙᴇꜱᴏᴋ, ꜱᴇᴍᴇɴᴛᴀʀᴀ ᴋᴀᴜ ʙɪꜱᴀ ᴍᴇɴɢᴇʀᴊᴀᴋᴀɴɴʏᴀ ʜᴀʀɪ ɪɴɪ.",
"20 ᴛᴀʜᴜɴ ᴅᴀʀɪ ꜱᴇᴋᴀʀᴀɴɢ, ᴋᴀᴜ ᴍᴜɴɢᴋɪɴ ʟᴇʙɪʜ ᴋᴇᴄᴇᴡᴀ ᴅᴇɴɢᴀɴ ʜᴀʟ-ʜᴀʟ ʏᴀɴɢ ᴛɪᴅᴀᴋ ꜱᴇᴍᴘᴀᴛ ᴋᴀᴜ ʟᴀᴋᴜᴋᴀɴ ᴀʟɪʜ-ᴀʟɪʜ ʏᴀɴɢ ꜱᴜᴅᴀʜ.",
"ᴊᴀɴɢᴀɴ ʜᴀʙɪꜱᴋᴀɴ ᴡᴀᴋᴛᴜᴍᴜ ᴍᴇᴍᴜᴋᴜʟɪ ᴛᴇᴍʙᴏᴋ ᴅᴀɴ ʙᴇʀʜᴀʀᴀᴘ ʙɪꜱᴀ ᴍᴇɴɢᴜʙᴀʜɴʏᴀ ᴍᴇɴᴊᴀᴅɪ ᴘɪɴᴛᴜ.",
"ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ ɪᴛᴜ ᴍɪʀɪᴘ ꜱᴇᴘᴇʀᴛɪ ᴍᴀᴛᴀʜᴀʀɪ ᴛᴇʀʙɪᴛ. ᴋᴀʟᴀᴜ ᴋᴀᴜ ᴍᴇɴᴜɴɢɢᴜ ᴛᴇʀʟᴀʟᴜ ʟᴀᴍᴀ, ᴋᴀᴜ ʙɪꜱᴀ ᴍᴇʟᴇᴡᴀᴛᴋᴀɴɴʏᴀ.",
"ʜɪᴅᴜᴘ ɪɴɪ ᴛᴇʀᴅɪʀɪ ᴅᴀʀɪ 10 ᴘᴇʀꜱᴇɴ ᴀᴘᴀ ʏᴀɴɢ ᴛᴇʀᴊᴀᴅɪ ᴘᴀᴅᴀᴍᴜ ᴅᴀɴ 90 ᴘᴇʀꜱᴇɴ ʙᴀɢᴀɪᴍᴀɴᴀ ᴄᴀʀᴀᴍᴜ ᴍᴇɴʏɪᴋᴀᴘɪɴʏᴀ.",
"ᴀᴅᴀ ᴛɪɢᴀ ᴄᴀʀᴀ ᴜɴᴛᴜᴋ ᴍᴇɴᴄᴀᴘᴀɪ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ ᴛᴇʀᴛɪɴɢɢɪ: ᴄᴀʀᴀ ᴘᴇʀᴛᴀᴍᴀ ᴀᴅᴀʟᴀʜ ʙᴇʀꜱɪᴋᴀᴘ ʙᴀɪᴋ. ᴄᴀʀᴀ ᴋᴇᴅᴜᴀ ᴀᴅᴀʟᴀʜ ʙᴇʀꜱɪᴋᴀᴘ ʙᴀɪᴋ. ᴄᴀʀᴀ ᴋᴇᴛɪɢᴀ ᴀᴅᴀʟᴀʜ ᴍᴇɴᴊᴀᴅɪ ʙᴀɪᴋ.",
"ᴀʟᴀꜱᴀɴ ɴᴏᴍᴏʀ ꜱᴀᴛᴜ ᴏʀᴀɴɢ ɢᴀɢᴀʟ ᴅᴀʟᴀᴍ ʜɪᴅᴜᴘ ᴀᴅᴀʟᴀʜ ᴋᴀʀᴇɴᴀ ᴍᴇʀᴇᴋᴀ ᴍᴇɴᴅᴇɴɢᴀʀᴋᴀɴ ᴛᴇᴍᴀɴ, ᴋᴇʟᴜᴀʀɢᴀ, ᴅᴀɴ ᴛᴇᴛᴀɴɢɢᴀ ᴍᴇʀᴇᴋᴀ.",
"ᴡᴀᴋᴛᴜ ʟᴇʙɪʜ ʙᴇʀʜᴀʀɢᴀ ᴅᴀʀɪᴘᴀᴅᴀ ᴜᴀɴɢ. ᴋᴀᴍᴜ ʙɪꜱᴀ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ʟᴇʙɪʜ ʙᴀɴʏᴀᴋ ᴜᴀɴɢ, ᴛᴇᴛᴀᴘɪ ᴋᴀᴍᴜ ᴛɪᴅᴀᴋ ʙɪꜱᴀ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ʟᴇʙɪʜ ʙᴀɴʏᴀᴋ ᴡᴀᴋᴛᴜ.",
"ᴘᴇɴᴇᴛᴀᴘᴀɴ ᴛᴜᴊᴜᴀɴ ᴀᴅᴀʟᴀʜ ʀᴀʜᴀꜱɪᴀ ᴍᴀꜱᴀ ᴅᴇᴘᴀɴ ʏᴀɴɢ ᴍᴇɴᴀʀɪᴋ.",
"ꜱᴀᴀᴛ ᴋɪᴛᴀ ʙᴇʀᴜꜱᴀʜᴀ ᴜɴᴛᴜᴋ ᴍᴇɴᴊᴀᴅɪ ʟᴇʙɪʜ ʙᴀɪᴋ ᴅᴀʀɪ ᴋɪᴛᴀ, ꜱᴇɢᴀʟᴀ ꜱᴇꜱᴜᴀᴛᴜ ᴅɪ ꜱᴇᴋɪᴛᴀʀ ᴋɪᴛᴀ ᴊᴜɢᴀ ᴍᴇɴᴊᴀᴅɪ ʟᴇʙɪʜ ʙᴀɪᴋ.",
"ᴘᴇʀᴛᴜᴍʙᴜʜᴀɴ ᴅɪᴍᴜʟᴀɪ ᴋᴇᴛɪᴋᴀ ᴋɪᴛᴀ ᴍᴜʟᴀɪ ᴍᴇɴᴇʀɪᴍᴀ ᴋᴇʟᴇᴍᴀʜᴀɴ ᴋɪᴛᴀ ꜱᴇɴᴅɪʀɪ.",
"ᴊᴀɴɢᴀɴʟᴀʜ ᴘᴇʀɴᴀʜ ᴍᴇɴʏᴇʀᴀʜ ᴋᴇᴛɪᴋᴀ ᴀɴᴅᴀ ᴍᴀꜱɪʜ ᴍᴀᴍᴘᴜ ʙᴇʀᴜꜱᴀʜᴀ ʟᴀɢɪ. ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴋᴀᴛᴀ ʙᴇʀᴀᴋʜɪʀ ꜱᴀᴍᴘᴀɪ ᴀɴᴅᴀ ʙᴇʀʜᴇɴᴛɪ ᴍᴇɴᴄᴏʙᴀ.",
"ᴋᴇᴍᴀᴜᴀɴ ᴀᴅᴀʟᴀʜ ᴋᴜɴᴄɪ ꜱᴜᴋꜱᴇꜱ. ᴏʀᴀɴɢ-ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ, ʙᴇʀᴜꜱᴀʜᴀ ᴋᴇʀᴀꜱ ᴀᴘᴀ ᴘᴜɴ ʏᴀɴɢ ᴍᴇʀᴇᴋᴀ ʀᴀꜱᴀᴋᴀɴ ᴅᴇɴɢᴀɴ ᴍᴇɴᴇʀᴀᴘᴋᴀɴ ᴋᴇɪɴɢɪɴᴀɴ ᴍᴇʀᴇᴋᴀ ᴜɴᴛᴜᴋ ᴍᴇɴɢᴀᴛᴀꜱɪ ꜱɪᴋᴀᴘ ᴀᴘᴀᴛɪꜱ, ᴋᴇʀᴀɢᴜᴀɴ ᴀᴛᴀᴜ ᴋᴇᴛᴀᴋᴜᴛᴀɴ.",
"ᴊᴀɴɢᴀɴʟᴀʜ ᴘᴇʀɴᴀʜ ᴍᴇɴʏᴇʀᴀʜ ᴋᴇᴛɪᴋᴀ ᴀɴᴅᴀ ᴍᴀꜱɪʜ ᴍᴀᴍᴘᴜ ʙᴇʀᴜꜱᴀʜᴀ ʟᴀɢɪ. ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴋᴀᴛᴀ ʙᴇʀᴀᴋʜɪʀ ꜱᴀᴍᴘᴀɪ ᴀɴᴅᴀ ʙᴇʀʜᴇɴᴛɪ ᴍᴇɴᴄᴏʙᴀ.",
"ᴋᴇᴍᴀᴜᴀɴ ᴀᴅᴀʟᴀʜ ᴋᴜɴᴄɪ ꜱᴜᴋꜱᴇꜱ. ᴏʀᴀɴɢ-ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ, ʙᴇʀᴜꜱᴀʜᴀ ᴋᴇʀᴀꜱ ᴀᴘᴀ ᴘᴜɴ ʏᴀɴɢ ᴍᴇʀᴇᴋᴀ ʀᴀꜱᴀᴋᴀɴ ᴅᴇɴɢᴀɴ ᴍᴇɴᴇʀᴀᴘᴋᴀɴ ᴋᴇɪɴɢɪɴᴀɴ ᴍᴇʀᴇᴋᴀ ᴜɴᴛᴜᴋ ᴍᴇɴɢᴀᴛᴀꜱɪ ꜱɪᴋᴀᴘ ᴀᴘᴀᴛɪꜱ, ᴋᴇʀᴀɢᴜᴀɴ ᴀᴛᴀᴜ ᴋᴇᴛᴀᴋᴜᴛᴀɴ.",
"ʜᴀʟ ᴘᴇʀᴛᴀᴍᴀ ʏᴀɴɢ ᴅɪʟᴀᴋᴜᴋᴀɴ ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇᴍᴀɴᴅᴀɴɢ ᴋᴇɢᴀɢᴀʟᴀɴ ꜱᴇʙᴀɢᴀɪ ꜱɪɴʏᴀʟ ᴘᴏꜱɪᴛɪꜰ ᴜɴᴛᴜᴋ ꜱᴜᴋꜱᴇꜱ.",
"ᴄɪʀɪ ᴋʜᴀꜱ ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇʀᴇᴋᴀ ꜱᴇʟᴀʟᴜ ʙᴇʀᴜꜱᴀʜᴀ ᴋᴇʀᴀꜱ ᴜɴᴛᴜᴋ ᴍᴇᴍᴘᴇʟᴀᴊᴀʀɪ ʜᴀʟ-ʜᴀʟ ʙᴀʀᴜ.",
"ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋᴀᴍᴜ ɪɴɢɪɴᴋᴀɴ, ᴋᴇʙᴀʜᴀɢɪᴀᴀɴ ᴍᴇɴɢɪɴɢɪɴᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋᴀᴍᴜ ᴅᴀᴘᴀᴛᴋᴀɴ.",
"ᴏʀᴀɴɢ ᴘᴇꜱɪᴍɪꜱ ᴍᴇʟɪʜᴀᴛ ᴋᴇꜱᴜʟɪᴛᴀɴ ᴅɪ ꜱᴇᴛɪᴀᴘ ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ. ᴏʀᴀɴɢ ʏᴀɴɢ ᴏᴘᴛɪᴍɪꜱ ᴍᴇʟɪʜᴀᴛ ᴘᴇʟᴜᴀɴɢ ᴅᴀʟᴀᴍ ꜱᴇᴛɪᴀᴘ ᴋᴇꜱᴜʟɪᴛᴀɴ.",
"ᴋᴇʀᴀɢᴜᴀɴ ᴍᴇᴍʙᴜɴᴜʜ ʟᴇʙɪʜ ʙᴀɴʏᴀᴋ ᴍɪᴍᴘɪ ᴅᴀʀɪᴘᴀᴅᴀ ᴋᴇɢᴀɢᴀʟᴀɴ.",
"ʟᴀᴋᴜᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ʜᴀʀᴜꜱ ᴋᴀᴍᴜ ʟᴀᴋᴜᴋᴀɴ ꜱᴀᴍᴘᴀɪ ᴋᴀᴍᴜ ᴅᴀᴘᴀᴛ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ɪɴɢɪɴ ᴋᴀᴍᴜ ʟᴀᴋᴜᴋᴀɴ.",
"ᴏᴘᴛɪᴍɪꜱᴛɪꜱ ᴀᴅᴀʟᴀʜ ꜱᴀʟᴀʜ ꜱᴀᴛᴜ ᴋᴜᴀʟɪᴛᴀꜱ ʏᴀɴɢ ʟᴇʙɪʜ ᴛᴇʀᴋᴀɪᴛ ᴅᴇɴɢᴀɴ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ ᴅᴀɴ ᴋᴇʙᴀʜᴀɢɪᴀᴀɴ ᴅᴀʀɪᴘᴀᴅᴀ ʏᴀɴɢ ʟᴀɪɴ.",
"ᴘᴇɴɢʜᴀʀɢᴀᴀɴ ᴘᴀʟɪɴɢ ᴛɪɴɢɢɪ ʙᴀɢɪ ꜱᴇᴏʀᴀɴɢ ᴘᴇᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱ ʙᴜᴋᴀɴʟᴀʜ ᴀᴘᴀ ʏᴀɴɢ ᴅɪᴀ ᴘᴇʀᴏʟᴇʜ ᴅᴀʀɪ ᴘᴇᴋᴇʀᴊᴀᴀɴ ɪᴛᴜ, ᴛᴀᴘɪ ꜱᴇʙᴇʀᴀᴘᴀ ʙᴇʀᴋᴇᴍʙᴀɴɢ ɪᴀ ᴅᴇɴɢᴀɴ ᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱɴʏᴀ ɪᴛᴜ.",
"ᴄᴀʀᴀ ᴛᴇʀʙᴀɪᴋ ᴜɴᴛᴜᴋ ᴍᴇᴍᴜʟᴀɪ ᴀᴅᴀʟᴀʜ ᴅᴇɴɢᴀɴ ʙᴇʀʜᴇɴᴛɪ ʙᴇʀʙɪᴄᴀʀᴀ ᴅᴀɴ ᴍᴜʟᴀɪ ᴍᴇʟᴀᴋᴜᴋᴀɴ.",
"ᴋᴇɢᴀɢᴀʟᴀɴ ᴛɪᴅᴀᴋ ᴀᴋᴀɴ ᴘᴇʀɴᴀʜ ᴍᴇɴʏᴜꜱᴜʟ ᴊɪᴋᴀ ᴛᴇᴋᴀᴅ ᴜɴᴛᴜᴋ ꜱᴜᴋꜱᴇꜱ ᴄᴜᴋᴜᴘ ᴋᴜᴀᴛ."
]
    const pilih = quotesmotivasi[Math.floor(Math.random() * quotesmotivasi.length)]
    reply(typeof pilih === "string" ? pilih : (pilih.arti || pilih.arabic || JSON.stringify(pilih)))
}
break

case "quotesgalau": {
    const quotesgalau = [
    "Gak salah kalo aku lebih berharap sama orang yang lebih pasti tanpa khianati janji-janji",
    "Kalau aku memang tidak sayang sama kamu ngapain aku mikirin kamu. Tapi semuanya kamu yang ngganggap aku gak sayang sama kamu",
    "Jangan iri dan sedih jika kamu tidak memiliki kemampuan seperti yang orang miliki. Yakinlah orang lain juga tidak memiliki kemampuan sepertimu",
    "Hanya kamu yang bisa membuat langkahku terhenti, sambil berkata dalam hati mana bisa aku meninggalkanmu",
    "Tetap tersenyum walaluku masih dibuat menunggu dan rindu olehmu, tapi itu demi kamu",
    "Tak semudah itu melupakanmu",
    "Secuek-cueknya kamu ke aku, aku tetap sayang sama kamu karena kamu telah menerima aku apa adanya",
    "Aku sangat bahagia jika kamu bahagia didekatku, bukan didekatnya",
    "Jadilah diri sendiri, jangan mengikuti orang lain, tetapi tidak sanggup untuk menjalaninya",
    "Cobalah terdiam sejenak untuk memikirkan bagaimana caranya agar kita dapat menyelesaikan masalah ini bersama-sama",
    "Bisakah kita tidak bermusuhan setelah berpisah, aku mau kita seperti dulu sebelum kita jadian yang seru-seruan bareng, bercanda dan yang lainnya",
    "Aku ingin kamu bisa langgeng sama aku dan yang aku harapkan kamu bisa jadi jodohku",
    "Cinta tak bisa dijelaskan dengan kata-kata saja, karena cinta hanya mampu dirasakan oleh hati",
    "Masalah terbesar dalam diri seseorang adalah tak sanggup melawan rasa takutnya",
    "Selamat pagi buat orang yang aku sayang dan orang yang membenciku, semoga hari ini hari yang lebih baik daripada hari kemarin buat aku dan kamu",
    "Jangan menyerah dengan keadaanmu sekarang, optimis karena optimislah yang bikin kita kuat",
    "Kepada pria yang selalu ada di doaku aku mencintaimu dengan tulus apa adanya",
    "Tolong jangan pergi saat aku sudah sangat sayang padamu",
    "Coba kamu yang berada diposisiku, lalu kamu ditinggalin gitu aja sama orang yang lo sayang banget",
    "Aku takut kamu kenapa-napa, aku panik jika kamu sakit, itu karena aku cinta dan sayang padamu",
    "Sakit itu ketika cinta yang aku beri tidak kamu hargai",
    "Kamu tiba-tiba berubah tanpa sebab tapi jika memang ada sebabnya kamu berubah tolong katakan biar saya perbaiki kesalahan itu",
    "Karenamu aku jadi tau cinta yang sesungguhnya",
    "Senyum manismu sangatlah indah, jadi janganlah sampai kamu bersedih",
    "Berawal dari kenalan, bercanda bareng, ejek-ejekan kemudian berubah menjadi suka, nyaman dan akhirnya saling sayang dan mencintai",
    "Tersenyumlah pada orang yang telah menyakitimu agar sia tau arti kesabaran yang luar biasa",
    "Aku akan ingat kenangan pahit itu dan aku akan jadikan pelajaran untuk masa depan yang manis",
    "Kalau memang tak sanggup menepati janjimu itu setidaknya kamu ingat dan usahakan jagan membiarkan janjimu itu sampai kau lupa",
    "Hanya bisa diam dan berfikir Kenapa orang yang setia dan baik ditinggalin yang nakal dikejar-kejar giliran ditinggalin bilangnya laki-laki itu semuanya sama",
    "Walaupun hanya sesaat saja kau membahagiakanku tapi rasa bahagia yang dia tidak cepat dilupakan",
    "Aku tak menyangka kamu pergi dan melupakan ku begitu cepat",
    "Jomblo gak usah diam rumah mumpung malam minggu ya keluar jalan lah kan jomblo bebas bisa dekat sama siapapun pacar orang mantan sahabat bahkan sendiri atau bareng setan pun bisa",
    "Kamu adalah teman yang selalu di sampingku dalam keadaan senang maupun susah Terimakasih kamu selalu ada di sampingku",
    "Aku tak tahu sebenarnya di dalam hatimu itu ada aku atau dia",
    "Tak mudah melupakanmu karena aku sangat mencintaimu meskipun engkau telah menyakiti aku berkali-kali",
    "Hidup ini hanya sebentar jadi lepaskan saja mereka yang menyakitimu Sayangi Mereka yang peduli padamu dan perjuangan mereka yang berarti bagimu",
    "Tolong jangan pergi meninggalkanku aku masih sangat mencintai dan menyayangimu",
    "Saya mencintaimu dan menyayangimu jadi tolong jangan engkau pergi dan meninggalkan ku sendiri",
    "Saya sudah cukup tahu bagaimana sifatmu itu kamu hanya dapat memberikan harapan palsu kepadaku",
    "Aku berusaha mendapatkan cinta darimu tetapi Kamunya nggak peka",
    "Aku bangkit dari jatuh ku setelah kau jatuhkan aku dan aku akan memulainya lagi dari awal Tanpamu",
    "Mungkin sekarang jodohku masih jauh dan belum bisa aku dapat tapi aku yakin jodoh itu Takkan kemana-mana dan akan ku dapatkan",
    "Datang aja dulu baru menghina orang lain kalau memang dirimu dan lebih baik dari yang kau hina",
    "Membelakanginya mungkin lebih baik daripada melihatnya selingkuh didepan mata sendiri",
    "Bisakah hatimu seperti angsa yang hanya setia pada satu orang saja",
    "Aku berdiri disini sendiri menunggu kehadiran dirimu",
    "Aku hanya tersenyum padamu setelah kau menyakitiku agar kamu tahu arti kesabaran",
    "Maaf aku lupa ternyata aku bukan siapa-siapa",
    "Untuk memegang janjimu itu harus ada buktinya jangan sampai hanya janji palsu",
    "Aku tidak bisa selamanya menunggu dan kini aku menjadi ragu Apakah kamu masih mencintaiku",
    "Jangan buat aku terlalu berharap jika kamu tidak menginginkanku",
    "Lebih baik sendiri daripada berdua tapi tanpa kepastian",
    "Pergi bukan berarti berhenti mencintai tapi kecewa dan lelah karena harus berjuang sendiri",
    "Bukannya aku tidak ingin menjadi pacarmu Aku hanya ingin dipersatukan dengan cara yang benar",
    "Akan ada saatnya kok aku akan benar-benar lupa dan tidak memikirkan mu lagi",
    "Kenapa harus jatuh cinta kepada orang yang tak bisa dimiliki",
    "Jujur aku juga memiliki perasaan terhadapmu dan tidak bisa menolakmu tapi aku juga takut untuk mencintaimu",
    "Maafkan aku sayang tidak bisa menjadi seperti yang kamu mau",
    "Jangan memberi perhatian lebih seperti itu cukup biasa saja tanpa perlu menimbulkan rasa",
    "Aku bukan mencari yang sempurna tapi yang terbaik untukku",
    "Sendiri itu tenang tidak ada pertengkaran kebohongan dan banyak aturan",
    "Cewek strong itu adalah yang sabar dan tetap tersenyum meskipun dalam keadaan terluka",
    "Terima kasih karena kamu aku menjadi lupa tentang masa laluku",
    "Cerita cinta indah tanpa masalah itu hanya di dunia dongeng saja",
    "Kamu tidak akan menemukan apa-apa di masa lalu Yang ada hanyalah penyesalan dan sakit hati",
    "Mikirin orang yang gak pernah mikirin kita itu emang bikin gila",
    "Dari sekian lama menunggu apa yang sudah didapat",
    "Perasaan Bodo gue adalah bisa jatuh cinta sama orang yang sama meski udah disakiti berkali-kali",
    "Yang sendiri adalah yang bersabar menunggu pasangan sejatinya",
    "Aku terlahir sederhana dan ditinggal sudah biasa",
    "Aku sayang kamu tapi aku masih takut untuk mencintaimu",
    "Bisa berbagi suka dan duka bersamamu itu sudah membuatku bahagia",
    "Aku tidak pernah berpikir kamu akan menjadi yang sementara",
    "Jodoh itu bukan seberapa dekat kamu dengannya tapi seberapa yakin kamu dengan Allah",
    "Jangan paksa aku menjadi cewek seperti seleramu",
    "Hanya yang sabar yang mampu melewati semua kekecewaan",
    "Balikan sama kamu itu sama saja bunuh diri dan melukai perasaan ku sendiri",
    "Tak perlu membalas dengan menyakiti biar Karma yang akan urus semua itu",
    "Aku masih ingat kamu tapi perasaanku sudah tidak sakit seperti dulu",
    "Punya kalimat sendiri & mau ditambahin? chat *.owner*"
]
    const pilih = quotesgalau[Math.floor(Math.random() * quotesgalau.length)]
    reply(typeof pilih === "string" ? pilih : (pilih.arti || pilih.arabic || JSON.stringify(pilih)))
}
break

case "quotesgombal": {
    const quotesgombal = [
    "Hal yang paling aku suka yaitu ngemil, namun tau gak ngemil apa yang paling aku suka? ngemilikin kamu sepenuhnya.",
    "Seandainya sekarang adalah tanggal 28 oktober 1928, aku akan ubah naskah sumpah pemuda menjadi sumpah aku cinta kamu.",
    "Aku gak pernah merasakan ketakutan sedikit pun ketika berada didekat kamu, karena kamulah kekuatanku.",
    "Kamu tahu apa persamaan rasa sayangku ke kamu dengan matahari? Persamaannya adalah sama-sama terbit setiap hari dan hanya akan berakhir sampai kiamat.",
    "Kalau bus kota jauh dekat ongkosnya sama, tapi cinta ini dekat-dekat makin saling cinta.",
    "Kalausaja aku harus mengorbankan semua kebahagiaanku hanya untuk sekedar membuat kamu tertawa. Aku rela.",
    "Anjing menggonggong kafilah berlalu, tiap hari bengong mikirin kamu melulu.",
    "Kalau aku jadi wakil rakyat kayaknya bakalan gagal deh. Gimana aku mau mikiran rakyat kalau yang ada dipikiran aku itu cuman ada kamu.",
    "denganambah satu sama dengan dua. Aku sama kamu sama dengan saling cinta.",
    "Kalo kita beda kartu GSM, itu gak masalah asalkan nantinya nama kita berdua ada di kartu Keluarga yang sama.",
    "Masalah yang selalu sulit untukku membuat mu mencintai ku, tapi lebih sulit memaksa hatiku untuk berhenti memikirkan dirimu.",
    "Aku harap kamu tidak menanyakan hal terindah yang pernah singgah di kehidupanku, karena jawaban nya adalah kamu.",
    "Hal yang paling aku suka yaitu ngemil, namun tau gak ngemil apa yang paling aku suka? ngemilikin kamu sepenuhnya.",
    "seandainyaa sekarang adalah tanggal 28 oktober 1928, aku akan ubah naskah sumpah pemuda menjadi sumpah aku cinta kamu.",
    "kuu gak pernah merasakan ketakutan sedikit pun ketika berada didekat kamu, karena kamulah kekuatanku.",
    "kamuu tahu apa persamaan rasa sayangku ke kamu dengan matahari? Persamaannya adalah sama-sama terbit setiap hari dan hanya akan berakhir sampai kiamat.",
    "Kalau bus kota jauh dekat ongkosnya sama, tapi cinta ini dekat-dekat makin saling cinta.",
    "jikaa saja aku harus mengorbankan semua kebahagiaanku hanya untuk sekedar membuat kamu tertawa. Aku rela.",
    "Anjing menggonggong kafilah berlalu, tiap hari bengong mikirin kamu melulu.",
    "Kalau aku jadi wakil rakyat kayaknya bakalan gagal deh. Gimana aku mau mikiran rakyat kalau yang ada dipikiran aku itu cuman ada kamu.",
    "atuu tambah satu sama dengan dua. Aku sama kamu sama dengan saling cinta,.",
    "aloo kita beda kartu GSM, itu gak masalah asalkan nantinya nama kita berdua ada di kartu Keluarga yang sama.",
    "Masalah yang selalu sulit untukku membuat mu mencintai ku, tapi lebih sulit memaksa hatiku untuk berhenti memikirkan dirimu.",
    "Aku tak pernah berjanji untuk sebuah perasaan, namun aku berusaha berjanji untuk sebuah kesetiaan.",
    "Aku sangat berharap kamu tau, kalau aku tidak pernah menyesali cintaku untuk mu, karena bagiku memiliki kamu sudah cukup bagi ku.",
    "Jangankan memilikimu, mendengar kamu kentut aja aku sudah bahagia.",
    "Aku mohon jangan jalan-jalan terus di pikiranku, duduk yang manis di hatiku saja.",
    "Berulang tahun memang indah, namun bagiku yang lebih indah jika berulang kali bersamamu.",
    "Napas aku kok sesek banget ya?, karena separuh nafasku ada di kamu.",
    "Jika ada seseorang lebih memilih pergi meninggalkan kamu, jangan pernah memohon padanya untuk tetap bertahan. Karena jika dia cinta, dia tak akan mau pergi.",
    "jangann diam aja dong, memang diam itu emas, tapi ketahuilah suara kamu itu seperti berlian.",
    "Kesasar itu serasa rugi banget, namun aku nggak merasa rugi karena cintaku sudah Biasanya orang yang lagi nyasar itu rugi ya, tapi tau gak? Aku gak merasa rugi sebab cintaku sudah nyasar ke hati bidadari.",
    "Ada 3 hal yang paling aku sukai di dunia ini, yaitu Matahari, Bulan dan Kamu. Matahari untuk siang hari, Bulan untuk malam hari dan Kamu untuk selamanya dihatiku.",
    "Sayang, kamu itu seperti garam di lautan, tidak terlihat namun akan selalu ada untuk selamanya.",
    "kuu gak perlu wanita yang sholeha, tapi bagaimana menuntun wanita yang aku cintai menjadi seorang yang sholehah.",
    "Aku tidak minta bintang atau bulan kepadamu. Cukup temani aku selamanya di bawah cahayanya.",
    "Akuana kalo kita berdua jadi komplotan penjahat: Aku mencuri hatimu, dan kamu mencuri hatiku?",
    "Aku gak perlu wanita yang cantik, tapi bagaimana aku menyanjung wanita yang aku cintai seperti wanita yang paling cantik di bumi ini.",
    "Aku pengen bersamamu cuma pada dua waktu: SEKARANG dan SELAMANYA.",
    "Akuu tuh bikin aku ga bisa tidur tau ga?",
    "Soalnya kamu selalu ada dibayang-bayang aku terus.",
    "Jika aku bisa jadi bagian dari dirimu,aku mau jadi air matamu,yang tersimpan di hatimu, lahir dari matamu, hidup di pipimu, dan mati di bibirmu.",
    "Papa kamu pasti kerja di apotik ya? | kenapa bang? | karena cuma kamu obat sakit hatiku.",
    "akuu selalu berusaha tak menangis karenamu, karena setiap butir yang jatuh, hanya makin mengingatkan, betapa aku tak bisa melepaskanmu.",
    "mauu nanya jalan nih. Jalan ke hatimu lewat mana ya?",
    "Andai sebuah bintang akan jatuh setiap kali aku mengingatmu, bulan pasti protes. Soalnya dia bakal sendirian di angkasa.",
    "Andai kamu gawang aku bolanya. Aku rela ditendang orang-orang demi aku dapat bersamamu,",
    "Dingin malam ini menusuk tulang. Kesendirian adalah kesepian. Maukah kau jadi selimut penghangat diriku?",
    "Keindahan Borobudur keajaiban dunia, keindahan kamu keajaiban cinta.",
    "Aku ingin mengaku dosa. Jangan pernah marah ya. Maafkan sebelumnya. Tadi malam aku mimpiin kamu jadi pacarku. Setelah bangun, akankah mimpiku jadi nyata?",
    "Kalau nggak sih aku bilang aku cinta kamu hari ini? Kalau besok gimana? Besok lusa? Besoknya besok lusa? Gimana kalau selamanya?",
    "Orangtuamu pengrajin bantal yah? Karena terasa nyaman jika di dekatmu.",
    "Jika malam adalah jeruji gelap yang menjadi sangkar, saya ingin terjebak selamanya di sana bersamamu.",
    "Sekarang aku gendutan gak sih? Kamu tau gak kenapa ? Soalnya kamu sudah mengembangkan cinta yang banyak di hatiku.",
    "Di atas langit masih ada langit. Di bawah langit masih ada aku yang mencintai kamu.",
    "Tau tidak kenapa malam ini tidak ada bintang? Soalnya bintangnya pindah semua ke matamu?",
    "Aku mencintaimu! Jika kamu benci aku, panah saja diriku. Tapi jangan di hatiku ya, karena di situ kamu berada.",
    "Bapak kamu pasti seorang astronot? | kok tau? | Soalnya aku melihat banyak bintang di matamu.",
    "Bapak kamu dosen ya? | kok tau? | karena nilai kamu A+ di hatiku.",
    "Kamu pasti kuliah di seni pahat ya? | kok tau sih? | Soalnya kamu pintar sekali memahat namamu di hatiku.",
    "Ya Tuhan, jika dia jodohku, menangkanlah tender pembangunan proyek menara cintaku di hatinya.",
    "Kamu mantan pencuri ya? | kok tau? | Abisnya kamu mencuri hatiku sih!",
    "Cowok : Aku suka senyum-senyum sendiri lho. | Cewek : Hah .. Gila Ya | Cowok : Nggak. Aku sedang mikirin kamu.",
    "Setiap malam aku berjalan-jalan di suatu tempat. Kamu tau di mana itu ? | gatau, emang dimana? | Di hatimu.",
    "Kamu pake Telkomesl ya? Karena sinyal-sinyal cintamu sangat kuat sampai ke hatiku.",
    "Kamu tahu gak sih? AKu tuh capek banget. Capek nahan kangen terus sama kamu.",
    "katanyaa kalau sering hujan itu bisa membuat seseorang terhanyut, kalau aku sekarang sedang terhanyut di dalam cintamu.",
    "Aku harap kamu jangan pergi lagi ya? karena, bila aku berpisah dengamu sedetik saja bagaikan 1000 tahun rasanya.",
    "Aku sih gak butuh week end, yang aku butuhkan hanyalah love you till the end.",
    "Emak kamu tukang Gado gado ya?, kok tau sih?, Pantesan saja kamu telah mencampur adukan perasaanku",
    "Walau hari ini cerah, tetapi tanpa kamu disisiku sama saja berselimutkan awan gelap di hati ini",
    "Kamu ngizinin aku kangen sehari berapa kali neng? Abang takut over dosis.",
    "cintaa aku ke kamu tuh bagaikan hutang, awalnya kecil, lama-lama didiemin malah tambah gede.",
    "Berulang tahun adalah hari yang indah. Tapih akin lebih indah kalo udah berulang-ulang kali bersama kamu."
]
    const pilih = quotesgombal[Math.floor(Math.random() * quotesgombal.length)]
    reply(typeof pilih === "string" ? pilih : (pilih.arti || pilih.arabic || JSON.stringify(pilih)))
}
break

case "quoteshacker": {
    const quoteshacker = [
  "Dear kamu yang tertulis di halaman defacementku, Kapan jadi pacarku?",
  "Aku rela ko jadi Processor yg kepanasan, asalkan kmu yg jadi heatsink'y yg setiap saat bisa mendinginkan ku.",
  "Gak usah nyari celah xss deh, karena ketika kamu ngeklik hatiku udah muncul pop up namamu.",
  "berharap setelah aku berhasil login di hati kamu ga akan ada tombol logout, dan sessionku ga bakal pernah expired.",
  "Masa aku harus pake teknik symlink bypass buat buka-buka folder hatimu yg open_basedir enabled.",
  "Diriku dan Dirimu itu ibarat PHP dan MySQL yang belum terkoneksi.",
  "Jangan cuma bisa inject hatinya,tapi harus bisa patchnya juga. Biar tidak selingkuh sama hacker lain.",
  "Aku memang programmer PHP,tapi aku nggak akan php-in kamu kok.",
  "Eneeeng. | Apache? | Km wanita yg paling Unix yg pernah aku kenal |",
  "Sayang, capslock kamu nyala ya? | ngga, kenapa emangnya? | soalnya nama kamu ketulis gede bgt di hati aku | zzz! smile",
  "Aku deketin kamu cuma untuk redirect ke hati temenmu.",
  "Domain aja bisa parkir, masa cintaku ga bisa parkir dihatimu?",
  "Aku boleh jadi pacarmu? | 400(Bad Request) | Aku cium boleh? | 401(Authorization Required) | Aku buka bajumu yah | 402(Payment Required) sad",
  "kamu tau ga beda'y kamu sama sintax PHP, kalo sintax PHP itu susah di hafalin kalo kamu itu susah di lupain",
  "Kamu dulu sekolah SMK ambil kejuruan apa? | Teknik Komputer Jaringan | Terus sekarang bisa apa aja? | Menjaring hatimu lewat komputerku | biggrin",
  "Jika cinta itu Array, maka,cintaku padamu tak pernah empty jika di unset().",
  "SQLI ( Structured Query Love Injection )",
  "aku ingin kamu rm -rf kan semua mantan di otak mu,akulah root hati kamu",
  "Senyumu bagaikan cooler yang menyejukan hatiku ketika sedang overclock.",
  "kamu adalah terminalku, dimana aku menghabiskan waktuku untuk mengetikan beribu baris kode cinta untukmu smile",
  "Aku seneng nongkrong di zone-h, karena disanalah aku arsipkan beberapa website yang ada foto kamunya.",
  "hatiku ibarat vps hanya untukmu saja bukan shared hosting yg bisa tumpuk berbagai domain cinta.",
  "Aku bukanlah VNC Server Tanpa Authentication yg bisa kamu pantau kapan saja.",
  "Jangan men-dualboot-kan hatiku kepadamu.",
  "cintaku kan ku Ctrl+A lalu kan ku Ctrl+C dan kan ku Ctrl+V tepat di folder system hatimu.",
  "KDE kalah Cantiknya, GNOME kalah Simplenya, FluxBox kalah Ringannya, pokonya Semua DE itu Kalah Sama Kamu.",
  "Cintamu bagaikan TeamViewer yang selalu mengendalikan hatiku",
  "cinta kita tak akan bisa dipisahkan walau setebal apapun itu firewall...!!"
]
    const pilih = quoteshacker[Math.floor(Math.random() * quoteshacker.length)]
    reply(typeof pilih === "string" ? pilih : (pilih.arti || pilih.arabic || JSON.stringify(pilih)))
}
break

case "quotesbijak": {
    const quotesbijak = [
"Keyakinan merupakan suatu pengetahuan di dalam hati, jauh tak terjangkau oleh bukti.",
"Rasa bahagia dan tak bahagia bukan berasal dari apa yang kamu miliki, bukan pula berasal dari siapa diri kamu, atau apa yang kamu kerjakan. Bahagia dan tak bahagia berasal dari pikiran kamu.",
"Sakit dalam perjuangan itu hanya sementara. Bisa jadi kamu rasakan dalam semenit, sejam, sehari, atau setahun. Namun jika menyerah, rasa sakit itu akan terasa selamanya.",
"Hanya seseorang yang takut yang bisa bertindak berani. Tanpa rasa takut itu tidak ada apapun yang bisa disebut berani.",
"Jadilah diri kamu sendiri. Siapa lagi yang bisa melakukannya lebih baik ketimbang diri kamu sendiri?",
"Kesempatan kamu untuk sukses di setiap kondisi selalu dapat diukur oleh seberapa besar kepercayaan kamu pada diri sendiri.",
"Kebanggaan kita yang terbesar adalah bukan tidak pernah gagal, tetapi bangkit kembali setiap kali kita jatuh.",
"Suatu pekerjaan yang paling tak kunjung bisa diselesaikan adalah pekerjaan yang tak kunjung pernah dimulai.",
"Pikiran kamu bagaikan api yang perlu dinyalakan, bukan bejana yang menanti untuk diisi.",
"Kejujuran adalah batu penjuru dari segala kesuksesan. Pengakuan adalah motivasi terkuat. Bahkan kritik dapat membangun rasa percaya diri saat disisipkan di antara pujian.",
"Segala sesuatu memiliki kesudahan, yang sudah berakhir biarlah berlalu dan yakinlah semua akan baik-baik saja.",
"Setiap detik sangatlah berharga karena waktu mengetahui banyak hal, termasuk rahasia hati.",
"Jika kamu tak menemukan buku yang kamu cari di rak, maka tulislah sendiri.",
"Jika hatimu banyak merasakan sakit, maka belajarlah dari rasa sakit itu untuk tidak memberikan rasa sakit pada orang lain.",
"Hidup tak selamanya tentang pacar.",
"Rumah bukan hanya sebuah tempat, tetapi itu adalah perasaan.",
"Pilih mana: Orang yang memimpikan kesuksesan atau orang yang membuatnya menjadi kenyataan?",
"Kamu mungkin tidak bisa menyiram bunga yang sudah layu dan berharap ia akan mekar kembali, tapi kamu bisa menanam bunga yang baru dengan harapan yang lebih baik dari sebelumnya.",
"Bukan bahagia yang menjadikan kita bersyukur, tetapi dengan bersyukurlah yang akan menjadikan hidup kita bahagia.",
"Aku memang diam. Tapi aku tidak buta.",
]
    const pilih = quotesbijak[Math.floor(Math.random() * quotesbijak.length)]
    reply(typeof pilih === "string" ? pilih : (pilih.arti || pilih.arabic || JSON.stringify(pilih)))
}
break

case "quotesislami": {
    const quotesislami = [
   {
      "id": "1",
      "arabic": "مَنْ سَارَ عَلىَ الدَّرْبِ وَصَلَ",
      "arti": "Barang siapa berjalan pada jalannya, maka dia akan sampai (pada tujuannya)."
   },
   {
      "id": "2",
      "arabic": "مَنْ صَبَرَ ظَفِرَ",
      "arti": "Barang siapa bersabar, maka dia akan beruntung."
   },
   {
      "id": "3",
      "arabic": "مَنْ جَدَّ وَجَـدَ",
      "arti": "Barang siapa bersungguh-sungguh, maka dia akan meraih (kesuksesan)."
   },
   {
      "id": "4",
      "arabic": "جَالِسْ أَهْلَ الصِّدْقِ وَالوَفَاءِ",
      "arti": "Bergaulah bersama orang-orang yang jujur dan menepati janji."
   },
   {
      "id": "5",
      "arabic": "مَنْ قَلَّ صِدْقُهُ قَلَّ صَدِيْقُهُ",
      "arti": "Barang siapa sedikit kejujurannya, maka sedikit pulalah temannya."
   },
   {
      "id": 6,
      "arabic": "مَوَدَّةُ الصَّدِيْقِ تَظْهَرُ وَقْتَ الضِّيْقِ",
      "arti": "Kecintaan seorang teman itu akan terlihat pada waktu kesempitan."
   },
   {
      "id": "7",
      "arabic": "الصَّبْرُ يُعِيْنُ عَلَى كُلِّ عَمَلٍ",
      "arti": "Kesabaran akan menolong segala pekerjaan."
   },
   {
      "id": "8",
      "arabic": "وَمَا اللَّذَّةُ إِلاَّ بَعْدَ التَّعَبِ",
      "arti": "Tidak ada kenikmatan kecuali setelah kepayahan."
   },
   {
      "id": "9",
      "arabic": "جَرِّبْ وَلاَحِظْ تَكُنْ عَارِفًا",
      "arti": "Coba dan perhatikanlah, maka engkau akan menjadi orang yang tahu."
   },
   {
      "id": "10",
      "arabic": "بَيْضَةُ اليَوْمِ خَيْرٌ مِنْ دَجَاجَةِ الغَدِ",
      "arti": "Telur hari ini lebih baik daripada ayam esok hari."
   },
   {
      "id": "11",
      "arabic": "أُطْلُبِ الْعِلْمَ مِنَ الْمَهْدِ إِلَى الَّلحْدِ",
      "arti": "Carilah ilmu sejak dari buaian hingga liang lahat."
   },
   {
      "id": "12",
      "arabic": "الوَقْتُ أَثْمَنُ مِنَ الذَّهَبِ",
      "arti": "Waktu itu lebih berharga daripada emas."
   },
   {
      "id": "13",
      "arabic": "لاَ خَيْرَ فيِ لَذَّةٍ تَعْقِبُ نَدَماً",
      "arti": "Tak ada kebaikan bagi kenikmatan yang diiringi dengan penyesalan."
   },
   {
      "id": "14",
      "arabic": "أَخِي لَنْ تَنَالَ العِلْمَ إِلاَّ بِسِتَّةٍ سَأُنْبِيْكَ عَنْ تَفْصِيْلِهَا بِبَيَانٍ: ذَكَاءٌ وَحِرْصٌ وَاجْتِهَادٌ وَدِرْهَمٌ وَصُحْبَةُ أُسْتَاذٍ وَطُوْلُ زَمَانٍ",
      "arti": "Wahai saudaraku, Kamu tidak akan memperoleh ilmu kecuali dengan enam perkara, akan aku sampaikan rinciannya dengan jelas; 1) Kecerdasan, 2) Ketamaan (terhadap ilmu), 3) Kesungguhan, 4) Harta benda (sebagai bekal), 5) Bergaul dengan guru, 6) Waktu yang lama."
   },
   {
      "id": "15",
      "arabic": "لاَ تَكُنْ رَطْباً فَتُعْصَرَ وَلاَ يَابِسًا فَتُكَسَّرَ",
      "arti": "Janganlah kamu bersikap lemah, sehingga kamu mudah diperas. Dan janganlah kamu bersikap keras, sehingga kamu mudah dipatahkan."
   },
   {
      "id": "16",
      "arabic": "لِكُلِّ مَقَامٍ مَقَالٌ وَلِكُلِّ مَقَالٍ مَقَامٌ",
      "arti": "Setiap tempat memiliki perkataannya masing-masing, dan setiap perkataan memiliki tempatnya masing-masing."
   },{
      "id": "17",
      "arabic": "خَيْرُ النَّاسِ أَحْسَنُهُمْ خُلُقاً وَأَنْفَعُهُمْ لِلنَّاسِ",
      "arti": "Sebaik-baik manusia adalah yang paling baik budi pekertinya dan yang paling bermanfaat bagi manusia lainnya."
   },
   {
      "id": "18",
      "arabic": "خَيْرُ جَلِيْسٍ في الزّمانِ كِتابُ",
      "arti": "Sebaik-baik teman duduk di setiap waktu adalah buku."
   },
   {
      "id": "19",
      "arabic": "مَنْ يَزْرَعْ يَحْصُدْ",
      "arti": "Barang siapa menanam, pasti ia akan memetik (mengetam)."
   },
   {
      "id": "20",
      "arabic": "لَوْلاَ العِلْمُ لَكَانَ النَّاسُ كَالبَهَائِمِ",
      "arti": "Kalaulah tidak karena ilmu, niscaya manusia itu seperti binatang."
   },
   {
      "id": "21",
      "arabic": "سَلاَمَةُ الإِنْسَانِ فيِ حِفْظِ اللِّسَانِ",
      "arti": "Keselamatan manusia itu terletak pada penjagaan lidahnya (perkataannya)."
   },
   {
      "id": "22",
      "arabic": "الرِّفْقُ بِالضَّعِيْفِ مِنْ خُلُقِ الشَّرِيْفِ",
      "arti": "Berlaku lemah lembut kepada orang yang lemah itu termasuk akhlak orang yang mulia (terhormat)."
   },
   {
      "id": "23",
      "arabic": "وَعَامِلِ النَّاسَ بِمَا تُحِبُّ مِنْهُ دَائِماً",
      "arti": "Dan bergaullah dengan manusia dengan sikap yang kamu juga suka diperlakukan seperti itu."
   },
   {
      "id": "24",
      "arabic": "لَيْسَ الجَمَالُ بِأَثْوَابٍ تُزَيِّنُنُا إِنَّ الجَمَالَ جمَاَلُ العِلْمِ وَالأَدَبِ",
      "arti": "Kecantikan bukanlah dengan pakaian yang melekat menghiasi diri kita, sesungguhnya kecantikan ialah kecantikan dengan ilmu dan budi pekerti."
   },
   {
      "id": "25",
      "arabic": "مَنْ أَعاَنَكَ عَلىَ الشَّرِّ ظَلَمَكَ",
      "arti": "Barang siapa membantumu dalam kejahatan, maka sesungguhnya ia telah berbuat aniaya terhadapmu."
   }
]
    const pilih = quotesislami[Math.floor(Math.random() * quotesislami.length)]
    reply(typeof pilih === "string" ? pilih : (pilih.arti || pilih.arabic || JSON.stringify(pilih)))
}
break

// ═══════════════════════ ISLAMI ═══════════════════════
case "ayatkursi": {
    let caption = `
*「 Ayat Kursi 」*
اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ

"Allahu laa ilaaha illaa huwal hayyul qoyyuum, laa ta'khudzuhuu sinatuw walaa naum. Lahuu maa fissamaawaati wa maa fil ardli man dzal ladzii yasyfa'u 'indahuu illaa biidznih, ya'lamu maa baina aidiihim wamaa kholfahum wa laa yuhiithuuna bisyai'im min 'ilmihii illaa bimaa syaa' wasi'a kursiyyuhus samaawaati wal ardlo walaa ya'uuduhuu hifdhuhumaa wahuwal 'aliyyul 'adhiim."

Artinya:
Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa'at di sisi Allah tanpa izin-Nya. Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.
(QS. Al Baqarah: 255)
`.trim()
    reply(caption)
}
break

case "asmaulhusna": {
    const asmaulhusna = [
    {
        index: 1,
        latin: "Ar Rahman",
        arabic: "الرَّحْمَنُ",
        translation_id: "Yang Memiliki Mutlak sifat Pemurah",
        translation_en: "The All Beneficent"
    },
    {
        index: 2,
        latin: "Ar Rahiim",
        arabic: "الرَّحِيمُ",
        translation_id: "Yang Memiliki Mutlak sifat Penyayang",
        translation_en: "The Most Merciful"
    },
    {
        index: 3,
        latin: "Al Malik",
        arabic: "الْمَلِكُ",
        translation_id: "Yang Memiliki Mutlak sifat Merajai/Memerintah",
        translation_en: "The King, The Sovereign"
    },
    {
        index: 4,
        latin: "Al Quddus",
        arabic: "الْقُدُّوسُ",
        translation_id: "Yang Memiliki Mutlak sifat Suci",
        translation_en: "The Most Holy"
    },
    {
        index: 5,
        latin: "As Salaam",
        arabic: "السَّلاَمُ",
        translation_id: "Yang Memiliki Mutlak sifat Memberi Kesejahteraan",
        translation_en: "Peace and Blessing"
    },
    {
        index: 6,
        latin: "Al Mu’min",
        arabic: "الْمُؤْمِنُ",
        translation_id: "Yang Memiliki Mutlak sifat Memberi Keamanan",
        translation_en: "The Guarantor"
    },
    {
        index: 7,
        latin: "Al Muhaimin",
        arabic: "الْمُهَيْمِنُ",
        translation_id: "Yang Memiliki Mutlak sifat Pemelihara",
        translation_en: "The Guardian, the Preserver"
    },
    {
        index: 8,
        latin: "Al ‘Aziiz",
        arabic: "الْعَزِيزُ",
        translation_id: "Yang Memiliki Mutlak Kegagahan",
        translation_en: "The Almighty, the Self Sufficient"
    },
    {
        index: 9,
        latin: "Al Jabbar",
        arabic: "الْجَبَّارُ",
        translation_id: "Yang Memiliki Mutlak sifat Perkasa",
        translation_en: "The Powerful, the Irresistible"
    },
    {
        index: 10,
        latin: "Al Mutakabbir",
        arabic: "الْمُتَكَبِّرُ",
        translation_id: "Yang Memiliki Mutlak sifat Megah,Yang Memiliki Kebesaran",
        translation_en: "The Tremendous"
    },
    {
        index: 11,
        latin: "Al Khaliq",
        arabic: "الْخَالِقُ",
        translation_id: "Yang Memiliki Mutlak sifat Pencipta",
        translation_en: "The Creator"
    },
    {
        index: 12,
        latin: "Al Baari’",
        arabic: "الْبَارِئُ",
        translation_id: "Yang Memiliki Mutlak sifat Yang Melepaskan(Membuat, Membentuk, Menyeimbangkan)",
        translation_en: "The Maker"
    },
    {
        index: 13,
        latin: "Al Mushawwir",
        arabic: "الْمُصَوِّرُ",
        translation_id: "Yang Memiliki Mutlak sifat YangMembentuk Rupa (makhluknya)",
        translation_en: "The Fashioner of Forms"
    },
    {
        index: 14,
        latin: "Al Ghaffaar",
        arabic: "الْغَفَّارُ",
        translation_id: "Yang Memiliki Mutlak sifat Pengampun",
        translation_en: "The Ever Forgiving"
    },
    {
        index: 15,
        latin: "Al Qahhaar",
        arabic: "الْقَهَّارُ",
        translation_id: "Yang Memiliki Mutlak sifat Memaksa",
        translation_en: "The All Compelling Subduer"
    },
    {
        index: 16,
        latin: "Al Wahhaab",
        arabic: "الْوَهَّابُ",
        translation_id: "Yang Memiliki Mutlak sifat Pemberi Karunia",
        translation_en: "The Bestower"
    },
    {
        index: 17,
        latin: "Ar Razzaaq",
        arabic: "الرَّزَّاقُ",
        translation_id: "Yang Memiliki Mutlak sifat Pemberi Rejeki",
        translation_en: "The Ever Providing"
    },
    {
        index: 18,
        latin: "Al Fattaah",
        arabic: "الْفَتَّاحُ",
        translation_id: "Yang Memiliki Mutlak sifat Pembuka Rahmat",
        translation_en: "The Opener, the Victory Giver"
    },
    {
        index: 19,
        latin: "Al ‘Aliim",
        arabic: "اَلْعَلِيْمُ",
        translation_id: "Yang Memiliki Mutlak sifatMengetahui (Memiliki Ilmu)",
        translation_en: "The All Knowing, the Omniscient"
    },
    {
        index: 20,
        latin: "Al Qaabidh",
        arabic: "الْقَابِضُ",
        translation_id: "Yang Memiliki Mutlak sifat YangMenyempitkan (makhluknya)",
        translation_en: "The Restrainer, the Straightener"
    },
    {
        index: 21,
        latin: "Al Baasith",
        arabic: "الْبَاسِطُ",
        translation_id: "Yang Memiliki Mutlak sifat YangMelapangkan (makhluknya)",
        translation_en: "The Expander, the Munificent"
    },
    {
        index: 22,
        latin: "Al Khaafidh",
        arabic: "الْخَافِضُ",
        translation_id: "Yang Memiliki Mutlak sifat YangMerendahkan (makhluknya)",
        translation_en: "The Abaser"
    },
    {
        index: 23,
        latin: "Ar Raafi’",
        arabic: "الرَّافِعُ",
        translation_id: "Yang Memiliki Mutlak sifat YangMeninggikan (makhluknya)",
        translation_en: "The Exalter"
    },
    {
        index: 24,
        latin: "Al Mu’izz",
        arabic: "الْمُعِزُّ",
        translation_id: "Yang Memiliki Mutlak sifat YangMemuliakan (makhluknya)",
        translation_en: "The Giver of Honor"
    },
    {
        index: 25,
        latin: "Al Mudzil",
        arabic: "المُذِلُّ",
        translation_id: "Yang Memiliki Mutlak sifatYang Menghinakan (makhluknya)",
        translation_en: "The Giver of Dishonor"
    },
    {
        index: 26,
        latin: "Al Samii’",
        arabic: "السَّمِيعُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mendengar",
        translation_en: "The All Hearing"
    },
    {
        index: 27,
        latin: "Al Bashiir",
        arabic: "الْبَصِيرُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Melihat",
        translation_en: "The All Seeing"
    },
    {
        index: 28,
        latin: "Al Hakam",
        arabic: "الْحَكَمُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Menetapkan",
        translation_en: "The Judge, the Arbitrator"
    },
    {
        index: 29,
        latin: "Al ‘Adl",
        arabic: "الْعَدْلُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Adil",
        translation_en: "The Utterly Just"
    },
    {
        index: 30,
        latin: "Al Lathiif",
        arabic: "اللَّطِيفُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Lembut",
        translation_en: "The Subtly Kind"
    },
    {
        index: 31,
        latin: "Al Khabiir",
        arabic: "الْخَبِيرُ",
        translation_id: "Yang Memiliki Mutlak sifatMaha Mengetahui Rahasia",
        translation_en: "The All Aware"
    },
    {
        index: 32,
        latin: "Al Haliim",
        arabic: "الْحَلِيمُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Penyantun",
        translation_en: "The Forbearing, the Indulgent"
    },
    {
        index: 33,
        latin: "Al ‘Azhiim",
        arabic: "الْعَظِيمُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Agung",
        translation_en: "The Magnificent, the Infinite"
    },
    {
        index: 34,
        latin: "Al Ghafuur",
        arabic: "الْغَفُورُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Pengampun",
        translation_en: "The All Forgiving"
    },
    {
        index: 35,
        latin: "As Syakuur",
        arabic: "الشَّكُورُ",
        translation_id: "Yang Memiliki Mutlak sifat MahaPembalas Budi (Menghargai)",
        translation_en: "The Grateful"
    },
    {
        index: 36,
        latin: "Al ‘Aliy",
        arabic: "الْعَلِيُّ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Tinggi",
        translation_en: "The Sublimely Exalted"
    },
    {
        index: 37,
        latin: "Al Kabiir",
        arabic: "الْكَبِيرُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Besar",
        translation_en: "The Great"
    },
    {
        index: 38,
        latin: "Al Hafizh",
        arabic: "الْحَفِيظُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Menjaga",
        translation_en: "The Preserver"
    },
    {
        index: 39,
        latin: "Al Muqiit",
        arabic: "المُقيِت",
        translation_id: "Yang Memiliki Mutlak sifat Maha Pemberi Kecukupan",
        translation_en: "The Nourisher"
    },
    {
        index: 40,
        latin: "Al Hasiib",
        arabic: "الْحسِيبُ",
        translation_id: "Yang Memiliki Mutlak sifat MahaMembuat Perhitungan",
        translation_en: "The Reckoner"
    },
    {
        index: 41,
        latin: "Al Jaliil",
        arabic: "الْجَلِيلُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mulia",
        translation_en: "The Majestic"
    },
    {
        index: 42,
        latin: "Al Kariim",
        arabic: "الْكَرِيمُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Pemurah",
        translation_en: "The Bountiful, the Generous"
    },
    {
        index: 43,
        latin: "Ar Raqiib",
        arabic: "الرَّقِيبُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mengawasi",
        translation_en: "The Watchful"
    },
    {
        index: 44,
        latin: "Al Mujiib",
        arabic: "الْمُجِيبُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mengabulkan",
        translation_en: "The Responsive, the Answerer"
    },
    {
        index: 45,
        latin: "Al Waasi’",
        arabic: "الْوَاسِعُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Luas",
        translation_en: "The Vast, the All Encompassing"
    },
    {
        index: 46,
        latin: "Al Hakiim",
        arabic: "الْحَكِيمُ",
        translation_id: "Yang Memiliki Mutlak sifat Maka Bijaksana",
        translation_en: "The Wise"
    },
    {
        index: 47,
        latin: "Al Waduud",
        arabic: "الْوَدُودُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Pencinta",
        translation_en: "The Loving, the Kind One"
    },
    {
        index: 48,
        latin: "Al Majiid",
        arabic: "الْمَجِيدُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mulia",
        translation_en: "The All Glorious"
    },
    {
        index: 49,
        latin: "Al Baa’its",
        arabic: "الْبَاعِثُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Membangkitkan",
        translation_en: "The Raiser of the Dead"
    },
    {
        index: 50,
        latin: "As Syahiid",
        arabic: "الشَّهِيدُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Menyaksikan",
        translation_en: "The Witness"
    },
    {
        index: 51,
        latin: "Al Haqq",
        arabic: "الْحَقُّ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Benar",
        translation_en: "The Truth, the Real"
    },
    {
        index: 52,
        latin: "Al Wakiil",
        arabic: "الْوَكِيلُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Memelihara",
        translation_en: "The Trustee, the Dependable"
    },
    {
        index: 53,
        latin: "Al Qawiyyu",
        arabic: "الْقَوِيُّ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Kuat",
        translation_en: "The Strong"
    },
    {
        index: 54,
        latin: "Al Matiin",
        arabic: "الْمَتِينُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Kokoh",
        translation_en: "The Firm, the Steadfast"
    },
    {
        index: 55,
        latin: "Al Waliyy",
        arabic: "الْوَلِيُّ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Melindungi",
        translation_en: "The Protecting Friend, Patron, and Helper"
    },
    {
        index: 56,
        latin: "Al Hamiid",
        arabic: "الْحَمِيدُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Terpuji",
        translation_en: "The All Praiseworthy"
    },
    {
        index: 57,
        latin: "Al Mushii",
        arabic: "الْمُحْصِي",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mengkalkulasi",
        translation_en: "The Accounter, the Numberer of All"
    },
    {
        index: 58,
        latin: "Al Mubdi’",
        arabic: "الْمُبْدِئُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Memulai",
        translation_en: "The Producer, Originator, and Initiator of all"
    },
    {
        index: 59,
        latin: "Al Mu’iid",
        arabic: "الْمُعِيدُ",
        translation_id: "Yang Memiliki Mutlak sifat MahaMengembalikan Kehidupan",
        translation_en: "The Reinstater Who Brings Back All"
    },
    {
        index: 60,
        latin: "Al Muhyii",
        arabic: "الْمُحْيِي",
        translation_id: "Yang Memiliki Mutlak sifat Maha Menghidupkan",
        translation_en: "The Giver of Life"
    },
    {
        index: 61,
        latin: "Al Mumiitu",
        arabic: "اَلْمُمِيتُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mematikan",
        translation_en: "The Bringer of Death, the Destroyer"
    },
    {
        index: 62,
        latin: "Al Hayyu",
        arabic: "الْحَيُّ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Hidup",
        translation_en: "The Ever Living"
    },
    {
        index: 63,
        latin: "Al Qayyuum",
        arabic: "الْقَيُّومُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mandiri",
        translation_en: "The Self Subsisting Sustainer of All"
    },
    {
        index: 64,
        latin: "Al Waajid",
        arabic: "الْوَاجِدُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Penemu",
        translation_en: "The Perceiver, the Finder, the Unfailing"
    },
    {
        index: 65,
        latin: "Al Maajid",
        arabic: "الْمَاجِدُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mulia",
        translation_en: "The Illustrious, the Magnificent"
    },
    {
        index: 66,
        latin: "Al Wahiid",
        arabic: "الْواحِدُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Tunggal",
        translation_en: "The One, The Unique, Manifestation of Unity"
    },
    {
        index: 67,
        latin: "Al ‘Ahad",
        arabic: "اَلاَحَدُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Esa",
        translation_en: "The One, the All Inclusive, the Indivisible"
    },
    {
        index: 68,
        latin: "As Shamad",
        arabic: "الصَّمَدُ",
        translation_id: "Yang Memiliki Mutlak sifat MahaDibutuhkan, Tempat Meminta",
        translation_en: "The Self Sufficient, the Impregnable,the Eternally Besought of All, the Everlasting"
    },
    {
        index: 69,
        latin: "Al Qaadir",
        arabic: "الْقَادِرُ",
        translation_id: "Yang Memiliki Mutlak sifat MahaMenentukan, Maha Menyeimbangkan",
        translation_en: "The All Able"
    },
    {
        index: 70,
        latin: "Al Muqtadir",
        arabic: "الْمُقْتَدِرُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Berkuasa",
        translation_en: "The All Determiner, the Dominant"
    },
    {
        index: 71,
        latin: "Al Muqaddim",
        arabic: "الْمُقَدِّمُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mendahulukan",
        translation_en: "The Expediter, He who brings forward"
    },
    {
        index: 72,
        latin: "Al Mu’akkhir",
        arabic: "الْمُؤَخِّرُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mengakhirkan",
        translation_en: "The Delayer, He who puts far away"
    },
    {
        index: 73,
        latin: "Al Awwal",
        arabic: "الأوَّلُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Awal",
        translation_en: "The First"
    },
    {
        index: 74,
        latin: "Al Aakhir",
        arabic: "الآخِرُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Akhir",
        translation_en: "The Last"
    },
    {
        index: 75,
        latin: "Az Zhaahir",
        arabic: "الظَّاهِرُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Nyata",
        translation_en: "The Manifest; the All Victorious"
    },
    {
        index: 76,
        latin: "Al Baathin",
        arabic: "الْبَاطِنُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Ghaib",
        translation_en: "The Hidden; the All Encompassing"
    },
    {
        index: 77,
        latin: "Al Waali",
        arabic: "الْوَالِي",
        translation_id: "Yang Memiliki Mutlak sifat Maha Memerintah",
        translation_en: "The Patron"
    },
    {
        index: 78,
        latin: "Al Muta’aalii",
        arabic: "الْمُتَعَالِي",
        translation_id: "Yang Memiliki Mutlak sifat Maha Tinggi",
        translation_en: "The Self Exalted"
    },
    {
        index: 79,
        latin: "Al Barri",
        arabic: "الْبَرُّ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Penderma",
        translation_en: "The Most Kind and Righteous"
    },
    {
        index: 80,
        latin: "At Tawwaab",
        arabic: "التَّوَابُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Penerima Tobat",
        translation_en: "The Ever Returning, Ever Relenting"
    },
    {
        index: 81,
        latin: "Al Muntaqim",
        arabic: "الْمُنْتَقِمُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Penuntut Balas",
        translation_en: "The Avenger"
    },
    {
        index: 82,
        latin: "Al Afuww",
        arabic: "العَفُوُّ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Pemaaf",
        translation_en: "The Pardoner, the Effacer of Sins"
    },
    {
        index: 83,
        latin: "Ar Ra`uuf",
        arabic: "الرَّؤُوفُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Pengasih",
        translation_en: "The Compassionate, the All Pitying"
    },
    {
        index: 84,
        latin: "Malikul Mulk",
        arabic: "مَالِكُ الْمُلْكِ",
        translation_id: "Yang Memiliki Mutlak sifatPenguasa Kerajaan (Semesta)",
        translation_en: "The Owner of All Sovereignty"
    },
    {
        index: 85,
        latin: "Dzul JalaaliWal Ikraam",
        arabic: "ذُوالْجَلاَلِوَالإكْرَامِ",
        translation_id: "Yang Memiliki Mutlak sifat PemilikKebesaran dan Kemuliaan",
        translation_en: "The Lord of Majesty and Generosity"
    },
    {
        index: 86,
        latin: "Al Muqsith",
        arabic: "الْمُقْسِطُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Adil",
        translation_en: "The Equitable, the Requiter"
    },
    {
        index: 87,
        latin: "Al Jamii’",
        arabic: "الْجَامِعُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mengumpulkan",
        translation_en: "The Gatherer, the Unifier"
    },
    {
        index: 88,
        latin: "Al Ghaniyy",
        arabic: "الْغَنِيُّ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Berkecukupan",
        translation_en: "The All Rich, the Independent"
    },
    {
        index: 89,
        latin: "Al Mughnii",
        arabic: "الْمُغْنِي",
        translation_id: "Yang Memiliki Mutlak sifat Maha Memberi Kekayaan",
        translation_en: "The Enricher, the Emancipator"
    },
    {
        index: 90,
        latin: "Al Maani",
        arabic: "اَلْمَانِعُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Mencegah",
        translation_en: "The Withholder, the Shielder, the Defender"
    },
    {
        index: 91,
        latin: "Ad Dhaar",
        arabic: "الضَّارَّ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Memberi Derita",
        translation_en: "The Distressor, the Harmer"
    },
    {
        index: 92,
        latin: "An Nafii’",
        arabic: "النَّافِعُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Memberi Manfaat",
        translation_en: "The Propitious, the Benefactor"
    },
    {
        index: 93,
        latin: "An Nuur",
        arabic: "النُّورُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Bercahaya(Menerangi, Memberi Cahaya)",
        translation_en: "The Light"
    },
    {
        index: 94,
        latin: "Al Haadii",
        arabic: "الْهَادِي",
        translation_id: "Yang Memiliki Mutlak sifat Maha Pemberi Petunjuk",
        translation_en: "The Guide"
    },
    {
        index: 95,
        latin: "Al Baadii",
        arabic: "الْبَدِيعُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Pencipta",
        translation_en: "Incomparable, the Originator"
    },
    {
        index: 96,
        latin: "Al Baaqii",
        arabic: "اَلْبَاقِي",
        translation_id: "Yang Memiliki Mutlak sifat Maha Kekal",
        translation_en: "The Ever Enduring and Immutable"
    },
    {
        index: 97,
        latin: "Al Waarits",
        arabic: "الْوَارِثُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Pewaris",
        translation_en: "The Heir, the Inheritor of All"
    },
    {
        index: 98,
        latin: "Ar Rasyiid",
        arabic: "الرَّشِيدُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Pandai",
        translation_en: "The Guide, Infallible Teacher, and Knower"
    },
    {
        index: 99,
        latin: "As Shabuur",
        arabic: "الصَّبُورُ",
        translation_id: "Yang Memiliki Mutlak sifat Maha Sabar",
        translation_en: "The Patient"
    }
]
    if (!text) {
        let list = asmaulhusna.map((v) => `${v.index}. ${v.latin}`).join("\n")
        return reply(`📿 *ASMAUL HUSNA* (99 Nama Allah)\n\nKetik: .asmaulhusna <nomor>\nContoh: .asmaulhusna 1\n\n${list}`)
    }
    let idx = parseInt(text.trim())
    let data = asmaulhusna.find((v) => v.index === idx)
    if (!data) return reply("Nomor gak ditemukan. Rentang 1-99.")
    reply(`📿 *${data.index}. ${data.latin}*\n${data.arabic}\n\n🇮🇩 ${data.translation_id}\n🇬🇧 ${data.translation_en}`)
}
break

case "niatsholat": {
    const niatsholat = [
    {
        index: 1,
        solat: "subuh",
        latin: "Ushalli fardhosh shubhi rok'ataini mustaqbilal qiblati adaa-an lillaahi ta'aala",
        arabic: "اُصَلِّى فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى",
        translation_id: "Aku berniat shalat fardhu Shubuh dua raka'at menghadap kiblat karena Allah Ta'ala",
    },
    {
        index: 2,
        solat: "maghrib",
        latin: "Ushalli fardhol maghribi tsalaata raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala",
        arabic: "اُصَلِّى فَرْضَ الْمَغْرِبِ ثَلاَثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى",
        translation_id: "Aku berniat shalat fardhu Maghrib tiga raka'at menghadap kiblat karena Allah Ta'ala",
    },
    {
        index: 3,
        solat: "dzuhur",
        latin: "Ushalli fardhodl dhuhri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala",
        arabic: "اُصَلِّى فَرْضَ الظُّهْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى",
        translation_id: "Aku berniat shalat fardhu Dzuhur empat raka'at menghadap kiblat karena Allah Ta'ala",
    },
    {
        index: 4,
        solat: "isha",
        latin: "Ushalli fardhol 'isyaa-i arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala",
        arabic: "صَلِّى فَرْضَ الْعِشَاءِ اَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى",
        translation_id: "Aku berniat shalat fardhu Isya empat raka'at menghadap kiblat karena Allah Ta'ala",
    },
    {
        index: 5,
        solat: "ashar",
        latin: "Ushalli fardhol 'ashri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala",
        arabic: "صَلِّى فَرْضَ الْعَصْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى",
        translation_id: "Aku berniat shalat fardhu 'Ashar empat raka'at menghadap kiblat karena Allah Ta'ala",
    }
]
    if (!text) {
        let list = niatsholat.map((v) => `• ${v.solat}`).join("\n")
        return reply(`🕌 *NIAT SHOLAT*\n\nKetik: .niatsholat <nama sholat>\nContoh: .niatsholat subuh\n\nDaftar:\n${list}`)
    }
    let data = niatsholat.find((v) => v.solat.toLowerCase() === text.trim().toLowerCase())
    if (!data) return reply("Nama sholat gak ditemukan.")
    reply(`🕌 *Niat Sholat ${data.solat.charAt(0).toUpperCase() + data.solat.slice(1)}*\n\n${data.arabic}\n\n_${data.latin}_\n\nArtinya:\n${data.translation_id}`)
}
break

case "jadwalsholat": {
    try {
        let kota = text ? text.trim() : "Jakarta"
        await russyuroku.sendMessage(m.chat, { react: { text: "🕌", key: m.key } })
        let res = await axios.get(`https://api.aladhan.com/v1/timingsByCity`, {
            params: { city: kota, country: "Indonesia", method: 11 }
        })
        let json = res.data
        if (!json.data) return reply(`Kota *${kota}* gak ditemukan.`)
        let d = json.data.timings
        let tgl = json.data.date.gregorian
        let hij = json.data.date.hijri
        reply(`🕌 *JADWAL SHOLAT — ${kota.toUpperCase()}*\n📅 ${tgl.date} M / ${hij.date} H\n\n🌅 Subuh   : ${d.Fajr}\n☀️ Dzuhur  : ${d.Dhuhr}\n🌤️ Ashar   : ${d.Asr}\n🌇 Maghrib : ${d.Maghrib}\n🌃 Isya    : ${d.Isha}`)
    } catch (err) {
        console.error(err)
        reply("Gagal ambil jadwal sholat, cek nama kotanya.")
    }
}
break
case "kisahnabi": {
    if (!text) return reply(`Masukkan nama nabi.\nContoh: .kisahnabi adam`)
    try {
        let res = await axios.get(`https://raw.githubusercontent.com/ZeroChanBot/Api-Freee/a9da6483809a1fbf164cdf1dfbfc6a17f2814577/data/kisahNabi/${text.trim().toLowerCase()}.json`)
        let kisah = res.data
        reply(`👳 *Nabi:* ${kisah.name}\n📅 *Tahun Lahir:* ${kisah.thn_kelahiran}\n📍 *Tempat Lahir:* ${kisah.tmp}\n📊 *Usia:* ${kisah.usia}\n\n— — — [ KISAH ] — — —\n\n${kisah.description}`)
    } catch (err) {
        reply("Nabi gak ditemukan. Coba nama tanpa huruf kapital, contoh: adam, nuh, ibrahim, musa, isa, muhammad.")
    }
}
break
case "doaharian": {
    try {
        let src = JSON.parse(fs.readFileSync("./data/doaharian.json", "utf-8"))
        if (!text) {
            let list = src.map((v, i) => `${i + 1}. ${v.title}`).join("\n")
            return reply(`🤲 *DOA HARIAN*\n\nKetik: .doaharian <nomor>\nContoh: .doaharian 1\n\n${list}`)
        }
        let idx = parseInt(text.trim()) - 1
        let v = src[idx]
        if (!v) return reply("Nomor gak ditemukan.")
        reply(`🤲 *${v.title}*\n\n❃ Latin:\n${v.latin}\n\n❃ Arab:\n${v.arabic}\n\n❃ Artinya:\n${v.translation}`)
    } catch (err) {
        console.error(err)
        reply("Gagal ambil data doa harian.")
    }
}
break
case "doatahlil": {
    try {
        let { result } = JSON.parse(fs.readFileSync("./data/tahlil.json", "utf-8"))
        if (!text) {
            let list = result.map((v, i) => `${i + 1}. ${v.title}`).join("\n")
            return reply(`📿 *DOA TAHLIL*\n\nKetik: .doatahlil <nomor>\nContoh: .doatahlil 1\n\n${list}`)
        }
        let idx = parseInt(text.trim()) - 1
        let v = result[idx]
        if (!v) return reply("Nomor gak ditemukan.")
        reply(`📿 *${v.title}*\n\n❃ Arab:\n${v.arabic}\n\n❃ Artinya:\n${v.translation}`)
    } catch (err) {
        console.error(err)
        reply("Gagal ambil data tahlil.")
    }
}
break
case "alquran": {
    if (!text) return reply(`Format: .alquran <no surah> <no ayat>\nContoh: .alquran 1 1`)
    try {
        let [surah, ayat] = text.trim().split(/\s+/)
        if (!surah || !ayat) return reply(`Format: .alquran <no surah> <no ayat>\nContoh: .alquran 1 1`)
        await russyuroku.sendMessage(m.chat, { react: { text: "📖", key: m.key } })
        let res = await axios.get(`https://kalam.sindonews.com/ayat/${ayat}/${surah}`)
        let $ = cheerio.load(res.data)
        let content = $("body > main > div > div.content.clearfix > div.news > section > div.list-content.clearfix")
        let judul = $(content).find("div.ayat-title > h1").text().trim()
        let arab = $(content).find("div.ayat-detail > div.ayat-arab").text().trim()
        let latin = $(content).find("div.ayat-detail > div.ayat-latin").text().trim()
        let terjemahan = $(content).find("div.ayat-detail > div.ayat-detail-text").text().trim()
        if (!judul) return reply("Surah/ayat gak ditemukan, cek nomornya lagi.")
        reply(`📖 *${judul}*\n\n${arab}\n\n_${latin}_\n\nArtinya:\n${terjemahan}`)
    } catch (err) {
        console.error(err)
        reply("Gagal ambil ayat, coba lagi nanti.")
    }
}
break

// ═══════════════════════ ANIME ═══════════════════════
case "neko": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://weeb-api.vercel.app/neko", { responseType: "arraybuffer" })
        let buffer = Buffer.from(res.data)
        await russyuroku.sendMessage(m.chat, { image: buffer, caption: "✅ *Random Neko Pic* 💮" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "loli": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://weeb-api.vercel.app/loli", { responseType: "arraybuffer" })
        let buffer = Buffer.from(res.data)
        await russyuroku.sendMessage(m.chat, { image: buffer, caption: "✅ *Random Loli Pic* 💮" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "akira": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/akira.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Akira*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "akiyama": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/akiyama.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Akiyama*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "asuna": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/asuna.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Asuna*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "boruto": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/boruto.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Boruto*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "chitoge": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/chitoge.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Chitoge*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "doraemon": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/doraemon.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Doraemon*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "elaina": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/elaina.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Elaina*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "emilia": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/emilia.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Emilia*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "erza": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/erza.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Erza*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "gremory": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/gremory.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Gremory*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "hestia": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/hestia.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Hestia*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "hinata": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/hinata.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Hinata*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "inori": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/inori.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Inori*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "itachi": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/itachi.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Itachi*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "kaga": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kaga.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Kaga*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "kagura": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kagura.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Kagura*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "kaori": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kaori.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Kaori*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "kurumi": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kurumi.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Kurumi*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "madara": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/madara.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Madara*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "megumin": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/megumin.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Megumin*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "mikasa": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/mikasa.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Mikasa*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "miku": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/miku.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Miku*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "minato": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/minato.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Minato*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "nezuko": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/nezuko.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Nezuko*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "onepiece": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/onepiece.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Onepiece*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "pokemon": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/pokemon.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Pokemon*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "sakura": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/sakura.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Sakura*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "sasuke": {
    await russyuroku.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/sasuke.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Sasuke*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

// ═══════════════════════ RANDOM ═══════════════════════
case "coffee":
case "kopi": {
    await russyuroku.sendMessage(m.chat, { react: { text: "☕", key: m.key } })
    try {
        let img = await axios.get("https://coffee.alexflipnote.dev/random", { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Coffee*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "aesthetic": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/aesthetic.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Aesthetic*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "bike": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/bike.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Motor*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "blackpink": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/blackpink.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Blackpink*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "boneka": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/boneka.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Boneka*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "car": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/car.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Mobil*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "cosplay": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/cosplay.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Cosplay*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "kpop": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/kpop.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random K-Pop*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "pubg": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/pubg.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random PUBG*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "rose": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/rose.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Rose Blackpink*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "ulzzangboy": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/ulzzangboy.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Ulzzang Boy*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "ulzzanggirl": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/ulzzanggirl.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Ulzzang Girl*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "wallml": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let list = JSON.parse(fs.readFileSync("./data/randompics/wallml.json", "utf-8"))
        let item = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(item.url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Wallpaper Mobile Legends*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "bts": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/bts.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random BTS*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "hacker": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/hacker.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Hacker*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "cyber": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/cyber.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Cyberpunk*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "islamic": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/islamic.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Islami*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "jennie": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/jennie.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Jennie Blackpink*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "jiso": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/jiso.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Jisoo Blackpink*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "cartoon": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/cartoon.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Cartoon*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "pentol": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/pentol.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Pentol*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "lisa": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/lisa.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Lisa Blackpink*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "space": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/space.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Luar Angkasa*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "technology": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/technology.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Teknologi*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "mountain": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/mountain.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Gunung*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

case "goose": {
    await russyuroku.sendMessage(m.chat, { react: { text: "🎲", key: m.key } })
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/master/goose.json")
        let list = res.data
        let url = Array.isArray(list) ? list[Math.floor(Math.random() * list.length)] : list.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { image: Buffer.from(img.data), caption: "✅ *Random Angsa*" }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil gambar, coba lagi nanti.")
    }
}
break

// ═══════════════════════ FUN — ACTION STICKER ═══════════════════════
case "hug": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/hug")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "pat": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/pat")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "slap": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/slap")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "cry": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/cry")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "kill": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/kill")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "lick": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/lick")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "bite": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/bite")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "yeet": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/yeet")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "bully": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/bully")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "bonk": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/bonk")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "wink": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/wink")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "poke": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/poke")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "nom": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/nom")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "smile": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/smile")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "wave": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/wave")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "blush": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/blush")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "smug": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/smug")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "glomp": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/glomp")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "happy": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/happy")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "dance": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/dance")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "cringe": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/cringe")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "cuddle": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/cuddle")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "highfive": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/highfive")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "handhold": {
    try {
        let res = await axios.get("https://api.waifu.pics/sfw/handhold")
        let url = res.data.url
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

// ═══════════════════════ STICKER ═══════════════════════
case "gura": {
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/main/gura")
        let list = String(res.data).split("\n").map((s) => s.trim()).filter(Boolean)
        let url = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "doge": {
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/main/doge")
        let list = String(res.data).split("\n").map((s) => s.trim()).filter(Boolean)
        let url = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "patrick": {
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/main/patrick")
        let list = String(res.data).split("\n").map((s) => s.trim()).filter(Boolean)
        let url = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "lovestick": {
    try {
        let res = await axios.get("https://raw.githubusercontent.com/DGXeon/XeonMedia/main/love")
        let list = String(res.data).split("\n").map((s) => s.trim()).filter(Boolean)
        let url = list[Math.floor(Math.random() * list.length)]
        let img = await axios.get(url, { responseType: "arraybuffer" })
        await russyuroku.sendMessage(m.chat, { sticker: Buffer.from(img.data) }, { quoted: m })
    } catch (err) {
        console.error(err)
        reply("Gagal ambil sticker, coba lagi nanti.")
    }
}
break

case "randomjkt48": {
    if (!global.apisaurus || !global.apikeysaurus) {
        reply("⚠️ Fitur ini belum dikonfigurasi. Hubungi Owner.")
        break
    }
    const jkt48AllMembers = [
        "aralie", "bella", "carissa", "christy", "cynthia", "daisy", "danella",
        "delynn", "ekin", "eli", "elin", "ella", "erine", "fahira", "feni", "fera",
        "fiony", "freya", "fritzy", "gendis", "giaa", "gita", "gracie", "greesel",
        "heidi", "intan", "jazzy", "jemima", "jessi", "kathrina", "kimmy", "lana",
        "levi", "lia", "lulu", "lyn", "maira", "marsha", "maxine", "michie",
        "mikaela", "muthe", "nachia", "nala", "nayla", "oline", "olla", "raisha",
        "ralyn", "rara", "ribka", "rilly", "sona", "trisha", "virgi",
    ]
    const memberName = jkt48AllMembers[Math.floor(Math.random() * jkt48AllMembers.length)]
    let endpoint
    switch (memberName) {
        case "aralie": endpoint = "/api/jkt48/randomjkt48-aralie"; break
        case "bella": endpoint = "/api/jkt48/randomjkt48-bella"; break
        case "carissa": endpoint = "/api/jkt48/randomjkt48-carissa"; break
        case "christy": endpoint = "/api/jkt48/randomjkt48-christy"; break
        case "cynthia": endpoint = "/api/jkt48/randomjkt48-cynthia"; break
        case "daisy": endpoint = "/api/jkt48/randomjkt48-daisy"; break
        case "danella": endpoint = "/api/jkt48/randomjkt48-danella"; break
        case "delynn": endpoint = "/api/jkt48/randomjkt48-delynn"; break
        case "ekin": endpoint = "/api/jkt48/randomjkt48-ekin"; break
        case "eli": endpoint = "/api/jkt48/randomjkt48-eli"; break
        case "elin": endpoint = "/api/jkt48/randomjkt48-elin"; break
        case "ella": endpoint = "/api/jkt48/randomjkt48-ella"; break
        case "erine": endpoint = "/api/jkt48/randomjkt48-erine"; break
        case "fahira": endpoint = "/api/jkt48/randomjkt48-fahira"; break
        case "feni": endpoint = "/api/jkt48/randomjkt48-feni"; break
        case "fera": endpoint = "/api/jkt48/randomjkt48-fera"; break
        case "fiony": endpoint = "/api/jkt48/randomjkt48-fiony"; break
        case "freya": endpoint = "/api/jkt48/randomjkt48-freya"; break
        case "fritzy": endpoint = "/api/jkt48/randomjkt48-fritzy"; break
        case "gendis": endpoint = "/api/jkt48/randomjkt48-gendis"; break
        case "giaa": endpoint = "/api/jkt48/randomjkt48-giaa"; break
        case "gita": endpoint = "/api/jkt48/randomjkt48-gita"; break
        case "gracie": endpoint = "/api/jkt48/randomjkt48-gracie"; break
        case "greesel": endpoint = "/api/jkt48/randomjkt48-greesel"; break
        case "heidi": endpoint = "/api/jkt48/randomjkt48-heidi"; break
        case "intan": endpoint = "/api/jkt48/randomjkt48-intan"; break
        case "jazzy": endpoint = "/api/jkt48/randomjkt48-jazzy"; break
        case "jemima": endpoint = "/api/jkt48/randomjkt48-jemima"; break
        case "jessi": endpoint = "/api/jkt48/randomjkt48-jessi"; break
        case "kathrina": endpoint = "/api/jkt48/randomjkt48-kathrina"; break
        case "kimmy": endpoint = "/api/jkt48/randomjkt48-kimmy"; break
        case "lana": endpoint = "/api/jkt48/randomjkt48-lana"; break
        case "levi": endpoint = "/api/jkt48/randomjkt48-levi"; break
        case "lia": endpoint = "/api/jkt48/randomjkt48-lia"; break
        case "lulu": endpoint = "/api/jkt48/randomjkt48-lulu"; break
        case "lyn": endpoint = "/api/jkt48/randomjkt48-lyn"; break
        case "maira": endpoint = "/api/jkt48/randomjkt48-maira"; break
        case "marsha": endpoint = "/api/jkt48/randomjkt48-marsha"; break
        case "maxine": endpoint = "/api/jkt48/randomjkt48-maxine"; break
        case "michie": endpoint = "/api/jkt48/randomjkt48-michie"; break
        case "mikaela": endpoint = "/api/jkt48/randomjkt48-mikaela"; break
        case "muthe": endpoint = "/api/jkt48/randomjkt48-muthe"; break
        case "nachia": endpoint = "/api/jkt48/randomjkt48-nachia"; break
        case "nala": endpoint = "/api/jkt48/randomjkt48-nala"; break
        case "nayla": endpoint = "/api/jkt48/randomjkt48-nayla"; break
        case "oline": endpoint = "/api/jkt48/randomjkt48-oline"; break
        case "olla": endpoint = "/api/jkt48/randomjkt48-olla"; break
        case "raisha": endpoint = "/api/jkt48/randomjkt48-raisha"; break
        case "ralyn": endpoint = "/api/jkt48/randomjkt48-ralyne"; break
        case "rara": endpoint = "/api/jkt48/randomjkt48-rara"; break
        case "ribka": endpoint = "/api/jkt48/randomjkt48-ribka"; break
        case "rilly": endpoint = "/api/jkt48/randomjkt48-rilly"; break
        case "sona": endpoint = "/api/jkt48/randomjkt48-sona"; break
        case "trisha": endpoint = "/api/jkt48/randomjkt48-trisha"; break
        case "virgi": endpoint = "/api/jkt48/randomjkt48-virgi"; break
    }

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
    try {
        const apiUrl = `${global.apisaurus}${endpoint}?apikey=${encodeURIComponent(global.apikeysaurus)}`
        const res = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 30000, validateStatus: () => true })
        if (res.status !== 200) throw new Error(`API ${res.status}`)
        const ctype = res.headers?.["content-type"] || ""
        if (!/^image\//.test(ctype)) throw new Error(`Bukan gambar: ${ctype}`)

        await russyuroku.sendMessage(m.chat, {
            image: Buffer.from(res.data),
            caption: `📸 JKT48 — *${memberName.charAt(0).toUpperCase() + memberName.slice(1)}*`,
        }, { quoted: m })
        await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
    } catch (err) {
        console.error(`[randomjkt48] error:`, err?.message || err)
        await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        reply(`❌ Gagal mengambil foto ${memberName}.\n${err.message || err}`)
    }
}
break

case "randomjkt48aralie":
case "randomjkt48bella":
case "randomjkt48carissa":
case "randomjkt48christy":
case "randomjkt48cynthia":
case "randomjkt48daisy":
case "randomjkt48danella":
case "randomjkt48delynn":
case "randomjkt48ekin":
case "randomjkt48eli":
case "randomjkt48elin":
case "randomjkt48ella":
case "randomjkt48erine":
case "randomjkt48fahira":
case "randomjkt48feni":
case "randomjkt48fera":
case "randomjkt48fiony":
case "randomjkt48freya":
case "randomjkt48fritzy":
case "randomjkt48gendis":
case "randomjkt48giaa":
case "randomjkt48gita":
case "randomjkt48gracie":
case "randomjkt48greesel":
case "randomjkt48heidi":
case "randomjkt48intan":
case "randomjkt48jazzy":
case "randomjkt48jemima":
case "randomjkt48jessi":
case "randomjkt48kathrina":
case "randomjkt48kimmy":
case "randomjkt48lana":
case "randomjkt48levi":
case "randomjkt48lia":
case "randomjkt48lulu":
case "randomjkt48lyn":
case "randomjkt48maira":
case "randomjkt48marsha":
case "randomjkt48maxine":
case "randomjkt48michie":
case "randomjkt48mikaela":
case "randomjkt48muthe":
case "randomjkt48nachia":
case "randomjkt48nala":
case "randomjkt48nayla":
case "randomjkt48oline":
case "randomjkt48olla":
case "randomjkt48raisha":
case "randomjkt48ralyn":
case "randomjkt48rara":
case "randomjkt48ribka":
case "randomjkt48rilly":
case "randomjkt48sona":
case "randomjkt48trisha":
case "randomjkt48virgi": {
    if (!global.apisaurus || !global.apikeysaurus) {
        reply("⚠️ Fitur ini belum dikonfigurasi. Hubungi Owner.")
        break
    }
    const memberName = command.toLowerCase().replace("randomjkt48", "")
    let endpoint
    switch (memberName) {
        case "aralie": endpoint = "/api/jkt48/randomjkt48-aralie"; break
        case "bella": endpoint = "/api/jkt48/randomjkt48-bella"; break
        case "carissa": endpoint = "/api/jkt48/randomjkt48-carissa"; break
        case "christy": endpoint = "/api/jkt48/randomjkt48-christy"; break
        case "cynthia": endpoint = "/api/jkt48/randomjkt48-cynthia"; break
        case "daisy": endpoint = "/api/jkt48/randomjkt48-daisy"; break
        case "danella": endpoint = "/api/jkt48/randomjkt48-danella"; break
        case "delynn": endpoint = "/api/jkt48/randomjkt48-delynn"; break
        case "ekin": endpoint = "/api/jkt48/randomjkt48-ekin"; break
        case "eli": endpoint = "/api/jkt48/randomjkt48-eli"; break
        case "elin": endpoint = "/api/jkt48/randomjkt48-elin"; break
        case "ella": endpoint = "/api/jkt48/randomjkt48-ella"; break
        case "erine": endpoint = "/api/jkt48/randomjkt48-erine"; break
        case "fahira": endpoint = "/api/jkt48/randomjkt48-fahira"; break
        case "feni": endpoint = "/api/jkt48/randomjkt48-feni"; break
        case "fera": endpoint = "/api/jkt48/randomjkt48-fera"; break
        case "fiony": endpoint = "/api/jkt48/randomjkt48-fiony"; break
        case "freya": endpoint = "/api/jkt48/randomjkt48-freya"; break
        case "fritzy": endpoint = "/api/jkt48/randomjkt48-fritzy"; break
        case "gendis": endpoint = "/api/jkt48/randomjkt48-gendis"; break
        case "giaa": endpoint = "/api/jkt48/randomjkt48-giaa"; break
        case "gita": endpoint = "/api/jkt48/randomjkt48-gita"; break
        case "gracie": endpoint = "/api/jkt48/randomjkt48-gracie"; break
        case "greesel": endpoint = "/api/jkt48/randomjkt48-greesel"; break
        case "heidi": endpoint = "/api/jkt48/randomjkt48-heidi"; break
        case "intan": endpoint = "/api/jkt48/randomjkt48-intan"; break
        case "jazzy": endpoint = "/api/jkt48/randomjkt48-jazzy"; break
        case "jemima": endpoint = "/api/jkt48/randomjkt48-jemima"; break
        case "jessi": endpoint = "/api/jkt48/randomjkt48-jessi"; break
        case "kathrina": endpoint = "/api/jkt48/randomjkt48-kathrina"; break
        case "kimmy": endpoint = "/api/jkt48/randomjkt48-kimmy"; break
        case "lana": endpoint = "/api/jkt48/randomjkt48-lana"; break
        case "levi": endpoint = "/api/jkt48/randomjkt48-levi"; break
        case "lia": endpoint = "/api/jkt48/randomjkt48-lia"; break
        case "lulu": endpoint = "/api/jkt48/randomjkt48-lulu"; break
        case "lyn": endpoint = "/api/jkt48/randomjkt48-lyn"; break
        case "maira": endpoint = "/api/jkt48/randomjkt48-maira"; break
        case "marsha": endpoint = "/api/jkt48/randomjkt48-marsha"; break
        case "maxine": endpoint = "/api/jkt48/randomjkt48-maxine"; break
        case "michie": endpoint = "/api/jkt48/randomjkt48-michie"; break
        case "mikaela": endpoint = "/api/jkt48/randomjkt48-mikaela"; break
        case "muthe": endpoint = "/api/jkt48/randomjkt48-muthe"; break
        case "nachia": endpoint = "/api/jkt48/randomjkt48-nachia"; break
        case "nala": endpoint = "/api/jkt48/randomjkt48-nala"; break
        case "nayla": endpoint = "/api/jkt48/randomjkt48-nayla"; break
        case "oline": endpoint = "/api/jkt48/randomjkt48-oline"; break
        case "olla": endpoint = "/api/jkt48/randomjkt48-olla"; break
        case "raisha": endpoint = "/api/jkt48/randomjkt48-raisha"; break
        case "ralyn": endpoint = "/api/jkt48/randomjkt48-ralyne"; break
        case "rara": endpoint = "/api/jkt48/randomjkt48-rara"; break
        case "ribka": endpoint = "/api/jkt48/randomjkt48-ribka"; break
        case "rilly": endpoint = "/api/jkt48/randomjkt48-rilly"; break
        case "sona": endpoint = "/api/jkt48/randomjkt48-sona"; break
        case "trisha": endpoint = "/api/jkt48/randomjkt48-trisha"; break
        case "virgi": endpoint = "/api/jkt48/randomjkt48-virgi"; break
    }

    if (!endpoint) {
        reply(`❌ Member tidak ditemukan. Coba *${prefix}randomjkt48* buat random semua member.`)
        break
    }

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
    try {
        const apiUrl = `${global.apisaurus}${endpoint}?apikey=${encodeURIComponent(global.apikeysaurus)}`
        const res = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 30000, validateStatus: () => true })
        if (res.status !== 200) throw new Error(`API ${res.status}`)
        const ctype = res.headers?.["content-type"] || ""
        if (!/^image\//.test(ctype)) throw new Error(`Bukan gambar: ${ctype}`)

        await russyuroku.sendMessage(m.chat, {
            image: Buffer.from(res.data),
            caption: `📸 JKT48 — *${memberName.charAt(0).toUpperCase() + memberName.slice(1)}*`,
        }, { quoted: m })
        await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
    } catch (err) {
        console.error(`[randomjkt48-${memberName}] error:`, err?.message || err)
        await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        reply(`❌ Gagal mengambil foto ${memberName}.\n${err.message || err}`)
    }
}
break

case "buatgambar":
case "createimage": {
    if (!global.apisaurus || !global.apikeysaurus) {
        reply("⚠️ Fitur ini belum dikonfigurasi. Hubungi Owner.")
        break
    }

    const prompt = (text || "").trim()
    if (!prompt) {
        reply(
`╭━━━「 🎨 *AI Image Generator* 」
│
│ Bikin gambar dari deskripsi teks (prompt)
│ pakai AI.
│
├━━━「 ✨ *Cara Pakai* 」
│
│ ${prefix}${command} <prompt>
│
├━━━「 💡 *Contoh* 」
│
│ ${prefix}${command} (masterpiece) 1girl, anime, sunset
│
╰━━━「 🚀 *Powered by ${global.namabot || 'Yuroku MD'}* 」`.trim()
        )
        break
    }

    await russyuroku.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
    try {
        const apiUrl = `${global.apisaurus}/api/ai/createimg?prompt=${encodeURIComponent(prompt)}&negative=true&apikey=${encodeURIComponent(global.apikeysaurus)}`
        const res = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 60000, validateStatus: () => true })
        if (res.status !== 200) throw new Error(`API ${res.status}`)

        const ctype = res.headers?.["content-type"] || ""
        let imageBuffer = null

        if (/^image\//.test(ctype)) {
            imageBuffer = Buffer.from(res.data)
        } else {
            // Fallback: API mungkin balas JSON berisi url gambar, bukan binary langsung
            let parsed
            try {
                parsed = JSON.parse(Buffer.from(res.data).toString("utf8"))
            } catch {
                throw new Error(`Response bukan gambar/JSON valid (content-type: ${ctype})`)
            }
            const imgUrl = parsed?.result || parsed?.url || parsed?.data?.url || parsed?.image
            if (!imgUrl) throw new Error("URL gambar tidak ditemukan di response API")
            const imgRes = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 60000, validateStatus: () => true })
            if (imgRes.status !== 200 || !/^image\//.test(imgRes.headers?.["content-type"] || "")) {
                throw new Error("Gagal mengunduh gambar hasil generate")
            }
            imageBuffer = Buffer.from(imgRes.data)
        }

        await russyuroku.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `🎨 *AI Image Generator*\n📝 Prompt: ${prompt}`,
        }, { quoted: m })
        await russyuroku.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
    } catch (err) {
        console.error("[buatgambar] error:", err?.message || err)
        await russyuroku.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        reply(`❌ Gagal membuat gambar.\n${err.message || err}`)
    }
}
break

    default:

if (isCmd && command && isAutoCorrectOn()) {
  const suggestion = suggestCommand(command);
  if (suggestion) {
    reply(`🍀 *Command tidak ditemukan.*\n\nMungkin maksud kamu: *${prefix}${suggestion.match}* (${suggestion.similarity}% mirip)`);
  }
}

if (budy.startsWith('=>')) {
    if (!isCreator) return

    function Return(sul) {
        sat = JSON.stringify(sul, null, 2)
        bang = util.format(sat)
        if (sat == undefined) {
            bang = util.format(sul)
        }
        return m.reply(bang)
    }
    try {
        m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
    } catch (e) {
        m.reply(String(e))
    }
}

if (budy.startsWith('>')) {
    if (!isCreator) return;
    try {
        let evaled = await eval(budy.slice(2));

        if (typeof evaled !== 'string') {
            const util = await import('util')
            evaled = util.inspect(evaled, { depth: 1 })
        }

        await m.reply(evaled);
    } catch (err) {
        m.reply(String(err));
    }
}

if (budy.startsWith('$')) {
    if (!isCreator) return
    exec(budy.slice(2), (err, stdout) => {
        if (err) return m.reply(`${err}`)
        if (stdout) return m.reply(stdout)
    })
}

}
}
} catch (err) {
    console.log(util.format(err))
}
}