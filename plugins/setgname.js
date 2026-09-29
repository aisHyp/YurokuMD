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

  if (!text) return reply('Masukkan nama grup baru.\nContoh: *setgname Nama Grup Kece*');
  if (text.length > 25) return reply('❌ Nama grup maksimal 25 karakter (batasan WhatsApp).');

  try {
    await russyuroku.groupUpdateSubject(m.chat, text.trim());
    return reply(`✅ Nama grup berhasil diubah menjadi:\n*${text.trim()}*`);
  } catch (e) {
    return reply(`❌ Gagal mengubah nama grup.\n${e.message || e}`);
  }
};

handler.command = ['setgname', 'setnamagc', 'setsubject'];
handler.tags = ['group'];
handler.help = ['setgname <nama baru>'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
