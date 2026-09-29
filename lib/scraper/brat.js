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

import fs from "fs";
import os from "os";
import path from "path";
import { createCanvas, loadImage, registerFont } from "canvas";

const BRAT_FONT_URL = "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Poppins.ttf";
let isFontLoaded = false;

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gagal download: ${res.status} ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

async function ensureFont() {
  if (isFontLoaded) return;
  const fontBuffer = await downloadBuffer(BRAT_FONT_URL);
  const fontPath = path.join(os.tmpdir(), "brat-poppins.ttf");
  fs.writeFileSync(fontPath, fontBuffer);
  registerFont(fontPath, { family: "Poppins" });
  isFontLoaded = true;
}

function tokenize(text) {
  return String(text || "")
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((w, i) => (i > 0 ? [{ type: "space" }, { type: "text", value: w }] : [{ type: "text", value: w }]));
}

function getTokenWidth(ctx, token) {
  return token.type === "space" ? ctx.measureText(" ").width : ctx.measureText(token.value).width;
}

function buildLines(ctx, tokens, fontSize, maxW, fontFamily) {
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  const lines = [];
  let line = [];
  let lineW = 0;

  for (const token of tokens) {
    const w = getTokenWidth(ctx, token);
    if (token.type === "space") {
      if (line.length > 0) { line.push({ ...token, w }); lineW += w; }
      continue;
    }
    if (line.length > 0 && lineW + w > maxW) {
      while (line.length && line[line.length - 1].type === "space") { lineW -= line.pop().w; }
      lines.push({ items: line, width: lineW });
      line = [{ ...token, w }];
      lineW = w;
    } else {
      line.push({ ...token, w });
      lineW += w;
    }
  }
  if (line.length) {
    while (line.length && line[line.length - 1].type === "space") { lineW -= line.pop().w; }
    lines.push({ items: line, width: lineW });
  }
  return lines;
}

/**
 * Render teks brat di atas warna solid (bratgreen) atau di atas gambar
 * template (bratgojo/bratvermeil/dst). Return PNG buffer.
 */
export async function drawBrat({
  text,
  bgUrl,
  bgColor,
  width,
  height,
  centerX,
  centerY,
  maxWidth,
  maxHeight,
  rotationAngle = 0,
  maxFontSize = 130,
  minFontSize = 10,
  fontDecrement = 2,
  lineHeightMult = 1.2,
  textColor = "#000000",
  fontFamily = "sans-serif",
  useCustomFont = false,
}) {
  let bg = null;
  if (bgUrl) {
    const bgBuffer = await downloadBuffer(bgUrl);
    bg = await loadImage(bgBuffer);
    width = width || bg.width;
    height = height || bg.height;
  }

  if (useCustomFont) await ensureFont();
  const font = useCustomFont ? "Poppins" : fontFamily;

  const canvas = createCanvas(width || 512, height || 512);
  const ctx = canvas.getContext("2d");

  if (bg) {
    ctx.drawImage(bg, 0, 0, width, height);
  } else if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  const tokens = tokenize(text);
  let fontSize = maxFontSize;
  let lines = buildLines(ctx, tokens, fontSize, maxWidth, font);
  while (fontSize > minFontSize) {
    lines = buildLines(ctx, tokens, fontSize, maxWidth, font);
    if (lines.length * fontSize * lineHeightMult <= maxHeight) break;
    fontSize -= fontDecrement;
  }

  const lineHeight = fontSize * lineHeightMult;
  const totalHeight = lines.length * lineHeight;
  const cx = typeof centerX === "function" ? centerX(width, height) : (centerX ?? width / 2);
  const cy = typeof centerY === "function" ? centerY(width, height) : (centerY ?? height / 2);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotationAngle);
  ctx.fillStyle = textColor;
  ctx.textBaseline = "middle";

  const startY = -(totalHeight / 2) + lineHeight / 2;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const y = startY + i * lineHeight;
    ctx.font = `bold ${fontSize}px ${font}`;
    let x = -line.width / 2;
    for (const token of line.items) {
      if (token.type === "text") { ctx.fillText(token.value, x, y); x += token.w; }
      else { x += token.w; }
    }
  }
  ctx.restore();
  return canvas.toBuffer("image/png");
}

// ── Template posisi untuk variant "brat karakter" (dari bratextra) ──
export const CHAR_TEMPLATES = {
  bratbahlil: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772229450331.jpeg",
    centerX: 460, centerY: 840, maxWidth: 660, maxHeight: 140, maxFontSize: 110, minFontSize: 40,
  },
  bratpatrick: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772794292812.jpeg",
    centerX: 460, centerY: 599, maxWidth: 260, maxHeight: 160, maxFontSize: 70, minFontSize: 8,
  },
  bratsquidward: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772794955890.jpeg",
    centerX: 370, centerY: 370, maxWidth: 230, maxHeight: 110, maxFontSize: 50, minFontSize: 10,
  },
  bratwhite: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771727655279.jpeg",
    centerX: (w) => w / 2 + 10, centerY: (w, h) => h / 2 + 285, maxWidth: 480, maxHeight: 280,
    rotationAngle: (-7.5 * Math.PI) / 180, maxFontSize: 130, minFontSize: 10,
  },
  bratchika: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771527351581.jpeg",
    centerX: 500, centerY: 810, maxWidth: 450, maxHeight: 250, maxFontSize: 75, minFontSize: 15,
  },
  bratkobato: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771728510134.jpeg",
    centerX: (w) => w / 2 + 175, centerY: (w, h) => h / 2 + 75, maxWidth: 350, maxHeight: 250, maxFontSize: 120, minFontSize: 10,
  },
  bratmenhera: {
    url: "https://c.termai.cc/i145/qJsN.jpg",
    centerX: (w) => w / 2 + 25, centerY: 260, maxWidth: 480, maxHeight: 310, maxFontSize: 400, minFontSize: 25,
  },
  bratnezuko: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772793912974.jpeg",
    centerX: (w) => w / 2, centerY: 1245, maxWidth: 820, maxHeight: 480, maxFontSize: 140, minFontSize: 20,
  },
  bratqiqi: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771532869746.jpeg",
    centerX: (w) => w / 2 + 5, centerY: (w, h) => h / 2 + 108, maxWidth: 210, maxHeight: 95,
    rotationAngle: (-7.5 * Math.PI) / 180, maxFontSize: 40, minFontSize: 5,
  },
  bratruromiya: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771827988894.jpeg",
    centerX: 810, centerY: 1310, maxWidth: 650, maxHeight: 450, maxFontSize: 120, minFontSize: 15,
  },
  bratumaru: {
    url: "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771524973616.jpeg",
    centerX: 375, centerY: 565, maxWidth: 450, maxHeight: 250, maxFontSize: 75, minFontSize: 15,
  },
};

// ── Template untuk variant lokal beresolusi tinggi (dari bratlocal) ──
export const HD_TEMPLATES = {
  bratvermeil: {
    url: "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Vermile.jpg",
    width: 1254, height: 1254, centerX: 637.5, centerY: 705.5, maxWidth: 711, maxHeight: 463, maxFontSize: 90, minFontSize: 22,
  },
  bratgojo: {
    url: "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Gojo.jpeg",
    width: 1254, height: 1254, centerX: 630, centerY: 810, maxWidth: 720, maxHeight: 520, maxFontSize: 90, minFontSize: 22,
  },
};
