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
 *  .ytmp3 <link YouTube> — download audio MP3.
 *  Dipanggil otomatis lewat tombol "Audio" pada .play,
 *  atau bisa dipakai langsung.
 */

'use strict';

import { ytmp3 } from '../lib/scraper/youtubedl.js';

let handler = async (m, { russyuroku, text, prefix }) => {
  if (!text) {
    return m.reply(`Masukkan link YouTube-nya juga dong!\n\nContoh: ${prefix}ytmp3 https://youtu.be/...`);
  }

  try {
    await russyuroku.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const res = await ytmp3(text.trim());

    if (!res?.downloadUrl) {
      await russyuroku.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return m.reply('Gagal memproses, server sedang bermasalah. Coba lagi nanti ya!');
    }

    await m.reply(`🎵 *${res.title || 'Audio'}*`);

    await russyuroku.sendMessage(
      m.chat,
      { audio: { url: res.downloadUrl }, mimetype: 'audio/mpeg', ptt: false },
      { quoted: m }
    );

    await russyuroku.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error('[ytmp3] error:', err);
    await russyuroku.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`Gagal download audio, coba link lain atau coba lagi nanti.\n\n> ${err?.message || 'Unknown error'}`);
  }
};

handler.command = ['ytmp3'];
handler.tags = ['downloader'];
handler.help = ['ytmp3 <link youtube>'];

export default handler;
