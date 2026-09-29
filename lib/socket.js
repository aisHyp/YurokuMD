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

import {
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  jidDecode,
  Button,
  ButtonV2,
  Carousel,
  AIRich,
} from 'luoxy-baileys';

import { getBuffer, getSizeMedia } from './myfunc.js';
import { imageToWebp, videoToWebp, writeExifImg, writeExifVid, exifAvatar } from './exif.js';
import * as baileysLib from 'luoxy-baileys';
import * as logger from './logger.js';

function attachMessageBuilder(socket) {
  socket.messageBuilder = function (jid, options = {}) {
    let currentInstancePromise = null;

    const handler = {
      get(target, propKey) {
        if (propKey === 'then') return undefined;

        if (propKey === 'setType') {
          return function (type) {
            currentInstancePromise = Promise.resolve().then(async () => {
              if (type === 'Button') return new Button(socket);
              if (type === 'ButtonV2') return new ButtonV2(socket);
              if (type === 'Carousel') return new Carousel(socket);
              if (type === 'AIRich' || type === 'html' || type === 'HTML') return new AIRich(socket);
              throw new Error(
                `Type ${type} tidak dikenali. Gunakan salah satu dari: Button, ButtonV2, Carousel, AIRich.`
              );
            });
            return proxy;
          };
        }

        if (propKey === 'send') {
          return async function () {
            if (!currentInstancePromise) {
              throw new Error('Kamu harus menentukan .setType() terlebih dahulu sebelum .send()');
            }
            const instance = await currentInstancePromise;
            return await instance.send(jid, options);
          };
        }

        return function (...args) {
          if (!currentInstancePromise) {
            throw new Error(`Kamu harus memanggil .setType() sebelum memanggil .${propKey}()`);
          }

          currentInstancePromise = currentInstancePromise.then(async (instance) => {
            if (typeof instance[propKey] !== 'function') {
              const available = Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
                .concat(
                  Object.getPrototypeOf(Object.getPrototypeOf(instance))
                    ? Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(instance)))
                    : []
                )
                .filter((n) => n !== 'constructor')
                .sort()
                .join(', ');
              throw new TypeError(
                `Method .${propKey}() tidak ada di builder ini.\nMethod valid: ${available}`
              );
            }
            const result = await instance[propKey](...args);
            return result && typeof result === 'object' ? result : instance;
          });

          return proxy;
        };
      },
    };

    const proxy = new Proxy({}, handler);
    return proxy;
  };
}

function normalizeNumber(jid = '') {
  return jid.split('@')[0].split(':')[0];
}

let cachedOwnerPN = null;
let cachedOwnerLID = null;
let lidResolvePromise = null;

async function resolveOwnerLid(russyuroku) {
  const currentPN = String(global.ownernumber || '').trim();
  if (!currentPN) return null;
  if (cachedOwnerPN === currentPN && cachedOwnerLID) return cachedOwnerLID;
  if (lidResolvePromise) return lidResolvePromise;

  lidResolvePromise = (async () => {
    try {
      const jid = currentPN + '@s.whatsapp.net';
      const lid = await russyuroku.signalRepository.lidMapping.getLIDForPN(jid);
      if (!lid) return null;
      cachedOwnerPN = currentPN;
      cachedOwnerLID = lid.split('@')[0].split(':')[0];
      return cachedOwnerLID;
    } catch {
      return null;
    } finally {
      lidResolvePromise = null;
    }
  })();

  return lidResolvePromise;
}

