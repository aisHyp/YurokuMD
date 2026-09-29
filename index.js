/*
 * ─────────────────────────────────────────────────────────
 *   ⚡ LORD SAURUS EMPIRE ⚡
 * ─────────────────────────────────────────────────────────
 *   Website   → https://saurusdev.cloud
 *   YouTube   → https://www.youtube.com/@sauruskinggwuw
 *   Saluran   → https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *   Telegram  → @lordsaurus
 *
 *   ⚠ Dilarang menghapus credit ini.
 * ─────────────────────── © 2026 Lunar Saurus ───────────────
 */
import './settings.js'

import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers,
  makeCacheableSignalKeyStore,
  getAggregateVotesInPollMessage,
} from "luoxy-baileys";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { modul } from './module.js'
import * as logger from './lib/logger.js'
import { attachSocketHelpers } from './lib/socket.js'
import { bootstrapFiles, makePentingStore } from './lib/database.js'
import { startAutoJpm } from './lib/autojpm.js'
import { isOnlyGroupMode } from './lib/globaltoggles.js'
import { startExpirationWatcher } from './lib/cpanelHelper.js'
import { restoreSubBots } from './lib/jadibot.js'
import { attachWelcome } from './lib/welcome.js'
import { checkBirthdaysToday } from './lib/ultah.js'
import { collectOwnerConfig } from './lib/setup.js'

const {
  fs,
  fileTypeFromBuffer,
  path,
  pino,
  parsePhoneNumber,
  axios
} = modul

import { makeInMemoryStore } from './lib/store.js'
import Pino from 'pino'
import yargs from 'yargs/yargs'
import _ from 'lodash'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import mongoDB from './lib/mongoDB.js'
import NodeCache from 'node-cache'

import { sleep, loadModule, previewAd, patchCanvasRemoteImage } from './lib/myfunc.js'
import { smsg, Solving, isDuplicateMessage } from './source/message.js'

patchCanvasRemoteImage();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prefix = "";

const dbPath = path.join(__dirname, "library", "database");
const { pentingFile } = bootstrapFiles(dbPath);
const { loadPenting, savePenting } = makePentingStore(pentingFile);

let mainHandler;
let caseFileMtime = 0;
const caseFilePath = path.join(__dirname, "yuroku.js");
const loadHandler = async () => {
  const mtime = fs.statSync(caseFilePath).mtimeMs;
  if (mainHandler && mtime === caseFileMtime) return;
  caseFileMtime = mtime;
  mainHandler = (await import(`./yuroku.js?update=${Date.now()}`)).default;
};
loadHandler();
const getMainHandler = async () => {
  await loadHandler();
  return mainHandler;
};
global.getMainHandler = getMainHandler;

const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});

global.opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
const defaultData = {
  users: [],
  chats: [],
  settings: {}
}
global.db = new Low(
  /mongodb/.test(opts['db'] || '')
    ? new mongoDB(opts['db'])
    : new JSONFile('./library/database/database.json'),
  defaultData
)
global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    chats: {},
    game: {},
    database: {},
    settings: {},
    setting: {},
    others: {},
    sticker: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

// ═══ Auto-Save Database ═══
// Otomatis simpan perubahan global.db.data ke database.json tiap 30 detik,
// biar data (users/chats/settings/dll) gak hilang kalau bot restart/crash.
if (!global.dbSaveInterval) {
  global.dbSaveInterval = setInterval(async () => {
    try {
      if (global.db && global.db.data) {
        await global.db.write();
      }
    } catch (e) {
      logger?.error ? logger.error('[AutoSave DB Error]', e.message) : console.error('[AutoSave DB Error]', e.message);
    }
  }, 30000);
}

// simpan juga saat proses mau exit, biar perubahan terakhir gak hilang
async function saveDbOnExit() {
  try {
    if (global.db && global.db.data) await global.db.write();
  } catch (e) {}
}
process.on('SIGINT', async () => { await saveDbOnExit(); process.exit(0); });
process.on('SIGTERM', async () => { await saveDbOnExit(); process.exit(0); });

console.clear();
logger.starting("Welcome In Terminal Yuroku MD!");

