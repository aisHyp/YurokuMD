/*
 * ─────────────────────────────────────────────────────────
 *   ⚡ LORD SAURUS EMPIRE ⚡
 * ─────────────────────────────────────────────────────────
 *   Website   → https://saurusdev.cloud
 *   YouTube   → https://www.youtube.com/@sauruskinggwuw
 *   Saluran   → https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *   Telegram  → @lordsaurus
 *
 *   ⚠ Dilarang menghapus credit ini.
 * ─────────────────────── © 2026 Lunar Saurus ───────────────
 */

let handler = async (m, { guard, russyuroku, args, reply }) => {
  const tolak = guard(m, { group: true, admin: true, botAdmin: true });
  if (tolak) return reply(tolak);

  let user =
    m.quoted?.sender ||
    m.mentionedJid?.[0] ||
    (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!user) return reply('Tag atau reply pesan user yang mau dijadikan admin.');

  await russyuroku.groupParticipantsUpdate(m.chat, [user], 'promote');
  return reply(`✅ Berhasil menaikkan @${user.split('@')[0]} menjadi admin grup.`, { mentions: [user] });
};

handler.command = ['promote'];
handler.tags = ['group'];
handler.help = ['promote'];
export default handler;