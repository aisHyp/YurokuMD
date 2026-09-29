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
  ensureDB, loadUsersDB, loadPanelDB, savePanelDB, normalizePhone, daysLeftFromExpiry,
  checkServerExists, suspendServer, guardPanel, panelActor,
} from '../lib/cpanelHelper.js';

let handler = async (m, { isCreator, senderPnJid }) => {
  const tolak = guardPanel(m, { isCreator, senderPnJid });
  if (tolak) return m.reply(tolak);

  ensureDB();

  try {

    const phone = normalizePhone(panelActor(m, senderPnJid).split('@')[0]);
    const user = loadUsersDB().find((u) => String(u.phone) === String(phone));
    const panelDB = loadPanelDB();
    const myServers = panelDB.filter((p) => String(p.owner || '') === String(phone));

    if (!user || !myServers.length) return m.reply('Anda saat ini belum memiliki layanan server yang aktif.');

    let suspendedNow = 0;
    for (const p of myServers) {
      if (daysLeftFromExpiry(p.expiresAt) > 0 || p.suspended || !p.serverId) continue;
      if (await checkServerExists(p.serverId)) {
        if (await suspendServer(p.serverId)) { p.suspended = true; suspendedNow++; }
      } else {
        p.suspended = true;
        suspendedNow++;
      }
    }
    if (suspendedNow) savePanelDB(panelDB);

    let teks = '╭─⬣「 LAYANAN ANDA 」⬣\n│\n';
    teks += `├─ 👤 Pengguna: ${user.username}\n`;
    teks += `├─ 📱 Kontak: ${phone}\n`;
    teks += `├─ 🖥️ Total Layanan: ${myServers.length}\n`;
    if (suspendedNow > 0) teks += `├─ 🧷 Ditangguhkan otomatis: ${suspendedNow} (Kadaluarsa)\n`;
    teks += '│\n├─ Daftar Layanan Aktif:\n';

    myServers.forEach((p, i) => {
      const dLeft = daysLeftFromExpiry(p.expiresAt);
      const status = dLeft > 0 ? `🟢 ${dLeft} hari` : `🔴 Kadaluarsa${p.suspended ? ' / Ditangguhkan' : ''}`;
      const expDate = p.expiresAt ? new Date(Number(p.expiresAt)).toLocaleDateString('id-ID') : '-';
      teks += `│  ${i + 1}. ${p.name || 'Tanpa Nama'} — ${status} (Hingga: ${expDate})\n`;
    });

    teks += '│\n╰─⬣\n\n🔒 Catatan: Data login dirahasiakan untuk menjaga keamanan akun Anda.';
    return m.reply(teks);
  } catch (e) {
    console.error('MyPanel Error:', e);
    return m.reply('Pengambilan informasi layanan gagal diproses.');
  }
};

handler.command = ['mypanel'];
handler.tags = ['cpanel'];
handler.help = ['mypanel'];
handler.premium = true;

export default handler;
