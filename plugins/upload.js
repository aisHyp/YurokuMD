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

import fs from 'fs';
import path from 'path';

let handler = async (m, { russyuroku, isCreator, text, prefix, command, reply }) => {
  if (!isCreator) return reply(global.mess?.creator || global.mess?.owner || 'Fitur khusus owner!');

  let q = m.quoted;
  if (!q) return reply('📌 reply file yang mau di upload terus ketik foldernya');
  if (!text) return reply(`📌 contoh nya: *${prefix + command} library/database*\nketik ${prefix + command} *.* atau *root* buat upload ke folder utama`);

  try {
    const inner = q.message?.documentMessage;
    if (inner) q = { ...inner, mtype: 'documentMessage', msg: inner };

    const mime = (q.msg || q).mimetype || '';
    let ext = '.bin';

    if (/^image\//.test(mime)) {
      ext = '.jpg';
    } else if (/^video\//.test(mime)) {
      ext = '.mp4';
    } else if (/^audio\//.test(mime)) {
      ext = '.mp3';
    } else if (q.mtype !== 'documentMessage' && !mime) {
      return reply('❌ yang kamu reply harus type dokumen, gambar, audio, video');
    }

    const [inputFolder, inputName] = text.split(' ');
    const folderTarget = (inputFolder || '.').trim();

    if (inputName) {
      if (/^image\//.test(mime) && !/\.(jpg|jpeg|png)$/i.test(inputName)) {
        return reply('media ini jenis gambar, format harus .jpg/.jpeg/.png');
      }
      if (/^video\//.test(mime) && !/\.mp4$/i.test(inputName)) {
        return reply('media ini jenis video, format harus .mp4');
      }
      if (/^audio\//.test(mime) && !/\.(mp3|opus)$/i.test(inputName)) {
        return reply('media ini jenis audio, format harus .mp3/.opus');
      }
    }

    const fileName = inputName || (q.msg?.fileName || q.fileName || `upload_${Date.now()}${ext}`);
    const targetDir = (folderTarget === '.' || folderTarget === 'root')
      ? process.cwd()
      : path.join(process.cwd(), folderTarget);
    const fullPath = path.join(targetDir, fileName);

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    await russyuroku.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const buffer = await russyuroku.downloadMediaMessage(q);
    if (!buffer?.length) throw new Error('Gagal mengunduh media');

    fs.writeFileSync(fullPath, buffer);

    await russyuroku.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    reply(`🚀 *Media Berhasil Di Upload*\n\n📁 *Folder:* ${folderTarget === '.' || folderTarget === 'root' ? 'Root (Utama)' : folderTarget}\n📄 *Nama:* ${fileName}\n📍 *Full Path:* ${fullPath}`);
  } catch (err) {
    console.error('[UPLOAD ERROR]', err);
    reply(`❌ gagal upload: ${err.message}`);
  }
};

handler.command = ['upload', 'uploadfile', 'upfile'];
handler.tags = ['owner'];
handler.help = ['upload <folder> [namafile] (reply media)'];
handler.owner = true;

export default handler;
