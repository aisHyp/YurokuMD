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

let handler = async (m, { russyuroku, text, example, axios, fs, uploader, isUrl }) => {
  let quoted = m.quoted ? m.quoted : m;
  let mime = (quoted.msg || quoted).mimetype || "";
  let imgUrl = isUrl(text) ? text.trim() : null;

  if (!imgUrl && !/image/.test(mime)) {
    return example("(reply gambar / kirim gambar dengan caption ini, atau sertakan URL gambar)");
  }

  await russyuroku.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

  let mediaPath;
  try {
    if (!imgUrl) {
      mediaPath = await russyuroku.downloadAndSaveMediaMessage(quoted);
      imgUrl = await uploader.auto(mediaPath);
    }

    if (!imgUrl) return m.reply("❌ Gagal mendapatkan URL gambar.");

    const { data } = await axios.get("https://api.ammaricano.my.id/api/ai/removal", {
      params: { imgUrl },
      headers: { accept: "application/json" },
    });

    const resultUrl = data?.result?.url || data?.result?.low_resolution;
    if (!data?.success || !resultUrl) return m.reply("❌ Gagal menghapus background gambar.");

    await russyuroku.sendMessage(
      m.chat,
      { image: { url: resultUrl }, caption: "✅ *Background berhasil dihapus!*" },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
    m.reply(`❌ Error: ${err.message}`);
  } finally {
    try { if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath); } catch {}
  }
};

handler.command = ["removebg"];
handler.tags = ["tools"];
handler.help = ["removebg <url>"];

export default handler;
