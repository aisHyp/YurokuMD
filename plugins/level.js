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
 *  .level [@user]     lihat kartu level (diri sendiri kalau kosong)
 *  .toplevel            leaderboard level grup ini
 *  .autolevel on/off    (admin) toggle notif otomatis pas ada yang naik level
 */
import {
  getUserLevel,
  getXPToNextLevel,
  getGroupLeaderboard,
  generateLevelCard,
  getAutoLevelConfig,
  setAutoLevelConfig,
  makeProgressBar,
} from '../lib/level.js';

let handler = async (m, { guard, russyuroku, command, text, reply }) => {
  const cmd = command.toLowerCase();

  if (cmd === 'level' || cmd === 'rank') {
    const tolak = guard(m, { group: true });
    if (tolak) return reply(tolak);

    const target = m.mentionedJid?.[0] || m.sender;
    const data = getUserLevel(m.chat, target);
    const xpNeeded = getXPToNextLevel(data.level);
    const name = target.split('@')[0];

    const board = getGroupLeaderboard(m.chat);
    const rankIdx = board.findIndex((u) => u.jid === target);
    const rank = rankIdx >= 0 ? rankIdx + 1 : null;

    let pfpUrl = null;
    try {
      pfpUrl = await russyuroku.profilePictureUrl(target, 'image');
    } catch {}

    try {
      const buffer = await generateLevelCard(name, data.level, data.xp, xpNeeded, data.messages || 0, pfpUrl, rank);
      return russyuroku.sendMessage(m.chat, {
        image: buffer,
        caption: `📊 *LEVEL* @${name}\n🎚️ Level ${data.level}${rank ? ` • Rank #${rank}` : ''}\n✨ ${makeProgressBar(data.xp, xpNeeded)}\n💬 ${data.messages || 0} pesan`,
        mentions: [target],
      }, { quoted: m });
    } catch (err) {
      console.error('[LEVEL CARD ERROR]', err);
      return reply(
        `📊 *LEVEL* @${name}\n🎚️ Level ${data.level}${rank ? ` • Rank #${rank}` : ''}\n✨ ${data.xp}/${xpNeeded} XP ${makeProgressBar(data.xp, xpNeeded)}\n💬 ${data.messages || 0} pesan`,
        [target]
      );
    }
  }

  if (cmd === 'toplevel' || cmd === 'leaderboard') {
    const tolak = guard(m, { group: true });
    if (tolak) return reply(tolak);

    const board = getGroupLeaderboard(m.chat).slice(0, 10);
    if (board.length === 0) return reply('❌ Belum ada data level di grup ini. Ayo mulai chat!');

    const medals = ['🥇', '🥈', '🥉'];
    let message = '🏆 *LEADERBOARD LEVEL*\n\n';
    board.forEach((u, i) => {
      const icon = medals[i] || `${i + 1}.`;
      message += `${icon} @${u.jid.split('@')[0]} — Lv.${u.level} (${u.xp} XP)\n`;
    });

    return reply(message, board.map((u) => u.jid));
  }

  if (cmd === 'autolevel') {
    const tolak = guard(m, { group: true, admin: true });
    if (tolak) return reply(tolak);

    const arg = (text || '').trim().toLowerCase();
    if (!['on', 'off'].includes(arg)) {
      const cfg = getAutoLevelConfig(m.chat);
      return reply(`📌 Autolevel saat ini: *${cfg.autolevel ? 'ON' : 'OFF'}*\nKetik *.autolevel on* atau *.autolevel off*`);
    }

    setAutoLevelConfig(m.chat, { autolevel: arg === 'on' });
    return reply(`✅ Notifikasi naik level di grup ini: *${arg.toUpperCase()}*`);
  }
};

handler.command = ['level', 'rank', 'toplevel', 'leaderboard', 'autolevel'];
handler.tags = ['group'];
handler.help = ['level [@user]', 'toplevel', 'autolevel <on|off>'];

export default handler;
