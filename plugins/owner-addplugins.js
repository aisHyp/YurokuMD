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

import fs from "fs";

let handler = async (m, { guard, russyuroku, text, reply, example }) => {
const tolak = guard(m, { owner: true })
if (tolak) return reply(tolak)
if (!text) return example("namafile & reply code")
if (!m.quoted || !m.quoted.text) return example("namafile & reply code")
if (!text.endsWith(".js")) return reply("Nama file harus berformat .js")
let kondisi = "menambah"
if (fs.existsSync("./plugins/" + text)) return reply("Nama file plugins sudah terdaftar di dalam folder plugins!")
let teks = m.quoted.text
await fs.writeFileSync("./plugins/" + text, teks)
return reply(`Berhasil ${kondisi} file plugins *${text}*`)
}

handler.command = ["addplugins", "addplugin", "addp", "addplug"]

export default handler;

