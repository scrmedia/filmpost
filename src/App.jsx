import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// ── Supabase client ───────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0a; --deep: #111111; --surface: #191919; --border: #2a2a2a;
    --muted: #3a3a3a; --text-dim: #888; --text: #d4cfc9; --text-bright: #f5f0eb;
    --gold: #c9a96e; --gold-dim: #8a6f42; --red: #c0392b; --green: #27ae60; --amber: #e67e22; --radius: 4px;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--text); min-height: 100vh; font-size: 14px; line-height: 1.6; }
  h1, h2, h3 { font-family: 'Cormorant Garamond', serif; font-weight: 300; letter-spacing: 0.02em; }
  .app { display: flex; flex-direction: column; min-height: 100vh; }
  .header { display: flex; align-items: center; justify-content: space-between; padding: 20px 40px; border-bottom: 1px solid var(--border); background: var(--black); position: sticky; top: 0; z-index: 100; }
  .logo { display: flex; align-items: baseline; gap: 10px; }
  .logo-mark { width: 28px; height: 28px; border: 1px solid var(--gold); display: flex; align-items: center; justify-content: center; }
  .logo-text { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 400; color: var(--text-bright); letter-spacing: 0.1em; }
  .logo-sub { font-size: 11px; color: var(--text-dim); letter-spacing: 0.2em; text-transform: uppercase; }
  .header-actions { display: flex; align-items: center; gap: 16px; }
  .user-chip { font-size: 12px; color: var(--text-dim); padding: 6px 12px; border: 1px solid var(--border); letter-spacing: 0.05em; }
  .main { flex: 1; display: flex; }
  .sidebar { width: 220px; min-height: calc(100vh - 65px); border-right: 1px solid var(--border); padding: 32px 0; flex-shrink: 0; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 24px; font-size: 13px; color: var(--text-dim); cursor: pointer; transition: all 0.15s; letter-spacing: 0.03em; border-left: 2px solid transparent; }
  .nav-item:hover { color: var(--text); background: rgba(255,255,255,0.02); }
  .nav-item.active { color: var(--gold); border-left-color: var(--gold); background: rgba(201,169,110,0.04); }
  .nav-section { padding: 20px 24px 8px; font-size: 10px; color: var(--muted); letter-spacing: 0.2em; text-transform: uppercase; }
  .content { flex: 1; padding: 40px; max-width: 860px; }
  .page-title { font-size: 36px; color: var(--text-bright); margin-bottom: 6px; }
  .page-subtitle { font-size: 14px; color: var(--text-dim); margin-bottom: 40px; }
  .card { background: var(--surface); border: 1px solid var(--border); padding: 28px; margin-bottom: 20px; }
  .card-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--text-bright); margin-bottom: 16px; }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.05em; cursor: pointer; transition: all 0.15s; border: none; text-transform: uppercase; }
  .btn-primary { background: var(--gold); color: var(--black); }
  .btn-primary:hover { background: #d4b47a; }
  .btn-primary:disabled { background: var(--muted); color: var(--text-dim); cursor: not-allowed; }
  .btn-ghost { background: transparent; color: var(--text); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--text-dim); }
  .btn-sm { padding: 6px 14px; font-size: 12px; }
  .field { margin-bottom: 20px; }
  .field-hint { font-size: 11px; color: var(--text-dim); margin-top: 5px; }
  .label { display: block; font-size: 12px; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
  .label-opt { font-size: 10px; color: var(--muted); margin-left: 6px; letter-spacing: 0.05em; }
  .input, .textarea { width: 100%; background: var(--deep); border: 1px solid var(--border); color: var(--text); padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.15s; border-radius: var(--radius); }
  .input:focus, .textarea:focus { border-color: var(--gold-dim); }
  .textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
  .input::placeholder, .textarea::placeholder { color: var(--muted); }
  .input-prefix { display: flex; align-items: center; background: var(--deep); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .input-prefix span { padding: 10px 12px; color: var(--muted); font-size: 13px; border-right: 1px solid var(--border); white-space: nowrap; flex-shrink: 0; }
  .input-prefix .input { border: none; border-radius: 0; }
  .input-prefix .input:focus { border: none; outline: none; }
  .drop-zone { border: 1px dashed var(--muted); padding: 60px 40px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--deep); }
  .drop-zone:hover, .drop-zone.drag-over { border-color: var(--gold-dim); background: rgba(201,169,110,0.03); }
  .drop-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.4; }
  .drop-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: var(--text-bright); margin-bottom: 8px; }
  .drop-sub { font-size: 13px; color: var(--text-dim); }
  .file-selected { border-style: solid; border-color: var(--gold-dim); background: rgba(201,169,110,0.05); }
  .steps { display: flex; align-items: center; margin-bottom: 40px; }
  .step { display: flex; align-items: center; gap: 10px; }
  .step-num { width: 28px; height: 28px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--text-dim); flex-shrink: 0; }
  .step.active .step-num { border-color: var(--gold); color: var(--gold); }
  .step.done .step-num { background: var(--gold); color: var(--black); border-color: var(--gold); }
  .step-label { font-size: 12px; color: var(--text-dim); letter-spacing: 0.05em; white-space: nowrap; }
  .step.active .step-label { color: var(--text-bright); }
  .step-line { flex: 1; height: 1px; background: var(--border); margin: 0 12px; min-width: 20px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--muted); font-size: 12px; color: var(--text-dim); border-radius: 2px; }
  .tag-gold { background: rgba(201,169,110,0.15); color: var(--gold); }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
  .status-dot.green { background: var(--green); }
  .status-dot.red { background: var(--red); }
  .status-dot.amber { background: var(--amber); }
  .yt-progress { height: 4px; background: var(--border); border-radius: 2px; margin-top: 8px; overflow: hidden; }
  .yt-progress-bar { height: 100%; background: var(--gold); transition: width 0.3s; }
  .alert { padding: 14px 18px; border-left: 3px solid; margin-bottom: 20px; font-size: 13px; }
  .alert-info { border-color: var(--gold); background: rgba(201,169,110,0.06); color: var(--text); }
  .alert-error { border-color: var(--red); background: rgba(192,57,43,0.06); color: var(--text); }
  .spinner { width: 18px; height: 18px; border: 2px solid var(--muted); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border); }
  .settings-row:last-child { border-bottom: none; }
  .settings-key { font-size: 13px; color: var(--text-bright); }
  .settings-val { font-size: 12px; color: var(--text-dim); font-family: monospace; }
  .connected { color: var(--green); font-size: 12px; display: flex; align-items: center; gap: 6px; }
  .not-connected { color: var(--red); font-size: 12px; display: flex; align-items: center; gap: 6px; }
  .post-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border); }
  .post-row:last-child { border-bottom: none; }
  .post-title-text { font-size: 14px; color: var(--text-bright); margin-bottom: 4px; }
  .post-meta { font-size: 12px; color: var(--text-dim); }
  .onboard-wrap { max-width: 520px; margin: 60px auto; }
  .onboard-logo { text-align: center; margin-bottom: 48px; }
  .onboard-logo h1 { font-size: 48px; color: var(--text-bright); }
  .onboard-logo p { color: var(--text-dim); font-size: 14px; margin-top: 8px; }
  .onboard-step { font-size: 11px; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; }
  .divider { height: 1px; background: var(--border); margin: 24px 0; }
  .loading-overlay { position: fixed; inset: 0; background: rgba(10,10,10,0.92); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1000; gap: 20px; }
  .loading-overlay .spinner { width: 40px; height: 40px; border-width: 3px; }
  .loading-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--text-bright); }
  .loading-sub { font-size: 13px; color: var(--text-dim); }
  .char-count { font-size: 11px; color: var(--text-dim); text-align: right; margin-top: 4px; }
  .tabs { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
  .tab { padding: 10px 20px; font-size: 13px; color: var(--text-dim); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s; letter-spacing: 0.03em; }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--gold); border-bottom-color: var(--gold); }
  .success-icon { font-size: 64px; text-align: center; margin-bottom: 20px; }
  .success-links { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
  .success-link { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: var(--deep); border: 1px solid var(--border); text-decoration: none; color: var(--text); transition: border-color 0.15s; }
  .success-link:hover { border-color: var(--gold-dim); }
  .success-link-label { font-size: 12px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; }
  .success-link-url { font-size: 13px; color: var(--gold); margin-top: 2px; }
  .preview-label { font-size: 11px; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px; }
  .profile-preview { background: var(--deep); border: 1px solid var(--border); padding: 16px; margin-top: 16px; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--muted); }
  @media (max-width: 768px) { .sidebar { display: none; } .header { padding: 16px 20px; } .content { padding: 24px 20px; } .grid-2 { grid-template-columns: 1fr; } }
