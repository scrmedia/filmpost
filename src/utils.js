import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const VENUE_QUESTIONS = [
  { id: "venueStyle", label: "Venue Style / Character", placeholder: "e.g. Rustic barn, grand manor, modern minimalist...", type: "text" },
  { id: "venueSetting", label: "Surrounding Setting & Scenery", placeholder: "e.g. Rolling Cotswold hills, woodland, lakeside...", type: "text" },
  { id: "filmingHighlights", label: "Best Spots for Filming", placeholder: "e.g. Oak-lined driveway, walled garden, dramatic staircase...", type: "textarea" },
  { id: "lightingNotes", label: "Lighting Character", placeholder: "e.g. Flood of natural light, moody candlelit reception...", type: "text" },
  { id: "droneAccess", label: "Drone / Aerial Access", placeholder: "e.g. Full drone access, stunning aerial approach...", type: "text" },
  { id: "coupleType", label: "Typical Couple Vibe", placeholder: "e.g. Laid-back, romantic, fun & alternative...", type: "text" },
  { id: "standoutMemory", label: "A Standout or Memorable Moment", placeholder: "Share a specific story — a moment that made a wedding here unforgettable...", type: "textarea" },
  { id: "proTip", label: "Your Pro Videographer Tip", placeholder: "What advice would you give couples to get the most from filming here?", type: "textarea" },
  { id: "coupleNames", label: "Featured Couple's Names", placeholder: "e.g. Emily & James — leave blank to omit", type: "text" },
];

export function buildBusinessFooter(user) {
  const lines = [];
  lines.push(`${user.business_name}`);
  if (user.tagline) lines.push(user.tagline);
  lines.push("");
  if (user.enquiry_email) lines.push(`Enquiries: ${user.enquiry_email}`);
  if (user.website) lines.push(`${user.website}`);
  if (user.instagram) lines.push(`Instagram: instagram.com/${user.instagram.replace(/^@/, "")}`);
  if (user.tiktok) lines.push(`TikTok: @${user.tiktok.replace(/^@/, "")}`);
  if (user.facebook) lines.push(`Facebook: ${user.facebook}`);
  lines.push("");
  lines.push("—");
  lines.push(`To enquire about having ${user.business_name} film your wedding, visit our website or drop us an email.`);
  return lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");
}

export async function callClaude(systemPrompt, userPrompt) {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }
  const data = await response.json();
  return data.content?.[0]?.text || "";
}
