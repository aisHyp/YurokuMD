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

let handler = async (m, { guard, russyuroku, text, participants }) => {
  const tolak = guard(m, { group: true, admin: true, botAdmin: true });
  if (tolak) return m.reply(tolak);

  let message =
    text ||
    m.quoted?.text ||
    m.quoted?.caption;

  if (!message) return m.reply('Kirim teks atau reply pesan untuk dihidetag.');

  if (!participants || !participants.length) {
    const meta = await russyuroku.groupMetadata(m.chat);
    participants = meta.participants;
  }

  let member = participants.map(u => u.id);

  await russyuroku.sendMessage(m.chat, {
    text: message,
    mentions: member
  });
};

handler.command = ['hidetag', 'ht'];
handler.tags = ['group'];
handler.help = ['hidetag'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;