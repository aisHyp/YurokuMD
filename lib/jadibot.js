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
 *
 *  lib/jadibot.js — Multi-session sub-bot manager (.jadibot / .delbot)
 *
 *  Tiap sub-bot punya socket, auth state, dan store sendiri-sendiri,
 *  disimpan di library/database/jadibot/<nomor>/. Sub-bot memakai
 *  mainHandler yang sama (yuroku.js) lewat callback getMainHandler,
 *  jadi semua fitur bot utama otomatis jalan juga di sub-bot.
 */

import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers,
  makeCacheableSignalKeyStore,
} from "luoxy-baileys";
import path from "path";
import fs from "fs";
import Pino from "pino";
import NodeCache from "node-cache";

import { makeInMemoryStore } from "./store.js";
import { sleep } from "./myfunc.js";
import { smsg, Solving, isDuplicateMessage } from "../source/message.js";
import { attachSocketHelpers } from "./socket.js";
import * as logger from "./logger.js";
import { attachWelcome } from "./welcome.js";
import chalk from "chalk";

const JADIBOT_DIR = path.join(process.cwd(), "library", "database", "rentbot");

global.jadibotSessions = global.jadibotSessions || {};

function normalizeNumber(input) {
  return String(input || "").replace(/[^0-9]/g, "");
}

function sessionPath(number) {
  return path.join(JADIBOT_DIR, number);
}

async function startSubBot(rawNumber, deps, opts = {}) {
  const number = normalizeNumber(rawNumber);
  if (!number || number.length < 8) {
    throw new Error("Nomor tidak valid.");
  }

  if (!opts.reconnect && global.jadibotSessions[number]) {
    throw new Error(`Sub-bot untuk nomor ${number} sudah aktif. Hapus dulu dengan .delbot ${number} kalau mau ulang.`);
  }
  if (opts.reconnect) {
    const lama = global.jadibotSessions[number];
    if (!lama || lama.stopped) return null;

    try { lama.sock.ev.removeAllListeners(); } catch {}
    try { lama.sock.end?.(undefined); } catch {}
  }

  const { parentSocket, getMainHandler, fileTypeFromBuffer, parsePhoneNumber, axios } = deps;

  const sesDir = sessionPath(number);
  fs.mkdirSync(sesDir, { recursive: true });

  const { saveCreds, state } = await useMultiFileAuthState(sesDir);
  const { version } = await fetchLatestBaileysVersion();
  const msgRetryCounterCache = new NodeCache();
  const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });
  const subStore = makeInMemoryStore({
    logger: Pino({ level: "silent" }),
  });

  const getMessage = async (key) => {
    const msg = await subStore.loadMessage(key.remoteJid, key.id);
    return msg?.message || undefined;
  };

  const subSock = makeWASocket({
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

  const prev = opts.reconnect ? global.jadibotSessions[number] : null;
  const session = {
    number,
    sock: subSock,
    dir: sesDir,
    connected: false,
    stopped: false,
    startedAt: prev?.startedAt || Date.now(),
    everConnected: prev?.everConnected || false,
    reconnectAttempts: prev?.reconnectAttempts || 0,
  };
  global.jadibotSessions[number] = session;

  subSock.ev.on("creds.update", saveCreds);
  subStore.bind(subSock.ev);

  subSock.ev.on("groups.update", async ([event]) => {
    try {
      const metadata = await subSock.groupMetadata(event.id);
      groupCache.set(event.id, metadata);
    } catch {}
  });

  subSock.ev.on("group-participants.update", async (event) => {
    try {
      const metadata = await subSock.groupMetadata(event.id);
      groupCache.set(event.id, metadata);
    } catch {}
  });

  attachWelcome(subSock);

  attachSocketHelpers(subSock, { fs, fileTypeFromBuffer, parsePhoneNumber, store: subStore, axios });
  Solving(subSock);
  subSock.public = true;

  subSock.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      const kay = chatUpdate.messages[0];
      if (!kay.message) return;
      if (isDuplicateMessage(subSock, kay)) return;

      kay.message =
        Object.keys(kay.message)[0] === "ephemeralMessage"
          ? kay.message.ephemeralMessage.message
          : kay.message;

      const m = smsg(subSock, kay, subStore);
      if (!m.message) return;
      m.message = Object.keys(m.message)[0] === "ephemeralMessage" ? m.message.ephemeralMessage.message : m.message;
      if (m.isBaileys) return;
      if (m.mtype === "protocolMessage") return;

      if (kay.key.id.startsWith("BAE5") && kay.key.id.length === 16) return;

      const mainHandler = await getMainHandler();
      mainHandler(subSock, m, chatUpdate, subStore);
    } catch (err) {
      logger.error(`[jadibot:${number}] Error saat memproses pesan:`, err);
    }
  });

  let pairingCodeResolved = null;
  let rejectPairing = null;

  const pairingPromise = new Promise((resolve, reject) => {
    pairingCodeResolved = resolve;
    rejectPairing = reject;
  });

  subSock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    const statusCode = lastDisconnect?.error?.output?.statusCode;

    if (session.stopped || global.jadibotSessions[number] !== session) return;

    if (connection === "open") {
      session.connected = true;
      session.everConnected = true;
      session.reconnectAttempts = 0;
      session.jid = subSock.user?.id;
      console.log(chalk.green(`[ Jadibot ] +${number} berhasil terhubung ke WhatsApp`));

      try {
        const me = String(global.ownernumber || "").split(",")[0].trim();
        if (me) {
          await parentSocket?.sendMessage?.(`${me}@s.whatsapp.net`, {
            text: `✅ Sub-bot *${number}* sudah terhubung.`,
          });
        }
      } catch {}
      return;
    }

    if (connection !== "close") return;

    session.connected = false;
    const isLoggedOut = statusCode === DisconnectReason.loggedOut;
    const isForbidden = statusCode === 403;
    const isReplaced = statusCode === DisconnectReason.connectionReplaced;

    if (isLoggedOut || isForbidden || isReplaced) {
      logger.info(`[jadibot:${number}] Sesi berakhir (kode ${statusCode}), sesi dihapus.`);
      await removeSession(number, { logout: false });
      return;
    }

    session.reconnectAttempts += 1;
    const MAX_RECONNECT_JADIBOT = 8;

    if (session.reconnectAttempts > MAX_RECONNECT_JADIBOT) {
      logger.error(`[jadibot:${number}] Gagal connect setelah ${MAX_RECONNECT_JADIBOT}x percobaan, sesi dihapus. Coba .jadibot ulang.`);
      await removeSession(number, { logout: false, keepIfEverConnected: true });
      return;
    }

    const delay = statusCode === DisconnectReason.restartRequired
      ? 500
      : Math.min(3000 * session.reconnectAttempts, 30_000);

    setTimeout(() => {
      startSubBot(number, deps, { reconnect: true }).catch((err) => {
        logger.error(`[jadibot:${number}] Gagal reconnect:`, err);
      });
    }, delay);
  });

  if (opts.reconnect) {

    pairingCodeResolved(null);
  } else if (!subSock.authState.creds.registered) {
    try {
      await new Promise((r) => setTimeout(r, 3000));
      const raw = await subSock.requestPairingCode(number);
      pairingCodeResolved(String(raw).match(/.{1,4}/g)?.join("-") || raw);
    } catch (err) {
      await removeSession(number, { logout: false });
      rejectPairing(err);
    }
  } else {

    pairingCodeResolved(null);
  }

  const pairingCode = await pairingPromise;
  return { number, pairingCode, sock: subSock };
}

