import fs from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

global.menuLegend = `
╭─「 KETERANGAN 」
┃ 🅞 = Khusus Owner
┃ 🅐 = Khusus Admin Grup
┃ 🅟 = Khusus Premium
╰──────────
`

global.menuowner = `
╭─「 OWNER 」
┃ ▸ .getcase 🅞
┃ ▸ .getplugin 🅞
┃ ▸ .addcase 🅞
┃ ▸ .delcase 🅞
┃ ▸ .editcase 🅞
┃ ▸ .savecase 🅞
┃ ▸ .listcase 🅞
┃ ▸ .addplugin 🅞
┃ ▸ .delplugin 🅞
┃ ▸ .setnamabot 🅞
┃ ▸ .setting 🅞
┃ ▸ .self 🅞
┃ ▸ .public 🅞
┃ ▸ .autoread 🅞
┃ ▸ .autoreadsw 🅞
┃ ▸ .autojoingc 🅞
┃ ▸ .joingc 🅞
┃ ▸ .ping
┃ ▸ .runtime
┃ ▸ .addprem 🅞
┃ ▸ .delprem 🅞
┃ ▸ .addlimit 🅞
┃ ▸ .buyprem
┃ ▸ .buylimit
┃ ▸ .crm2 🅞
┃ ▸ .send 🅞
┃ ▸ .jadibot
┃ ▸ .stopjadibot
┃ ▸ .listjadibot 🅞
┃ ▸ .delbot 🅞
┃ ▸ .pinchat 🅞
┃ ▸ .unpinchat 🅞
┃ ▸ .sambutowner 🅞
┃ ▸ .addrespon 🅞
┃ ▸ .delrespon 🅞
┃ ▸ .listrespon 🅞
┃ ▸ .clearrespon 🅞
┃ ▸ .getsc 🅞
╰──────────
`

global.menugroup = `
╭─「 GROUP 」
┃ ▸ .promote 🅐
┃ ▸ .demote 🅐
┃ ▸ .kick 🅐
┃ ▸ .add 🅐
┃ ▸ .delete 🅐
┃ ▸ .leavegc 🅐
┃ ▸ .hidetag 🅐
┃ ▸ .tagall 🅐
┃ ▸ .swgc 🅐
┃ ▸ .welcome 🅐
┃ ▸ .left 🅐
┃ ▸ .setwelcome 🅐
┃ ▸ .setleft 🅐
┃ ▸ .resetwelcome 🅐
┃ ▸ .resetleft 🅐
┃ ▸ .cekwelcome 🅐
┃ ▸ .on 🅐
┃ ▸ .on2 / .off2 🅐
┃ ▸ .antilink 🅐
┃ ▸ .antitoxic 🅐
┃ ▸ .antispam 🅐
┃ ▸ .antitagall 🅐
┃ ▸ .antifoto 🅐
┃ ▸ .antivideo 🅐
┃ ▸ .antiaudio 🅐
┃ ▸ .antidokumen 🅐
┃ ▸ .antisticker 🅐
┃ ▸ .addbadword 🅐
┃ ▸ .delbadword 🅐
┃ ▸ .listbadword 🅐
┃ ▸ .addbotjid / .delbotjid / .listbotjid 🅐
┃ ▸ .onlygroup 🅐
┃ ▸ .autocorrect 🅐
┃ ▸ .antidelete (via .on/.on2) 🅐
┃ ▸ .antilokasi (via .on/.on2) 🅐
┃ ▸ .antikontak (via .on/.on2) 🅐
┃ ▸ .antilinkall / .antilinkyt / .antilinkytch (via .on/.on2) 🅐
┃ ▸ .antilinkch / .antilinkgroup (via .on/.on2) 🅐
┃ ▸ .antipromosi / .antitagsw / .antibot (via .on/.on2) 🅐
╰──────────
`

global.menubroadcast = `
╭─「 BROADCAST 」
┃ ▸ .jpm
┃ ▸ .jpmch
┃ ▸ .jpmht
┃ ▸ .jpmswgc
┃ ▸ .bljpm
┃ ▸ .autojpm
╰──────────────
`

global.menustore = `
╭─「 STORE 」
┃ ▸ .dana
┃ ▸ .gopay
┃ ▸ .ovo
┃ ▸ .qris
┃ ▸ .cekprem
┃ ▸ .ceklimit
╰──────────
`

