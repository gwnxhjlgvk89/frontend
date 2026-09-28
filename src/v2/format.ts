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
