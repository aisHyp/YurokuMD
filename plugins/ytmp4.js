/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  ⚔️  Lunar Saurus Empire  ⚔️
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  🌍 Site     : https://saurusdev.cloud
 *  📺 YouTube  : https://www.youtube.com/@sauruskinggwuw
 *  📢 Channel  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *  💬 Telegram : @lordsaurus
 *
 *  ⚠️ Watermark ini wajib tetap ada.
 *━━━━━━━━━━━━━━━━━━━ © 2026 Lunar Saurus ━━━━━━━━━━━━━━━━━━
 *
 *  .ytmp4 <resolusi> <link YouTube> — download video MP4.
 *  Dipanggil otomatis lewat tombol resolusi pada .play,
 *  atau bisa dipakai langsung: .ytmp4 720 https://youtu.be/...
 */

'use strict';

import { ytmp4 } from '../lib/scraper/youtubedl.js';

let handler = async (m, { russyuroku, text, args, prefix }) => {
  if (!text) {
    return m.reply(`Masukkan resolusi dan link YouTube-nya!\n\nContoh: ${prefix}ytmp4 720 https://youtu.be/...`);
  }

  const isQuality = /^\d+$/.test(args[0]);
  const quality = isQuality ? args[0] : '720';
  const url = isQuality ? args[1] : args[0];

  if (!url) {
    return m.reply('Link YouTube-nya mana? Jangan lupa disertakan ya!');
  }

  try {
    await russyuroku.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const res = await ytmp4(url.trim(), quality);

    if (!res?.downloadUrl) {
      await russyuroku.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return m.reply('Gagal memproses, server sedang bermasalah. Coba lagi nanti ya!');
    }

    await russyuroku.sendMessage(
      m.chat,
      {
        video: { url: res.downloadUrl },
        caption: `🎬 *${res.title || 'Video'}*\n📺 Resolusi: ${quality}p`,
        mimetype: 'video/mp4',
      },
      { quoted: m }
    );

    await russyuroku.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error('[ytmp4] error:', err);
    await russyuroku.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`Gagal download video, coba resolusi lain atau coba lagi nanti.\n\n> ${err?.message || 'Unknown error'}`);
  }
};

handler.command = ['ytmp4'];
handler.tags = ['downloader'];
handler.help = ['ytmp4 <resolusi> <link youtube>'];

export default handler;