`;

const VENUE_QUESTIONS = [
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

function buildBusinessFooter(user) {
  const lines = [];
  lines.push(`📽 ${user.business_name}`);
  if (user.tagline) lines.push(user.tagline);
  lines.push("");
  if (user.enquiry_email) lines.push(`📩 Enquiries: ${user.enquiry_email}`);
  if (user.website) lines.push(`🌐 ${user.website}`);
  if (user.instagram) lines.push(`📸 Instagram: instagram.com/${user.instagram.replace(/^@/, "")}`);
  if (user.tiktok) lines.push(`🎵 TikTok: @${user.tiktok.replace(/^@/, "")}`);
  if (user.facebook) lines.push(`👍 Facebook: ${user.facebook}`);
  lines.push("");
  lines.push("—");
  lines.push(`To enquire about having ${user.business_name} film your wedding, visit our website or drop us an email.`);
  return lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");
}

async function callClaude(systemPrompt, userPrompt) {
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

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Arrow: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Settings: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  History: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Logout: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  External: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  YouTube: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>,
};

// ── Business Profile Fields ───────────────────────────────────────────────────
function BusinessProfileFields({ form, update }) {
  const previewFooter = buildBusinessFooter(form);
  return (
    <>
      <div className="field">
        <label className="label">Business Tagline <span className="label-opt">optional</span></label>
        <input className="input" value={form.tagline || ""} onChange={e => update("tagline", e.target.value)} placeholder="e.g. Cinematic wedding films across the UK & Europe" />
      </div>
      <div className="grid-2">
        <div className="field">
          <label className="label">Enquiry Email</label>
          <input className="input" type="email" value={form.enquiry_email || ""} onChange={e => update("enquiry_email", e.target.value)} placeholder="info@yourdomain.com" />
        </div>
        <div className="field">
          <label className="label">Website <span className="label-opt">optional</span></label>
          <input className="input" value={form.website || ""} onChange={e => update("website", e.target.value)} placeholder="https://www.yourdomain.com" />
        </div>
      </div>
      <div className="grid-2">
        <div className="field">
          <label className="label">Instagram <span className="label-opt">optional</span></label>
          <div className="input-prefix"><span>@</span><input className="input" value={form.instagram || ""} onChange={e => update("instagram", e.target.value)} placeholder="yourhandle" /></div>
        </div>
        <div className="field">
          <label className="label">TikTok <span className="label-opt">optional</span></label>
          <div className="input-prefix"><span>@</span><input className="input" value={form.tiktok || ""} onChange={e => update("tiktok", e.target.value)} placeholder="yourhandle" /></div>
        </div>
      </div>
      <div className="field">
        <label className="label">Facebook Page URL <span className="label-opt">optional</span></label>
        <input className="input" value={form.facebook || ""} onChange={e => update("facebook", e.target.value)} placeholder="https://www.facebook.com/yourpage" />
      </div>
      {(form.enquiry_email || form.instagram || form.website) && (
        <div className="profile-preview">
          <div style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>YouTube Footer Preview</div>
          <pre style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, whiteSpace: "pre-wrap", color: "var(--text-dim)" }}>{previewFooter}</pre>
        </div>
      )}
    </>
  );
}

// ── Onboarding ────────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "", business_name: "",
    tagline: "", enquiry_email: "", website: "", instagram: "", tiktok: "", facebook: "",
    wp_url: "", wp_user: "", wp_pass: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const finish = async () => {
    setLoading(true); setError("");
    try {
      // Check email not already used
      const { data: existing } = await supabase.from("users").select("id").eq("email", form.email).single();
      if (existing) { setError("An account with that email already exists"); setLoading(false); return; }

      const hashedPassword = await bcrypt.hash(form.password, 10);
      const { data, error: insertError } = await supabase.from("users").insert([{
        email: form.email, password: hashedPassword, name: form.name,
        business_name: form.business_name, tagline: form.tagline,
        enquiry_email: form.enquiry_email, website: form.website,
        instagram: form.instagram.replace(/^@/, ""),
        tiktok: form.tiktok.replace(/^@/, ""),
        facebook: form.facebook, wp_url: form.wp_url,
        wp_user: form.wp_user, wp_pass: form.wp_pass,
      }]).select().single();

      if (insertError) throw insertError;
      localStorage.setItem("filmpost_session", JSON.stringify({ userId: data.id, email: data.email }));
      onComplete(data);
    } catch (e) { setError(e.message || "Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div className="onboard-wrap">
        <div className="onboard-logo"><h1>FilmPost</h1><p>Publish wedding films and blog posts in minutes</p></div>

        {step === 1 && (
          <div className="card">
            <div className="onboard-step">Step 1 of 4 — Your Account</div>
            <h2 className="card-title">Create your account</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="field"><label className="label">Your name</label><input className="input" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Steven Ringrose" /></div>
            <div className="field"><label className="label">Email address</label><input className="input" type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@yourdomain.com" /></div>
            <div className="field"><label className="label">Password</label><input className="input" type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Choose a password" /></div>
            <div className="field"><label className="label">Business / brand name</label><input className="input" value={form.business_name} onChange={e => update("business_name", e.target.value)} placeholder="Blue Ridge Films" /></div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}
              onClick={() => { if (!form.name || !form.email || !form.password || !form.business_name) { setError("Please fill all fields"); return; } setError(""); setStep(2); }}>
              Continue <Icon.Arrow />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <div className="onboard-step">Step 2 of 4 — Business Profile</div>
            <h2 className="card-title">Your contact & social details</h2>
            <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 20 }}>These are automatically added to every YouTube description you generate.</p>
            <BusinessProfileFields form={form} update={update} />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setStep(3)}>Skip for now</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setStep(3)}>Continue <Icon.Arrow /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <div className="onboard-step">Step 3 of 4 — WordPress</div>
            <h2 className="card-title">Connect your website</h2>
            <div className="alert alert-info" style={{ marginBottom: 20 }}>
              Create an Application Password in <strong>WP Admin → Users → Profile → Application Passwords</strong>.
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="field"><label className="label">WordPress URL</label><input className="input" value={form.wp_url} onChange={e => update("wp_url", e.target.value)} placeholder="https://www.blueridge-weddings.com" /></div>
            <div className="field"><label className="label">WordPress Username</label><input className="input" value={form.wp_user} onChange={e => update("wp_user", e.target.value)} placeholder="blueridge" /></div>
            <div className="field"><label className="label">Application Password</label><input className="input" type="password" value={form.wp_pass} onChange={e => update("wp_pass", e.target.value)} placeholder="xxxx xxxx xxxx xxxx xxxx xxxx" /></div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setStep(4)}>Skip for now</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setStep(4)}>Continue <Icon.Arrow /></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card">
            <div className="onboard-step">Step 4 of 4 — Almost done</div>
            <h2 className="card-title">You're all set</h2>
            <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 24 }}>
              Your account will be created and you can start publishing straight away. You can update any settings at any time.
            </p>
            {error && <div className="alert alert-error">{error}</div>}
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setStep(3)}>Back</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={finish} disabled={loading}>
                {loading ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Creating account...</> : <>Create Account <Icon.Check /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────
function Login({ onLogin, onRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const login = async () => {
    setLoading(true); setError("");
    try {
      const { data, error: dbError } = await supabase.from("users").select("*").eq("email", form.email).single();
      if (dbError || !data || !(await bcrypt.compare(form.password, data.password))) { setError("Incorrect email or password"); setLoading(false); return; }
      localStorage.setItem("filmpost_session", JSON.stringify({ userId: data.id, email: data.email }));
      onLogin(data);
    } catch (e) { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div className="onboard-logo"><h1>FilmPost</h1><p>Welcome back</p></div>
        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="field"><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => update("email", e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="you@yourdomain.com" /></div>
          <div className="field"><label className="label">Password</label><input className="input" type="password" value={form.password} onChange={e => update("password", e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="Your password" /></div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={login} disabled={loading}>
            {loading ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Signing in...</> : "Sign In"}
          </button>
          <div className="divider" />
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={onRegister}>Create an account</button>
        </div>
      </div>
    </div>
  );
}

// ── YouTube Callback ──────────────────────────────────────────────────────────
function YouTubeCallback({ user, onComplete }) {
  const [status, setStatus] = useState("Connecting your YouTube channel...");
  const [error, setError] = useState("");

  useEffect(() => {
    const exchange = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get("code");
        if (!code) throw new Error("No authorisation code found in URL");
        const res = await fetch("/api/youtube-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "exchangeCode", code }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to connect YouTube");
        await supabase.from("users").update({
          youtube_access_token: data.access_token,
          youtube_refresh_token: data.refresh_token,
          youtube_channel_name: data.channel_name,
        }).eq("id", user.id);
        setStatus(`Connected: ${data.channel_name}`);
        setTimeout(() => onComplete({
          ...user,
          youtube_access_token: data.access_token,
          youtube_refresh_token: data.refresh_token,
          youtube_channel_name: data.channel_name,
        }), 800);
      } catch (e) { setError(e.message); }
    };
    exchange();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{styles}</style>
      <div style={{ textAlign: "center" }}>
        {error ? (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✕</div>
            <div style={{ color: "var(--red)", marginBottom: 16 }}>{error}</div>
            <button className="btn btn-ghost" onClick={() => { window.history.replaceState({}, "", "/"); window.location.reload(); }}>Return to app</button>
          </>
        ) : (
          <>
            <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3, margin: "0 auto 20px" }} />
            <div style={{ color: "var(--text)", fontSize: 15 }}>{status}</div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Upload Wizard ─────────────────────────────────────────────────────────────
function UploadWizard({ user, onSaveUser }) {
  const [wizardStep, setWizardStep] = useState(1);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [answers, setAnswers] = useState({});
  const [generated, setGenerated] = useState(null);
  const [activeTab, setActiveTab] = useState("yt");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [publishResults, setPublishResults] = useState({});
  const [ytUpload, setYtUpload] = useState(null);
  const ytUploadStarted = useRef(false);
  const fileRef = useRef();

  const setAnswer = (id, val) => setAnswers(p => ({ ...p, [id]: val }));

  // Auto-upload to YouTube when step 5 is reached
  useEffect(() => {
    if (wizardStep !== 5 || !publishResults.youtube?.pending || !file || ytUploadStarted.current) return;
    ytUploadStarted.current = true;
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", publishResults.youtube.uploadUri);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
    setYtUpload({ state: "uploading", progress: 0 });
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) setYtUpload({ state: "uploading", progress: Math.round(e.loaded / e.total * 100) });
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        setYtUpload({ state: "done", videoId: data.id, url: `https://www.youtube.com/watch?v=${data.id}` });
      } else {
        setYtUpload({ state: "error", error: `Upload failed (${xhr.status})` });
      }
    };
    xhr.onerror = () => setYtUpload({ state: "error", error: "Network error during upload" });
    xhr.send(file);
    return () => xhr.abort();
  }, [wizardStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("video/")) setFile(f);
    else setError("Please drop a video file (MP4, MOV, etc.)");
  }, []);

  const generateContent = async () => {
    if (!venue) { setError("Please enter a venue name"); return; }
    setLoading(true); setError("");
    const answerStr = VENUE_QUESTIONS.filter(q => answers[q.id]).map(q => `${q.label}: ${answers[q.id]}`).join("\n");
    const baseContext = `Venue: ${venue}\nLocation: ${location}\nWedding date: ${weddingDate || "not specified"}\n${answerStr}\nBusiness: ${user.business_name}`.trim();
    const businessFooter = buildBusinessFooter(user);
    try {
      setLoadingMsg("Crafting your YouTube metadata...");
      const ytRaw = await callClaude(
        "You are an expert SEO copywriter for wedding videography. Return ONLY valid JSON with keys: title (max 100 chars), descriptionBody (main content max 300 words, no contact details), tags (array of 15 strings). No markdown.",
        `Generate YouTube metadata for a cinematic wedding film.\n${baseContext}\nTitle should include venue name and be SEO-friendly. descriptionBody should be compelling but do NOT include contact details or social links.`
      );
      const ytParsed = JSON.parse(ytRaw.replace(/```json|```/g, "").trim());
      const yt = { ...ytParsed, description: `${ytParsed.descriptionBody}\n\n${businessFooter}` };

      setLoadingMsg("Writing your blog post...");
      const blogRaw = await callClaude(
        "You are an expert wedding blog writer for a UK wedding videography company. Write in a warm first-person voice. Return ONLY valid JSON with keys: title (string), metaDescription (max 155 chars), content (full HTML 900-1100 words using h2 h3 p ul tags). No markdown wrapper.",
        `Write a venue guide blog post for ${user.business_name}.\n${baseContext}\nTarget keyword: "wedding videographer ${venue}". Include: scene-setting intro, filming highlights, lighting tips, personal anecdote if provided, insider tips, CTA to enquire.`
      );
      const blog = JSON.parse(blogRaw.replace(/```json|```/g, "").trim());
      setGenerated({ yt, blog });
      setWizardStep(3);
    } catch (e) { setError("Generation failed: " + e.message); }
    finally { setLoading(false); setLoadingMsg(""); }
  };

  const publishToWordPress = async () => {
    const creds = btoa(`${user.wp_user}:${user.wp_pass}`);
    const slug = generated.blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const res = await fetch(`${user.wp_url.replace(/\/$/, "")}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${creds}` },
      body: JSON.stringify({ title: generated.blog.title, content: generated.blog.content, status: "draft", slug, excerpt: generated.blog.metaDescription, meta: { _seopress_titles_title: generated.yt.title, _seopress_titles_desc: generated.blog.metaDescription } }),
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e?.message || `WP error ${res.status}`); }
    const post = await res.json();
    return { id: post.id, editUrl: `${user.wp_url.replace(/\/$/, "")}/wp-admin/post.php?post=${post.id}&action=edit` };
  };

  const handlePublish = async () => {
    setLoading(true); setError("");
    const results = {};
    try {
      setLoadingMsg("Creating WordPress draft...");
      const wpResult = await publishToWordPress();
      results.wordpress = { success: true, ...wpResult };
    } catch (e) { results.wordpress = { success: false, error: e.message }; }

    // Save post to Supabase
    try {
      await supabase.from("posts").insert([{
        user_id: user.id, venue, location,
        wedding_date: weddingDate || null,
        yt_title: generated.yt.title,
        blog_title: generated.blog.title,
        wp_post_id: results.wordpress?.id?.toString() || null,
        wp_edit_url: results.wordpress?.editUrl || null,
      }]);
    } catch (e) { console.error("Failed to save post history:", e); }

    // Initiate YouTube resumable upload session if connected
    if (user.youtube_access_token) {
      try {
        setLoadingMsg("Preparing YouTube upload...");
        const initRes = await fetch("/api/youtube-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: generated.yt.title,
            description: generated.yt.description,
            tags: generated.yt.tags,
            refreshToken: user.youtube_refresh_token,
          }),
        });
        const initData = await initRes.json();
        if (!initRes.ok) throw new Error(initData.error || "Failed to initiate YouTube upload");
        results.youtube = { pending: true, uploadUri: initData.uploadUri };
      } catch (e) {
        results.youtube = { success: false, error: e.message };
      }
    }

    setPublishResults(results);
    setLoading(false); setLoadingMsg("");
    setWizardStep(5);
  };

  const stepDone = s => wizardStep > s;
  const stepActive = s => wizardStep === s;

  return (
    <>
      {loading && <div className="loading-overlay"><div className="spinner" /><div className="loading-title">Generating</div><div className="loading-sub">{loadingMsg}</div></div>}
      <div className="steps">
        {[["1", "Drop Video"], ["2", "Venue Details"], ["3", "Review"], ["4", "Publish"], ["5", "Done"]].map(([n, label], i, arr) => (
          <span key={n} style={{ display: "contents" }}>
            <div className={`step ${stepDone(+n) ? "done" : stepActive(+n) ? "active" : ""}`}>
              <div className="step-num">{stepDone(+n) ? <Icon.Check /> : n}</div>
              <span className="step-label">{label}</span>
            </div>
            {i < arr.length - 1 && <div className="step-line" />}
          </span>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}<button style={{ float: "right", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }} onClick={() => setError("")}>✕</button></div>}

      {wizardStep === 1 && (
        <div className="card">
          <h2 className="card-title">Drop your wedding film</h2>
          <div className={`drop-zone ${dragOver ? "drag-over" : ""} ${file ? "file-selected" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
            onDrop={onDrop} onClick={() => fileRef.current.click()}>
            <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }} onChange={e => e.target.files[0] && setFile(e.target.files[0])} />
            {file ? (<><div className="drop-icon">🎬</div><div className="drop-title">{file.name}</div><div className="drop-sub">{(file.size / 1024 / 1024 / 1024).toFixed(2)} GB · Click to change</div></>) : (<><div className="drop-icon">📽</div><div className="drop-title">Drop your video file here</div><div className="drop-sub">MP4, MOV, MXF · Click to browse</div></>)}
          </div>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" disabled={!file} onClick={() => setWizardStep(2)}>Continue <Icon.Arrow /></button>
          </div>
        </div>
      )}

      {wizardStep === 2 && (
        <div className="card">
          <h2 className="card-title">Tell us about the wedding</h2>
          <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 24 }}>The more detail you provide, the richer your content.</p>
          <div className="grid-2">
            <div className="field"><label className="label">Venue Name *</label><input className="input" value={venue} onChange={e => setVenue(e.target.value)} placeholder="Dewsall Court" /></div>
            <div className="field"><label className="label">Location / County</label><input className="input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Herefordshire" /></div>
          </div>
          <div className="field"><label className="label">Wedding Date</label><input className="input" type="date" value={weddingDate} onChange={e => setWeddingDate(e.target.value)} /></div>
          <div className="divider" />
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: "var(--text-bright)", marginBottom: 20 }}>Venue & filming details</h3>
          {VENUE_QUESTIONS.map(q => (
            <div className="field" key={q.id}>
              <label className="label">{q.label} <span className="label-opt">optional</span></label>
              {q.type === "textarea"
                ? <textarea className="textarea" value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} placeholder={q.placeholder} rows={3} />
                : <input className="input" value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} placeholder={q.placeholder} />}
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={() => setWizardStep(1)}>Back</button>
            <button className="btn btn-primary" onClick={generateContent}>Generate Content <Icon.Arrow /></button>
          </div>
        </div>
      )}

      {wizardStep === 3 && generated && (
        <div className="card">
          <h2 className="card-title">Review & edit your content</h2>
          <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 20 }}>Edit anything before publishing.</p>
          <div className="tabs">
            <div className={`tab ${activeTab === "yt" ? "active" : ""}`} onClick={() => setActiveTab("yt")}>YouTube</div>
            <div className={`tab ${activeTab === "blog" ? "active" : ""}`} onClick={() => setActiveTab("blog")}>Blog Post</div>
          </div>
          {activeTab === "yt" && (
            <>
              <div className="field"><label className="label">YouTube Title</label>
                <input className="input" value={generated.yt.title} onChange={e => setGenerated(g => ({ ...g, yt: { ...g.yt, title: e.target.value } }))} />
                <div className="char-count">{generated.yt.title?.length || 0}/100</div>
              </div>
              <div className="field"><label className="label">YouTube Description</label>
                <div className="field-hint" style={{ marginBottom: 8 }}>Your business contact details are included at the bottom automatically.</div>
                <textarea className="textarea" rows={12} value={generated.yt.description} onChange={e => setGenerated(g => ({ ...g, yt: { ...g.yt, description: e.target.value } }))} />
              </div>
              <div className="field"><label className="label">Tags</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "12px", background: "var(--deep)", border: "1px solid var(--border)" }}>
                  {(generated.yt.tags || []).map((t, i) => (
                    <span key={i} className="tag tag-gold">{t}
                      <span style={{ cursor: "pointer", opacity: 0.6 }} onClick={() => setGenerated(g => ({ ...g, yt: { ...g.yt, tags: g.yt.tags.filter((_, j) => j !== i) } }))}>✕</span>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeTab === "blog" && (
            <>
              <div className="field"><label className="label">Post Title</label><input className="input" value={generated.blog.title} onChange={e => setGenerated(g => ({ ...g, blog: { ...g.blog, title: e.target.value } }))} /></div>
              <div className="field"><label className="label">Meta Description</label>
                <input className="input" value={generated.blog.metaDescription} onChange={e => setGenerated(g => ({ ...g, blog: { ...g.blog, metaDescription: e.target.value } }))} />
                <div className="char-count">{generated.blog.metaDescription?.length || 0}/155</div>
              </div>
              <div className="field"><label className="label">Blog Post Content (HTML)</label>
                <textarea className="textarea" rows={20} value={generated.blog.content} onChange={e => setGenerated(g => ({ ...g, blog: { ...g.blog, content: e.target.value } }))} />
              </div>
            </>
          )}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={() => setWizardStep(2)}>← Back</button>
            <button className="btn btn-ghost" onClick={generateContent}>Regenerate</button>
            <button className="btn btn-primary" onClick={() => setWizardStep(4)}>Looks Good <Icon.Arrow /></button>
          </div>
        </div>
      )}

      {wizardStep === 4 && generated && (
        <div className="card">
          <h2 className="card-title">Ready to publish</h2>
          <div className="settings-row">
            <div><div className="settings-key">🎬 YouTube</div><div className="settings-val" style={{ marginTop: 4 }}>{generated.yt.title}</div></div>
            {user.youtube_access_token
              ? <span className="connected"><span className="status-dot green" />Will upload automatically</span>
              : <span style={{ fontSize: 12, color: "var(--amber)", display: "flex", alignItems: "center", gap: 6 }}><span className="status-dot amber" />Connect YouTube in Settings</span>}
          </div>
          <div className="settings-row">
            <div><div className="settings-key">✍️ WordPress Draft</div><div className="settings-val" style={{ marginTop: 4 }}>{generated.blog.title}</div></div>
            {user.wp_url ? <span className="connected"><span className="status-dot green" />Ready</span> : <span className="not-connected"><span className="status-dot red" />Not connected</span>}
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={() => setWizardStep(3)}>← Back</button>
            <button className="btn btn-primary" onClick={handlePublish}>Publish Now <Icon.Arrow /></button>
          </div>
        </div>
      )}

      {wizardStep === 5 && (
        <div className="card" style={{ textAlign: "center" }}>
          <div className="success-icon">🎬</div>
          <h1 className="page-title">Done</h1>
          <p style={{ color: "var(--text-dim)", marginBottom: 8 }}>{venue}{location ? ` · ${location}` : ""}</p>
          <div className="success-links" style={{ textAlign: "left" }}>
            {publishResults.wordpress?.success && (
              <a href={publishResults.wordpress.editUrl} target="_blank" rel="noreferrer" className="success-link">
                <div><div className="success-link-label">WordPress Draft Created</div><div className="success-link-url">{publishResults.wordpress.editUrl}</div></div>
                <Icon.External />
              </a>
            )}
            {publishResults.wordpress?.success === false && <div className="alert alert-error">WordPress failed: {publishResults.wordpress.error}</div>}
            {ytUpload?.state === "uploading" && (
              <div className="card" style={{ margin: 0, background: "var(--deep)", textAlign: "left" }}>
                <div className="preview-label">Uploading to YouTube</div>
                <div className="yt-progress"><div className="yt-progress-bar" style={{ width: `${ytUpload.progress}%` }} /></div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>{ytUpload.progress}% — this may take several minutes</div>
              </div>
            )}
            {ytUpload?.state === "done" && (
              <a href={ytUpload.url} target="_blank" rel="noreferrer" className="success-link">
                <div><div className="success-link-label">Uploaded to YouTube</div><div className="success-link-url">{ytUpload.url}</div></div>
                <Icon.External />
              </a>
            )}
            {ytUpload?.state === "error" && <div className="alert alert-error">YouTube upload failed: {ytUpload.error}</div>}
            {publishResults.youtube?.success === false && <div className="alert alert-error">YouTube: {publishResults.youtube.error}</div>}
            <div className="card" style={{ textAlign: "left", margin: 0, background: "var(--deep)" }}>
              <div className="preview-label">YouTube Description (with your business details)</div>
              <pre style={{ color: "var(--text)", fontSize: 12, whiteSpace: "pre-wrap", maxHeight: 160, overflow: "hidden", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7 }}>{generated?.yt?.description?.slice(0, 500)}...</pre>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => navigator.clipboard?.writeText(generated?.yt?.description || "")}>
                <Icon.Copy /> Copy Full Description
              </button>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <div className="alert alert-info" style={{ textAlign: "left", marginBottom: 20 }}>
              <strong>Next steps:</strong><br />
              1. Review & publish your WordPress draft at the link above<br />
              {!user.youtube_access_token && <>2. Upload your video to YouTube, paste the copied description<br /></>}
              {!user.youtube_access_token
                ? <>3. Set focus keyphrase: <em>wedding videographer {venue}</em></>
                : <>2. Set focus keyphrase in WordPress: <em>wedding videographer {venue}</em></>}
            </div>
            <button className="btn btn-primary" onClick={() => { setWizardStep(1); setFile(null); setVenue(""); setAnswers({}); setGenerated(null); setPublishResults({}); setYtUpload(null); ytUploadStarted.current = false; }}>+ New Film</button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function Settings({ user, onUpdate }) {
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setLoading(true);
    try {
      const updated = {
        name: form.name, business_name: form.business_name,
        tagline: form.tagline, enquiry_email: form.enquiry_email,
        website: form.website,
        instagram: (form.instagram || "").replace(/^@/, ""),
        tiktok: (form.tiktok || "").replace(/^@/, ""),
        facebook: form.facebook,
        wp_url: form.wp_url, wp_user: form.wp_user, wp_pass: form.wp_pass,
      };
      const { error } = await supabase.from("users").update(updated).eq("id", user.id);
      if (error) throw error;
      onUpdate({ ...user, ...updated });
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch (e) { alert("Save failed: " + e.message); }
    finally { setLoading(false); }
  };

  const connectYouTube = async () => {
    try {
      const res = await fetch("/api/youtube-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAuthUrl" }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch (e) { alert("Could not connect YouTube: " + e.message); }
  };

  const disconnectYouTube = async () => {
    setLoading(true);
    try {
      await supabase.from("users").update({
        youtube_access_token: null,
        youtube_refresh_token: null,
        youtube_channel_name: null,
      }).eq("id", user.id);
      onUpdate({ ...user, youtube_access_token: null, youtube_refresh_token: null, youtube_channel_name: null });
    } catch (e) { alert("Failed to disconnect: " + e.message); }
    finally { setLoading(false); }
  };

  const testWP = async () => {
    try {
      const creds = btoa(`${form.wp_user}:${form.wp_pass}`);
      const res = await fetch(`${form.wp_url.replace(/\/$/, "")}/wp-json/wp/v2/users/me`, { headers: { Authorization: `Basic ${creds}` } });
      if (res.ok) { const d = await res.json(); setTestResult("✓ Connected as " + d.name); }
      else setTestResult("✗ Check credentials");
    } catch { setTestResult("✗ Could not reach site"); }
  };

  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Manage your account and integrations</p>
      <div className="card">
        <h2 className="card-title">Account</h2>
        <div className="grid-2">
          <div className="field"><label className="label">Your Name</label><input className="input" value={form.name || ""} onChange={e => update("name", e.target.value)} /></div>
          <div className="field"><label className="label">Business Name</label><input className="input" value={form.business_name || ""} onChange={e => update("business_name", e.target.value)} /></div>
        </div>
      </div>
      <div className="card">
        <h2 className="card-title">Business Profile</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 20 }}>These details appear automatically in every YouTube description.</p>
        <BusinessProfileFields form={form} update={update} />
      </div>
      <div className="card">
        <h2 className="card-title">WordPress</h2>
        <div className="field"><label className="label">Site URL</label><input className="input" value={form.wp_url || ""} onChange={e => update("wp_url", e.target.value)} placeholder="https://www.your-site.com" /></div>
        <div className="grid-2">
          <div className="field"><label className="label">Username</label><input className="input" value={form.wp_user || ""} onChange={e => update("wp_user", e.target.value)} /></div>
          <div className="field"><label className="label">Application Password</label><input className="input" type="password" value={form.wp_pass || ""} onChange={e => update("wp_pass", e.target.value)} /></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={testWP}>Test Connection</button>
          {testResult && <span style={{ fontSize: 12, color: testResult.startsWith("✓") ? "var(--green)" : "var(--red)" }}>{testResult}</span>}
        </div>
      </div>
      <div className="card">
        <h2 className="card-title">YouTube</h2>
        {user.youtube_channel_name ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="connected"><span className="status-dot green" />{user.youtube_channel_name}</span>
            <button className="btn btn-ghost btn-sm" onClick={disconnectYouTube} disabled={loading}>Disconnect</button>
          </div>
        ) : (
          <div>
            <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 16 }}>Connect your YouTube channel to auto-upload wedding films directly from the app.</p>
            <button className="btn btn-ghost" onClick={connectYouTube}><Icon.YouTube /> Connect YouTube</button>
          </div>
        )}
      </div>
      <button className="btn btn-primary" onClick={save} disabled={loading}>
        {loading ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Saving...</> : saved ? "✓ Saved" : "Save Changes"}
      </button>
    </div>
  );
}

// ── History ───────────────────────────────────────────────────────────────────
function History({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from("posts").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, [user.id]);

  if (loading) return (
    <div><h1 className="page-title">History</h1>
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} /></div>
    </div>
  );

  if (!posts.length) return (
    <div>
      <h1 className="page-title">History</h1>
      <p className="page-subtitle">Your published films and blog posts</p>
      <div className="card" style={{ textAlign: "center", padding: "60px" }}>
        <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>📋</div>
        <p style={{ color: "var(--text-dim)" }}>No posts yet. Upload your first wedding film to get started.</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="page-title">History</h1>
      <p className="page-subtitle">{posts.length} film{posts.length !== 1 ? "s" : ""} published</p>
      <div className="card">
        {posts.map(p => (
          <div className="post-row" key={p.id}>
            <div>
              <div className="post-title-text">{p.venue}{p.location ? ` — ${p.location}` : ""}</div>
              <div className="post-meta">{p.blog_title}</div>
              <div className="post-meta" style={{ marginTop: 4 }}>{new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
            </div>
            {p.wp_edit_url && <a href={p.wp_edit_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">WP Draft <Icon.External /></a>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [authState, setAuthState] = useState("check");
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("upload");
  const isYTCallback = window.location.pathname === "/youtube/callback" && new URLSearchParams(window.location.search).has("code");

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const session = JSON.parse(localStorage.getItem("filmpost_session") || "null");
        if (session?.userId) {
          const { data } = await supabase.from("users").select("*").eq("id", session.userId).single();
          if (data) { setCurrentUser(data); setAuthState(isYTCallback ? "youtube_callback" : "app"); return; }
        }
      } catch (e) { /* session invalid */ }
      setAuthState("login");
    };
    restoreSession();
  }, []);

  const logout = () => {
    localStorage.removeItem("filmpost_session");
    setCurrentUser(null);
    setAuthState("login");
  };

  if (authState === "check") return (
    <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{styles}</style>
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
    </div>
  );
  if (authState === "login") return <Login onLogin={u => { setCurrentUser(u); setAuthState("app"); }} onRegister={() => setAuthState("onboard")} />;
  if (authState === "onboard") return <Onboarding onComplete={u => { setCurrentUser(u); setAuthState("app"); }} />;
  if (authState === "youtube_callback") return (
    <YouTubeCallback user={currentUser} onComplete={u => {
      setCurrentUser(u);
      window.history.replaceState({}, "", "/");
      setPage("settings");
      setAuthState("app");
    }} />
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-mark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
            </div>
            <span className="logo-text">FilmPost</span>
            <span className="logo-sub">by {currentUser?.business_name}</span>
          </div>
          <div className="header-actions">
            <span className="user-chip">{currentUser?.name}</span>
            <button className="btn btn-ghost btn-sm" onClick={logout}><Icon.Logout /> Sign out</button>
          </div>
        </header>
        <div className="main">
          <nav className="sidebar">
            <div className="nav-section">Publish</div>
            <div className={`nav-item ${page === "upload" ? "active" : ""}`} onClick={() => setPage("upload")}><Icon.Upload /> New Film</div>
            <div className="nav-section">Manage</div>
            <div className={`nav-item ${page === "history" ? "active" : ""}`} onClick={() => setPage("history")}><Icon.History /> History</div>
            <div className={`nav-item ${page === "settings" ? "active" : ""}`} onClick={() => setPage("settings")}><Icon.Settings /> Settings</div>
          </nav>
          <main className="content">
            {page === "upload" && <UploadWizard user={currentUser} onSaveUser={u => setCurrentUser(u)} />}
            {page === "history" && <History user={currentUser} />}
            {page === "settings" && <Settings user={currentUser} onUpdate={u => setCurrentUser(u)} />}
          </main>
        </div>
      </div>
    </>
  );
}