global.menudownload = `
╭─「 DOWNLOADER 」
┃ ▸ .play
┃ ▸ .play2
┃ ▸ .ytmp3
┃ ▸ .ytmp4
┃ ▸ .capcut
┃ ▸ .igdl
┃ ▸ .mediafire
┃ ▸ .spotify
┃ ▸ .tiktok
┃ ▸ .twitter
╰───────────────
`

global.menusearch = `
╭─「 SEARCH 」
┃ ▸ .pinterest
┃ ▸ .ptvsearch
┃ ▸ .soundcloud
┃ ▸ .wikipedia
╰───────────
`

global.menumaker = `
╭─「 MAKER 」
┃ ▸ .buatgambar
┃ ▸ .iqc
┃ ▸ .glitchtext
┃ ▸ .writetext
┃ ▸ .advancedglow
┃ ▸ .typographytext
┃ ▸ .pixelglitch
┃ ▸ .neonglitch
┃ ▸ .flagtext
┃ ▸ .flag3dtext
┃ ▸ .deletingtext
┃ ▸ .blackpinkstyle
┃ ▸ .glowingtext
┃ ▸ .underwatertext
┃ ▸ .logomaker
┃ ▸ .cartoonstyle
┃ ▸ .papercutstyle
┃ ▸ .watercolortext
┃ ▸ .effectclouds
┃ ▸ .blackpinklogo
┃ ▸ .gradienttext
┃ ▸ .summerbeach
┃ ▸ .luxurygold
┃ ▸ .multicoloredneon
┃ ▸ .sandsummer
┃ ▸ .galaxywallpaper
┃ ▸ .1917style
┃ ▸ .makingneon
┃ ▸ .royaltext
┃ ▸ .freecreate
┃ ▸ .galaxystyle
┃ ▸ .lighteffects
┃ ▸ .qr
┃ ▸ .stickmeme
┃ ▸ .ttp
╰──────────
`

global.menutolls = `
╭─「 TOOLS 」
┃ ▸ .totalfitur
┃ ▸ .toaudio
┃ ▸ .tovid
┃ ▸ .tovn
┃ ▸ .tourl
┃ ▸ .ambilq
┃ ▸ .setbio
┃ ▸ .setpp
┃ ▸ .tutor
┃ ▸ .bass
┃ ▸ .blown
┃ ▸ .deep
┃ ▸ .earrape
┃ ▸ .fast
┃ ▸ .fat
┃ ▸ .nightcore
┃ ▸ .reverse
┃ ▸ .robot
┃ ▸ .slow
┃ ▸ .tupai
┃ ▸ .nulis
┃ ▸ .nuliskiri
┃ ▸ .nuliskanan
┃ ▸ .foliokiri
┃ ▸ .foliokanan
┃ ▸ .styletext
┃ ▸ .obfuscate
┃ ▸ .toqr
┃ ▸ .ssweb
┃ ▸ .ebinary
┃ ▸ .dbinary
┃ ▸ .fliptext
┃ ▸ .myip
┃ ▸ .tinyurl
┃ ▸ .web2zip
┃ ▸ .readviewonce
┃ ▸ .toonce
┃ ▸ .togif
┃ ▸ .say
┃ ▸ .cekkhodam
┃ ▸ .alkitab
┃ ▸ .lyrics
┃ ▸ .volume
┃ ▸ .take
┃ ▸ .cekidgc
┃ ▸ .removebg
┃ ▸ .tempmail
┃ ▸ .getpp
┃ ▸ .cekidch
┃ ▸ .remini
┃ ▸ .swhd
┃ ▸ .shortlink2
╰──────────
`

global.menustalker = `
╭─「 STALKER 」
┃ ▸ .igstalk
┃ ▸ .igstalk2
┃ ▸ .ttstalk
┃ ▸ .ffstalk
┃ ▸ .mlstalk
┃ ▸ .npmstalk
┃ ▸ .ghstalk
┃ ▸ .ytstalk
╰──────────
`

