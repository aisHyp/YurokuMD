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
 *  .akinator — Game tebak karakter ala Akinator.
 *  Balas pertanyaan dengan angka 1-5 (atau kata: ya/tidak/gatau/mungkin/mungkin tidak)
 *  di chat yang sama, TANPA perlu ketik prefix lagi.
 *
 *  .akinator batal — hentikan sesi yang sedang berjalan.
 *  .akinator balik — kembali ke pertanyaan sebelumnya.
 *
 *  Sesi disimpan per-chat (m.chat) di global.akinatorSessions, dan handler
 *  jawaban-tanpa-prefix di-hook langsung dari yuroku.js (lihat komentar
 *  "AKINATOR SESSION HOOK" di yuroku.js) supaya bisa jalan walau user tidak
 *  ketik ulang ".akinator" di setiap jawaban.
 */

import * as akinator from '../lib/scraper/akinator.js';
import { Button } from 'luoxy-baileys';

global.akinatorSessions = global.akinatorSessions || {};

const ANSWER_LABELS = [
    { keys: ['1', 'ya', 'y', 'iya', 'yes'], id: 0, label: 'Ya' },
    { keys: ['2', 'tidak', 't', 'no', 'nggak', 'ga', 'gak'], id: 1, label: 'Tidak' },
    { keys: ['3', 'gatau', 'ga tau', 'tidak tau', 'idk', 'kurang tau'], id: 2, label: 'Tidak Tahu' },
    { keys: ['4', 'mungkin', 'probably'], id: 3, label: 'Mungkin' },
    { keys: ['5', 'mungkin tidak', 'kayaknya tidak', 'probably not'], id: 4, label: 'Mungkin Tidak' },
];

const CONTROL_STOP = ['batal', 'stop', 'berhenti', 'cancel', 'keluar'];
const CONTROL_BACK = ['balik', 'kembali', 'back', 'undo'];

function matchAnswer(raw) {
    const t = String(raw || '').trim().toLowerCase();
    return ANSWER_LABELS.find((a) => a.keys.includes(t)) || null;
}

function questionText(session) {
    const progress = Math.min(100, Math.max(0, Math.round(session.progression || 0)));
    return (
        `🔮 *Pertanyaan ${session.step + 1}*\n\n` +
        `${session.question}\n\n` +
        `📊 Keyakinan: ${progress}%`
    );
}

async function sendQuestionCard(m, { russyuroku }, session) {
    try {
        await new Button(russyuroku)
            .text(questionText(session))
            .footer('Yuroku MD • Akinator')
            .addSelection('Pilih Jawaban', {})
            .makeSection('Jawaban')
            .makeRow('', '✅ Ya', 'Jawab: Ya', '1')
            .makeRow('', '❌ Tidak', 'Jawab: Tidak', '2')
            .makeRow('', '🤷 Tidak Tahu', 'Jawab: Tidak Tahu', '3')
            .makeRow('', '🤔 Mungkin', 'Jawab: Mungkin', '4')
            .makeRow('', '🙅 Mungkin Tidak', 'Jawab: Mungkin Tidak', '5')
            .makeSection('Kontrol Game')
            .makeRow('', '⬅️ Balik', 'Kembali ke pertanyaan sebelumnya', 'balik')
            .makeRow('', '🛑 Stop', 'Hentikan sesi Akinator', 'batal')
            .send(m.chat, { quoted: m });
    } catch (err) {

        await russyuroku.sendMessage(m.chat, {
            text:
                `${questionText(session)}\n\n` +
                `*1* Ya\n*2* Tidak\n*3* Tidak Tahu\n*4* Mungkin\n*5* Mungkin Tidak\n\n` +
                `Balas salah satu angka di atas (atau ketik "ya"/"tidak" dst).\n` +
                `Ketik *balik* untuk kembali, atau *batal* untuk menyudahi game.\n\n` +
                `(⚠️ Tombol gagal dikirim: ${err?.message || err})`,
        }, { quoted: m });
    }
}

export async function startSession(m, { russyuroku, prefix }) {
    await russyuroku.sendMessage(m.chat, { text: '🔮 Memulai Akinator... tunggu sebentar ya.' }, { quoted: m });

    let result;
    try {
        result = await akinator.start('characters', false);
    } catch (err) {
        return russyuroku.sendMessage(m.chat, {
            text: `❌ Gagal memulai Akinator: ${err?.message || err}`,
        }, { quoted: m });
    }

    if (!result.status) {
        return russyuroku.sendMessage(m.chat, { text: `❌ ${result.error}` }, { quoted: m });
    }

    global.akinatorSessions[m.chat] = {
        session: result.session,
        signature: result.signature,
        step: result.step,
        progression: result.progression,
        question: result.question,
        sid: result.sid,
        cookieJar: result.cookieJar,
        startedBy: m.sender,
        startedAt: Date.now(),
    };

    await sendQuestionCard(m, { russyuroku }, global.akinatorSessions[m.chat]);
}

