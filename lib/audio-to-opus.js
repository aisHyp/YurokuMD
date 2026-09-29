/*═══════════════════════════════════════════════════════
 *  ⚔  Lunar Saurus Empire
 *═══════════════════════════════════════════════════════
 *  🌐  Website     : https://saurusdev.cloud
 *  ⌨︎  Developer   : https://www.youtube.com/@sauruskinggwuw
 *  ▶︎  YouTube     : https://www.youtube.com/@sauruskinggwuw
 *  📡  Saluran WA  : https://whatsapp.com/channel/0029Vb8g2ZyH5JLykgHzVu2g
 *  ✈︎  Telegram    : @lordsaurus
 *
 *  ⚠︎  Mohon untuk tidak menghapus watermark ini
 *═══════════════════ © 2026 Lunar Saurus ─════════════════════
 */

import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { tmpdir } from 'os';
import Crypto from 'crypto';
import fs from 'fs-extra';

async function bufferToTmp(buffer, ext = '.bin') {
  const tmp = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + ext);
  await fs.writeFile(tmp, buffer);
  return tmp;
}

export async function AudioToOpus(buff) {
  const input = await bufferToTmp(buff, '.mp3');
  const output = path.join(tmpdir(), Crypto.randomBytes(6).toString('hex') + '.opus');

  await new Promise((resolve, reject) => {
    ffmpeg(input)
      .audioCodec('libopus')
      .audioBitrate(128)
      .format('opus')
      .save(output)
      .on('end', resolve)
      .on('error', reject);
  });

  const result = await fs.readFile(output);

  await fs.unlink(input).catch(() => {});
  await fs.unlink(output).catch(() => {});

  return result;
}

export default AudioToOpus;
