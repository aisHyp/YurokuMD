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
import * as cheerio from "cheerio";

const LANG = "id";
const LIMIT = 5;
const BASE = `https://${LANG}.wikipedia.org`;
const API = `${BASE}/w/api.php`;
const UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

function decodeHtml(text) {
  return String(text || "")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanText(text) {
  return decodeHtml(text).replace(/<\/?[^>]+>/g, "").replace(/\[\d+\]/g, "").replace(/\[[a-z]\]/gi, "").replace(/\s+/g, " ").trim();
}

function cleanBlock(text) {
  return decodeHtml(text).replace(/<\/?[^>]+>/g, "").replace(/\[\d+\]/g, "").replace(/\[[a-z]\]/gi, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function fixUrl(url) {
  if (!url) return null;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${BASE}${url}`;
  return url;
}

async function searchWikipedia(query) {
  const { data } = await axios.get(API, {
    params: { action: "query", list: "search", srsearch: query, srlimit: LIMIT, format: "json", origin: "*" },
    headers: { "user-agent": UA, "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7" },
    timeout: 20000,
  });
  return data?.query?.search || [];
}

async function getFullArticle(title) {
  const pageUrl = `${BASE}/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`;
  const { data } = await axios.get(pageUrl, {
    headers: {
      "user-agent": UA,
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      "referer": "https://www.wikipedia.org/",
    },
    timeout: 20000,
  });

  const $ = cheerio.load(data);
  $("script, style, noscript, sup.reference, .mw-editsection, .navbox, .metadata, .ambox, .hatnote, .toc, #toc, table.vertical-navbox").remove();

  const pageTitle = cleanText($("#firstHeading").text()) || title;
  const description = cleanText($(".tagline").first().text()) || null;

  const introParagraphs = [];
  $(".mw-parser-output > section").first().find("p").each((_, el) => {
    const text = cleanBlock($(el).text());
    if (text.length > 40) introParagraphs.push(text);
  });
  if (!introParagraphs.length) {
    $(".mw-parser-output > p").each((_, el) => {
      const text = cleanBlock($(el).text());
      if (text.length > 40) introParagraphs.push(text);
    });
  }

  const infobox = {};
  $(".infobox tr").each((_, tr) => {
    const key = cleanText($(tr).find("th").first().text());
    const value = cleanText($(tr).find("td").first().text());
    if (key && value && key.length < 100) infobox[key] = value;
  });

  let image = null;
  $(".mw-parser-output img").each((_, img) => {
    if (image) return;
    const src = fixUrl($(img).attr("src"));
    if (!src || src.includes("static/images") || src.includes("Semi-protection") || src.includes("OOjs_UI")) return;
    image = src;
  });

  return {
    title: pageTitle,
    description,
    url: pageUrl,
    extract: introParagraphs.join("\n\n") || null,
    infobox,
    image,
  };
}

export async function wikipediaSearch(query) {
  const results = await searchWikipedia(query);
  if (!results.length) return null;
  return getFullArticle(results[0].title);
}
