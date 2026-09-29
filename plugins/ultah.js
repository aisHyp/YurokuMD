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
 *  .setultah DD/MM      daftarkan tanggal ulang tahunmu
 *  .cekultah [@user]     lihat hitung mundur ulang tahun (diri sendiri kalau kosong)
 *  .listultah             daftar ulang tahun semua member terdaftar di grup, urut terdekat
 *  .delultah               hapus data ulang tahunmu sendiri
 *  .testultah              (owner) kirim contoh ucapan ultah ke chat ini
 */
import { loadUltahDB, saveUltahDB, parseDDMM, getDaysUntil, getRandomBirthdayMessage } from '../lib/ultah.js';

let handler = async (m, { guard, command, text, prefix, isCreator, reply }) => {
  const cmd = command.toLowerCase();

  if (cmd === 'setultah') {
    const tolak = guard(m, { group: true });
    if (tolak) return reply(tolak);

    if (!text) return reply(`Format: *${prefix}setultah DD/MM*\nContoh: *${prefix}setultah 25/12*`);
    const formatted = parseDDMM(text);
    if (!formatted) return reply('❌ Format/tanggal tidak valid. Gunakan DD/MM (contoh: 01/05).');

    const db = loadUltahDB();
    if (!db[m.chat]) db[m.chat] = {};
    db[m.chat][m.sender] = formatted;
    saveUltahDB(db);

    return reply(`✅ Berhasil! Tanggal ulang tahunmu (${formatted}) telah disimpan.`);
  }

  if (cmd === 'cekultah' || cmd === 'ultah') {
    const tolak = guard(m, { group: true });
    if (tolak) return reply(tolak);

    const target = m.mentionedJid?.[0] || m.sender;
    const isSelf = target === m.sender;
    const db = loadUltahDB();
    const date = db[m.chat]?.[target];

    if (!date) {
      return reply(
        `❌ ${isSelf ? 'Kamu belum' : 'User belum'} mendaftarkan ulang tahun.${isSelf ? `\nGunakan: *${prefix}setultah DD/MM*` : ''}`,
        [target]
      );
    }

    const days = getDaysUntil(date);
    const name = target.split('@')[0];

    if (days === 0) {
      return reply(`🎂 Wih @${name} hari ini ulang tahun! 🎉\n\nSemoga panjang umur, sehat selalu, dan sukses terus! 🎊`, [target]);
    }
    return reply(`📅 Ulang tahun @${name}: ${date}\n⏳ ${days} hari lagi! 🎂`, [target]);
  }

  if (cmd === 'listultah') {
    const tolak = guard(m, { group: true });
    if (tolak) return reply(tolak);

    const db = loadUltahDB();
    const entries = Object.entries(db[m.chat] || {});
    if (entries.length === 0) return reply('❌ Belum ada yang mendaftarkan ulang tahun di grup ini.');

    const list = entries
      .map(([jid, date]) => ({ jid, date, days: getDaysUntil(date) }))
      .sort((a, b) => a.days - b.days);

    let message = '📅 *DAFTAR ULANG TAHUN*\n\n';
    list.forEach((d, i) => {
      const name = d.jid.split('@')[0];
      message += d.days === 0
        ? `${i + 1}. @${name} - ${d.date} 🎂 HARI INI!\n`
        : `${i + 1}. @${name} - ${d.date} (${d.days} hari lagi)\n`;
    });

    return reply(message, list.map((d) => d.jid));
  }

  if (cmd === 'delultah') {
    const tolak = guard(m, { group: true });
    if (tolak) return reply(tolak);

    const db = loadUltahDB();
    if (!db[m.chat]?.[m.sender]) return reply('❌ Kamu belum mendaftarkan ulang tahun.');

    delete db[m.chat][m.sender];
    saveUltahDB(db);
    return reply('✅ Data ulang tahunmu berhasil dihapus.');
  }

  if (cmd === 'testultah') {
    if (!isCreator) return reply(global.mess?.creator || global.mess?.owner || 'Fitur khusus owner!');
    const name = m.sender.split('@')[0];
    return reply(`🧪 *TEST ULTAH*\n\n${getRandomBirthdayMessage(name)}`, [m.sender]);
  }
};

handler.command = ['setultah', 'cekultah', 'ultah', 'listultah', 'delultah', 'testultah'];
handler.tags = ['group'];
handler.help = ['setultah <DD/MM>', 'cekultah [@user]', 'listultah', 'delultah', 'testultah'];

export default handler;
