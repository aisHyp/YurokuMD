/*╔═══════════════════════════════════════════════════════╗
 *║  🦖  LORD SAURUS EMPIRE
 *╟───────────────────────────────────────────────────────╢
 *║  🌐 Web      : https://saurusdev.cloud
 *║  ▶︎ YouTube  : https://www.youtube.com/@sauruskinggwuw
 *║  📡 Saluran  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *║  ✈︎ Telegram : @lordsaurus
 *║
 *║  ⚠︎ Jangan hapus watermark ini ya!
 *╚═══════════════════ © 2026 Lunar Saurus ═════════════════╝
 */

import { videoToAudio } from "../lib/convert.js";

let handler = async (m, { russyuroku, example }) => {
  let quoted = m.quoted ? m.quoted : m;
  let mime = (quoted.msg || quoted).mimetype || "";

  if (!/video/.test(mime)) {
    return example("(reply video untuk diambil audionya)");
  }

  await russyuroku.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

  try {
    const buffer = await russyuroku.downloadMediaMessage(quoted);
    const audio = await videoToAudio(buffer, "mp3");

    await russyuroku.sendMessage(
      m.chat,
      { audio, mimetype: "audio/mpeg", fileName: "audio.mp3" },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
    m.reply(`❌ Error: ${err.message}`);
  }
};

handler.command = ["toaudio", "videotoaudio"];
handler.tags = ["tools"];
handler.help = ["toaudio"];

export default handler;
