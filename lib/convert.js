import fs from 'fs'
import { tmpdir } from 'os'
import Crypto from 'crypto'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
import webp from 'node-webpmux'
import path from 'path'

const ffmpegPath = ffmpegInstaller.path
ffmpeg.setFfmpegPath(ffmpegPath)

function tmpFile(ext) {
  return path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.${ext}`)
}

function isWebpBuffer(media) {
  return Buffer.isBuffer(media) &&
    media.length > 12 &&
    media.slice(0, 4).toString('ascii') === 'RIFF' &&
    media.slice(8, 12).toString('ascii') === 'WEBP'
}

async function stripWebpExif(media) {
  const tmpIn = tmpFile('webp')
  const tmpOut = tmpFile('webp')
  try {
    fs.writeFileSync(tmpIn, media)
    const img = new webp.Image()
    await img.load(tmpIn)
    img.exif = null
    await img.save(tmpOut)
    return fs.readFileSync(tmpOut)
  } catch {
    return media
  } finally {
    try { if (fs.existsSync(tmpIn)) fs.unlinkSync(tmpIn) } catch {}
    try { if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut) } catch {}
  }
}

async function webpToVideo(media) {
  if (!Buffer.isBuffer(media) || media.length < 50) {
    throw new Error('Data media kosong atau terlalu kecil untuk diproses.')
  }
  if (!isWebpBuffer(media)) {
    throw new Error('Data yang diterima bukan file webp yang valid.')
  }

  const cleanMedia = await stripWebpExif(media)

  const tmpIn = tmpFile('webp')
  const tmpOut = tmpFile('mp4')
  fs.writeFileSync(tmpIn, cleanMedia)

  await new Promise((resolve, reject) => {
    ffmpeg(tmpIn)
      .on('error', reject)
      .on('end', () => resolve(true))
      .addOutputOptions([
        '-movflags', 'faststart',
        '-pix_fmt', 'yuv420p',
        '-vsync', '0',
        '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2'
      ])
      .toFormat('mp4')
      .save(tmpOut)
  })

  const buff = fs.readFileSync(tmpOut)
  fs.unlinkSync(tmpIn)
  fs.unlinkSync(tmpOut)
  return buff
}

async function videoToAudio(media, format = 'mp3') {
  if (!Buffer.isBuffer(media) || media.length < 50) {
    throw new Error('Data media kosong atau terlalu kecil untuk diproses.')
  }

  const tmpIn = tmpFile('mp4')
  const tmpOut = tmpFile(format)
  fs.writeFileSync(tmpIn, media)

  await new Promise((resolve, reject) => {
    ffmpeg(tmpIn)
      .on('error', reject)
      .on('end', () => resolve(true))
      .noVideo()
      .toFormat(format)
      .save(tmpOut)
  })

  const buff = fs.readFileSync(tmpOut)
  fs.unlinkSync(tmpIn)
  fs.unlinkSync(tmpOut)
  return buff
}

const AUDIO_EFFECTS = {
  bass: ['-af', 'equalizer=f=54:width_type=o:width=2:g=20'],
  blown: ['-af', 'acrusher=.1:1:64:0:log'],
  deep: ['-af', 'atempo=4/4,asetrate=44500*2/3'],
  earrape: ['-af', 'volume=12'],
  fast: ['-af', 'atempo=1.63,asetrate=44100'],
  fat: ['-af', 'atempo=1.6,asetrate=22100'],
  nightcore: ['-af', 'atempo=1.06,asetrate=44100*1.25'],
  reverse: ['-af', 'areverse'],
  robot: ['-af', "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75"],
  slow: ['-af', 'atempo=0.7,asetrate=44100'],
  tupai: ['-af', 'atempo=0.5,asetrate=65100'],
}

async function applyAudioEffect(media, effect, format = 'mp3') {
  if (!Buffer.isBuffer(media) || media.length < 50) {
    throw new Error('Data media kosong atau terlalu kecil untuk diproses.')
  }
  const opts = AUDIO_EFFECTS[effect]
  if (!opts) {
    throw new Error(`Efek "${effect}" tidak dikenali.`)
  }

  const tmpIn = tmpFile('mp3')
  const tmpOut = tmpFile(format)
  fs.writeFileSync(tmpIn, media)

  await new Promise((resolve, reject) => {
    ffmpeg(tmpIn)
      .on('error', reject)
      .on('end', () => resolve(true))
      .addOutputOptions(opts)
      .toFormat(format)
      .save(tmpOut)
  })

  const buff = fs.readFileSync(tmpOut)
  fs.unlinkSync(tmpIn)
  fs.unlinkSync(tmpOut)
  return buff
}

async function applyVolumeEffect(media, level = 5, format = 'mp3') {
  if (!Buffer.isBuffer(media) || media.length < 50) {
    throw new Error('Data media kosong atau terlalu kecil untuk diproses.')
  }
  const vol = Number(level)
  if (!vol || vol <= 0) {
    throw new Error('Level volume tidak valid.')
  }

  const tmpIn = tmpFile('mp3')
  const tmpOut = tmpFile(format)
  fs.writeFileSync(tmpIn, media)

  await new Promise((resolve, reject) => {
    ffmpeg(tmpIn)
      .on('error', reject)
      .on('end', () => resolve(true))
      .addOutputOptions(['-filter:a', `volume=${vol}`])
      .toFormat(format)
      .save(tmpOut)
  })

  const buff = fs.readFileSync(tmpOut)
  fs.unlinkSync(tmpIn)
  fs.unlinkSync(tmpOut)
  return buff
}

async function hdVideo(media) {
  if (!Buffer.isBuffer(media) || media.length < 50) {
    throw new Error('Data media kosong atau terlalu kecil untuk diproses.')
  }

  const tmpIn = tmpFile('mp4')
  const tmpOut = tmpFile('mp4')
  try {
    fs.writeFileSync(tmpIn, media)
    await new Promise((resolve, reject) => {
      ffmpeg(tmpIn)
        .on('error', reject)
        .on('end', () => resolve(true))
        .addOutputOptions([
          '-c:v', 'libx264',
          '-crf', '20',
          '-preset', 'medium',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-vf', "scale='min(720,iw)':-2",
          '-pix_fmt', 'yuv420p',
          '-movflags', 'faststart'
        ])
        .toFormat('mp4')
        .save(tmpOut)
    })
    return fs.readFileSync(tmpOut)
  } finally {
    try { fs.existsSync(tmpIn) && fs.unlinkSync(tmpIn) } catch {}
    try { fs.existsSync(tmpOut) && fs.unlinkSync(tmpOut) } catch {}
  }
}

export { webpToVideo, videoToAudio, applyAudioEffect, applyVolumeEffect, isWebpBuffer, hdVideo }
