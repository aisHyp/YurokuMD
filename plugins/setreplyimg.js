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

import sharp from 'sharp';

let handler = async (m, { russyuroku, reply }) => {
  let q = m.quoted;
  if (!q) return reply('❌ Reply gambar (foto atau dikirim sebagai dokumen) dengan caption *setreplyimg*.');

  // dukung image biasa maupun image yang dikirim sebagai documentMessage
  const inner = q.message?.documentMessage;
  if (inner) q = { ...inner, mtype: 'documentMessage', msg: inner };

  const mime = (q.msg || q).mimetype || '';
  if (!mime.startsWith('image/')) {
    return reply('❌ Media yang direply bukan gambar. Reply foto/gambar dokumen ya.');
  }

  await russyuroku.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  try {
    const buffer = await russyuroku.downloadMediaMessage(q);
    if (!buffer?.length) throw new Error('Gagal mengunduh gambar');

    const resized = await sharp(buffer)
      .resize(300, 300, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90 })
      .toBuffer();

    await russyuroku.sendMessage(m.chat, {
      document: resized,
      mimetype: 'image/jpeg',
      fileName: 'image_300x300.jpg',
      caption: '✅ Gambar berhasil diubah ke JPG 300x300 dan dikirim sebagai dokumen.',
    }, { quoted: m });

    await russyuroku.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error('[SETREPLYIMG ERROR]', e);
    await russyuroku.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    reply(`❌ Gagal memproses gambar.\n${e.message || e}`);
  }
};

handler.command = ['setreplyimg', 'imgdokumen', 'tojpg300'];
handler.tags = ['tools'];
handler.help = ['setreplyimg <reply gambar>'];

export default handler;
