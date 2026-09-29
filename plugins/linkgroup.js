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

  try {
    const code = await russyuroku.groupInviteCode(m.chat);
    return reply(`🔗 *Link Grup*\nhttps://chat.whatsapp.com/${code}`);
  } catch (e) {
    return reply(`❌ Gagal mengambil link grup.\n${e.message || e}`);
  }
};

handler.command = ['linkgroup', 'linkgc', 'getlink'];
handler.tags = ['group'];
handler.help = ['linkgroup'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
