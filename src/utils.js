import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const VENUE_QUESTIONS = [
  { id: "venueStyle", label: "Venue Style / Character", placeholder: "e.g. Rustic barn, grand manor, modern minimalist...", type: "text" },
  { id: "venueSetting", label: "Surrounding Setting & Scenery", placeholder: "e.g. Rolling Cotswold hills, woodland, lakeside...", type: "text" },
  { id: "venueLocation", label: "Town / Region", placeholder: "e.g. Tropea, Calabria, Italy", type: "text" },
  { id: "filmingHighlights", label: "Best Spots for Filming", placeholder: "e.g. Oak-lined driveway, walled garden, dramatic staircase...", type: "textarea" },
  { id: "lightingNotes", label: "Lighting Character", placeholder: "e.g. Flood of natural light, moody candlelit reception...", type: "text" },
  { id: "droneAccess", label: "Drone / Aerial Access", placeholder: "e.g. Full drone access, stunning aerial approach...", type: "text" },
  { id: "coupleType", label: "Typical Couple Vibe", placeholder: "e.g. Laid-back, romantic, fun & alternative...", type: "text" },
  { id: "standoutMemory", label: "A Standout or Memorable Moment", placeholder: "Share a specific story — a moment that made a wedding here unforgettable...", type: "textarea" },
  { id: "proTip", label: "Your Pro Videographer Tip", placeholder: "What advice would you give couples to get the most from filming here?", type: "textarea" },
  { id: "coupleNames", label: "Featured Couple's Names", placeholder: "e.g. Emily & James — leave blank to omit", type: "text" },
  { id: "coupleStory", label: "The Couple's Story", placeholder: "How they met, what friends and family said about them, what they're like together...", type: "textarea" },
  { id: "ceremonyDetails", label: "The Ceremony", placeholder: "Type of ceremony, who led it, readings, the walk down the aisle, what the vows focused on...", type: "textarea" },
  { id: "speechHighlights", label: "Best Lines from the Speeches & Vows", placeholder: "Short quotes worth using, with who said them (e.g. the best man, the bride's father)...", type: "textarea" },
  { id: "musicEntertainment", label: "Music & Entertainment", placeholder: "e.g. Live band with a sax player, first dance song, fireworks...", type: "text" },
  { id: "stylingDetails", label: "Styling, Flowers & Outfits", placeholder: "e.g. Wildflowers in glass bottles, strapless gown with cathedral veil, black tie...", type: "textarea" },
  { id: "venueWebsite", label: "Venue Website", placeholder: "https://www.venuename.co.uk — leave blank if unknown", type: "text" },
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
      model: "claude-sonnet-5",
      max_tokens: 16000, // Sonnet 5 thinks by default; thinking counts toward this
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }
  const data = await response.json();
  if (data.stop_reason === "refusal") throw new Error("Claude declined this request");
  // Replies start with a thinking block, so join the text blocks rather than reading content[0]
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  if (!text) throw new Error(`Claude returned no text (stop reason: ${data.stop_reason})`);
  return text;
}
