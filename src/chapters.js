// "MM:SS" or "H:MM:SS" -> seconds (NaN if unparseable)
export const toSecs = (t) => {
  const parts = String(t || "").trim().split(":").map(Number);
  if (parts.length < 2 || parts.some(n => !Number.isFinite(n))) return NaN;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
};

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// YouTube only shows chapters when: first starts at 0:00, at least 3, each at least 10 s long.
export function chaptersText(chapters = []) {
  const rows = chapters
    .map(c => ({ s: toSecs(c.time), title: (c.title || "").trim() }))
    .filter(c => Number.isFinite(c.s) && c.title)
    .sort((a, b) => a.s - b.s);
  if (!rows.length) return "";
  rows[0].s = 0;
  const kept = [rows[0]];
  for (const c of rows.slice(1)) if (c.s - kept[kept.length - 1].s >= 10) kept.push(c);
  return kept.length >= 3 ? kept.map(c => `${fmt(c.s)} ${c.title}`).join("\n") : "";
}
