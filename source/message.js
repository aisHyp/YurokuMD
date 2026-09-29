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
 *
 *  source/message.js  (serializer pesan, gaya Zephyra)
 *
 *  Isi file ini:
 *   1. smsg()            ubah pesan mentah Baileys jadi objek `m` (chat, sender, quoted, reply, ...)
 *   2. serializeAccess() tempelkan flag akses ke `m`:
 *                        m.isGroup, m.isPrivate, m.isAdmin, m.isBotAdmin, m.isCreator (= m.isOwner)
 *   3. buildAccess() / guard() / collectAdminIds() / matchJid()
 *                        logika pengecekan admin, bot admin & owner. WhatsApp sekarang campur ID
 *                        nomor (@s.whatsapp.net) dan LID (@lid), jadi semua bentuk ID admin
 *                        dikumpulkan lalu dicocokkan dua arah.
 *
 *  Pesan penolakan ada di global.mess (settings.js).
 */
import { proto, getContentType } from 'luoxy-baileys'
import * as baileysLib from 'luoxy-baileys'

const deviceOf = (id = '') =>
    /^3A.{18}$/.test(id) ? 'ios' :
    /^3E.{20}$/.test(id) ? 'web' :
    /^(.{21}|.{32})$/.test(id) ? 'android' :
    /^(3F|.{18}$)/.test(id) ? 'desktop' : 'unknown'

export const smsg = (russyuroku, m, store) => {
    if (!m) return m;
    let M = proto.WebMessageInfo;
    if (m.key) {
        m.id = m.key.id;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = russyuroku.decodeJid(m.fromMe && russyuroku.user.id || m.participant || m.key.participant || m.chat || '');
        if (m.isGroup) m.participant = russyuroku.decodeJid(m.key.participant) || '';
    }
    if (m.message) {
        m.mtype = getContentType(m.message);
        m.msg = (m.mtype === 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype]);
        m.body =
            m.message?.conversation ||
            m.msg?.caption ||
            m.msg?.text ||
            (m.mtype === 'listResponseMessage' && m.msg?.singleSelectReply?.selectedRowId) ||
            (m.mtype === 'buttonsResponseMessage' && m.msg?.selectedButtonId) ||
            (m.mtype === 'viewOnceMessage' && m.msg?.caption) ||
            m.text || '';

        let quoted = m.quoted = m.msg?.contextInfo?.quotedMessage || null;
        m.mentionedJid = m.msg?.contextInfo?.mentionedJid || [];
        if (m.quoted) {
            let type = Object.keys(m.quoted)[0];
            m.quoted = m.quoted[type];
            if (['productMessage'].includes(type)) {
                type = Object.keys(m.quoted)[0];
                m.quoted = m.quoted[type];
            }
            if (typeof m.quoted === 'string') m.quoted = { text: m.quoted };
            m.quoted.mtype = type;
            m.quoted.id = m.msg?.contextInfo?.stanzaId;
            m.quoted.chat = m.msg?.contextInfo?.remoteJid || m.chat;
            m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false;
            m.quoted.sender = russyuroku.decodeJid(m.msg?.contextInfo?.participant);
            m.quoted.fromMe = m.quoted.sender === russyuroku.decodeJid(russyuroku.user.id);

            m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || '';
            m.quoted.mentionedJid = m.msg?.contextInfo?.mentionedJid || [];
            if (m.quoted.id) m.quoted.device = deviceOf(m.quoted.id);
            m.quoted.body = m.quoted.text || m.quoted.selectedButtonId || m.quoted.singleSelectReply?.selectedRowId || m.quoted.selectedId || m.quoted.name || '';
            m.getQuotedObj = m.getQuotedMessage = async () => {
                if (!m.quoted.id) return false;
                let q = await store.loadMessage(m.chat, m.quoted.id, russyuroku);
                return smsg(russyuroku, q, store);
            };
            let vM = m.quoted.fakeObj = M.fromObject({
                key: {
                    remoteJid: m.quoted.chat,
                    fromMe: m.quoted.fromMe,
                    id: m.quoted.id
                },
                message: quoted,
                ...(m.isGroup ? { participant: m.quoted.sender } : {})
            });

            m.quoted.delete = () => russyuroku.sendMessage(m.quoted.chat, { delete: vM.key });
            m.quoted.copyNForward = (jid, forceForward = false, options = {}) => russyuroku.copyNForward(jid, vM, forceForward, options);
            m.quoted.download = () => russyuroku.downloadMediaMessage(m.quoted);
        }
    }
    if (m.msg?.url) m.download = () => russyuroku.downloadMediaMessage(m.msg);
    m.text = m.msg?.text || m.msg?.caption || m.message?.conversation || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || '';

    if (m.id) m.device = deviceOf(m.id);
    m.expiration = m.msg?.contextInfo?.expiration || 0;
    m.timestamp = Number(typeof m.messageTimestamp === 'object' ? (m.messageTimestamp?.low ?? m.messageTimestamp?.high) : m.messageTimestamp) || 0;
    m.isMedia = !!(m.msg?.mimetype || m.msg?.thumbnailDirectPath);
    if (m.isMedia) {
        m.mime = m.msg?.mimetype;
        m.size = m.msg?.fileLength;
        m.height = m.msg?.height || '';
        m.width = m.msg?.width || '';
        if (/webp/i.test(m.mime || '')) m.isAnimated = m.msg?.isAnimated;
    }

    let interactive = {};
    for (const raw of [m.msg?.interactiveResponseMessage?.paramsJson, m.msg?.nativeFlowResponseMessage?.paramsJson, m.msg?.paramsJson]) {
        if (!raw) continue;
        try { interactive = { ...interactive, ...JSON.parse(raw) }; } catch {}
    }
    m.interactive = interactive;
    m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text) ? russyuroku.sendFile(chatId, text, { quoted: m, ...options }) : russyuroku.sendText(chatId, text, m, { ...options });
    m.copy = () => smsg(russyuroku, M.fromObject(M.toObject(m)));
    m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => russyuroku.copyNForward(jid, m, forceForward, options);

    return m;
};