global.menusticker = `
╭─「 STICKER 」
┃ ▸ .sticker
┃ ▸ .smeme
┃ ▸ .qc
┃ ▸ .emojimix
┃ ▸ .toimg
┃ ▸ .brat
┃ ▸ .bratimg
┃ ▸ .brathd
┃ ▸ .bratgreen
┃ ▸ .bratcewek
┃ ▸ .bratanime
┃ ▸ .bratvid
┃ ▸ .bratbahlil
┃ ▸ .bratgojo
┃ ▸ .bratvermeil
┃ ▸ .bratpatrick
┃ ▸ .bratsquidward
┃ ▸ .bratwhite
┃ ▸ .bratchika
┃ ▸ .bratkobato
┃ ▸ .bratmenhera
┃ ▸ .bratnezuko
┃ ▸ .bratqiqi
┃ ▸ .bratruromiya
┃ ▸ .bratumaru
┃ ▸ .gura
┃ ▸ .doge
┃ ▸ .patrick
┃ ▸ .lovestick
╰────────────
`

global.menugame = `
╭─「 GAME 」
┃ ▸ .blockblast
┃ ▸ .akinator
┃ ▸ .tebakbom
┃ ▸ .tictactoe
┃ ▸ .tttresign
┃ ▸ .tttboard
┃ ▸ .sambungkata2
┃ ▸ .kuismath
┃ ▸ .kuis
┃ ▸ .tekateki
┃ ▸ .tebakkah
┃ ▸ .caklontong
┃ ▸ .family100
┃ ▸ .asahotak
┃ ▸ .susunkata
┃ ▸ .siapakahaku
┃ ▸ .lengkapikalimat
┃ ▸ .tebakkata
┃ ▸ .tebakkalimat
┃ ▸ .tebaklirik
┃ ▸ .tebaklagu
┃ ▸ .tebakgambar
┃ ▸ .tebaklogo
┃ ▸ .tebakbendera
┃ ▸ .tebakgame
┃ ▸ .tebakanime
┃ ▸ .tebakhero
┃ ▸ .tebakgenshin
┃ ▸ .tebakmakanan
┃ ▸ .tebakhewan
┃ ▸ .tebakinggris
┃ ▸ .tebakjorok
┃ ▸ .tebakjkt
┃ ▸ .tebakff
┃ ▸ .nyerah
╰─────────
`

global.menujkt48 = `
╭─「 JKT48 」
┃ ▸ .randomjkt48
┃ ▸ .randomjkt48aralie
┃ ▸ .randomjkt48bella
┃ ▸ .randomjkt48carissa
┃ ▸ .randomjkt48christy
┃ ▸ .randomjkt48cynthia
┃ ▸ .randomjkt48daisy
┃ ▸ .randomjkt48danella
┃ ▸ .randomjkt48delynn
┃ ▸ .randomjkt48ekin
┃ ▸ .randomjkt48eli
┃ ▸ .randomjkt48elin
┃ ▸ .randomjkt48ella
┃ ▸ .randomjkt48erine
┃ ▸ .randomjkt48fahira
┃ ▸ .randomjkt48feni
┃ ▸ .randomjkt48fera
┃ ▸ .randomjkt48fiony
┃ ▸ .randomjkt48freya
┃ ▸ .randomjkt48fritzy
┃ ▸ .randomjkt48gendis
┃ ▸ .randomjkt48giaa
┃ ▸ .randomjkt48gita
┃ ▸ .randomjkt48gracie
┃ ▸ .randomjkt48greesel
┃ ▸ .randomjkt48heidi
┃ ▸ .randomjkt48intan
┃ ▸ .randomjkt48jazzy
┃ ▸ .randomjkt48jemima
┃ ▸ .randomjkt48jessi
┃ ▸ .randomjkt48kathrina
┃ ▸ .randomjkt48kimmy
┃ ▸ .randomjkt48lana
┃ ▸ .randomjkt48levi
┃ ▸ .randomjkt48lia
┃ ▸ .randomjkt48lulu
┃ ▸ .randomjkt48lyn
┃ ▸ .randomjkt48maira
┃ ▸ .randomjkt48marsha
┃ ▸ .randomjkt48maxine
┃ ▸ .randomjkt48michie
┃ ▸ .randomjkt48mikaela
┃ ▸ .randomjkt48muthe
┃ ▸ .randomjkt48nachia
┃ ▸ .randomjkt48nala
┃ ▸ .randomjkt48nayla
┃ ▸ .randomjkt48oline
┃ ▸ .randomjkt48olla
┃ ▸ .randomjkt48raisha
┃ ▸ .randomjkt48ralyn
┃ ▸ .randomjkt48rara
┃ ▸ .randomjkt48ribka
┃ ▸ .randomjkt48rilly
┃ ▸ .randomjkt48sona
┃ ▸ .randomjkt48trisha
┃ ▸ .randomjkt48virgi
╰────────────
`

