/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  ⚔️  Lunar Saurus Empire  ⚔️
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  🌍 Site     : https://saurusdev.cloud
 *  📺 YouTube  : https://www.youtube.com/@sauruskinggwuw
 *  📢 Channel  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *  💬 Telegram : @lordsaurus
 *
 *  ⚠️ Watermark ini wajib tetap ada.
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { isPremium } from '../lib/premium.js';
import { hdVideo } from '../lib/convert.js';

let handler = async (m, { russyuroku, example, prefix, command, isCreator, senderPnJid }) => {

  if (!isCreator && !isPremium(senderPnJid || m.sender)) return m.reply(global.mess.prem);

  let q = m.quoted;
  if (!q) return example('dengan reply media dokumen (foto/video)');

  const inner = q.message?.documentMessage;
  if (inner) q = { ...inner, mtype: 'documentMessage', msg: inner };

  const mime = (q.msg || q).mimetype || '';
  const isDoc = q.mtype === 'documentMessage';
  if (!isDoc) return m.reply('❌ Reply file yang dikirim dalam bentuk *Dokumen*!');
  if (!/^(image|video)\//.test(mime)) {
    return m.reply('❌ Dokumen yang direply bukan format foto atau video!');
  }

  await russyuroku.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
  m.reply(global.mess.wait);

  try {
    const buffer = await russyuroku.downloadMediaMessage(q);
    if (!buffer?.length) throw new Error('Gagal mengunduh dokumen');

    if (mime.startsWith('image/')) {
      await russyuroku.sendMessage(m.chat, {
        image: buffer,
        caption: '乂  *SW HD*\n\nSiap di-forward ke status WhatsApp!',
      }, { quoted: m });
    } else {
      const hasil = await hdVideo(buffer);
      await russyuroku.sendMessage(m.chat, {
        video: hasil,
        caption: '乂  *Proses di selesaikan*',
      }, { quoted: m });
    }

    await russyuroku.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error('[SWHD ERROR]', e);
    await russyuroku.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(global.mess.error);
  }
};

handler.command = ['swhd', 'storyhd'];
handler.tags = ['tools'];
handler.help = ['swhd <reply dokumen foto/video>'];
handler.premium = true;

export default handler;
