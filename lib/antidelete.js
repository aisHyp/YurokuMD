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

import { isToggleOn } from "./toggles.js";

const cache = new Map();
const MAX_CACHE = 500;

export function cacheIncoming(m) {
  if (!m.isGroup || !m.message || m.mtype === "protocolMessage") return;
  const key = `${m.chat}:${m.key.id}`;
  const text = m.text || m.message?.[m.mtype]?.caption || "";
  cache.set(key, { sender: m.sender, text, mtype: m.mtype, time: Date.now() });
  if (cache.size > MAX_CACHE) {
    cache.delete(cache.keys().next().value);
  }
}

export async function handleRevoke(russyuroku, m) {
  const revokedKey = m.message?.protocolMessage?.key;
  if (!revokedKey || !m.isGroup) return;
  if (!isToggleOn(m.chat, "antidelete")) return;

  const cacheKey = `${m.chat}:${revokedKey.id}`;
  const cached = cache.get(cacheKey);
  if (!cached) return;

  const deleterTag = `@${m.sender.split("@")[0]}`;
  const senderTag = `@${cached.sender.split("@")[0]}`;
  const isi = cached.text ? cached.text : `[pesan ${cached.mtype || "media"}]`;

  try {
    await russyuroku.sendMessage(
      m.chat,
      {
        text: `🗑️ *Antidelete*\nPesan dari ${senderTag} dihapus oleh ${deleterTag}:\n\n${isi}`,
        mentions: [cached.sender, m.sender],
      },
    );
  } catch (e) {}

  cache.delete(cacheKey);
}
