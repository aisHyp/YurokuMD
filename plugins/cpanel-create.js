/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  ⚔️  Lunar Saurus Empire  ⚔️
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  🌍 Site     : https://saurusdev.cloud
 *  📺 YouTube  : https://www.youtube.com/@sauruskinggwuw
 *  📢 Channel  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *  💬 Telegram : @lordsaurus
 *
 *  ⚠️ Watermark ini wajib tetap ada.
 *━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  Buat panel Pterodactyl: .1gb .. .10gb .unli
 *  Format : .<paket> username|628xxx|hari
 *  Akses  : khusus Premium & Owner
 */
import crypto from 'crypto';
import {
  ensureDB, loadUsersDB, saveUsersDB, upsertPanel, normalizePhone, toServerName,
  DAY_MS, apiGET, apiPOST, apiErrorText, getServerAllocations, guardPanel, panelActor,
} from '../lib/cpanelHelper.js';

const specs = {};
for (let n = 1; n <= 10; n++) {
  specs[`${n}gb`] = { ram: n * 1024, disk: n * 5120, cpu: 100 + (n - 1) * 50 };
}
specs.unlimited = { ram: 0, disk: 51200, cpu: 0 };
specs.unli = { ram: 0, disk: 51200, cpu: 0 };

const fmt = (mb) => (mb === 0 ? 'Unlimited' : `${(mb / 1024).toFixed(1)}GB`);

