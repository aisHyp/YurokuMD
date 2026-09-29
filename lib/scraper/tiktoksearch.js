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

import axios from "axios";

const TTSEARCH_API = "https://api.nexray.eu.cc/search/tiktok?q=";

function normalizeUrl(url) {
  if (!url || typeof url !== "string") return null;
  const matches = url.match(/https?:\/\//g) || [];
  if (matches.length <= 1) return url;
  const lastIndex = url.lastIndexOf("http");
  return url.slice(lastIndex);
}

function normalizeNumber(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^0-9.KMB]/gi, "");
  const num = parseFloat(cleaned);
  if (!Number.isFinite(num)) return 0;
  const upper = String(value).toUpperCase();
  if (upper.includes("B")) return Math.round(num * 1_000_000_000);
  if (upper.includes("M")) return Math.round(num * 1_000_000);
  if (upper.includes("K")) return Math.round(num * 1_000);
  return Math.round(num);
}

function normalizeItem(item) {
  return {
    title: item?.title || "",
    cover: normalizeUrl(item?.cover),
    link: normalizeUrl(item?.data),
    music: normalizeUrl(item?.music_info?.url),
    duration: item?.duration || "",
    author: {
      nickname: item?.author?.nickname || item?.author?.fullname || "",
    },
    stats: {
      plays: normalizeNumber(item?.stats?.views),
      likes: normalizeNumber(item?.stats?.likes),
      comments: normalizeNumber(item?.stats?.comment),
    },
  };
}

export async function tiktokSearchVideo(query) {
  const { data } = await axios.get(`${TTSEARCH_API}${encodeURIComponent(query)}`, {
    timeout: 30000,
    headers: { "user-agent": "Mozilla/5.0" },
  });

  if (!data?.status || !Array.isArray(data?.result)) {
    throw new Error(data?.message || "TikTok search gagal");
  }

  return data.result.map(normalizeItem).filter((item) => item.link);
}
