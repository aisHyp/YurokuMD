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

let handler = async (m, { guard, russyuroku, command, reply }) => {
  const tolak = guard(m, { group: true, admin: true, botAdmin: true });
  if (tolak) return reply(tolak);

  const buka = command === 'open' || command === 'bukagc';

  try {
    await russyuroku.groupSettingUpdate(m.chat, buka ? 'not_announcement' : 'announcement');
    return reply(buka
      ? '🔓 Grup dibuka. Semua anggota bisa mengirim pesan.'
      : '🔒 Grup dikunci. Hanya admin yang bisa mengirim pesan.');
  } catch (e) {
    return reply(`❌ Gagal mengubah pengaturan grup.\n${e.message || e}`);
  }
};

handler.command = ['open', 'close', 'bukagc', 'kuncigc'];
handler.tags = ['group'];
handler.help = ['open', 'close'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
