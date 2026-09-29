/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  ⚔️  Lunar Saurus Empire  ⚔️
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  🌍 Site     : https://saurusdev.cloud
 *  📺 YouTube  : https://www.youtube.com/@sauruskinggwuw
 *  📢 Channel  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *  💬 Telegram : @lordsaurus
 *
 *  ⚠️ Watermark ini wajib tetap ada.
 *━━━━━━━━━━━━━━━━━━━ © 2026 Lunar Saurus ━━━━━━━━━━━━━━━━━━
 */

import { AudioToOpus } from "../lib/audio-to-opus.js";
import { videoToAudio } from "../lib/convert.js";

let handler = async (m, { russyuroku, example }) => {
  let quoted = m.quoted ? m.quoted : m;
  let mime = (quoted.msg || quoted).mimetype || "";

  if (!/audio|video/.test(mime)) {
    return example("(reply audio/video untuk diubah jadi voice note)");
  }

  await russyuroku.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

  try {
    let buffer = await russyuroku.downloadMediaMessage(quoted);
    if (/video/.test(mime)) buffer = await videoToAudio(buffer, "mp3");

    const opus = await AudioToOpus(buffer);

    await russyuroku.sendMessage(
      m.chat,
      { audio: opus, mimetype: "audio/ogg; codecs=opus", ptt: true },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
    m.reply(`❌ Error: ${err.message}`);
  }
};

handler.command = ["tovn", "toptt"];
handler.tags = ["tools"];
handler.help = ["tovn"];

export default handler;
