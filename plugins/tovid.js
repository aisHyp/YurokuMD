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

import { webpToVideo } from "../lib/convert.js";

let handler = async (m, { russyuroku, example }) => {
  let quoted = m.quoted ? m.quoted : m;
  let mime = (quoted.msg || quoted).mimetype || "";

  if (!/webp/.test(mime)) {
    return example("(reply stiker animasi/gif untuk diubah jadi video)");
  }

  await russyuroku.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

  try {
    const buffer = await russyuroku.downloadMediaMessage(quoted);
    const video = await webpToVideo(buffer);

    await russyuroku.sendMessage(
      m.chat,
      { video, caption: "✅ *Berhasil diubah jadi video*" },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
    m.reply(`❌ Error: ${err.message}`);
  }
};

handler.command = ["tovid", "stickertovideo", "toanimasi"];
handler.tags = ["tools"];
handler.help = ["tovid"];

export default handler;
