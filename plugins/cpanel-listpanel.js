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
  ensureDB, loadPanelDB, daysLeftFromExpiry, apiGetAll, guardPanel, panelActor,
} from '../lib/cpanelHelper.js';

let handler = async (m, { isCreator, senderPnJid }) => {
  const tolak = guardPanel(m, { isCreator, senderPnJid });
  if (tolak) return m.reply(tolak);

  ensureDB();
  const who = panelActor(m, senderPnJid);

  try {
    await m.reply('Sedang memuat data operasional server...');

    const res = await apiGetAll('/servers');
    if (!res.ok) return m.reply(`Sinkronisasi data dengan server utama gagal (Kode: ${res.status}).`);
    if (!res.items.length) return m.reply('Tidak ditemukan riwayat layanan yang sedang berjalan.');

    const allPanels = loadPanelDB();
    const filtered = isCreator
      ? res.items
      : res.items.filter((s) => {
          const p = allPanels.find((x) => String(x.serverId) === String(s.attributes.id));
          return p && p.reseller === who;
        });

    if (!filtered.length) return m.reply('Anda belum memiliki server yang terdaftar di bawah pengawasan Anda.');

    let out = '╭─⬣「 REKAPITULASI SERVER 」⬣\n│\n';
    let n = 0, aktif = 0, kadaluarsa = 0;

    for (const s of filtered) {
      const info = allPanels.find((p) => String(p.serverId) === String(s.attributes.id));
      const dLeft = info ? daysLeftFromExpiry(info.expiresAt) : 0;
      const status = info ? (dLeft > 0 ? '🟢' : '🔴') : '⚪';

      out += `├─ ${++n}. ${s.attributes.name}\n`;
      out += `│  ├─ 🆔 ID Server: ${s.attributes.id}\n`;
      out += `│  ├─ 👤 ID Pengguna: ${s.attributes.user}\n`;

      if (info) {
        out += `│  ├─ 👤 Pemilik: ${info.owner || '-'}\n`;
        out += `│  ├─ 📅 Batas Waktu: ${info.expiresAt ? new Date(Number(info.expiresAt)).toLocaleDateString('id-ID') : '-'}\n`;
        out += `│  └─ 🔋 Status Saat Ini: ${status} (${dLeft} hari)${info.suspended ? ' / Ditangguhkan' : ''}\n`;
        if (dLeft > 0) aktif++; else kadaluarsa++;
      } else {
        out += '│  └─ ⚠️ Data tidak tersinkronisasi dengan database lokal\n';
      }
    }

    const scope = isCreator ? allPanels : allPanels.filter((p) => p.reseller === who);
    const anomali = scope.filter((p) => !res.items.some((s) => String(s.attributes.id) === String(p.serverId))).length;

    out += '│\n├─ Ringkasan Sistem\n';
    out += `│  ├─ 🖥️ Total Ditampilkan: ${n}\n`;
    out += `│  ├─ ✅ Layanan Aktif: ${aktif}\n`;
    out += `│  ├─ 🔴 Layanan Kadaluarsa: ${kadaluarsa}\n`;
    out += `│  └─ 🗑️ Anomali Data: ${anomali}\n`;
    out += '╰─⬣';

    return m.reply(out);
  } catch (e) {
    console.error('ListPanel Error:', e);
    return m.reply('Pengambilan rekapitulasi server gagal dilakukan.');
  }
};

handler.command = ['listpanel'];
handler.tags = ['cpanel'];
handler.help = ['listpanel'];
handler.premium = true;

export default handler;