global.menuanime = `
╭─「 ANIME 」
┃ ▸ .waifu
┃ ▸ .bluearchive
┃ ▸ .neko
┃ ▸ .loli
┃ ▸ .akira
┃ ▸ .akiyama
┃ ▸ .asuna
┃ ▸ .boruto
┃ ▸ .chitoge
┃ ▸ .doraemon
┃ ▸ .elaina
┃ ▸ .emilia
┃ ▸ .erza
┃ ▸ .gremory
┃ ▸ .hestia
┃ ▸ .hinata
┃ ▸ .inori
┃ ▸ .itachi
┃ ▸ .kaga
┃ ▸ .kagura
┃ ▸ .kaori
┃ ▸ .kurumi
┃ ▸ .madara
┃ ▸ .megumin
┃ ▸ .mikasa
┃ ▸ .miku
┃ ▸ .minato
┃ ▸ .nezuko
┃ ▸ .onepiece
┃ ▸ .pokemon
┃ ▸ .sakura
┃ ▸ .sasuke
╰──────────
`

global.menuquotes = `
╭─「 QUOTES 」
┃ ▸ .quotesanime
┃ ▸ .quotesbucin
┃ ▸ .quotesmotivasi
┃ ▸ .quotesgalau
┃ ▸ .quotesgombal
┃ ▸ .quoteshacker
┃ ▸ .quotesbijak
┃ ▸ .quotesislami
╰──────────
`

global.menuislami = `
╭─「 ISLAMI 」
┃ ▸ .ayatkursi
┃ ▸ .asmaulhusna
┃ ▸ .niatsholat
┃ ▸ .jadwalsholat
┃ ▸ .kisahnabi
┃ ▸ .doaharian
┃ ▸ .doatahlil
┃ ▸ .alquran
╰──────────
`

global.menuprimbon = `
╭─「 PRIMBON 」
┃ ▸ .nomerhoki
┃ ▸ .artimimpi
┃ ▸ .ramaljodoh
┃ ▸ .ramaljodohbali
┃ ▸ .suamiistri
┃ ▸ .ramalcinta
┃ ▸ .artinama
┃ ▸ .kecocokannama
┃ ▸ .kecocokanpasangan
┃ ▸ .jadianpernikahan
┃ ▸ .sifatusaha
┃ ▸ .rezeki
┃ ▸ .pekerjaan
┃ ▸ .ramalnasib
┃ ▸ .potensipenyakit
┃ ▸ .tarot
┃ ▸ .fengshui
┃ ▸ .haribaik
┃ ▸ .harisangar
┃ ▸ .harinaas
┃ ▸ .nagahari
┃ ▸ .arahrezeki
┃ ▸ .peruntungan
┃ ▸ .weton
┃ ▸ .sifat
┃ ▸ .keberuntungan
┃ ▸ .memancing
┃ ▸ .masasubur
┃ ▸ .zodiak
┃ ▸ .shio
╰────────────
`

global.menufun = `
╭─「 FUN MENU 」
┃ ▸ .fitnah
┃ ▸ .coba
┃ ▸ .jadian
┃ ▸ .nilai
┃ ▸ .jodohku
┃ ▸ .kiss
┃ ▸ .hug
┃ ▸ .pat
┃ ▸ .slap
┃ ▸ .cry
┃ ▸ .kill
┃ ▸ .lick
┃ ▸ .bite
┃ ▸ .yeet
┃ ▸ .bully
┃ ▸ .bonk
┃ ▸ .wink
┃ ▸ .poke
┃ ▸ .nom
┃ ▸ .smile
┃ ▸ .wave
┃ ▸ .blush
┃ ▸ .smug
┃ ▸ .glomp
┃ ▸ .happy
┃ ▸ .dance
┃ ▸ .cringe
┃ ▸ .cuddle
┃ ▸ .highfive
┃ ▸ .handhold
╰────────────
`

