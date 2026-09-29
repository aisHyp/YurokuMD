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
import fs from 'fs';
import chalk from 'chalk';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import moment from "moment-timezone";

global.ownernumber = '62895639043495'
global.ownername = 'Saurus'

global.namabot = "Yuroku MD"
global.nomorbot = '62895639043495'
global.pair = "YUROKUMD"
global.version = '1.1'
global.prefix = '°zZ#$@+,.?=\'\'():√%!¢£¥€π¤ΠΦ&><`™©®Δ^βα¦|/\\©^'

global.owneronly = true
global.autojoingc = false
global.autoreadsw = false
global.autoread = false

global.image = {

    menu: "https://cdn.saurusdev.cloud/vkrvlPlR99.jpg",
    reply: "https://cdn.saurusdev.cloud/azgn.jpg",

    broadcast: "https://cdn.saurusdev.cloud/vkrvlPlR99.jpg",
    info: "https://cdn.synoxcloud.xyz/storage/tim9rqudgrdv.jpg",

    favicon: "https://am.saurusgege.my.id/assets/image/logo.png",

    welcome: "https://img3.pixhost.to/images/5890/773097050_1001916559.png",

    left: "https://img3.pixhost.to/images/5890/773097050_1001916559.png",
}
global.vnMenu = "./source/media/audio/saurusgtg.mp3"
global.noProfileImg = "https://i.ibb.co/6BRf4Rc/no-profile.png"
global.fallbackPfp = "./source/media/foto/noprofile.png"
global.defaultChannelImg = "https://files.catbox.moe/xpntd8.jpg"

global.apisaurus    = 'https://api.saurusdev.cloud'
global.apikeysaurus = 'russdev'

// JKT48Connect API (v2.jkt48connect.com) — dipakai untuk fitur live/teater/event/member JKT48.
// Free key publik, limit 50 request/key. Ganti dengan key sendiri (beli via WA JKT48Connect) kalau limit habis.
global.jkt48ConnectApi    = 'https://v2.jkt48connect.com/api'
global.jkt48ConnectApiKey = 'J-D55B'

global.web = "https://saurusdev.cloud"
global.linkSaluran = "https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g"
global.idSaluran = "120363429190136593@newsletter"
global.nameSaluran = "Lunar Saurus"
global.ytChannel = "https://www.youtube.com/@sauruskinggwuw"
global.telegram = "@lordsaurus"

global.packname = `Dιвυαт σℓєн Yυяσкυ MD
⏰ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")}
Sєωα вσт? Cнαт: ${ownernumber}`
global.author = ``
global.foother = '© 2026 - Made By Saurus'

global.domain = ""
global.apikey = ""
global.nestid = "5"
global.egg = "15"
global.loc = "1"

global.dana = "0895393336779"
global.ovo = false
global.gopay = false
global.qris = "https://e.top4top.io/p_39129u6mz1.jpg"
global.an = {
    dana: "kepo",
    ovo: "nama_ovo",
    gopay: "nama_gopay"
}

global.limitDefault = 25
global.hargaLimit = 5000
global.hargaPrem = 10000

global.delayJpm = 3500
global.delayPushkontak = 5000
global.namakontak = "AutoSave Yuroku MD"

global.mess = {
  owner: `🚫 *AKSES DITOLAK*\nFitur ini hanya bisa digunakan oleh *Owner Bot*.`,
  creator: `🚫 *AKSES DITOLAK*\nFitur ini hanya bisa digunakan oleh *Owner Bot*.`,
  admin: `🚫 *AKSES DITOLAK*\nFitur ini khusus untuk *Admin Grup*.`,
  botAdmin: `🚫 *AKSES DITOLAK*\nBot harus menjadi *Admin Grup* terlebih dahulu untuk menjalankan fitur ini.`,
  group: `🚫 *AKSES DITOLAK*\nFitur ini hanya dapat digunakan di *dalam grup*.`,
  private: `🚫 *AKSES DITOLAK*\nFitur ini hanya bisa digunakan di *chat pribadi*.`,
  prem: `🚫 *AKSES DITOLAK*\nFitur ini hanya tersedia untuk *User Premium*.\n> ketik .buyprem untuk upgrade nomor mu`,
  verifikasi: `🚫 *AKSES DITOLAK*\nKetik *.daftar* untuk akses semua fitur bot.`,
  limit: `❌ *Limit habis!*\n\nKetik *.buylimit* untuk beli limit atau *.buyprem* untuk upgrade premium`,

  wait: `⏳ *Mohon tunggu...*\nPermintaan kamu sedang diproses.`,
  error: `❌ *Terjadi kesalahan!*\nSilakan coba lagi nanti.`,
  done: `✅ *Berhasil!*\nProses telah selesai dengan sukses.`,
  success: `✅ *Berhasil!*\nProses telah selesai dengan sukses.`,
  text: `Teksnya mana? Masukkan teksnya dulu.`,
  media: `Media nya mana? Kirim/reply medianya dulu.`,
}

global.closeMsgInterval = 30;
global.backMsgInterval = 2;

import './source/menu-yurokumd.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let file = __filename;
fs.watchFile(file, async () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${file}`));
    try {
        const module = await import(`${file}?update=${Date.now()}`);
    } catch (err) {
        console.error(err);
    }
});
