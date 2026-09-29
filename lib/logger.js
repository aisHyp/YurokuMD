import { modul } from '../module.js';
import figlet from 'figlet';
import gradient from 'gradient-string';

const { chalk } = modul;

const line = (char = '─', len = 50) => char.repeat(len);

function banner(text, layout = 'fitted') {
  console.clear();
  console.log(gradient.pastel.multiline(figlet.textSync(text, { horizontalLayout: layout })));
}

function subBanner(text) {
  console.log(gradient.morning(text));
}

function section(title) {
  console.log(chalk.magentaBright(line('╌')));
  console.log(chalk.cyanBright.bold(`✦ ${title}`));
  console.log(chalk.magentaBright(line('╌') + '\n'));
}

function info(msg) {
  console.log(chalk.cyan('[Info] ') + chalk.white(msg));
}

function success(msg) {
  console.log(chalk.greenBright('[Sukses] ') + chalk.white(msg));
}

function warn(msg) {
  console.log(chalk.yellow('[Peringatan] ') + chalk.white(msg));
}

function error(msg, err) {
  console.log(chalk.red('[Error] ') + chalk.white(msg), err ?? '');
}

function db(msg) {
  console.log(chalk.greenBright(`[Database] ${msg}`));
}

function starting(msg) {
  console.log(chalk.yellow('[ Starting ] ') + chalk.white.bold(msg));
}

function systemInfo(modul) {
  console.log(chalk.yellowBright.bold('⟢ System Information'));
  console.log(chalk.cyanBright(`   ├ Platform  `) + chalk.greenBright(`${modul.os.platform()} ${modul.os.arch()}`));
  console.log(chalk.cyanBright(`   ├ Release   `) + chalk.greenBright(`${modul.os.release()}`));
  console.log(chalk.cyanBright(`   ├ Hostname  `) + chalk.greenBright(`${modul.os.hostname()}`));
  console.log(chalk.cyanBright(`   ├ Total RAM `) + chalk.greenBright(`${(modul.os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`));
  console.log(chalk.cyanBright(`   ├ Free RAM  `) + chalk.greenBright(`${(modul.os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`));
  console.log(chalk.cyanBright(`   └ Uptime    `) + chalk.greenBright(`${modul.os.uptime()} sec\n`));
  console.log(gradient.retro('Preparing environment...'));
}

function ownerSetupInfo({ ownername, ownernumber, namabot, nomorbot }) {
  console.log(chalk.magentaBright(line('╌')));
  console.log(chalk.yellowBright.bold('⟢ Owner & Bot Info'));
  console.log(chalk.cyanBright(`   ├ Owner Name  `) + chalk.greenBright(ownername));
  console.log(chalk.cyanBright(`   ├ Owner Number`) + chalk.greenBright(` ${ownernumber}`));
  console.log(chalk.cyanBright(`   ├ Bot Name    `) + chalk.greenBright(` ${namabot}`));
  console.log(chalk.cyanBright(`   └ Bot Number  `) + chalk.greenBright(` ${nomorbot}`));
  console.log(chalk.magentaBright(line('╌') + '\n'));
}

function pairingCode(code) {
  console.log(chalk.black.bgGreen('Ini kode pairing kamu:'), chalk.white.bold(code));
}

function connecting() {
  console.log(chalk.yellow('Connecting to WhatsApp...'));
}

function connected() {
  console.log(chalk.green.bold('✅ Connected Successfully to WhatsApp'));
}

function disconnected(statusCode, isLoggedOut) {
  console.log(chalk.red(`[DISCONNECT] Status: ${statusCode} | isLoggedOut: ${isLoggedOut}`));
}

function loggedOut() {
  console.log(chalk.red.bold('❌ Bot ter-logout dari WhatsApp! Hapus folder session dan pairing ulang.'));
}

function reconnectFailed(max) {
  console.log(chalk.red.bold(`❌ Gagal reconnect setelah ${max}x. Bot berhenti.`));
}

function reconnecting(attempt, backoffMs) {
  console.log(chalk.yellow(`⚠️ Reconnect ke-${attempt} dalam ${(backoffMs / 1000).toFixed(1)}s...`));
}

function newMessage({ time, msgType, senderLabel, senderJid, locationLabel, isOwner }) {

  const BOT_TAG = '[BOT REPLY] ';
  const isBotReply = String(msgType).startsWith(BOT_TAG);
  const judul = isBotReply ? 'B A L A S A N   B O T' : 'P E S A N   M A S U K';

  let isi = String(isBotReply ? msgType.slice(BOT_TAG.length) : msgType).replace(/\s+/g, ' ').trim();
  if (isi.length > 60) isi = isi.slice(0, 60) + '…';

  const nomor = String(senderJid || '').split('@')[0].split(':')[0];

  console.log(
    `${chalk.magentaBright('╭─ ')}${chalk.magentaBright.bold(`✿ ${judul} ✿`)}${chalk.magentaBright(' ─╮')}\n` +
    `${chalk.magentaBright('│')}\n` +
    `${chalk.magentaBright('├─ ')}${chalk.cyanBright('🍡 pesan   ')}${chalk.gray('›')} ${chalk.white(isi)}\n` +
    `${chalk.magentaBright('├─ ')}${chalk.greenBright('🎀 nama    ')}${chalk.gray('›')} ${chalk.white(senderLabel)}${chalk.gray(`  ${nomor}`)}\n` +
    `${chalk.magentaBright('├─ ')}${chalk.blueBright('🏡 tempat  ')}${chalk.gray('›')} ${locationLabel}\n` +
    `${chalk.magentaBright('├─ ')}${chalk.magentaBright('👑 owner   ')}${chalk.gray('›')} ${isOwner ? chalk.greenBright('iya~ ✨') : chalk.gray('bukan')}\n` +
    `${chalk.magentaBright('╰─ ')}${chalk.yellowBright('⏰ waktu   ')}${chalk.gray('›')} ${chalk.white(time)}\n`
  );
}

function autoJpmSkipped(reason) {
  console.log(chalk.yellow(`⚠️  ${reason}`));
}

function autoJpmFailed(gid, err) {
  console.error(chalk.red(`❌ Gagal kirim AutoJPM ke ${gid}:`), err);
}

function autoJpmError(err) {
  console.error(chalk.red('❌ AutoJpm Error:'), err);
}

export {
  banner,
  subBanner,
  section,
  info,
  success,
  warn,
  error,
  db,
  starting,
  systemInfo,
  ownerSetupInfo,
  pairingCode,
  connecting,
  connected,
  disconnected,
  loggedOut,
  reconnectFailed,
  reconnecting,
  newMessage,
  autoJpmSkipped,
  autoJpmFailed,
  autoJpmError,
};
