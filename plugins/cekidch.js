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
 *
 *  .cekidch / .idch — Cek info & ID channel WhatsApp dari link.
 *  Support 1 link atau banyak link sekaligus.
 */

import {
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia
} from "luoxy-baileys";

let handler = async (m, { russyuroku, reply, text }) => {

    if (!text) {
        return reply(
            "⚠️ Masukkan minimal 1 link channel!\n\n" +
            "Contoh: .cekidch https://whatsapp.com/channel/xxxxx"
        );
    }

    const links = text.split(/\s+/).filter(Boolean).slice(0, 10);

    if (links.length === 1) {

        const link = links[0];

        if (!link.includes("https://whatsapp.com/channel/")) {
            return reply("❌ Link tautan tidak valid!");
        }

        const idPart = link
            .split("https://whatsapp.com/channel/")[1]
            ?.split(/[?&\s]/)[0];

        if (!idPart) {
            return reply("❌ Link channel tidak valid!");
        }

        await russyuroku.sendMessage(m.chat, {
            react: {
                text: "🔎",
                key: m.key
            }
        });

        let res;

        try {
            res = await russyuroku.newsletterMetadata(
                "invite",
                idPart
            );
        } catch (err) {
            console.error("[cekidch] newsletterMetadata:", err);
            return reply("❌ Gagal mengambil data channel!");
        }

        if (!res || !res.id) {
            return reply("❌ Gagal mengambil data channel!");
        }

        const teks = `╔──☉ *CHANNEL INFO*
│✎ *Nama* : ${res.name || "-"}
│✎ *ID* : ${res.id}
│✎ *Followers* : ${res.subscribers || 0}
│✎ *Status* : ${res.state || "-"}
│✎ *Verified* : ${
            res.verification === "VERIFIED"
                ? "✅ Terverifikasi"
                : "❌ Tidak"
        }
╚────────────☉`;

        try {

            const media = await prepareWAMessageMedia(
                {
                    image: {
                        url: global.image.menu
                    }
                },
                {
                    upload: russyuroku.waUploadToServer
                }
            );

            const msgii = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },

                            interactiveMessage:
                                proto.Message.InteractiveMessage.create({

                                    body:
                                        proto.Message.InteractiveMessage.Body.create({
                                            text: teks
                                        }),

                                    footer:
                                        proto.Message.InteractiveMessage.Footer.create({
                                            text: global.namabot
                                        }),

                                    header:
                                        proto.Message.InteractiveMessage.Header.create({
                                            title: "*Info Channel*",
                                            hasMediaAttachment: true,
                                            ...media
                                        }),

                                    nativeFlowMessage:
                                        proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                            buttons: [

                                                {
                                                    name: "cta_copy",
                                                    buttonParamsJson:
                                                        JSON.stringify({
                                                            display_text:
                                                                "📋 SALIN ID",
                                                            id: res.id,
                                                            copy_code: res.id
                                                        })
                                                },

                                                {
                                                    name: "cta_url",
                                                    buttonParamsJson:
                                                        JSON.stringify({
                                                            display_text:
                                                                global.nameSaluran,
                                                            url:
                                                                global.linkSaluran,
                                                            merchant_url:
                                                                global.linkSaluran
                                                        })
                                                }

                                            ]
                                        }),

                                    contextInfo: {
                                        stanzaId: m.key.id,
                                        participant: m.sender
                                    }
                                })
                        }
                    }
                },
                {
                    userJid: m.sender,
                    quoted: m
                }
            );

            await russyuroku.relayMessage(
                m.chat,
                msgii.message,
                {
                    messageId: msgii.key.id
                }
            );

        } catch (err) {

            console.error("[cekidch] Native card error:", err);

            return reply(teks);
        }

        return;
    }

    const processMsg = await russyuroku.sendMessage(
        m.chat,
        {
            text: "🔎 Sedang memeriksa channel..."
        }
    );

    const captionArr = [];

    for (const link of links) {

        if (!link.includes("https://whatsapp.com/channel/")) {

            captionArr.push(
                `╭─❐ *LINK TIDAK VALID* ❐─╮
┃ ➤ ${link}
╰────────────────╯`
            );

            continue;
        }

        const idPart = link
            .split("https://whatsapp.com/channel/")[1]
            ?.split(/[?&\s]/)[0];

        if (!idPart) {

            captionArr.push(
                `╭─❐ *LINK TIDAK VALID* ❐─╮
┃ ➤ ${link}
╰────────────────╯`
            );

            continue;
        }

        try {

            const res = await russyuroku.newsletterMetadata(
                "invite",
                idPart
            );

            if (!res || !res.id) {
                throw new Error("Metadata channel kosong");
            }

            captionArr.push(
                `╭─❐ *${res.name || "Tanpa Nama"}* ❐─╮
┃ ➤ ID        : ${res.id}
┃ ➤ Followers : ${res.subscribers || 0}
┃ ➤ Verified  : ${
                    res.verification === "VERIFIED"
                        ? "✅"
                        : "❌"
                }
┃ ➤ Status    : ${res.state || "-"}
╰────────────────╯`
            );

        } catch (err) {

            console.error(
                "[cekidch] Error cek channel:",
                err
            );

            captionArr.push(
                `╭─❐ *GAGAL CEK* ❐─╮
┃ ➤ ${link}
╰────────────────╯`
            );
        }
    }

    const caption =
        captionArr.join("\n\n") ||
        "❌ Tidak ada channel valid untuk dicek.";

    await russyuroku.sendMessage(
        m.chat,
        {
            text: caption,
            edit: processMsg.key
        }
    );
};

handler.command = ["cekidch", "idch"];
handler.tags = ["info"];
handler.help = ["cekidch <link1> [link2]"];

export default handler;