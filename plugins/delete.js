/*
 * ─────────────────────────────────────────────────────────
 *   ⚡ LORD SAURUS EMPIRE ⚡
 * ─────────────────────────────────────────────────────────
 *   Website   → https://saurusdev.cloud
 *   YouTube   → https://www.youtube.com/@sauruskinggwuw
 *   Saluran   → https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *   Telegram  → @lordsaurus
 *
 *   ⚠ Dilarang menghapus credit ini.
 * ─────────────────────── © 2026 Lunar Saurus ───────────────
 */

let handler = async (m, { guard, russyuroku, reply }) => {
  const tolak = guard(m, { group: true, admin: true, botAdmin: true });
  if (tolak) return reply(tolak);

  if (!m.quoted) return reply("Reply pesan yang mau dihapus, baru ketik *.delete*");

  try {
    await russyuroku.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });
    await russyuroku.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.quoted.id,
        participant: m.quoted.sender
      }
    });
  } catch (err) {
    console.log(err);
    reply("❌ Gagal menghapus pesan, mungkin pesan terlalu lama atau bukan dari member.");
  }
};

handler.command = ["delete", "del"];
handler.tags = ["group"];
handler.help = ["delete"];
handler.group = true;

export default handler;