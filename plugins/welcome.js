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
 *  Command pengaturan Welcome & Left (logic-nya di lib/welcome.js):
 *    .welcome on|off        nyalakan/matikan sambutan anggota baru
 *    .left on|off           nyalakan/matikan pesan anggota keluar
 *    .setwelcome <teks>     atur teks sambutan
 *    .setleft <teks>        atur teks pamit
 *    .resetwelcome          balikin teks sambutan ke bawaan
 *    .resetleft             balikin teks pamit ke bawaan
 *    .cekwelcome            lihat status & teks saat ini
 *
 *  Placeholder: @user (tag anggota), @group (nama grup), @count (jumlah member)
 */
import {
  getWelcomeConfig,
  setWelcomeConfig,
  renderText,
  DEFAULT_WELCOME,
  DEFAULT_LEFT,
  createWelcomeCard,
  createLeftCard,
} from '../lib/welcome.js';

const PLACEHOLDER_INFO =
  '*Placeholder:*\n• @user  → tag anggota\n• @group → nama grup\n• @count → jumlah member';

let handler = async (m, { guard, russyuroku, command, text, args, prefix, reply }) => {
  const tolak = guard(m, { group: true, admin: true });
  if (tolak) return reply(tolak);

  const cmd = command.toLowerCase();

  if (cmd === 'welcome' || cmd === 'left') {
    const field = cmd;
    const label = field === 'welcome' ? 'Welcome' : 'Left';
    const arg = (args[0] || '').toLowerCase();
    const current = getWelcomeConfig(m.chat)[field];

    if (arg !== 'on' && arg !== 'off') {
      return reply(
        `*${label}* saat ini: ${current ? '✅ AKTIF' : '❌ NONAKTIF'}\n\n` +
          `Contoh:\n• *${prefix}${cmd} on*\n• *${prefix}${cmd} off*`
      );
    }

    const next = arg === 'on';
    if (next === current) {
      return reply(`${label} sudah ${next ? 'aktif' : 'nonaktif'} di grup ini.`);
    }
    setWelcomeConfig(m.chat, { [field]: next });
    return reply(`✅ ${label} berhasil di${next ? 'aktifkan' : 'nonaktifkan'}.`);
  }

  if (cmd === 'setwelcome' || cmd === 'setleft') {
    const isWelcome = cmd === 'setwelcome';
    const field = isWelcome ? 'welcomeText' : 'leftText';
    const label = isWelcome ? 'welcome' : 'left';
    const body = (text || m.quoted?.text || '').trim();

    if (!body) {
      const contoh = isWelcome
        ? 'Halo @user, selamat datang di @group! Kamu member ke-@count 🎉'
        : 'Selamat tinggal @user, makasih udah jadi bagian dari @group 👋';
      return reply(`❌ Masukkan teks ${label}!\n\nContoh:\n*${prefix}${cmd} ${contoh}*\n\n${PLACEHOLDER_INFO}`);
    }

    setWelcomeConfig(m.chat, { [field]: body });
    const cfg = getWelcomeConfig(m.chat);
    const aktif = isWelcome ? cfg.welcome : cfg.left;

    let info = `✅ Teks ${label} berhasil disimpan!`;
    if (!aktif) info += `\n\n⚠️ Fitur ${label} masih *nonaktif*. Nyalakan dulu dengan *${prefix}${label} on*.`;
    return reply(info);
  }

  if (cmd === 'resetwelcome' || cmd === 'resetleft') {
    const isWelcome = cmd === 'resetwelcome';
    const field = isWelcome ? 'welcomeText' : 'leftText';
    const cfg = getWelcomeConfig(m.chat);
    if (!(isWelcome ? cfg.welcomeText : cfg.leftText)) {
      return reply(`Teks ${isWelcome ? 'welcome' : 'left'} memang masih memakai bawaan.`);
    }
    setWelcomeConfig(m.chat, { [field]: null });
    return reply(`✅ Teks ${isWelcome ? 'welcome' : 'left'} dikembalikan ke bawaan.`);
  }

  if (cmd === 'testwelcome' || cmd === 'testleft') {
    const isWelcome = cmd === 'testwelcome';
    const meta = await russyuroku.groupMetadata(m.chat).catch(() => null);
    const sample = {
      userJid: m.sender,
      groupName: meta?.subject || 'grup ini',
      count: meta?.participants?.length ?? 0,
    };
    const cfg = getWelcomeConfig(m.chat);
    const template = isWelcome ? (cfg.welcomeText || DEFAULT_WELCOME) : (cfg.leftText || DEFAULT_LEFT);
    const caption = `🧪 *TEST ${isWelcome ? 'WELCOME' : 'LEFT'}*\n\n${renderText(template, sample)}`;

    try {
      const buffer = isWelcome
        ? await createWelcomeCard(russyuroku, sample)
        : await createLeftCard(russyuroku, sample);
      return russyuroku.sendMessage(m.chat, { image: buffer, caption, mentions: [m.sender] }, { quoted: m });
    } catch (err) {
      console.error('[testwelcome/testleft] gagal bikin kartu:', err?.message || err);
      return russyuroku.sendMessage(m.chat, { text: caption, mentions: [m.sender] }, { quoted: m });
    }
  }

  if (cmd === 'cekwelcome') {
    const cfg = getWelcomeConfig(m.chat);
    const meta = await russyuroku.groupMetadata(m.chat).catch(() => null);
    const sample = {
      userJid: m.sender,
      groupName: meta?.subject || 'grup ini',
      count: meta?.participants?.length ?? 0,
    };
    const teksW = renderText(cfg.welcomeText || DEFAULT_WELCOME, sample);
    const teksL = renderText(cfg.leftText || DEFAULT_LEFT, sample);

    return russyuroku.sendMessage(
      m.chat,
      {
        text:
          `*PENGATURAN WELCOME & LEFT*\n\n` +
          `• Welcome : ${cfg.welcome ? '✅ AKTIF' : '❌ NONAKTIF'}\n` +
          `• Left    : ${cfg.left ? '✅ AKTIF' : '❌ NONAKTIF'}\n\n` +
          `*Teks Welcome* ${cfg.welcomeText ? '(custom)' : '(bawaan)'}:\n${teksW}\n\n` +
          `*Teks Left* ${cfg.leftText ? '(custom)' : '(bawaan)'}:\n${teksL}\n\n` +
          PLACEHOLDER_INFO,
        mentions: [m.sender],
      },
      { quoted: m }
    );
  }
};

handler.command = ['welcome', 'left', 'setwelcome', 'setleft', 'resetwelcome', 'resetleft', 'cekwelcome', 'testwelcome', 'testleft'];
handler.tags = ['group'];
handler.help = ['welcome', 'left', 'setwelcome', 'setleft', 'resetwelcome', 'resetleft', 'cekwelcome', 'testwelcome', 'testleft'];
export default handler;
