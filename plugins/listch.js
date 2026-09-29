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

import { getBuffer, runtime, previewAd } from "../lib/myfunc.js";

let handler = async (m, { russyuroku, isCreator, reply }) => {
  if (!isCreator) return reply("⚠️ Fitur ini hanya untuk Developer bot!");

  await russyuroku.sendMessage(m.chat, { react: { text: "👁️‍🗨️", key: m.key } });

  let channels;
  try {
    channels = await russyuroku.newsletterFetchAllParticipating();
  } catch (e) {
    console.error(e);
    return m.reply("*✖️ Gagal mengambil daftar channel.*");
  }

  let chList = Object.values(channels);
  if (!chList.length) return m.reply("⚠️ Tidak ada channel yang kamu ikuti.");

  let teks = `*📡 Daftar Channel Detail (${chList.length} Channel):*\n\n`;
  chList.forEach((ch, i) => {

    let role = ch.viewer_metadata?.role || "–";
    let mute = ch.viewer_metadata?.mute || "–";
    let verified = ch.verification || "–";
    let state = ch.state || "–";

    teks += `*${i + 1}. ${ch.name || "Tanpa Nama"}*\n`;
    teks += `├ ID: ${ch.id || "❓"}\n`;
    teks += `├ Subscribers: ${ch.subscribers || 0}\n`;
    teks += `├ Role kamu: ${role}\n`;
    teks += `├ Mute: ${mute}\n`;
    teks += `├ Verifikasi: ${verified}\n`;
    teks += `├ State: ${state}\n`;
    teks += `└ Link: ${ch.invite ? `https://whatsapp.com/channel/${ch.invite}` : "❌ Tidak tersedia"}\n\n`;
  });

  await russyuroku.sendMessage(
    m.chat,
    {
      text: teks,
      ...previewAd({
        title: `${chList.length} Channel Aktif`,
        body: `Runtime : ${runtime(process.uptime())}`,
        sourceUrl: global.linkSaluran || global.web,
        thumbnail: global.image.info,
        mention: [m.sender],
        largerThumbnail: true,
      }),
    },
    { quoted: m }
  );
};

handler.command = ["listchannel", "listch"];
handler.tags = ["info"];
handler.help = ["listchannel"];

export default handler;