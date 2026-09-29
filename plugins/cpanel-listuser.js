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
  ensureDB, loadUsersDB, loadPanelDB, normalizePhone, apiGetAll, guardPanel, panelActor,
} from '../lib/cpanelHelper.js';

let handler = async (m, { isCreator, senderPnJid }) => {
  const tolak = guardPanel(m, { isCreator, senderPnJid });
  if (tolak) return m.reply(tolak);

  ensureDB();
  const who = panelActor(m, senderPnJid);

  try {
    await m.reply('Sedang menghimpun data pengguna dan server...');

    const srv = await apiGetAll('/servers');
    if (!srv.ok) return m.reply('Terjadi kendala saat mengambil data server.');
    const usr = await apiGetAll('/users');
    if (!usr.ok) return m.reply('Terjadi kendala saat mengambil data pengguna.');

    const usersDB = loadUsersDB();
    const panelDB = loadPanelDB();

    const countByUserId = {};
    for (const s of srv.items) {
      const uid = s?.attributes?.user;
      if (uid) countByUserId[uid] = (countByUserId[uid] || 0) + 1;
    }

    const allowed = new Set();
    if (!isCreator) {
      for (const p of panelDB) {
        if (String(p.reseller || '') !== String(who)) continue;
        const u = usersDB.find((x) => String(x.phone) === String(normalizePhone(p.owner || '')));
        if (u?.userId) allowed.add(u.userId);
      }
    }

    const admins = [];
    const normals = [];
    for (const u of usr.items) {
      const a = u.attributes || {};
      if (!isCreator && !allowed.has(a.id)) continue;
      if (a.root_admin || a.id === 1) admins.push(u); else normals.push(u);
    }
    normals.sort((A, B) => (countByUserId[B.attributes?.id] || 0) - (countByUserId[A.attributes?.id] || 0));

    let out = '╭─⬣「 DAFTAR PENGGUNA 」⬣\n│\n';

    if (isCreator && admins.length) {
      out += '├─ 👑 ADMIN PANEL\n';
      admins.forEach((u, i) => {
        const a = u.attributes || {};
        out += `│  ${i + 1}. ${a.username || '-'}\n│     ✉️ ${a.email || '-'}\n│     🖥️ Jumlah Server: ${countByUserId[a.id] || 0}\n`;
      });
      out += '│\n';
    }

    out += '├─ 👥 PENGGUNA LAYANAN\n';
    if (!normals.length) {
      out += '│  (Tidak ada data)\n';
    } else {
      normals.forEach((u, i) => {
        const a = u.attributes || {};
        const local = usersDB.find((x) => String(x.userId) === String(a.id));
        out += `│  ${i + 1}. ${a.username || '-'} (${local?.phone ? '@' + local.phone : '-'})\n`;
        out += `│     ✉️ ${a.email || '-'}\n│     🖥️ Jumlah Server: ${countByUserId[a.id] || 0}\n`;
      });
    }

    out += '│\n╰─⬣';
    return m.reply(out);
  } catch (e) {
    console.error('ListUser Error:', e);
    return m.reply('Pengambilan daftar pengguna gagal diproses.');
  }
};

handler.command = ['listuser'];
handler.tags = ['cpanel'];
handler.help = ['listuser'];
handler.premium = true;

export default handler;
