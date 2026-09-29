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
  const tolak = guard(m, { group: true });
  if (tolak) return reply(tolak);

  try {
    const meta = await russyuroku.groupMetadata(m.chat);
    const admins = meta.participants.filter(p => p.admin).length;
    const created = meta.creation ? new Date(meta.creation * 1000).toLocaleString('id-ID') : '-';

    const teks = `*📋 INFO GRUP*

*Nama:* ${meta.subject}
*ID:* ${meta.id}
*Dibuat:* ${created}
*Total Member:* ${meta.participants.length}
*Total Admin:* ${admins}
*Deskripsi:*
${meta.desc || '-'}`;

    return reply(teks);
  } catch (e) {
    return reply(`❌ Gagal mengambil info grup.\n${e.message || e}`);
  }
};

handler.command = ['groupinfo', 'infogc', 'gcinfo'];
handler.tags = ['group'];
handler.help = ['groupinfo'];
handler.group = true;

export default handler;