export const serializeAccess = async (russyuroku, m, groupMetadata, senderPnJid) => {
    if (!m) return m;
    const access = await buildAccess({ sock: russyuroku, m, groupMetadata, senderPnJid });
    m.isGroup = access.isGroup;
    m.isPrivate = access.isPrivate;
    m.isAdmin = access.isAdmins;
    m.isBotAdmin = access.isBotAdmins;
    m.isCreator = access.isCreator;
    m.isOwner = access.isOwner;
    m.access = access;
    if (access.isGroup) {
        m.metadata = groupMetadata || {};
        m.admins = access.adminIds;
    }
    return m;
};

export function jidNumber(jid = '') {
  return String(jid || '').split('@')[0].split(':')[0];
}

function jidDomain(jid = '') {
  const parts = String(jid || '').split('@');
  return parts.length > 1 ? parts[1] : '';
}

export function collectAdminIds(participants = []) {
  const ids = new Set();
  for (const p of participants || []) {
    if (!p) continue;

    if (p.admin === null || p.admin === undefined || p.admin === false) continue;
    for (const v of [p.id, p.jid, p.lid, p.phoneNumber]) {
      if (v && typeof v === 'string') ids.add(v);
    }
  }
  return [...ids];
}

export function matchJid(jid, list = []) {
  if (!jid) return false;
  const num = jidNumber(jid);
  const dom = jidDomain(jid);
  if (!num) return false;
  return list.some((x) => {
    if (!x) return false;
    if (x === jid) return true;
    return jidNumber(x) === num && (jidDomain(x) === dom || !dom || !jidDomain(x));
  });
}

export async function buildAccess({ sock, m, groupMetadata, senderPnJid }) {
  const isGroup = !!(m?.chat && String(m.chat).endsWith('@g.us'));
  const isPrivate = !isGroup;

  let isCreator = false;
  try {
    isCreator = !!(await sock.isOwnerJid(m.sender));
    if (!isCreator && senderPnJid && senderPnJid !== m.sender) {
      isCreator = !!(await sock.isOwnerJid(senderPnJid));
    }
  } catch {
    isCreator = false;
  }

  if (m?.fromMe) isCreator = true;

  let isAdmins = false;
  let isBotAdmins = false;
  let adminIds = [];

  if (isGroup) {
    const participants = groupMetadata?.participants || [];
    adminIds = collectAdminIds(participants);

    const botIds = [sock?.user?.id, sock?.user?.lid, sock?.user?.jid].filter(Boolean);
    isBotAdmins = botIds.some((b) => matchJid(b, adminIds));

    const senderIds = [m.sender, senderPnJid].filter(Boolean);
    if (m.fromMe) senderIds.push(...botIds);
    isAdmins = senderIds.some((s) => matchJid(s, adminIds));
  }

  return {
    isGroup,
    isPrivate,
    isAdmins,
    isBotAdmins,
    isCreator,
    isOwner: isCreator,
    adminIds,
  };
}

export function guard(src, need = {}, mess = global.mess || {}) {

  const isGroup = src.isGroup;
  const isPrivate = src.isPrivate;
  const isAdmin = src.isAdmin ?? src.isAdmins;
  const isBotAdmin = src.isBotAdmin ?? src.isBotAdmins;
  const isCreator = src.isCreator;

  if (need.owner && !isCreator) return mess.creator || mess.owner;
  if (need.group && !isGroup) return mess.group;
  if (need.private && !isPrivate) return mess.private;
  if (need.admin && !isAdmin && !isCreator) return mess.admin;
  if (need.botAdmin && !isBotAdmin) return mess.botAdmin;
  return null;
}

