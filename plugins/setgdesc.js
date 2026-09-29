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

let handler = async (m, { guard, russyuroku, text, reply }) => {
  const tolak = guard(m, { group: true, admin: true, botAdmin: true });
  if (tolak) return reply(tolak);

  const desc = text || m.quoted?.text || m.quoted?.caption;
  if (!desc) return reply('Masukkan deskripsi grup baru, atau reply pesan yang isinya deskripsi.\nContoh: *setgdesc Selamat datang di grup!*');

  try {
    await russyuroku.groupUpdateDescription(m.chat, desc.trim());
    return reply('✅ Deskripsi grup berhasil diubah.');
  } catch (e) {
    return reply(`❌ Gagal mengubah deskripsi grup.\n${e.message || e}`);
  }
};

handler.command = ['setgdesc', 'setdeskripsi'];
handler.tags = ['group'];
handler.help = ['setgdesc <deskripsi baru>'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
