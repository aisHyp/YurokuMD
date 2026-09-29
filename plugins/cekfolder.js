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
  if (!text) return reply(`📌 ketik nama folder yang mau dicek bang\ncontoh: *${prefix + command} library/database*\nketik *.* atau *root* buat cek folder utama`);

  try {
    const folderTarget = text.trim();
    const targetDir = (folderTarget === '.' || folderTarget === 'root')
      ? process.cwd()
      : path.join(process.cwd(), folderTarget);

    if (!fs.existsSync(targetDir)) return reply(`❌ folder *${folderTarget}* gak ketemu bang, coba cek lagi tulisannya`);

    const stats = fs.statSync(targetDir);
    if (!stats.isDirectory()) return reply(`❌ itu bukan folder bang, tapi file pake command ${prefix}getfile aja kalo mau ambil file nya`);

    await russyuroku.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const files = fs.readdirSync(targetDir);
    if (files.length === 0) return reply(`📂 folder *${folderTarget}* kosong bang, gak ada isinya sama sekali, coba cek folder lain`);

    let teksList = `🚀 *CEK FOLDER BERHASIL*\n\n`;
    teksList += `📁 *folder:* ${folderTarget === '.' || folderTarget === 'root' ? 'Root (Utama)' : folderTarget}\n`;
    teksList += `📊 *total:* ${files.length} item\n\n`;

    files.forEach((file, i) => {
      const fStat = fs.statSync(path.join(targetDir, file));
      const icon = fStat.isDirectory() ? '📁' : '📄';
      teksList += `${i + 1}. ${icon} \`${file}\`\n`;
    });

    teksList += `\n📍 *path:* ${targetDir}`;

    await russyuroku.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    reply(teksList);
  } catch (err) {
    console.error('[CEKFOLDER ERROR]', err);
    reply(`❌ gagal cek folder: ${err.message}`);
  }
};

handler.command = ['cekfolder', 'cd', 'foldercek'];
handler.tags = ['owner'];
handler.help = ['cekfolder <folder>'];
handler.owner = true;

export default handler;
