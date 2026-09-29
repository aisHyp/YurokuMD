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
 *  .play — Search YouTube (yt-search) lalu tampilkan tombol
 *  pilihan Audio / Video (resolusi 144p-1080p). Saat dipilih,
 *  akan menjalankan .ytmp3 / .ytmp4 di bawah.
 *  (Untuk player lirik + HTML rich, pakai .play2)
 */

'use strict';

import yts from 'yt-search';
import {
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
} from 'luoxy-baileys';

let handler = async (m, { russyuroku, text, prefix }) => {
  if (!text) {
    return m.reply(`Mau dengerin lagu apa? Ketik judul atau link YouTube-nya ya!\n\nContoh: ${prefix}play Silhouette KANA-BOON`);
  }

  try {
    await russyuroku.sendMessage(m.chat, { react: { text: '🎧', key: m.key } });

    const search = await yts(text);
    const vid = search?.videos?.[0];

    if (!vid) {
      return m.reply('Lagunya tidak ketemu, coba cek lagi judulnya ya!');
    }

    const body =
      `🎵 *Pencarian Video & Audio*\n\n` +
      `📌 *Judul:* ${vid.title}\n` +
      `⏱️ *Durasi:* ${vid.timestamp}\n` +
      `👁️ *Views:* ${vid.views.toLocaleString('id-ID')}\n` +
      `📺 *Channel:* ${vid.author.name}\n\n` +
      `Pilih mau langsung Audio, atau pilih resolusi Video di bawah 👇`;

    const rows = [
      { header: 'Hemat', title: '144p', description: 'Resolusi rendah, ukuran kecil', id: `${prefix}ytmp4 144 ${vid.url}` },
      { header: 'Standar', title: '240p', description: 'Resolusi standar', id: `${prefix}ytmp4 240 ${vid.url}` },
      { header: 'Bening', title: '360p', description: 'Resolusi cukup jernih', id: `${prefix}ytmp4 360 ${vid.url}` },
      { header: 'Jernih', title: '480p', description: 'Resolusi jernih', id: `${prefix}ytmp4 480 ${vid.url}` },
      { header: 'HD', title: '720p', description: 'Resolusi HD', id: `${prefix}ytmp4 720 ${vid.url}` },
      { header: 'FULL HD', title: '1080p', description: 'Resolusi Full HD', id: `${prefix}ytmp4 1080 ${vid.url}` },
    ];

    const media = await prepareWAMessageMedia({ image: { url: vid.thumbnail } }, { upload: russyuroku.waUploadToServer });

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({ text: body }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: global.namabot || 'YurokuMD' }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: '🎧 Downloader Menu',
                hasMediaAttachment: true,
                ...media,
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                      title: '🎥 Video',
                      sections: [{ title: 'Daftar Resolusi', rows }],
                    }),
                  },
                  {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                      display_text: '🎵 Audio',
                      id: `${prefix}ytmp3 ${vid.url}`,
                    }),
                  },
                ],
              }),
              contextInfo: { stanzaId: m.key.id, participant: m.sender },
            }),
          },
        },
      },
      { userJid: m.sender, quoted: m }
    );

    await russyuroku.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch (err) {
    console.error('[play] error:', err);
    await russyuroku.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`Gagal memproses, coba lagi ya!\n\n> ${err?.message || 'Unknown error'}`);
  }
};

handler.command = ['play'];
handler.tags = ['downloader'];
handler.help = ['play <judul lagu / link youtube>'];

export default handler;
