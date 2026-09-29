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
 *
 *  .add 6281234567890   → undang nomor itu masuk ke grup
 *  .add 628xxx, 628yyy  → bisa banyak nomor sekaligus, pisah koma/spasi
 */

let handler = async (m, { guard, russyuroku, text, reply }) => {
  const tolak = guard(m, { group: true, admin: true, botAdmin: true });
  if (tolak) return reply(tolak);
  if (!text) return reply('Masukkan nomor yang mau ditambahkan.\nContoh: *.add 6281234567890*');

  const nomorList = text
    .split(/[,\s]+/)
    .map((n) => n.replace(/[^0-9]/g, ''))
    .filter((n) => n.length >= 8);

  if (!nomorList.length) return reply('Nomor tidak valid. Pastikan format nomor internasional (mis. 6281234567890), tanpa + atau spasi berlebih.');

  const hasil = [];
  for (const nomor of nomorList) {
    const jid = nomor + '@s.whatsapp.net';
    try {
      const res = await russyuroku.groupParticipantsUpdate(m.chat, [jid], 'add');
      const status = res?.[0]?.status;
      if (status === '200' || status === 200) {
        hasil.push(`✅ ${nomor} — berhasil ditambahkan`);
      } else if (status === '403') {

        try {
          const code = await russyuroku.groupInviteCode(m.chat);
          await russyuroku.sendMessage(jid, {
            text: `Kamu diundang gabung ke grup ini:\nhttps://chat.whatsapp.com/${code}`,
          });
          hasil.push(`⚠️ ${nomor} — privasi menolak add langsung, link invite dikirim ke DM`);
        } catch (e) {
          hasil.push(`❌ ${nomor} — gagal add (privasi) & gagal kirim link invite`);
        }
      } else if (status === '408') {
        hasil.push(`❌ ${nomor} — nomor tidak terdaftar di WhatsApp`);
      } else if (status === '401') {
        hasil.push(`❌ ${nomor} — nomor ini memblokir bot`);
      } else if (status === '409') {
        hasil.push(`⚠️ ${nomor} — sudah ada di grup`);
      } else {
        hasil.push(`❌ ${nomor} — gagal (status: ${status ?? 'tidak diketahui'})`);
      }
    } catch (e) {
      hasil.push(`❌ ${nomor} — error: ${e.message}`);
    }
  }

  return reply(`*Hasil Penambahan Anggota:*\n\n${hasil.join('\n')}`);
};

handler.command = ['add', 'addmember', 'invite'];
handler.tags = ['group'];
handler.help = ['add'];
export default handler;
