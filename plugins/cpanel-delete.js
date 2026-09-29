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
  ensureDB, loadPanelDB, savePanelDB, loadUsersDB, saveUsersDB, normalizePhone,
  checkServerExists, deleteServer, apiDELETE, clearNotifState,
  guardPanel, panelActor,
} from '../lib/cpanelHelper.js';

let handler = async (m, { command, text, prefix, isCreator, senderPnJid }) => {
  const tolak = guardPanel(m, { isCreator, senderPnJid });
  if (tolak) return m.reply(tolak);

  ensureDB();
  const cmd = String(command || '').toLowerCase();
  const who = panelActor(m, senderPnJid);

  if (cmd === 'delsrv') {
    const serverId = Number(String(text || '').trim());
    if (!serverId) return m.reply(`Format penggunaan: ${prefix}delsrv <ID Server>`);

    const db = loadPanelDB();
    const panel = db.find((p) => String(p.serverId) === String(serverId));

    if (panel && !isCreator && panel.reseller !== who) {
      return m.reply('Maaf, Anda tidak memiliki akses untuk menghapus server ini.');
    }

    if (!panel && !isCreator) {
      return m.reply('Maaf, server ini tidak tercatat atas nama Anda.');
    }

    await m.reply('Sedang memproses penghapusan server...');

    if (await checkServerExists(serverId)) {
      if (!(await deleteServer(serverId))) {
        return m.reply('Penghapusan server gagal. Silakan periksa kembali konfigurasi API atau hak akses.');
      }
    }

    savePanelDB(loadPanelDB().filter((p) => String(p.serverId) !== String(serverId)));
    clearNotifState(serverId);
    return m.reply(`Server dengan ID ${serverId} beserta datanya berhasil dihapus.`);
  }

  if (!text) {
    return m.reply(`Format penggunaan:\n${prefix}deluser 628xxxx\natau\n${prefix}deluser username`);
  }

  const key = String(text).trim().toLowerCase();
  const usersDB = loadUsersDB();
  const panelsDB = loadPanelDB();

  const userEntry = /^\d+$/.test(key)
    ? usersDB.find((u) => String(u.phone) === String(normalizePhone(key)))
    : usersDB.find((u) => String(u.username || '').toLowerCase() === key);

  if (!userEntry) return m.reply('Data pengguna tidak ditemukan.');

  const ownerPhone = String(userEntry.phone);
  const userServers = panelsDB.filter((p) => String(p.owner || '') === ownerPhone);

  const toDelete = isCreator ? userServers : userServers.filter((p) => p.reseller === who);
  if (!isCreator && toDelete.length === 0) {
    return m.reply('Maaf, Anda tidak memiliki wewenang atas pengguna ini.');
  }

  await m.reply(`Sedang memproses penghapusan ${toDelete.length} server milik pengguna...`);

  const deletedIds = new Set();
  let delFail = 0;
  for (const s of toDelete) {
    const gone = !(await checkServerExists(s.serverId)) || (await deleteServer(s.serverId));
    if (gone) {
      deletedIds.add(String(s.serverId));
      clearNotifState(s.serverId);
    } else {
      delFail++;
    }
  }

  savePanelDB(loadPanelDB().filter((p) => !deletedIds.has(String(p.serverId))));

  const sisa = userServers.length - deletedIds.size;
  let statusAkun;
  if (sisa > 0) {
    statusAkun = `Tidak dihapus (masih ada ${sisa} server tersisa)`;
  } else {
    const r = await apiDELETE(`/users/${userEntry.userId}`);
    const okUser = r.ok || r.status === 404;
    if (okUser) saveUsersDB(loadUsersDB().filter((u) => String(u.phone) !== ownerPhone));
    statusAkun = okUser ? 'Berhasil' : 'Gagal';
  }

  return m.reply(
    `Proses selesai.\n` +
    `Pengguna: ${userEntry.username} (${ownerPhone})\n` +
    `Server terhapus: ${deletedIds.size}\n` +
    `Server gagal dihapus: ${delFail}\n` +
    `Status penghapusan akun: ${statusAkun}`
  );
};

handler.command = ['delsrv', 'deluser'];
handler.tags = ['cpanel'];
handler.help = ['delsrv <id server>', 'deluser <628xxx/username>'];
handler.premium = true;

export default handler;