async function removeSession(number, { logout = false, keepIfEverConnected = false } = {}) {
  const session = global.jadibotSessions[number];
  const sesDir = session?.dir || sessionPath(number);

  if (session) {
    session.stopped = true;
    try { session.sock.ev.removeAllListeners(); } catch {}
    if (logout) {
      try { await session.sock.logout(); } catch {}
    }
    try { session.sock.end?.(undefined); } catch {}
    delete global.jadibotSessions[number];
  }

  if (keepIfEverConnected && session?.everConnected) return;

  try { fs.rmSync(sesDir, { recursive: true, force: true }); } catch {}
}

async function deleteSubBot(rawNumber) {
  const number = normalizeNumber(rawNumber);
  if (!number) return false;

  const adaDiMemori = !!global.jadibotSessions[number];
  const adaDiDisk = fs.existsSync(sessionPath(number));
  if (!adaDiMemori && !adaDiDisk) return false;

  await removeSession(number, { logout: true });
  return true;
}

function listSubBots() {
  return Object.values(global.jadibotSessions).map((s) => ({
    number: s.number,
    connected: !!s.connected,
    startedAt: s.startedAt,
  }));
}

function listRentbotFolders() {
  if (!fs.existsSync(JADIBOT_DIR)) return [];
  return fs.readdirSync(JADIBOT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

async function restoreSubBots(deps) {
  if (!fs.existsSync(JADIBOT_DIR)) return;
  const dirs = fs.readdirSync(JADIBOT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const number of dirs) {
    const credsPath = path.join(sessionPath(number), "creds.json");
    if (!fs.existsSync(credsPath)) continue;
    try {
      if (global.jadibotSessions[number]) continue;
      logger.info(`[jadibot:${number}] Restore sesi dari penyimpanan...`);
      await startSubBot(number, deps);
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      logger.error(`[jadibot:${number}] Gagal restore sesi:`, err);
    }
  }
}

export { startSubBot, deleteSubBot, listSubBots, listRentbotFolders, restoreSubBots, removeSession };
