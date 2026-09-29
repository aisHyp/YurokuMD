/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  ⚔️  Lunar Saurus Empire  ⚔️
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  🌍 Site     : https://saurusdev.cloud
 *  📺 YouTube  : https://www.youtube.com/@sauruskinggwuw
 *  📢 Channel  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *  💬 Telegram : @lordsaurus
 *
 *  ⚠️ Watermark ini wajib tetap ada.
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import {
  ensureDB, loadPanelDB, savePanelDB, normalizePhone, daysLeftFromExpiry,
  checkServerExists, suspendServer, hasSent, markSent, buildReminderText,
  guardPanel, panelActor,
} from '../lib/cpanelHelper.js';

let handler = async (m, { russyuroku, isCreator, senderPnJid }) => {
  const tolak = guardPanel(m, { isCreator, senderPnJid });
  if (tolak) return m.reply(tolak);

  ensureDB();
  const who = panelActor(m, senderPnJid);

  try {
    const thresholds = [7, 5, 3, 1, 0];
    const panelDB = loadPanelDB();
    const targets = isCreator ? panelDB : panelDB.filter((p) => String(p.reseller || '') === String(who));

    if (!targets.length) return m.reply('Tidak ditemukan data panel terkait pada akun Anda.');

    await m.reply('Sedang memindai data dan mengirimkan pengingat...');

    let sentCount = 0;
    let suspendedCount = 0;

    for (const p of targets) {
      const serverId = p.serverId;
      const owner = normalizePhone(p.owner || '');
      if (!serverId || !owner) continue;

      const dLeft = daysLeftFromExpiry(p.expiresAt);
      const key = dLeft <= 0 ? 0 : thresholds.includes(dLeft) ? dLeft : null;
      if (key === null || hasSent(serverId, key)) continue;

      const jid = `${owner}@s.whatsapp.net`;

      if (key === 0 && !p.suspended) {
        if (await checkServerExists(serverId)) {
          if (await suspendServer(serverId)) { p.suspended = true; suspendedCount++; }
        } else {
          p.suspended = true;
        }
      }

      const teks = buildReminderText({
        daysLeft: dLeft <= 0 ? 0 : dLeft,
        serverName: p.name || 'Unnamed',
        serverId,
        mentionTag: `@${owner}`,
      });

      try {
        await russyuroku.sendMessage(jid, { text: teks, mentions: [jid] });
        markSent(serverId, key);
        sentCount++;
      } catch (e) {
        console.error('Gagal mengirim pengingat:', e);
      }
    }

    savePanelDB(panelDB);
    return m.reply(`Proses pengingat selesai.\nPesan terkirim: ${sentCount}\nServer ditangguhkan otomatis: ${suspendedCount}`);
  } catch (e) {
    console.error('Notif Command Error:', e);
    return m.reply('Terjadi kesalahan saat memproses notifikasi.');
  }
};

handler.command = ['notif'];
handler.tags = ['cpanel'];
handler.help = ['notif'];
handler.premium = true;

export default handler;
