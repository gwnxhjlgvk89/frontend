import type { IconName } from "./icons";
import type { Club } from "./types";

// Category colors carry one meaning only: which category a club belongs to.
const tones = [
  { bg: "#EDF2FF", fg: "#2A5EE8" },
  { bg: "#F3EDFF", fg: "#6B3FD6" },
  { bg: "#E8F6EF", fg: "#087A54" },
  { bg: "#FFF1EC", fg: "#C63D17" },
  { bg: "#FDEDF5", fg: "#B4236E" },
  { bg: "#E6F6F8", fg: "#0B7285" },
  { bg: "#FFF4E5", fg: "#9A5200" },
  { bg: "#EEF0FA", fg: "#3F4AA8" },
];
export function categoryTone(category: string) {
  let hash = 0;
  for (const ch of category || "社团") hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return tones[hash % tones.length];
}
// Line icons for common club categories; unknown categories fall back to the initial.
const categoryIcons: [RegExp, IconName][] = [
  [/摄影|影像|摄像/, "camera"],
  [/羽毛球/, "feather"],
  [/篮球|足球|排球|网球|乒乓|球/, "dribbble"],
  [/合唱|音乐|乐团|吉他|声乐|歌/, "music"],
  [/机器人|科技|电子|创客/, "bot"],
  [/编程|计算机|程序|算法/, "code"],
  [/街舞|舞/, "footprints"],
  [/志愿|公益|服务/, "heart-handshake"],
  [/文学|读书|阅读|诗/, "book-open"],
  [/美术|绘画|书法|设计/, "palette"],
  [/主持|演讲|辩论|广播/, "mic"],
  [/戏剧|话剧|动漫|cos/i, "drama"],
  [/竞赛|运动|健身|武术|跑/, "trophy"],
];
export function categoryIcon(category: string) {
  return categoryIcons.find(([re]) => re.test(category || ""))?.[1];
}
export function initial(name?: string, fallback = "社") {
  return Array.from((name || "").trim() || fallback)[0];
}
export function eligibleFor(club: Club, major?: string) {
  return !club.allowed_majors.length || club.allowed_majors.includes(major || "");
}
// A club counts as nearly full once its last 10% (at least 3 seats) remain.
export function isScarce(remaining: number, capacity: number) {
  return remaining > 0 && remaining <= Math.max(3, Math.ceil(capacity * 0.1));
}
const pad = (n: number) => String(n).padStart(2, "0");
export function formatTime(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(Date.parse(iso));
  return `${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export function splitDuration(ms: number) {
  const sec = Math.max(0, Math.ceil(ms / 1000));
  return {
    days: Math.floor(sec / 86400),
    hours: pad(Math.floor((sec % 86400) / 3600)),
    minutes: pad(Math.floor((sec % 3600) / 60)),
    seconds: pad(sec % 60),
  };
}
// Same rule as the backend's normalize_label: majors and classes are compared
// verbatim, so drop all whitespace and use full-width parentheses.
export function normalizeLabel(value?: string) {
  return (value || "")
    .replace(/\s+/g, "")
    .replace(/\(/g, "（")
    .replace(/\)/g, "）");
}
// Existing values containing the typed text, most common first; nothing once it matches exactly.
export function matchOptions<T extends { name: string }>(
  options: T[],
  query: string,
  limit = 6,
) {
  const q = normalizeLabel(query);
  if (!q || options.some((o) => o.name === q)) return [];
  return options.filter((o) => o.name.includes(q)).slice(0, limit);
}
