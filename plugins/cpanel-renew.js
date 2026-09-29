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
  ensureDB, loadPanelDB, savePanelDB, upsertPanel, DAY_MS, daysLeftFromExpiry,
  apiGET, apiGetAll, unsuspendServer, clearNotifState, guardPanel, panelActor,
} from '../lib/cpanelHelper.js';

let handler = async (m, { text, prefix, isCreator, senderPnJid }) => {
  const tolak = guardPanel(m, { isCreator, senderPnJid });
  if (tolak) return m.reply(tolak);

  ensureDB();
  const who = panelActor(m, senderPnJid);

  try {

    if (!text) {
      const res = await apiGetAll('/servers');
      if (!res.ok) return m.reply('Pengambilan data server gagal diproses.');

      const allPanels = loadPanelDB();
      const mine = res.items.filter((s) => {
        if (isCreator) return true;
        const p = allPanels.find((x) => String(x.serverId) === String(s.attributes.id));
        return p && p.reseller === who;
      });
      if (!mine.length) return m.reply('Tidak ditemukan server yang memenuhi syarat untuk diperpanjang.');

      let msg = '🔄 SERVER TERSEDIA UNTUK PERPANJANGAN\n\n';
      mine.forEach((s, i) => {
        const panel = allPanels.find((p) => String(p.serverId) === String(s.attributes.id));
        const dLeft = panel ? daysLeftFromExpiry(panel.expiresAt) : 0;
        const status = panel
          ? dLeft > 0 ? `🟢 (${dLeft} hari)` : `🔴 (Kadaluarsa${panel.suspended ? ' / Ditangguhkan' : ''})`
          : '⚪ (Tidak ada data di database)';
        msg += `${i + 1}. ${s.attributes.name}\n   🆔 ID Server: ${s.attributes.id}\n   ⏰ Status: ${status}\n   🔄 Perintah: ${prefix}renew ${s.attributes.id}\n\n`;
      });
      return m.reply(msg);
    }

    const serverId = Number(String(text).trim());
    if (!serverId) return m.reply(`Format salah. Gunakan: ${prefix}renew <ID Server>`);

    const verify = await apiGET(`/servers/${serverId}`);
    if (!verify.ok) {
      if (verify.status === 404) {
        savePanelDB(loadPanelDB().filter((p) => String(p.serverId) !== String(serverId)));
        clearNotifState(serverId);
        return m.reply(`ID Server ${serverId} tidak terdaftar. Database telah disesuaikan.`);
      }
      return m.reply(`Verifikasi server gagal. Kode status: ${verify.status}`);
    }

    const server = verify.data.attributes;
    const panel = loadPanelDB().find((p) => String(p.serverId) === String(serverId));

    if (!isCreator && (!panel || panel.reseller !== who)) {
      return m.reply(`Maaf, Anda tidak memiliki akses untuk memperpanjang server ${server.name}.`);
    }

    const wasSuspended = !!panel?.suspended || server.suspended === true;
    if (!(await unsuspendServer(serverId)) && wasSuspended) {
      return m.reply('Perpanjangan dibatalkan: server gagal diaktifkan kembali di panel. Coba lagi atau hubungi owner.');
    }

    const days = 30;
    const now = Date.now();
    const oldExp = panel?.expiresAt ? Number(panel.expiresAt) : 0;
    const newExpiry = (oldExp > now ? oldExp : now) + days * DAY_MS;

    upsertPanel(serverId, {
      expiresAt: newExpiry,
      lastRenewed: now,
      suspended: false,
      name: panel?.name || server?.name,
    });
    clearNotifState(serverId);

    return m.reply(`✅ PERPANJANGAN SERVER BERHASIL

🏷️ Nama Layanan: ${server.name}
🆔 ID Server: ${serverId}
➕ Penambahan Durasi: ${days} hari
📅 Masa Aktif Sebelumnya: ${(oldExp ? new Date(oldExp) : new Date(now)).toLocaleDateString('id-ID')}
📅 Masa Aktif Baru: ${new Date(newExpiry).toLocaleDateString('id-ID')}

Layanan Anda telah berhasil diperpanjang.`);
  } catch (error) {
    console.error('Renew Error:', error);
    return m.reply(`Terjadi kendala sistem: ${error?.message || error}`);
  }
};

handler.command = ['renew', 'renewserver'];
handler.tags = ['cpanel'];
handler.help = ['renew <id server>'];
handler.premium = true;

export default handler;