global.menurandom = `
╭─「 RANDOM 」
┃ ▸ .randommeme
┃ ▸ .randomblackpink
┃ ▸ .randomprofile
┃ ▸ .randomcecan
┃ ▸ .randomcogan
┃ ▸ .randomcosplay
┃ ▸ .coffee
┃ ▸ .aesthetic
┃ ▸ .bike
┃ ▸ .blackpink
┃ ▸ .boneka
┃ ▸ .car
┃ ▸ .cosplay
┃ ▸ .kpop
┃ ▸ .pubg
┃ ▸ .rose
┃ ▸ .ulzzangboy
┃ ▸ .ulzzanggirl
┃ ▸ .wallml
┃ ▸ .bts
┃ ▸ .hacker
┃ ▸ .cyber
┃ ▸ .islamic
┃ ▸ .jennie
┃ ▸ .jiso
┃ ▸ .cartoon
┃ ▸ .pentol
┃ ▸ .lisa
┃ ▸ .space
┃ ▸ .technology
┃ ▸ .mountain
┃ ▸ .goose
╰──────────
`

global.menucpanel = `
╭─「 CPANEL 」
┃ ▸ .1gb
┃ ▸ .2gb
┃ ▸ .3gb
┃ ▸ .4gb
┃ ▸ .5gb
┃ ▸ .6gb
┃ ▸ .7gb
┃ ▸ .8gb
┃ ▸ .9gb
┃ ▸ .10gb
┃ ▸ .unli
┃ ▸ .renew
┃ ▸ .listpanel
┃ ▸ .listuser
┃ ▸ .mypanel
┃ ▸ .notif
┃ ▸ .delsrv
┃ ▸ .deluser
╰──────────
`

global.allmenu = `${global.menuowner}
${global.menugroup}
${global.menubroadcast}
${global.menustore}
${global.menudownload}
${global.menusearch}
${global.menumaker}
${global.menutolls}
${global.menustalker}
${global.menusticker}
${global.menugame}
${global.menujkt48}
${global.menuanime}
${global.menuquotes}
${global.menuislami}
${global.menuprimbon}
${global.menufun}
${global.menurandom}
${global.menucpanel}
`

global.menuKategori = [
  { key: 'menuowner', judul: 'Owner', emoji: '👑', total: 38 },
  { key: 'menugroup', judul: 'Group', emoji: '👥', total: 46 },
  { key: 'menubroadcast', judul: 'Broadcast', emoji: '📢', total: 6 },
  { key: 'menustore', judul: 'Store', emoji: '🛍️', total: 6 },
  { key: 'menudownload', judul: 'Downloader', emoji: '📥', total: 10 },
  { key: 'menusearch', judul: 'Search', emoji: '🔎', total: 4 },
  { key: 'menumaker', judul: 'Maker', emoji: '🎨', total: 35 },
  { key: 'menutolls', judul: 'Tools', emoji: '🧰', total: 52 },
  { key: 'menustalker', judul: 'Stalker', emoji: '🕵️', total: 8 },
  { key: 'menusticker', judul: 'Sticker', emoji: '🌟', total: 34 },
  { key: 'menugame', judul: 'Game', emoji: '🎮', total: 35 },
  { key: 'menujkt48', judul: 'JKT48', emoji: '🎤', total: 50 },
  { key: 'menuanime', judul: 'Anime', emoji: '🌸', total: 32 },
  { key: 'menuquotes', judul: 'Quotes', emoji: '💬', total: 8 },
  { key: 'menuislami', judul: 'Islami', emoji: '🕌', total: 8 },
  { key: 'menuprimbon', judul: 'Primbon', emoji: '🔮', total: 30 },
  { key: 'menufun', judul: 'Fun', emoji: '🍃', total: 30 },
  { key: 'menurandom', judul: 'Random', emoji: '🎲', total: 32 },
  { key: 'menucpanel', judul: 'CPanel', emoji: '🖥️', total: 18 },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let file = __filename;
fs.watchFile(file, async () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${file}`));
    try {
        await import(`${file}?update=${Date.now()}`);
    } catch (err) {
        console.error(err);
    }
});