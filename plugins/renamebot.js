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
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const settingsPath = path.join(__dirname, '..', 'settings.js');

// mapping: alias yang diketik user -> nama variabel global asli di settings.js
const validSettings = {
  'owner': 'ownernumber',
  'ownernumber': 'ownernumber',
  'namaowner': 'ownername',
  'ownername': 'ownername',
  'botname': 'namabot',
  'namabot': 'namabot',
  'nomorbot': 'nomorbot',
  'pair': 'pair',
  'version': 'version',
  'packname': 'packname',
  'linksaluran': 'linkSaluran',
  'idsaluran': 'idSaluran',
  'namasaluran': 'nameSaluran',
  'ytchannel': 'ytChannel',
  'telegram': 'telegram',
  'web': 'web',
  'foother': 'foother',
  'namakontak': 'namakontak',
};

let handler = async (m, { isCreator, text, reply, prefix }) => {
  if (!isCreator) return reply(global.mess?.creator || global.mess?.owner || 'Fitur khusus owner!');

  const args = (text || '').trim().split(' ');
  const settingName = args[0];
  const newValue = args.slice(1).join(' ').trim();

  if (!settingName || !newValue) {
    return reply(
`╭─✦ 𝗥𝗲𝗻𝗮𝗺𝗲 𝗕𝗼𝘁 - 𝗗𝗮𝗳𝘁𝗮𝗿 𝗦𝗲𝘁𝘁𝗶𝗻𝗴
│⟡ 1. owner - Nomor WhatsApp owner
│⟡ 2. namaowner - Nama owner
│⟡ 3. packname - Packname sticker
│⟡ 4. botname - Nama bot
│⟡ 5. nomorbot - Nomor bot
│⟡ 6. pair - Kode pairing custom
│⟡ 7. linksaluran - Link channel
│⟡ 8. idsaluran - ID channel
│⟡ 9. namasaluran - Nama channel
│⟡ 10. ytchannel - Link YouTube
│⟡ 11. telegram - Username Telegram
│⟡ 12. web - Link website
│⟡ 13. foother - Footer bot
│⟡ 14. namakontak - Nama simpan kontak
╰──────────✦

📌 *Contoh:*
${prefix}renamebot botname Yuroku MD
${prefix}renamebot owner 628123456789

💡 *Tips:*
> Gunakan .idch untuk cek id saluran
> Pastikan format penulisan benar~`
    );
  }

  const normalizedSetting = settingName.toLowerCase();
  const actualSettingName = validSettings[normalizedSetting];

  if (!actualSettingName) {
    return reply(
`╭─✦ 𝗥𝗲𝗻𝗮𝗺𝗲 𝗕𝗼𝘁 - 𝗚𝗔𝗚𝗔𝗟
│⟡ Alasan : Setting tidak valid
│⟡ Input : ${settingName}
│⟡ List : Ketik *${global.prefix?.[0] || '.'}renamebot* tanpa parameter untuk lihat daftar
╰──────────✦

💡 *Tips:*
> Gunakan nama setting yang ada di daftar
> Contoh: botname, owner, packname~`
    );
  }

  try {
    if (!fs.existsSync(settingsPath)) {
      return reply(
`╭─✦ 𝗥𝗲𝗻𝗮𝗺𝗲 𝗕𝗼𝘁 - 𝗚𝗔𝗚𝗔𝗟
│⟡ Alasan : File settings.js tidak ditemukan
╰──────────✦

💡 *Tips:*
> Pastikan file settings.js ada di root
> Cek kembali struktur folder bot~`
      );
    }

    let settingContent = fs.readFileSync(settingsPath, 'utf8');

    // dukung global.namavar = '...' dan global.namavar = "..." (quote tunggal/ganda)
    const regex = new RegExp(`global\\.${actualSettingName}\\s*=\\s*(['"])(?:(?!\\1).)*\\1`, 's');

    if (!regex.test(settingContent)) {
      return reply(
`╭─✦ 𝗥𝗲𝗻𝗮𝗺𝗲 𝗕𝗼𝘁 - 𝗚𝗔𝗚𝗔𝗟
│⟡ Alasan : Setting "${actualSettingName}" tidak ditemukan di settings.js
│⟡ File : settings.js
╰──────────✦

💡 *Tips:*
> Pastikan penulisan nama setting benar
> Cek isi file settings.js manual~`
      );
    }

    const safeValue = newValue.replace(/'/g, "\\'");
    const newContent = settingContent.replace(regex, `global.${actualSettingName} = '${safeValue}'`);
    fs.writeFileSync(settingsPath, newContent);

    // update runtime langsung tanpa perlu restart
    global[actualSettingName] = newValue;

    reply(
`╭─✦ 𝗥𝗲𝗻𝗮𝗺𝗲 𝗕𝗼𝘁 - 𝗕𝗘𝗥𝗛𝗔𝗦𝗜𝗟
│⟡ Setting : ${actualSettingName}
│⟡ Nilai Baru : "${newValue}"
╰──────────✦

💡 *Tips:*
> Perubahan langsung diterapkan di memori
> Restart bot disarankan agar 100% konsisten~`
    );
  } catch (error) {
    console.error('[RENAMEBOT ERROR]', error);
    reply(
`╭─✦ 𝗥𝗲𝗻𝗮𝗺𝗲 𝗕𝗼𝘁 - 𝗚𝗔𝗚𝗔𝗟
│⟡ Alasan : ${error.message}
╰──────────✦

💡 *Tips:*
> Terjadi kesalahan saat mengedit file
> Cek permission file settings.js~`
    );
  }
};

handler.command = ['renamebot'];
handler.tags = ['owner'];
handler.help = ['renamebot <setting> <nilai baru>'];
handler.owner = true;

export default handler;