export async function stopSession(m, { russyuroku }) {
    if (!global.akinatorSessions[m.chat]) {
        return russyuroku.sendMessage(m.chat, { text: '❌ Tidak ada sesi Akinator yang sedang berjalan di chat ini.' }, { quoted: m });
    }
    delete global.akinatorSessions[m.chat];
    return russyuroku.sendMessage(m.chat, { text: '✅ Game Akinator dihentikan.' }, { quoted: m });
}

export async function handleSessionReply(m, { russyuroku }) {
    const session = global.akinatorSessions[m.chat];
    if (!session) return false;

    const raw = String(m.text || '').trim();
    if (!raw) return false;
    const lower = raw.toLowerCase();

    if (CONTROL_STOP.includes(lower)) {
        await stopSession(m, { russyuroku });
        return true;
    }

    if (CONTROL_BACK.includes(lower)) {
        if (session.step <= 0) {
            await russyuroku.sendMessage(m.chat, { text: '❌ Sudah di pertanyaan pertama, tidak bisa balik lagi.' }, { quoted: m });
            return true;
        }
        let result;
        try {
            result = await akinator.back(session);
        } catch (err) {
            await russyuroku.sendMessage(m.chat, { text: `❌ Gagal kembali: ${err?.message || err}` }, { quoted: m });
            return true;
        }
        if (!result.status) {
            await russyuroku.sendMessage(m.chat, { text: `❌ ${result.error}` }, { quoted: m });
            return true;
        }
        Object.assign(session, result);
        await sendQuestionCard(m, { russyuroku }, session);
        return true;
    }

    const matched = matchAnswer(raw);
    if (!matched) {

        await russyuroku.sendMessage(m.chat, {
            text: `⚠️ Jawaban tidak dikenali. Balas dengan angka *1-5* atau kata ya/tidak/gatau/mungkin/mungkin tidak.\nKetik *balik* atau *batal* kalau perlu.`,
        }, { quoted: m });
        return true;
    }

    let result;
    try {
        result = await akinator.answer(session, matched.id);
    } catch (err) {
        await russyuroku.sendMessage(m.chat, { text: `❌ Gagal mengirim jawaban: ${err?.message || err}` }, { quoted: m });
        return true;
    }

    if (!result.status) {
        delete global.akinatorSessions[m.chat];
        await russyuroku.sendMessage(m.chat, { text: `❌ ${result.error}` }, { quoted: m });
        return true;
    }

    if (result.won) {
        delete global.akinatorSessions[m.chat];
        const caption =
            `🎉 *Akinator menebak...*\n\n` +
            `👤 *${result.name}*${result.pseudo ? ` (${result.pseudo})` : ''}\n` +
            `${result.description ? `\n${result.description}\n` : ''}\n` +
            `Ketik *.akinator* lagi untuk main sekali lagi.`;

        if (result.photo) {
            await russyuroku.sendMessage(m.chat, { image: { url: result.photo }, caption }, { quoted: m }).catch(async () => {
                await russyuroku.sendMessage(m.chat, { text: caption }, { quoted: m });
            });
        } else {
            await russyuroku.sendMessage(m.chat, { text: caption }, { quoted: m });
        }
        return true;
    }

    Object.assign(session, result);
    await sendQuestionCard(m, { russyuroku }, session);
    return true;
}

let handler = async (m, { russyuroku, prefix, text }) => {
    const sub = String(text || '').trim().toLowerCase();

    if (CONTROL_STOP.includes(sub)) {
        return stopSession(m, { russyuroku });
    }

    if (global.akinatorSessions[m.chat]) {
        return russyuroku.sendMessage(m.chat, {
            text: `⚠️ Masih ada sesi Akinator aktif di chat ini.\n\nBalas pertanyaan yang ada, ketik *balik* untuk mundur, atau *${prefix}akinator batal* untuk menyudahi dulu.`,
        }, { quoted: m });
    }

    return startSession(m, { russyuroku, prefix });
};

handler.command = ['akinator', 'aki'];
handler.tags = ['fun'];
handler.help = ['akinator', 'akinator batal'];

export default handler;
