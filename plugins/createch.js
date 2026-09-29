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

import fs from 'fs'
import FormData from 'form-data'
import fetch from 'node-fetch'
import { getBuffer, previewAd } from '../lib/myfunc.js'

let handler = async (m, { guard, russyuroku, qmsg, mime, text, reply }) => {
  const tolak = guard(m, { owner: true });
  if (tolak) return reply(tolak);
  if (!text) return reply("📛 *Gunakan format:*\n.createchannel <nama>|<deskripsi>");

  let [name, desc] = text.split("|");
  if (!name) return reply("❌ Harap tuliskan nama channel.");
  desc = desc ? desc.trim() : "Tidak ada deskripsi.";

  await russyuroku.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

  let imageUrl = global.defaultChannelImg;
  if (m.quoted && /image/.test(mime)) {
    try {
      const mediaPath = await russyuroku.downloadAndSaveMediaMessage(qmsg);
      const form = new FormData();
      form.append("reqtype", "fileupload");
      form.append("fileToUpload", fs.createReadStream(mediaPath));

      const upload = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: form,
      });
      const url = await upload.text();
      if (url && url.startsWith("https")) imageUrl = url.trim();
      fs.unlinkSync(mediaPath);
    } catch (e) {
      console.error(e);
      reply("⚠️ Gagal upload gambar, menggunakan gambar default.");
    }
  }

  try {
    const newsletter = await russyuroku.newsletterCreate(name.trim(), desc, { url: imageUrl });
    const invite = newsletter?.invite || "❌ Tidak tersedia";
    const id = newsletter?.id || "❓";

    await russyuroku.sendMessage(
      m.chat,
      {
        text: `✅ *Channel Berhasil Dibuat!*\n\n📡 *Nama:* ${name}\n📝 *Deskripsi:* ${desc}\n🆔 *ID:* ${id}\n🔗 *Link:* https://whatsapp.com/channel/${invite}`,
        ...previewAd({
          title: name,
          body: "Channel berhasil dibuat melalui sistem Lunar Saurus Empire",
          sourceUrl: `https://whatsapp.com/channel/${invite}`,
          thumbnail: imageUrl,
          largerThumbnail: true,
        }),
      },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
    reply("✖️ *Gagal membuat channel.* Pastikan akun bot kamu memenuhi syarat untuk membuat channel.");
  }
};

handler.command = ["createchannel", "createch"];
handler.tags = ["owner"];
handler.help = ["createchannel <nama>|<deskripsi>"];
export default handler;