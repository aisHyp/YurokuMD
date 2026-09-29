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
 *  .warn @user [alasan]   tambah 1 warn (auto-kick kalau sudah mencapai batas)
 *  .delwarn @user | all   hapus warn user tertentu / semua warn di grup
 *  .listwarn               daftar semua user yang punya warn di grup ini
 *  .infowarn [@user]       lihat detail riwayat warn user (default diri sendiri)
 *  .resetwarn [@user]      reset warn user tertentu, atau semua kalau tanpa target
 */
import { loadWarnDB, saveWarnDB, getMaxWarn } from '../lib/warn.js';
import { getTarget, isParticipantAdmin } from '../lib/target.js';

let handler = async (m, { guard, russyuroku, command, text, isCreator, reply }) => {
  const cmd = command.toLowerCase();

  if (cmd === 'warn') {
    const tolak = guard(m, { group: true, admin: true, botAdmin: true });
    if (tolak) return reply(tolak);

    const target = getTarget(m, text);
    if (!target) return reply('❌ Tag/reply user yang mau di-warn.\nContoh: *.warn @user telat bayar*');
    if (target === m.sender) return reply('😅 Ngapain warn diri sendiri.');
    if (isParticipantAdmin(m, target) && !isCreator) return reply('❌ Tidak bisa warn admin.');

    const warnDB = loadWarnDB();
    if (!warnDB[m.chat]) warnDB[m.chat] = {};
    if (!warnDB[m.chat][target]) {
      warnDB[m.chat][target] = {
        count: 0,
        warnings: [],
        name: target.split('@')[0],
      };
    }

    const userData = warnDB[m.chat][target];
    userData.count += 1;
    userData.warnings.push({
      timestamp: Date.now(),
      warnedBy: m.sender,
      warnedByName: m.pushName || m.sender.split('@')[0],
      reason: text.split(/\s+/).slice(1).join(' ') || 'Tidak ada alasan',
    });
    saveWarnDB(warnDB);

    const maxWarn = getMaxWarn();
    if (userData.count >= maxWarn) {
      await reply(`⚠️ @${target.split('@')[0]} mencapai ${maxWarn} warn, dikeluarkan dari grup.`, [target]);
      try {
        await russyuroku.groupParticipantsUpdate(m.chat, [target], 'remove');
      } catch (e) {
        console.error('[WARN KICK ERROR]', e);
      }
      delete warnDB[m.chat][target];
      saveWarnDB(warnDB);
    } else {
      await reply(`⚠️ Warn ${userData.count}/${maxWarn} untuk @${target.split('@')[0]}`, [target]);
    }
    return;
  }

  if (cmd === 'delwarn') {
    const tolak = guard(m, { group: true, admin: true });
    if (tolak) return reply(tolak);

    const warnDB = loadWarnDB();
    if (!warnDB[m.chat]) return reply('❌ Tidak ada warn di grup ini.');

    const arg = (text || '').trim().toLowerCase();
    if (arg === 'all' || arg === 'semua') {
      delete warnDB[m.chat];
      saveWarnDB(warnDB);
      return reply('✅ Semua warn di grup ini dihapus.');
    }

    const target = getTarget(m, text);
    if (!target) return reply('❌ Tag/reply user, atau ketik *.delwarn all* buat hapus semua.');
    if (!warnDB[m.chat][target]) return reply(`❌ @${target.split('@')[0]} tidak punya warn.`, [target]);

    delete warnDB[m.chat][target];
    saveWarnDB(warnDB);
    return reply(`✅ Warn untuk @${target.split('@')[0]} dihapus.`, [target]);
  }

  if (cmd === 'listwarn') {
    const tolak = guard(m, { group: true });
    if (tolak) return reply(tolak);

    const warnDB = loadWarnDB();
    const entries = Object.entries(warnDB[m.chat] || {});
    if (entries.length === 0) return reply('❌ Tidak ada warn di grup ini.');

    let message = '📋 *Daftar Warn*\n\n';
    entries.forEach(([jid, data], i) => {
      message += `${i + 1}. @${jid.split('@')[0]} — ⚠️ ${data.count} warn\n`;
    });
    message += `\nTotal: ${entries.length} user`;

    return reply(message, entries.map(([jid]) => jid));
  }

  if (cmd === 'infowarn') {
    const tolak = guard(m, { group: true });
    if (tolak) return reply(tolak);

    const warnDB = loadWarnDB();
    const target = getTarget(m, text) || m.sender;
    const data = warnDB[m.chat]?.[target];
    if (!data) return reply(`❌ @${target.split('@')[0]} tidak punya warn.`, [target]);

    let message = `📊 *Info Warn* @${target.split('@')[0]}\n⚠️ ${data.count}/${getMaxWarn()} warn\n\n`;
    if (data.warnings.length > 0) {
      message += `*Riwayat terakhir:*\n`;
      data.warnings.slice(-3).forEach((w, i) => {
        const date = new Date(w.timestamp).toLocaleDateString('id-ID');
        message += `${i + 1}. ${date} — ${w.reason}\n`;
      });
    }
    return reply(message, [target]);
  }

  if (cmd === 'resetwarn') {
    const tolak = guard(m, { group: true, admin: true });
    if (tolak) return reply(tolak);

    const warnDB = loadWarnDB();
    if (!warnDB[m.chat]) return reply('❌ Tidak ada warn di grup ini.');

    const target = getTarget(m, text);
    if (target) {
      if (!warnDB[m.chat][target]) return reply(`❌ @${target.split('@')[0]} tidak punya warn.`, [target]);
      warnDB[m.chat][target].count = 0;
      warnDB[m.chat][target].warnings = [];
      saveWarnDB(warnDB);
      return reply(`✅ Warn @${target.split('@')[0]} direset.`, [target]);
    }

    for (const jid in warnDB[m.chat]) {
      warnDB[m.chat][jid].count = 0;
      warnDB[m.chat][jid].warnings = [];
    }
    saveWarnDB(warnDB);
    return reply('✅ Semua warn di grup ini direset.');
  }
};

handler.command = ['warn', 'delwarn', 'listwarn', 'infowarn', 'resetwarn'];
handler.tags = ['group'];
handler.help = ['warn <@user> [alasan]', 'delwarn <@user|all>', 'listwarn', 'infowarn [@user]', 'resetwarn [@user]'];

export default handler;
