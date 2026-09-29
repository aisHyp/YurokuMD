/*╔═══════════════════════════════════════════════════════╗
 *║  🦖  LORD SAURUS EMPIRE
 *╟───────────────────────────────────────────────────────╢
 *║  🌐 Web      : https://saurusdev.cloud
 *║  ▶︎ YouTube  : https://www.youtube.com/@sauruskinggwuw
 *║  📡 Saluran  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *║  ✈︎ Telegram : @lordsaurus
 *║
 *║  ⚠︎ Jangan hapus watermark ini ya!
 *╚═══════════════════ © 2026 Lunar Saurus ═════════════════╝
 */

let handler = async (m, { guard, russyuroku, args, reply }) => {
  const tolak = guard(m, { group: true, admin: true, botAdmin: true });
  if (tolak) return reply(tolak);

  let user =
    m.quoted?.sender ||
    m.mentionedJid?.[0] ||
    (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!user) return reply('Tag atau reply pesan user yang mau dikeluarkan.');
  if (user === m.sender) return reply('😅 Ngapain kick diri sendiri ngab.');

  await russyuroku.groupParticipantsUpdate(m.chat, [user], 'remove');
  return reply(`Berhasil mengeluarkan @${user.split('@')[0]} dari grup.`, { mentions: [user] });
};

handler.command = ['kick'];
handler.tags = ['group'];
handler.help = ['kick'];
export default handler;