function attachSocketHelpers(russyuroku, deps) {
  const { fs, fileTypeFromBuffer, parsePhoneNumber, store, axios } = deps;

  const formatNumber = (rawJid) => {
    const num = rawJid.split('@')[0].split(':')[0];
    if (rawJid.endsWith('@lid') || !/^\d+$/.test(num)) return num;
    try {
      const parsed = parsePhoneNumber('+' + num);
      return (parsed.valid && parsed.number?.international) || num;
    } catch {
      return num;
    }
  };

  try {
    attachMessageBuilder(russyuroku);
  } catch (err) {
    logger.warn('messageBuilder gagal di-inject ke socket, fitur Button/Carousel mungkin tidak bekerja optimal.');
  }

  russyuroku.getFollowedChannels = async () => {
    const candidates = (store?.chats || []).filter((c) => c.id?.endsWith('@newsletter'));
    const results = [];
    for (const chat of candidates) {
      try {
        const meta = await russyuroku.newsletterMetadata('jid', chat.id);
        if (meta) results.push(meta);
      } catch {}
    }
    return results;
  };

  russyuroku.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + '@' + decode.server) ||
        jid
      );
    } else return jid;
  };

  russyuroku.isOwnerJid = async (jid) => {
    if (!jid) return false;
    const num = normalizeNumber(jid);
    const owners = String(global.ownernumber || '').split(',').map((v) => v.trim()).filter(Boolean);
    const bots = String(global.nomorbot || '').split(',').map((v) => v.trim()).filter(Boolean);

    if (owners.includes(num) || bots.includes(num)) return true;

    if (jid.endsWith('@lid')) {
      const lid = await resolveOwnerLid(russyuroku);
      if (lid && lid === num) return true;
    }

    return false;
  };

  const toPnJid = (raw) => {
    if (!raw) return null;
    const digits = normalizeNumber(raw);
    if (!digits) return null;
    return `${digits}@s.whatsapp.net`;
  };

  const pnCache = new Map();

  // Cari pasangan PN (nomor asli) untuk sebuah LID di dalam satu groupMetadata.
  // Dipisah jadi fungsi sendiri supaya bisa dipakai ulang untuk retry setelah refresh metadata.
  const findPnInMetadata = (lidNum, groupMetadata) => {
    if (!groupMetadata?.participants?.length) return null;
    const found = groupMetadata.participants.find((p) => {
      const pid = p.id || p.jid || '';
      const plid = p.lid || '';
      return normalizeNumber(pid) === lidNum || normalizeNumber(plid) === lidNum;
    });
    if (!found) return null;
    const candidate = [found.phoneNumber, found.id, found.jid].find(
      (v) => v && !String(v).endsWith('@lid'),
    );
    return toPnJid(candidate);
  };

  russyuroku.resolvePn = async (jid, groupMetadata, ctx = {}) => {
    if (!jid) return jid;
    if (!jid.endsWith('@lid')) return jid;

    if (pnCache.has(jid)) return pnCache.get(jid);

    const lidNum = normalizeNumber(jid);

    // 1) Coba dari metadata yang sudah diberikan caller (paling cepat, tanpa request tambahan).
    let pn = findPnInMetadata(lidNum, groupMetadata);
    if (pn) {
      pnCache.set(jid, pn);
      return pn;
    }

    // 2) Kalau metadata tidak diberikan/tidak lengkap, tapi ada chatId (grup), coba ambil ulang
    //    metadata grup secara langsung. Ini menutup celah "kadang gagal" saat metadata cache
    //    lama/basi atau caller lupa mengoper groupMetadata.
    const chatId = ctx.chatId || groupMetadata?.id;
    if (!pn && chatId && String(chatId).endsWith('@g.us')) {
      try {
        const freshMeta = await russyuroku.groupMetadata(chatId);
        pn = findPnInMetadata(lidNum, freshMeta);
        if (pn) {
          pnCache.set(jid, pn);
          return pn;
        }
      } catch (err) {
        logger.warn?.(`[resolvePn] Gagal refresh groupMetadata(${chatId}) untuk resolve ${jid}: ${err?.message || err}`);
      }
    }

    // 3) Fallback ke lookup internal Baileys (signal repository), dengan 1x retry
    //    kalau percobaan pertama gagal karena race condition/timeout sesaat.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await russyuroku.signalRepository.lidMapping.getPNForLID(jid);
        pn = toPnJid(raw);
        if (pn) {
          pnCache.set(jid, pn);
          return pn;
        }
        logger.warn?.(`[resolvePn] getPNForLID(${jid}) tidak mengembalikan nomor valid (percobaan ${attempt + 1}): ${JSON.stringify(raw)}`);
      } catch (err) {
        logger.warn?.(`[resolvePn] Gagal resolve ${jid} (percobaan ${attempt + 1}): ${err?.message || err}`);
      }
      if (attempt === 0) await new Promise((r) => setTimeout(r, 300));
    }

    logger.warn?.(`[resolvePn] LID ${jid} tidak berhasil di-resolve ke nomor asli, dipakai apa adanya (LID mentah).`);
    return jid;
  };

  russyuroku.sendTextWithMentions = async (jid, text, quoted, options = {}) =>
    russyuroku.sendMessage(
      jid,
      {
        text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map((v) => v[1] + '@s.whatsapp.net'),
        ...options,
      },
      { quoted },
    );

  russyuroku.ev.on('contacts.update', (update) => {
    for (const contact of update) {
      const id = russyuroku.decodeJid(contact.id);
      if (store && store.contacts) {
        store.contacts[id] = { id, name: contact.notify };
      }
    }
  });

  russyuroku.getName = (jid, withoutContact = false) => {
    const id = russyuroku.decodeJid(jid);
    withoutContact = russyuroku.withoutContact || withoutContact;
    let v;
    if (id.endsWith('@g.us')) {
      return new Promise(async (resolve) => {
        v = (store && store.contacts && store.contacts[id]) || {};
        if (!(v.name || v.subject)) {
          try {
            v = (await russyuroku.groupMetadata(id)) || {};
          } catch {
            v = {};
          }
        }
        resolve(
          v.name ||
            v.subject ||
            formatNumber(id),
        );
      });
    }
    v =
      id === '0@s.whatsapp.net'
        ? { id, name: 'WhatsApp' }
        : id === russyuroku.decodeJid(russyuroku.user.id)
          ? russyuroku.user
          : (store && store.contacts && store.contacts[id]) || {};
    return (
      (withoutContact ? '' : v.name) ||
      v.subject ||
      v.verifiedName ||
      formatNumber(jid)
    );
  };

  russyuroku.parseMention = (text = '') => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net');
  };

  russyuroku.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    const list = [];
    for (const i of kon) {
      const displayName = await russyuroku.getName(i);
      list.push({
        displayName,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${displayName}\nFN:${displayName}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${global.namabot}\nitem2.X-ABLabel:Bot\nitem3.URL:${global.web}\nitem3.X-ABLabel:Website\nitem4.ADR:;;${global.ownername};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    return russyuroku.sendMessage(
      jid,
      { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts },
      { quoted },
    );
  };

  russyuroku.setStatus = (status) => {
    russyuroku.query({
      tag: 'iq',
      attrs: { to: '@s.whatsapp.net', type: 'set', xmlns: 'status' },
      content: [{ tag: 'status', attrs: {}, content: Buffer.from(status, 'utf-8') }],
    });
    return status;
  };

  async function resolveBuffer(source) {
    if (Buffer.isBuffer(source)) return source;
    if (/^data:.*?\/.*?;base64,/i.test(source)) return Buffer.from(source.split(',')[1], 'base64');
    if (/^https?:\/\//.test(source)) return await getBuffer(source);
    if (fs.existsSync(source)) return fs.readFileSync(source);
    return Buffer.alloc(0);
  }

  russyuroku.sendImage = async (jid, source, caption = '', quoted = '', options) => {
    const buffer = await resolveBuffer(source);
    return russyuroku.sendMessage(jid, { image: buffer, caption, ...options }, { quoted });
  };

  russyuroku.sendImageAsSticker = async (jid, source, quoted, options = {}) => {
    const buff = await resolveBuffer(source);
    const buffer =
      options && (options.packname || options.author)
        ? await writeExifImg(buff, options)
        : await imageToWebp(buff);
    return russyuroku.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted }).then((response) => {
      if (typeof buffer === 'string' && fs.existsSync(buffer)) fs.unlinkSync(buffer);
      return response;
    });
  };

  russyuroku.sendVideoAsSticker = async (jid, source, quoted, options = {}) => {
    const buff = await resolveBuffer(source);
    const buffer =
      options && (options.packname || options.author)
        ? await writeExifVid(buff, options)
        : await videoToWebp(buff);
    await russyuroku.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
  };

  russyuroku.sendImageAsStickerAvatar = async (jid, source, quoted, options = {}) => {
    const buff = await resolveBuffer(source);
    const webp = await imageToWebp(buff);
    const buffer = await exifAvatar(webp, options.packname || '', options.author || '');
    return russyuroku.sendMessage(jid, { sticker: buffer, ...options }, { quoted });
  };

  russyuroku.sendVideoAsStickerAvatar = async (jid, source, quoted, options = {}) => {
    const buff = await resolveBuffer(source);
    const webp = await videoToWebp(buff);
    const buffer = await exifAvatar(webp, options.packname || '', options.author || '');
    return russyuroku.sendMessage(jid, { sticker: buffer, ...options }, { quoted });
  };

  russyuroku.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    if (options.readViewOnce) {
      message.message =
        message.message?.ephemeralMessage?.message || message.message || undefined;
      const vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = { ...message.message.viewOnceMessage.message };
    }
    const mtype = Object.keys(message.message)[0];
    const content = await generateForwardMessageContent(message, forceForward);
    const ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != 'conversation') context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = { ...context, ...content[ctype].contextInfo };
    const waMessage = await generateWAMessageFromContent(
      jid,
      content,
      options
        ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo
              ? { contextInfo: { ...content[ctype].contextInfo, ...options.contextInfo } }
              : {}),
          }
        : {},
    );
    await russyuroku.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
    return waMessage;
  };

  russyuroku.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    const quoted = message.msg ? message.msg : message;
    const mime = (message.msg || message).mimetype || '';
    const messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    const type = await fileTypeFromBuffer(buffer);
    const isAudio = type?.ext === 'ogg' || type?.ext === 'opus';
    const trueFileName = attachExtension ? `${filename}.${isAudio ? 'mp3' : type?.ext || 'bin'}` : filename;
    fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  russyuroku.downloadMediaMessage = async (message) => {
    const quoted = message.msg ? message.msg : message;
    const mime = (message.msg || message).mimetype || '';
    const messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    return buffer;
  };

  russyuroku.getFile = async (source, save) => {
    let res;
    let filename;
    let data;
    if (Buffer.isBuffer(source)) {
      data = source;
    } else if (/^data:.*?\/.*?;base64,/i.test(source)) {
      data = Buffer.from(source.split(',')[1], 'base64');
    } else if (/^https?:\/\//.test(source)) {
      res = await getBuffer(source);
      data = res;
    } else if (fs.existsSync(source)) {
      filename = source;
      data = fs.readFileSync(source);
    } else {
      data = typeof source === 'string' ? source : Buffer.alloc(0);
    }
    const type = (await fileTypeFromBuffer(data)) || { mime: 'application/octet-stream', ext: 'bin' };
    if (data && save && filename) fs.promises.writeFile(filename, data);
    return { res, filename, size: await getSizeMedia(data), ...type, data };
  };

  russyuroku.sendText = (jid, text, quoted = '', options) =>
    russyuroku.sendMessage(jid, { text, ...options }, { quoted });

  russyuroku.sendFile = async (jid, media, options = {}) => {
    const file = await russyuroku.getFile(media);
    let type;
    switch (file.ext) {
      case 'mp3':
        type = 'audio';
        options.mimetype = 'audio/mpeg';
        options.ptt = options.ptt || false;
        break;
      case 'jpg':
      case 'jpeg':
      case 'png':
        type = 'image';
        break;
      case 'webp':
        type = 'sticker';
        break;
      case 'mp4':
        type = 'video';
        break;
      default:
        type = 'document';
    }
    return russyuroku.sendMessage(
      jid,
      { [type]: file.data, caption: options.caption || '', ...options },
      { quoted: options.quoted || '', ...options },
    );
  };

  russyuroku.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
    const res = await axios.head(url);
    const mime = res.headers['content-type'] || '';
    const kind = mime.split('/')[0];

    if (mime.split('/')[1] === 'gif') {
      return russyuroku.sendMessage(
        jid,
        { video: await getBuffer(url), caption, gifPlayback: true, ...options },
        { quoted, ...options },
      );
    }
    if (mime === 'application/pdf') {
      return russyuroku.sendMessage(
        jid,
        { document: await getBuffer(url), mimetype: 'application/pdf', caption, ...options },
        { quoted, ...options },
      );
    }
    if (kind === 'image') {
      return russyuroku.sendMessage(jid, { image: await getBuffer(url), caption, ...options }, { quoted, ...options });
    }
    if (kind === 'video') {
      return russyuroku.sendMessage(
        jid,
        { video: await getBuffer(url), caption, mimetype: 'video/mp4', ...options },
        { quoted, ...options },
      );
    }
    if (kind === 'audio') {
      return russyuroku.sendMessage(
        jid,
        { audio: await getBuffer(url), caption, mimetype: 'audio/mpeg', ...options },
        { quoted, ...options },
      );
    }
  };

  return russyuroku;
}

export { attachSocketHelpers };
