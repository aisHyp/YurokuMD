let handler = async (m, { russyuroku, text, isCreator, reply }) => {
  if (!isCreator) return reply("⚠️ Fitur ini hanya bisa digunakan oleh Developer bot!");

  const channels = await russyuroku.newsletterFetchAllParticipating();
  const chList = Object.values(channels);
  if (!chList.length) return reply("❌ Tidak ada channel yang diikuti bot.");

  if (m.chat.endsWith("@newsletter")) {
    const action = text.trim().toLowerCase();
    if (!["on", "off"].includes(action))
      return reply("Gunakan:\n.notifch on — Nonaktifkan notifikasi channel ini\n.notifch off — Aktifkan Notifikasi channel ini");

    try {
      if (action === "on") {
        await russyuroku.newsletterMute(m.chat);
        reply(`Notifikasi Channel ini berhasil dimatikan.`);
      } else {
        await russyuroku.newsletterUnmute(m.chat);
        reply(`Notifikasi Channel ini berhasil di aktifkan.`);
      }
    } catch (e) {
      console.error(e);
      reply("⚠️ Gagal menyinkronkan mute/unmute ke WhatsApp.");
    }
    return;
  }

  let [idPart, action] = text.split("|").map(a => a?.trim()?.toLowerCase());
  if (!idPart || !action) {
    let teks = `*📋 Daftar Channel (${chList.length}):*\n\n`;
    chList.forEach((ch, i) => {
      teks += `${i + 1}. ${ch.name || "Tanpa Nama"}\n`;
      teks += `   ID: ${ch.id}\n`;
      teks += `   Subs: ${ch.subscribers || 0}\n\n`;
    });
    teks += `Gunakan:\n.mutech 1,3|on\n.mutech 2|off`;
    return reply(teks);
  }

  const indexes = idPart.split(",").map(x => parseInt(x.trim()) - 1);
  const isOn = action === "on";
  const isOff = action === "off";

  if (!isOn && !isOff)
    return reply("Gunakan: .notifch 1,3|on atau .notifch 2|off");

  let hasil = [];
  for (const idx of indexes) {
    if (isNaN(idx) || idx < 0 || idx >= chList.length) continue;
    const target = chList[idx];
    try {
      if (isOn) {
        await russyuroku.newsletterMute(target.id);
        hasil.push(`🔕 ${target.name || target.id} dimute.`);
      } else if (isOff) {
        await russyuroku.newsletterUnmute(target.id);
        hasil.push(`🔔 ${target.name || target.id} di-unmute.`);
      }
    } catch (e) {
      console.error(e);
      hasil.push(`⚠️ Gagal memproses ${target.name || target.id}.`);
    }
  }

  if (hasil.length === 0) return reply("✖️ Tidak ada ID channel yang valid.");
  return reply(hasil.join("\n"));
};

handler.help = ["mutech <id>|on/off"];
handler.tags = ["owner"];
handler.command = ["mutech", "notifch"];

export default handler;