let handler = async (m, { russyuroku, command, text, prefix, isCreator, senderPnJid }) => {
  const cmd = String(command || '').toLowerCase();
  const spec = specs[cmd];
  if (!spec) return;

  const tolak = guardPanel(m, { isCreator, senderPnJid });
  if (tolak) return m.reply(tolak);

  if (!text || !text.includes('|')) {
    return m.reply(`Format salah. Contoh penggunaan:\n${prefix}${cmd} username|628xxx|30`);
  }

  ensureDB();
  const { domain, nestid, egg, loc } = global;
  const [usernameRaw, nomorRaw, hariRaw] = text.split('|').map((v) => (v || '').trim());

  const username = String(usernameRaw || '').toLowerCase();
  const phone = normalizePhone(nomorRaw);
  const days = parseInt(hariRaw, 10);

  if (isNaN(days) || days <= 0 || days > 365) {
    return m.reply('Durasi tidak valid. Silakan masukkan angka antara 1 hingga 365 hari.');
  }
  if (!/^[a-z0-9]{3,15}$/.test(username)) {
    return m.reply('Username tidak memenuhi syarat. Hanya diperbolehkan huruf kecil dan angka dengan panjang 3-15 karakter.');
  }
  if (!phone || phone.length < 10) return m.reply('Format nomor tujuan tidak valid.');

  try {
    await m.reply('Sedang memproses pembuatan panel. Mohon tunggu sebentar...');

    const allocations = await getServerAllocations(loc);
    const defaultAllocation = allocations[0]?.attributes?.id ?? null;

    let usersDB = loadUsersDB();
    let userEntry = usersDB.find((u) => String(u.phone) === String(phone));

    if (userEntry) {
      const cek = await apiGET(`/users/${userEntry.userId}`);
      if (!cek.ok) {

        if (cek.status !== 404) return m.reply(`Gagal memeriksa akun panel.\nDetail: ${apiErrorText(cek)}`);
        usersDB = usersDB.filter((u) => String(u.phone) !== String(phone));
        saveUsersDB(usersDB);
        userEntry = null;
      }
    }

    let panelUser;
    let password;

    if (!userEntry) {
      password = username + crypto.randomBytes(2).toString('hex');

      const cekNama = await apiGET(`/users?filter[username]=${encodeURIComponent(username)}`);
      if (cekNama.ok && cekNama.data?.data?.length > 0) {
        const u = cekNama.data.data[0].attributes;
        return m.reply(`Username ${u.username} telah digunakan oleh email ${u.email}. Silakan pilih username yang berbeda.`);
      }

      const buatUser = await apiPOST('/users', {
        email: `${username}@gmail.com`,
        username,
        first_name: toServerName(username),
        last_name: 'USER',
        password,
      });
      if (!buatUser.ok) return m.reply(`Pembuatan user gagal.\nDetail: ${apiErrorText(buatUser)}`);

      panelUser = buatUser.data?.attributes || buatUser.data?.data?.attributes || buatUser.data;

      userEntry = {
        phone,
        userId: panelUser.id,
        username: panelUser.username,
        email: panelUser.email,
        password,
        createdAt: Date.now(),
      };
      usersDB = loadUsersDB();
      usersDB.push(userEntry);
      saveUsersDB(usersDB);
    } else {
      panelUser = { id: userEntry.userId, username: userEntry.username, email: userEntry.email };
      password = userEntry.password;
    }

    const realUserId = panelUser.id || panelUser.attributes?.id;
    if (!realUserId) return m.reply('Terjadi kesalahan sistem saat membaca ID User dari panel.');

    const eggRes = await apiGET(`/nests/${nestid}/eggs/${egg}`);
    if (!eggRes.ok) {
      return m.reply(`Pengambilan data egg gagal. Pastikan Egg ID (${egg}) dan Nest ID (${nestid}) benar.`);
    }
    const startupCmd = eggRes.data?.attributes?.startup || 'npm start';
    const dockerImage = eggRes.data?.attributes?.docker_image || 'ghcr.io/parkervcp/yolks:nodejs_20';

    const payload = {
      name: toServerName(username),
      description: `Server dibuat pada ${new Date().toLocaleDateString('id-ID')}`,
      user: realUserId,
      egg: parseInt(egg, 10),
      docker_image: dockerImage,
      startup: startupCmd,
      environment: { INST: 'npm install', USER_UPLOAD: '0', AUTO_UPDATE: '0', CMD_RUN: 'npm start' },
      limits: {
        memory: spec.ram === 0 ? null : spec.ram,
        swap: 0,
        disk: spec.disk,
        io: 500,
        cpu: spec.cpu === 0 ? null : spec.cpu,
      },
      feature_limits: { databases: 5, backups: 5, allocations: 5 },
      deploy: { locations: [parseInt(loc, 10)], dedicated_ip: false, port_range: [] },
    };
    if (defaultAllocation) payload.allocation = { default: defaultAllocation };

    const buatServer = await apiPOST('/servers', payload);
    if (!buatServer.ok) return m.reply(`Pembuatan server gagal.\nDetail: ${apiErrorText(buatServer)}`);

    const server = buatServer.data.attributes;
    const now = Date.now();
    const expiresAt = now + days * DAY_MS;

    upsertPanel(server.id, {
      serverId: server.id,
      name: server.name,
      owner: phone,
      username: panelUser.username,
      email: panelUser.email,
      reseller: panelActor(m, senderPnJid),
      expiresAt,
      suspended: false,
      created: now,
      lastRenewed: now,
      notified: false,
      spec: { ram: spec.ram, disk: spec.disk, cpu: spec.cpu, type: cmd },
    });

    const expiryDate = new Date(expiresAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const teks = `╭─⬣「 INFORMASI PANEL 」⬣
│
├─ Detail Akun
│  ├─ 👤 Username: ${panelUser.username}
│  ├─ 🔑 Password: ${password}
│  └─ 🌐 Halaman Login: ${domain}
│
├─ Spesifikasi Layanan
│  ├─ 💾 RAM: ${fmt(spec.ram)}
│  ├─ 💽 Disk: ${fmt(spec.disk)}
│  └─ ⚡ CPU: ${spec.cpu === 0 ? 'Unlimited' : spec.cpu + '%'}
│
├─ Detail Server
│  ├─ 🏷️ Nama: ${server.name}
│  ├─ 🆔 Server ID: ${server.id}
│  ├─ ⏰ Durasi Sewa: ${days} Hari
│  └─ 📅 Tanggal Expired: ${expiryDate}
│
╰─⬣

⚠️ Syarat & Ketentuan Berlaku:
- Dilarang menyebarkan atau menampilkan tautan panel kepada publik.
- Jika melakukan tangkapan layar, tautan panel wajib disensor.
- Harap menjaga kerahasiaan data panel Anda untuk menghindari penyalahgunaan.
- Garansi hanya diproses jika seluruh syarat dan ketentuan terpenuhi.
- Dilarang keras menggunakan layanan untuk aktivitas ilegal.`;

    if (m.isGroup) await m.reply('Panel berhasil dibuat. Data login telah dikirimkan ke nomor yang didaftarkan.');

    try {
      await russyuroku.sendMessage(`${phone}@s.whatsapp.net`, { text: teks }, { quoted: m });
      if (!m.isGroup) await m.reply(`✅ Panel berhasil dibuat & data login dikirim ke ${phone}.`);
    } catch (e) {
      console.error('Gagal mengirim data login ke target:', e);

      await m.reply(`Panel berhasil dibuat, namun pengiriman data login ke nomor ${phone} gagal.\nPastikan nomor tersebut terdaftar di WhatsApp. Data login:\n\n${teks}`);
    }
  } catch (err) {
    console.error('Kesalahan pembuatan panel:', err);
    m.reply(`Terjadi kesalahan sistem saat memproses panel.\n${err?.message || err}`);
  }
};

handler.command = [...Object.keys(specs)];
handler.tags = ['cpanel'];
handler.help = ['1gb', '2gb', '3gb', '4gb', '5gb', '6gb', '7gb', '8gb', '9gb', '10gb', 'unli'];
handler.premium = true;

export default handler;
