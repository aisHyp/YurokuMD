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

import { Button } from "luoxy-baileys";

let handler = async (m, { penting, russyuroku, isCreator }) => {
  if (!isCreator) return m.reply("⚠️ Fitur ini hanya untuk Developer bot!")

  const allGroups = await russyuroku.groupFetchAllParticipating()
  const groupIDs = Object.keys(allGroups).filter(id => !penting?.blacklistJpm?.includes(id))
  let sentCount = 0
  let failCount = 0
  let isAborted = false
  if (!groupIDs.length) return m.reply("❌ Tidak ada grup terdaftar.")

  const processMsg = await russyuroku.sendMessage(m.chat, { text: `⏳ *Memproses JPM Slide...*\nJumlah grup: ${groupIDs.length}\nTipe: Carousel Slide` }, { quoted: m })

  const dataSlide = [
    {
      title: `</> 🫶 ${global.ownername} 𝗺𝗲𝗻𝘆𝗲𝗱𝗶𝗮𝗸𝗮𝗻 🫶</>`,
      caption: `- Panel legal
- Jasa buatin baileys WhatsApp
- Jasa buatin web
- Jasa buatin sc bot telegram
- Jasa rename sc tele/wa
- Jasa encrypt
- Jasa scraping
- Jasa snip
- Aplikasi premium
- Api am premium
- Api reactch
- Nokos negara indo/luar
${global.linkSaluran}`,
      image: global.image.broadcast,
      button: "Hubungi Kami",
      source: "https://wa.me/" + global.ownernumber,
    },
    {
      title: "</> List Panel Run Bot Private </>",
      caption: `* Ram 1GB : Rp2000
* Ram 2 GB : Rp3000
* Ram 3 GB : Rp4000
* Ram 4 GB : Rp5000
* Ram 5 GB : Rp6000
* Ram 6 GB : Rp7000
* Ram 7 GB : Rp8000
* Ram 8 GB : Rp9000
* Ram 9 GB : Rp10.000
* Ram Unlimited : Rp10.000

*Syarat & Ketentuan :*
_• Server private & kualitas terbaik!_
_• Script bot dijamin aman (anti drama/maling)_
_• Garansi 30 hari (unlimited replace)_
_• Server anti delay/lemot!_
_• Claim garansi wajib bawa bukti transaksi_`,
      image: global.image.broadcast,
      button: "Beli Sekarang",
      source: "https://panel.saurusdev.cloud",
    },
    {
      title: "</> Simulasi Template Slide </>",
      caption: `* Tsundere : Rp99999
* Loli : Rp99999999999
* Milf : Rp99999999
* Kuudere : Rp9000
* Dandere : Rp99000
* Yandere : Rp1000
* Onee-chan : Rp999999999999999
* Shoujo : Rp9000
* Maid : Rp10.000

_Benefit:_
• Kualitas terbaik
• Anti drama
• Garansi sekian kali
• Anti delay
• Masih segel pastinya 😳`,
      image: global.image.broadcast,
      button: "Klik aja",
      source: "https://hanime.tv",
    },
  ]

  for (let i = 0; i < groupIDs.length; i++) {
    const id = groupIDs[i]

    if (!russyuroku.ws?.isOpen) {
      isAborted = true
      console.log(`⚠️  JPM Slide dihentikan di grup ke-${i+1}: socket disconnect`)
      break
    }

    try {
      let builder = russyuroku.messageBuilder(id)
        .setType('Carousel')
        .setBody('*All Transaksi Open*\n*Cek Produk Kami Dibawah Ini*')
        .setFooter(global.foother || '')

      for (const item of dataSlide) {
        const card = await new Button(russyuroku)
          .setTitle(item.title)
          .setBody(item.caption)
          .setImage(item.image)
          .addUrl(item.button || 'Buka', item.source || global.web, true)
          .toCard()

        builder = builder.addCard(card)
      }

      await builder.send()
      sentCount++
    } catch (err) {
      failCount++
      const errMsg = err.message || ''
      console.error(`❌ Gagal kirim JPM Slide ke ${id}:`, errMsg)

      if (errMsg.includes('Connection Closed') || errMsg.includes('stream') || errMsg.includes('timed out')) {
        isAborted = true
        console.log(`⚠️  JPM Slide dihentikan: ${errMsg}`)
        break
      }
    }

    if ((i + 1) % 10 === 0 || i + 1 === groupIDs.length) {
      try {
        await russyuroku.sendMessage(m.chat, {
          text: `⏳ *JPM Slide Progress...*\n${i+1}/${groupIDs.length} grup\n✅ ${sentCount} berhasil | ❌ ${failCount} gagal`,
          edit: processMsg.key
        })
      } catch {}
    }

    await new Promise(resolve => setTimeout(resolve, global.delayJpm || 4000))
  }

  const statusText = isAborted
    ? `⚠️ *JPM Slide Terhenti!* (koneksi terputus)\nTerkirim ke *${sentCount}* dari ${groupIDs.length} grup sebelum berhenti.`
    : `✅ *JPM Slide Selesai!*\nBerhasil: *${sentCount}* | Gagal: *${failCount}* dari total ${groupIDs.length} grup.`

  await russyuroku.sendMessage(m.chat, { text: statusText, edit: processMsg.key })
}

handler.help = ["jpmslide"]
handler.tags = ["owner"]
handler.command = ["jpmslide"]

export default handler;
