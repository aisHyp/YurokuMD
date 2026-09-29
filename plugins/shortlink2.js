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
 */

let handler = async (m, { text, example, axios }) => {
  if (!text) return example('linknya');
  if (!/^https?:\/\//i.test(text.trim())) return m.reply('Link tautan tidak valid');

  await m.reply(global.mess.wait);
  try {

    const { data } = await axios.get('https://is.gd/create.php', {
      params: { format: 'json', url: text.trim() },
      timeout: 20000,
    });
    if (!data?.shorturl) throw new Error(data?.errormessage || 'Gagal memendekkan link');
    m.reply(`* *Shortlink by is.gd*\n ${data.shorturl}`);
  } catch (e) {

    const msg = e?.response?.data?.errormessage || e.message;
    m.reply(`❌ Error! ${msg}`);
  }
};

handler.command = ['shortlink2'];
handler.tags = ['tools'];
handler.help = ['shortlink2 <link>'];

export default handler;