function logCrashToFile(label, data) {
  try {
    const fs = require("fs");
    const path = require("path");
    const util = require("util");
    const logMsg = `[${new Date().toISOString()}] ${label}: ${util.format(data)}\n\n`;
    fs.appendFileSync(path.join(__dirname, "error.log"), logMsg);
  } catch (e) {}
}

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection →", reason);
  logCrashToFile("Unhandled Rejection", reason);
});
process.on("rejectionHandled", () => {
  logger.info("Rejection handled.");
});
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception →", err);
  logCrashToFile("Uncaught Exception", err);
});

setTimeout(() => {
  logger.banner("LORD SAURUS");
  logger.subBanner("Booting Lunar Saurus Engine...");
  logger.section(`Welcome to Yuroku MD v${global.version} - Lunar Saurus Empire`);
  logger.systemInfo(modul);
}, 1000);

async function startsesi() {
  await new Promise((r) => setTimeout(r, 5000));
  logger.banner("YUROKU MD");
  logger.subBanner(`v${global.version} — Initializing Yuroku MD System...`);
  logger.section("Setup Owner & Bot");

  await collectOwnerConfig();

  logger.ownerSetupInfo({ ownername: global.ownername, ownernumber: global.ownernumber, namabot: global.namabot, nomorbot: global.nomorbot });
  logger.info("Membuat koneksi dan pairing code...");

  const { saveCreds, state } = await useMultiFileAuthState("./session");
  const msgRetryCounterCache = new NodeCache();
  const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });
  global.groupCache = groupCache;
  const { version } = await fetchLatestBaileysVersion();

  const getMessage = async (key) => {
    if (store) {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg?.message || undefined;
    }
    return { conversation: "" };
  };

  const russyuroku = makeWASocket({
    version,
    logger: Pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Safari"),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "silent" })),
    },
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: false,
    msgRetryCounterCache,
    keepAliveIntervalMs: 15_000,
    connectTimeoutMs: 60_000,
    retryRequestDelayMs: 500,
    maxMsgRetryCount: 5,
    syncFullHistory: false,
    fireInitQueries: true,
    emitOwnEvents: true,
    cachedGroupMetadata: async (jid) => groupCache.get(jid),
    getMessage,
  });

  russyuroku.ev.on("creds.update", saveCreds);
  store.bind(russyuroku.ev);

  russyuroku.ev.on("groups.update", async ([event]) => {
    try {
      const metadata = await russyuroku.groupMetadata(event.id);
      groupCache.set(event.id, metadata);
    } catch {}
  });

  russyuroku.ev.on("group-participants.update", async (event) => {
    try {
      const metadata = await russyuroku.groupMetadata(event.id);
      groupCache.set(event.id, metadata);
    } catch {}
  });

  attachWelcome(russyuroku);

  // ═══ Auto Ucapan Ulang Tahun ═══
  // Cek tiap 1 jam siapa aja yang ulang tahun hari ini di tiap grup, lalu kirim ucapan otomatis.
  if (!global.ultahCheckInterval) {
    checkBirthdaysToday(russyuroku).catch(() => {});
    global.ultahCheckInterval = setInterval(() => {
      checkBirthdaysToday(russyuroku).catch((e) => console.error('[AutoUltah Error]', e?.message || e));
    }, 60 * 60 * 1000);
  }

  if (!russyuroku.authState.creds.registered) {
    const requestPairingCodeWithRetry = async (maxRetries = 5, baseDelayMs = 3000) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await new Promise((r) => setTimeout(r, baseDelayMs));
          const code = await russyuroku.requestPairingCode(global.nomorbot, pair);
          return code;
        } catch (err) {
          const isConnClosed =
            err?.output?.statusCode === 428 ||
            err?.message?.includes("Connection Closed");

          if (!isConnClosed || attempt === maxRetries) {
            throw err;
          }

          logger.info(
            `Percobaan ke-${attempt} gagal (koneksi belum siap), mencoba lagi dalam ${baseDelayMs / 1000}s...`
          );
          baseDelayMs = Math.min(baseDelayMs + 2000, 10000);
        }
      }
    };

    try {
      const code = await requestPairingCodeWithRetry();
      logger.pairingCode(code);
    } catch (err) {
      logger.info(`Gagal mendapatkan pairing code setelah beberapa percobaan: ${err?.message || err}`);
      logger.info("Mencoba ulang koneksi dari awal...");
      return startsesi();
    }
  }

  startExpirationWatcher(russyuroku);

  let reconnectAttempts = 0;
  const MAX_RECONNECT = 10;

  russyuroku.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    const statusCode = lastDisconnect?.error?.output?.statusCode;

    if (connection === "connecting") {
      logger.connecting();
    } else if (connection === "open") {
      reconnectAttempts = 0;
      await sleep(3000);
      loadModule(russyuroku);
      logger.connected();

      global.russyurokuMain = russyuroku;
      if (!global._jadibotRestored) {
        global._jadibotRestored = true;
        restoreSubBots({
          parentSocket: russyuroku,
          getMainHandler: global.getMainHandler,
          fileTypeFromBuffer,
          parsePhoneNumber,
          axios,
        }).catch((err) => logger.error("Gagal restore sub-bot:", err));
      }
    } else if (connection === "close") {
      const isLoggedOut = statusCode === DisconnectReason.loggedOut;
      const isForbidden = statusCode === 403;

      logger.disconnected(statusCode, isLoggedOut);

      if (isLoggedOut || isForbidden) {
        logger.loggedOut();
        try { fs.rmSync("./session", { recursive: true, force: true }); } catch {}
        process.exit(1);
      }

      if (reconnectAttempts >= MAX_RECONNECT) {
        logger.reconnectFailed(MAX_RECONNECT);
        process.exit(1);
      }

      const backoff = Math.min(3000 * Math.pow(1.5, reconnectAttempts), 60_000);
      reconnectAttempts++;
      logger.reconnecting(reconnectAttempts, backoff);
      await sleep(backoff);
      startsesi();
    }
  });

  russyuroku.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      const kay = chatUpdate.messages[0];
      if (!kay.message) return;
      if (isDuplicateMessage(russyuroku, kay)) return;

      kay.message =
        Object.keys(kay.message)[0] === "ephemeralMessage"
          ? kay.message.ephemeralMessage.message
          : kay.message;

      const m = smsg(russyuroku, kay, store);

      if (!m.message) return;
      m.message = Object.keys(m.message)[0] === 'ephemeralMessage' ? m.message.ephemeralMessage.message : m.message;
      if (m.isBaileys) return;
      if (m.mtype === 'protocolMessage' && m.message?.protocolMessage?.type !== 0) return;
      if (m.key && m.key.remoteJid === 'status@broadcast') {
        if (global.autoreadsw) russyuroku.readMessages([m.key]);
      }

      if (global.autojoingc && chatUpdate.type === 'notify' && m.text && m.text.includes('chat.whatsapp.com/')) {
        const invite = m.text.match(/chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i);
        if (invite?.[1]) {
          try { await russyuroku.groupAcceptInvite(invite[1]); } catch {}
        }
      }

      const isAllowedInSelf =
        kay.key.fromMe ||
        (await russyuroku.isOwnerJid(m.sender)) ||
        (await russyuroku.isOwnerJid(kay.key.participant));

      if (!russyuroku.public && !isAllowedInSelf && chatUpdate.type === 'notify') return;

      if (isOnlyGroupMode() && !m.isGroup && !isAllowedInSelf && chatUpdate.type === 'notify') return;

      if (global.autoread) russyuroku.readMessages([m.key]);

      if (kay.key.id.startsWith("BAE5") && kay.key.id.length === 16) return;

      await loadHandler();
      mainHandler(russyuroku, m, chatUpdate, store);
    } catch (err) {
      logger.error("Error saat memproses pesan:", err);
    }
  });

  russyuroku.ev.on("messages.update", async (chatUpdate) => {
    for (const { key, update } of chatUpdate) {
      if (update.pollUpdates && key.fromMe) {
        const pollCreation = await getMessage(key);
        if (pollCreation) {
          const pollUpdate = await getAggregateVotesInPollMessage({
            message: pollCreation,
            pollUpdates: update.pollUpdates,
          });
          const toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]?.name;
          if (toCmd === undefined) return;
          const prefCmd = prefix + toCmd;
          russyuroku.appenTextMessage(prefCmd, chatUpdate);
        }
      }
    }
  });

  attachSocketHelpers(russyuroku, { fs, fileTypeFromBuffer, parsePhoneNumber, store, axios });
  Solving(russyuroku);
  russyuroku.public = !global.owneronly;

  return russyuroku;
}
startsesi();

fs.watchFile(__filename, async () => {
  fs.unwatchFile(__filename);
  logger.info(`Update ${__filename}`);
  try {
    await import(`${__filename}?update=${Date.now()}`);
  } catch (err) {
    logger.error("Gagal hot-reload index.js:", err);
  }
});
