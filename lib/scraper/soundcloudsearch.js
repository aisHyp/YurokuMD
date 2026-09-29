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

import { load } from "cheerio";

export async function soundcloudSearch(q) {
  const url = "https://m.soundcloud.com/search?q=" + encodeURIComponent(q);
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  const html = await res.text();
  const $ = load(html);
  const jsonText = $("#__NEXT_DATA__").text();
  if (!jsonText) return [];
  const json = JSON.parse(jsonText);

  const tracks = json?.props?.pageProps?.initialStoreState?.entities?.tracks;
  if (!tracks) return [];

  return Object.values(tracks)
    .filter((v) => v && v.data && v.data.title)
    .map((v) => {
      const d = v.data;
      return {
        title: d.title || "-",
        url: d.permalink_url || "-",
        artwork: d.artwork_url || null,
        plays: d.playback_count || 0,
        likes: d.likes_count || 0,
        comments: d.comment_count || 0,
        reposts: d.reposts_count || 0,
      };
    });
}
