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

let handler = async (m, { guard, russyuroku, reply, text }) => {
  const tolak = guard(m, { group: true, admin: true, botAdmin: true });
  if (tolak) return reply(tolak);

  let metadata = await russyuroku.groupMetadata(m.chat);
  let teks = `📢 *TagAll oleh Admin*\n\n${text ? text + "\n\n" : ""}`;
  let mentionAll = metadata.participants.map(a => a.id);
  mentionAll.forEach(u => (teks += `👤 @${u.split('@')[0]}\n`));

  await russyuroku.sendMessage(m.chat, { text: teks, mentions: mentionAll });
};

handler.command = ["tagall"];
handler.tags = ["group"];
handler.help = ["tagall"];
handler.group = true;

export default handler;