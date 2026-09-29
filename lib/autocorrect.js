import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mainFilePath = path.join(__dirname, "..", "yuroku.js");

let cachedCommands = null;

export function getAllCommands() {
  if (cachedCommands) return cachedCommands;
  try {
    const src = fs.readFileSync(mainFilePath, "utf8");
    const set = new Set();
    const re = /case\s+['"]([a-zA-Z0-9_]+)['"]\s*:/g;
    let match;
    while ((match = re.exec(src)) !== null) {
      set.add(match[1].toLowerCase());
    }
    cachedCommands = [...set];
  } catch (e) {
    cachedCommands = [];
  }
  return cachedCommands;
}

export function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

export function suggestCommand(command) {
  if (!command || command.length < 2) return null;

  const all = getAllCommands();
  let bestMatch = null;
  let minDistance = Infinity;

  // Command pendek gampang "ketabrak" kata lain secara kebetulan,
  // jadi threshold jaraknya diperketat biar gak salah nebak.
  const typoThreshold = command.length <= 3 ? 1 : 2;
  const minSimilarity = 50; // di bawah ini dianggap gak relevan, jangan disaranin

  for (const cmd of all) {
    const distance = levenshtein(command, cmd);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = cmd;
    }
  }

  if (bestMatch && minDistance <= typoThreshold && minDistance > 0) {
    const similarity = Math.max(0, Math.min(100, Math.round(((command.length - minDistance) / command.length) * 100)));
    if (similarity < minSimilarity) return null;
    return { match: bestMatch, distance: minDistance, similarity };
  }
  return null;
}