const normalizeJid = (jid = '') => {
    if (typeof baileysLib.jidNormalizedUser === 'function') return baileysLib.jidNormalizedUser(jid);
    const [user, server = ''] = String(jid || '').split('@');
    return user ? `${user.split(':')[0]}@${server === 'c.us' ? 's.whatsapp.net' : server}` : '';
};

export const Solving = (russyuroku) => {
    if (!russyuroku || russyuroku.__solvingAttached) return russyuroku;
    russyuroku.__solvingAttached = true;

    const originalPP = russyuroku.profilePictureUrl?.bind(russyuroku);
    if (originalPP) {
        russyuroku.profilePictureUrl = async (jid, type = 'image', timeoutMs) => {
            const target = normalizeJid(jid);
            let lastErr;
            try {
                const url = await originalPP(target, type, timeoutMs);
                if (url) return url;
            } catch (e) { lastErr = e; }
            if (target.endsWith('@lid') && typeof russyuroku.resolvePn === 'function') {
                const pn = await russyuroku.resolvePn(target).catch(() => null);
                if (pn && pn !== target && !String(pn).endsWith('@lid')) return originalPP(normalizeJid(pn), type, timeoutMs);
            }
            if (lastErr) throw lastErr;
            return undefined;
        };
    }

    russyuroku.sendContactV2 = async (jid, numbers = [], desc = 'Developer Bot', quoted = '', opts = {}) => {
        const contacts = (Array.isArray(numbers) ? numbers : [numbers]).map((item) => {
            const number = String(typeof item === 'object' ? item.number : item).replace(/[^0-9]/g, '');
            const name = (typeof item === 'object' && item.name) || global.ownername || 'Owner';
            return {
                displayName: name,
                vcard:
                    'BEGIN:VCARD\n' +
                    'VERSION:3.0\n' +
                    `N:;${name};;;\n` +
                    `FN:${name}\n` +
                    'ORG:null\n' +
                    'TITLE:\n' +
                    `item1.TEL;waid=${number}:${number}\n` +
                    'item1.X-ABLabel:Ponsel\n' +
                    `X-WA-BIZ-DESCRIPTION:${desc}\n` +
                    `X-WA-BIZ-NAME:${name}\n` +
                    'END:VCARD',
            };
        });
        return russyuroku.sendMessage(jid, { contacts: { displayName: `${contacts.length} Kontak`, contacts }, ...opts }, { quoted });
    };

    russyuroku.sendTextMentions = async (jid, text, quoted, options = {}) =>
        russyuroku.sendMessage(
            jid,
            { text, mentions: [...String(text).matchAll(/@(\d{5,16})/g)].map((v) => v[1] + '@s.whatsapp.net'), ...options },
            { quoted },
        );

    russyuroku.sendAsSticker = (jid, source, quoted, options = {}) =>
        russyuroku.sendImageAsSticker(jid, source, quoted, options);

    russyuroku.sendMedia = async (jid, source, fileName = '', caption = '', quoted = '', options = {}) => {
        const { mime, data } = await russyuroku.getFile(source);
        if (options.asSticker || /webp/.test(mime)) {
            return russyuroku.sendImageAsSticker(jid, data, quoted, {
                packname: options.packname || global.packname,
                author: options.author || global.author,
                ...options,
            });
        }
        let type = 'document';
        let mimetype = mime;
        if (/image|video|audio/.test(mime)) {
            type = mime.split('/')[0];
            mimetype = type === 'video' ? 'video/mp4' : type === 'audio' ? 'audio/mpeg' : mime;
        }
        return russyuroku.sendMessage(jid, { [type]: data, caption, mimetype, fileName, ...options }, { quoted, ...options });
    };

    russyuroku.appendResponseMessage = async (m, text) => {
        const apb = await baileysLib.generateWAMessage(
            m.chat,
            { text, mentions: m.mentionedJid },
            { userJid: russyuroku.user.id, quoted: m.quoted && m.quoted.fakeObj },
        );
        apb.key = m.key;
        apb.key.id = [...Array(32)].map(() => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
        apb.key.fromMe = baileysLib.areJidsSameUser(m.sender, russyuroku.user.id);
        if (m.isGroup) apb.participant = m.sender;
        russyuroku.ev.emit('messages.upsert', {
            ...m,
            messages: [proto.WebMessageInfo.fromObject(apb)],
            type: 'append',
        });
    };

    return russyuroku;
};

const seenMessages = new WeakMap();
const SEEN_LIMIT = 2000;

export const isDuplicateMessage = (russyuroku, msg) => {
    const id = msg?.key?.id;
    if (!id) return false;
    let seen = seenMessages.get(russyuroku);
    if (!seen) { seen = new Set(); seenMessages.set(russyuroku, seen); }
    const key = `${msg.key.remoteJid}:${id}`;
    if (seen.has(key)) return true;
    seen.add(key);
    if (seen.size > SEEN_LIMIT) seen.delete(seen.values().next().value);
    return false;
};

