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

let handler = async (m, { guard, russyuroku, reply }) => {
  const tolak = guard(m, { group: true, admin: true, botAdmin: true });
  if (tolak) return reply(tolak);

  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';

  if (!mime.startsWith('image')) {
    return reply('Kirim/reply gambar dengan caption *setppgc*, atau reply gambar lalu ketik *setppgc*.');
  }

  try {
    const buffer = await russyuroku.downloadMediaMessage(q);
    await russyuroku.updateProfilePicture(m.chat, buffer);
    return reply('✅ Berhasil mengganti foto profil grup.');
  } catch (e) {
    return reply(`❌ Gagal mengganti foto profil grup.\n${e.message || e}`);
  }
};

handler.command = ['setppgc', 'setppgroup', 'ppgc'];
handler.tags = ['group'];
handler.help = ['setppgc'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
