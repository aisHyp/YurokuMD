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
 *  Helper kecil buat nentuin "target" user dari mention / reply / nomor
 *  yang diketik manual. Dipakai bareng-bareng sama plugin warn, level,
 *  ultah, dll, biar gak duplikat logic di tiap file.
 */

// Ubah id @lid jadi nomor asli (@s.whatsapp.net) pakai data participants grup, kalau ada.
export function resolveLid(jid, participants = []) {
  if (!jid) return jid;
  if (!String(jid).endsWith('@lid')) return jid;
  const p = participants.find((x) => x.id === jid || x.lid === jid || x.jid === jid);
  if (p?.phoneNumber && !String(p.phoneNumber).endsWith('@lid')) return p.phoneNumber;
  if (p?.jid && !String(p.jid).endsWith('@lid')) return p.jid;
  return jid;
}

/**
 * Ambil target user dari: mention pertama -> quoted message -> nomor yang diketik.
 * Mengembalikan jid (string) atau null kalau gak ketemu.
 */
export function getTarget(m, text = '') {
  const participants = m.metadata?.participants || [];

  if (m.mentionedJid?.length > 0) {
    return resolveLid(m.mentionedJid[0], participants);
  }
  if (m.quoted?.sender) {
    return resolveLid(m.quoted.sender, participants);
  }
  if (text) {
    const number = String(text).trim().split(/\s+/)[0].replace(/[^0-9]/g, '');
    if (number) return number + '@s.whatsapp.net';
  }
  return null;
}

export function isParticipantAdmin(m, jid) {
  const participants = m.metadata?.participants || [];
  return participants.some((p) => (p.id === jid || p.jid === jid || p.lid === jid) && p.admin);
}
