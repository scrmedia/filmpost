import { useState, useCallback, useRef, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0a; --deep: #111111; --surface: #191919; --border: #2a2a2a;
    --muted: #3a3a3a; --text-dim: #888; --text: #d4cfc9; --text-bright: #f5f0eb;
    --gold: #c9a96e; --gold-dim: #8a6f42; --red: #c0392b; --green: #27ae60; --radius: 4px;
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
  .input, .textarea, .select { width: 100%; background: var(--deep); border: 1px solid var(--border); color: var(--text); padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.15s; border-radius: var(--radius); }
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
  .alert { padding: 14px 18px; border-left: 3px solid; margin-bottom: 20px; font-size: 13px; }
  .alert-info { border-color: var(--gold); background: rgba(201,169,110,0.06); color: var(--text); }
  .alert-error { border-color: var(--red); background: rgba(192,57,43,0.06); color: var(--text); }
  .alert-success { border-color: var(--green); background: rgba(39,174,96,0.06); color: var(--text); }
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
  .profile-preview { background: var(--deep); border: 1px solid var(--border); padding: 16px; margin-top: 16px; font-size: 12px; color: var(--text-dim); line-height: 1.8; }
  .profile-preview strong { color: var(--gold); font-weight: 400; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--muted); }
  @media (max-width: 768px) { .sidebar { display: none; } .header { padding: 16px 20px; } .content { padding: 24px 20px; } .grid-2 { grid-template-columns: 1fr; } }
`;

const VENUE_QUESTIONS = [
  { id: "venueStyle", label: "Venue Style / Character", placeholder: "e.g. Rustic barn, grand manor, modern minimalist, intimate garden...", type: "text" },
  { id: "venueSetting", label: "Surrounding Setting & Scenery", placeholder: "e.g. Rolling Cotswold hills, woodland, lakeside, city skyline...", type: "text" },
  { id: "filmingHighlights", label: "Best Spots for Filming", placeholder: "e.g. Oak-lined driveway, walled garden, dramatic staircase...", type: "textarea" },
  { id: "lightingNotes", label: "Lighting Character", placeholder: "e.g. Flood of natural light, moody candlelit reception, golden evening light...", type: "text" },
  { id: "droneAccess", label: "Drone / Aerial Access", placeholder: "e.g. Full drone access, stunning aerial approach, restricted to certain areas...", type: "text" },
  { id: "coupleType", label: "Typical Couple Vibe", placeholder: "e.g. Laid-back, romantic, fun & alternative, traditional, creative...", type: "text" },
  { id: "standoutMemory", label: "A Standout or Memorable Moment", placeholder: "Share a specific story — a moment, surprise, or detail that made a wedding here unforgettable...", type: "textarea" },
  { id: "proTip", label: "Your Pro Videographer Tip", placeholder: "What advice would you give couples and planners to get the most from filming here?", type: "textarea" },
  { id: "coupleNames", label: "Featured Couple's Names", placeholder: "e.g. Emily & James — leave blank to omit", type: "text" },
];

// In-memory store for artifact environment
let STORE = { users: {}, session: null };
function getUsers() { return STORE.users; }
function saveUsers(u) { STORE.users = u; }
function getSession() { return STORE.session; }
function saveSession(u) { STORE.session = u; }
function clearSession() { STORE.session = null; }

async function callClaude(systemPrompt, userPrompt, apiKey) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
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

// Build a business footer string for use in YouTube descriptions
function buildBusinessFooter(user) {
  const lines = [];
  lines.push(`📽 ${user.businessName}`);
  if (user.tagline) lines.push(`${user.tagline}`);
  lines.push("");
  if (user.enquiryEmail) lines.push(`📩 Enquiries: ${user.enquiryEmail}`);
  if (user.website) lines.push(`🌐 ${user.website}`);
  if (user.instagram) lines.push(`📸 Instagram: instagram.com/${user.instagram.replace(/^@/, "")}`);
  if (user.facebook) lines.push(`👍 Facebook: ${user.facebook}`);
  if (user.tiktok) lines.push(`🎵 TikTok: @${user.tiktok.replace(/^@/, "")}`);
  lines.push("");
  lines.push("—");
  lines.push(`To enquire about having ${user.businessName} film your wedding, visit our website or drop us an email.`);
  return lines.filter(Boolean).join("\n");
}

const Icon = {
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Arrow: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Settings: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  History: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Logout: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  External: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
};

// ── Business Profile Fields component (reused in onboarding + settings) ──────
function BusinessProfileFields({ form, update }) {
  const ig = form.instagram ? form.instagram.replace(/^@/, "") : "";
  const previewFooter = buildBusinessFooter({ ...form, instagram: ig });

  return (
    <>
      <div className="field">
        <label className="label">Business Tagline <span className="label-opt">optional</span></label>
        <input className="input" value={form.tagline || ""} onChange={e => update("tagline", e.target.value)}
          placeholder="e.g. Cinematic wedding films across the UK & Europe" />
      </div>
      <div className="grid-2">
        <div className="field">
          <label className="label">Enquiry Email</label>
          <input className="input" type="email" value={form.enquiryEmail || ""} onChange={e => update("enquiryEmail", e.target.value)}
            placeholder="info@blueridge-weddings.com" />
        </div>
        <div className="field">
          <label className="label">Website <span className="label-opt">optional</span></label>
          <input className="input" value={form.website || ""} onChange={e => update("website", e.target.value)}
            placeholder="https://www.blueridge-weddings.com" />
        </div>
      </div>
      <div className="grid-2">
        <div className="field">
          <label className="label">Instagram Handle <span className="label-opt">optional</span></label>
          <div className="input-prefix">
            <span>@</span>
            <input className="input" value={form.instagram || ""} onChange={e => update("instagram", e.target.value)}
              placeholder="blueridgefilms" />
          </div>
        </div>
        <div className="field">
          <label className="label">TikTok Handle <span className="label-opt">optional</span></label>
          <div className="input-prefix">
            <span>@</span>
            <input className="input" value={form.tiktok || ""} onChange={e => update("tiktok", e.target.value)}
              placeholder="blueridgefilms" />
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Facebook Page URL <span className="label-opt">optional</span></label>
        <input className="input" value={form.facebook || ""} onChange={e => update("facebook", e.target.value)}
          placeholder="https://www.facebook.com/blueridgefilms" />
      </div>
      {(form.enquiryEmail || form.instagram || form.website) && (
        <div className="profile-preview">
          <div style={{fontSize:10,color:"var(--gold)",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>YouTube Description Footer Preview</div>
          <pre style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,whiteSpace:"pre-wrap",color:"var(--text-dim)"}}>{previewFooter}</pre>
        </div>
      )}
    </>
  );
}

// ── Onboarding ────────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "", businessName: "",
    tagline: "", enquiryEmail: "", website: "", instagram: "", tiktok: "", facebook: "",
    wpUrl: "", wpUser: "", wpPass: "", apiKey: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const testApiKey = async () => {
    if (!form.apiKey) { setError("Please enter your API key"); return; }
    setLoading(true); setError("");
    try {
      await callClaude("You are a test.", "Say ok.", form.apiKey);
      setStep(3);
    } catch (e) { setError("API key invalid: " + e.message); }
    finally { setLoading(false); }
  };

  const finish = () => {
    const users = getUsers();
    if (users[form.email]) { setError("An account with that email already exists"); return; }
    const userData = { ...form, instagram: form.instagram.replace(/^@/, ""), tiktok: form.tiktok.replace(/^@/, ""), posts: [], createdAt: Date.now() };
    users[form.email] = userData;
    saveUsers(users);
    saveSession({ email: form.email });
    onComplete(userData);
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
            <div className="field"><label className="label">Business / brand name</label><input className="input" value={form.businessName} onChange={e => update("businessName", e.target.value)} placeholder="Blue Ridge Films" /></div>
            <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}}
              onClick={() => { if (!form.name||!form.email||!form.password||!form.businessName){setError("Please fill all fields");return;} setError(""); setStep(2); }}>
              Continue <Icon.Arrow />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <div className="onboard-step">Step 2 of 4 — Business Profile</div>
            <h2 className="card-title">Your contact & social details</h2>
            <p style={{color:"var(--text-dim)",fontSize:13,marginBottom:20}}>These are automatically added to every YouTube description you generate — you won't need to add them manually each time.</p>
            {error && <div className="alert alert-error">{error}</div>}
            <BusinessProfileFields form={form} update={update} />
            <div style={{display:"flex",gap:12,marginTop:8}}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={() => setStep(3)}>Skip for now</button>
              <button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={() => setStep(3)}>Continue <Icon.Arrow /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <div className="onboard-step">Step 3 of 4 — Claude API</div>
            <h2 className="card-title">Connect your AI</h2>
            <div className="alert alert-info" style={{marginBottom:20}}>
              FilmPost uses Claude to generate your YouTube descriptions and blog posts. You'll need a free API key from Anthropic.
              <br/><br/><a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{color:"var(--gold)"}}>Get your API key at console.anthropic.com →</a>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="field"><label className="label">Anthropic API Key</label><input className="input" type="password" value={form.apiKey} onChange={e => update("apiKey", e.target.value)} placeholder="sk-ant-api03-..." /></div>
            <div style={{display:"flex",gap:12}}>
              <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={testApiKey} disabled={loading}>
                {loading ? <><div className="spinner" style={{width:14,height:14}} /> Testing...</> : <>Test & Continue <Icon.Arrow /></>}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card">
            <div className="onboard-step">Step 4 of 4 — WordPress</div>
            <h2 className="card-title">Connect your website</h2>
            <div className="alert alert-info" style={{marginBottom:20}}>
              Create an Application Password in <strong>WP Admin → Users → Profile → Application Passwords</strong>.
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="field"><label className="label">WordPress URL</label><input className="input" value={form.wpUrl} onChange={e => update("wpUrl", e.target.value)} placeholder="https://www.blueridge-weddings.com" /></div>
            <div className="field"><label className="label">WordPress Username</label><input className="input" value={form.wpUser} onChange={e => update("wpUser", e.target.value)} placeholder="blueridge" /></div>
            <div className="field"><label className="label">Application Password</label><input className="input" type="password" value={form.wpPass} onChange={e => update("wpPass", e.target.value)} placeholder="xxxx xxxx xxxx xxxx xxxx xxxx" /></div>
            <div style={{display:"flex",gap:12}}>
              <button className="btn btn-ghost" onClick={() => setStep(3)}>Back</button>
              <button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={finish}>Skip for now</button>
              <button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={finish}>Finish Setup <Icon.Check /></button>
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
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const login = () => {
    const users = getUsers();
    const user = users[form.email];
    if (!user) { setError("No account found with that email"); return; }
    if (user.password !== form.password) { setError("Incorrect password"); return; }
    saveSession({ email: form.email });
    onLogin(user);
  };
  return (
    <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{maxWidth:420,width:"100%"}}>
        <div className="onboard-logo"><h1>FilmPost</h1><p>Welcome back</p></div>
        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="field"><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => update("email", e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="you@yourdomain.com" /></div>
          <div className="field"><label className="label">Password</label><input className="input" type="password" value={form.password} onChange={e => update("password", e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Your password" /></div>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={login}>Sign In</button>
          <div className="divider"/>
          <button className="btn btn-ghost" style={{width:"100%",justifyContent:"center"}} onClick={onRegister}>Create an account</button>
        </div>
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
  const fileRef = useRef();

  const setAnswer = (id, val) => setAnswers(p => ({ ...p, [id]: val }));

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
    const baseContext = `Venue: ${venue}\nLocation: ${location}\nWedding date: ${weddingDate || "not specified"}\n${answerStr}\nBusiness: ${user.businessName}`.trim();
    const businessFooter = buildBusinessFooter(user);

    try {
      setLoadingMsg("Crafting your YouTube metadata...");
      const ytRaw = await callClaude(
        "You are an expert SEO copywriter for wedding videography. Return ONLY valid JSON with keys: title (max 100 chars), descriptionBody (the main content, max 300 words — do NOT include business contact details as these will be appended automatically), tags (array of 15 strings). No markdown.",
        `Generate YouTube metadata for a cinematic wedding film.\n${baseContext}\nTitle should include venue name and be SEO-friendly. descriptionBody should be compelling, describe the wedding and venue, and end with a soft call to action — but do NOT include any contact details, social links, or business footer (these are added automatically).`,
        user.apiKey
      );
      const ytParsed = JSON.parse(ytRaw.replace(/```json|```/g, "").trim());
      // Assemble the full description by appending the business footer
      const fullDescription = `${ytParsed.descriptionBody}\n\n${businessFooter}`;
      const yt = { ...ytParsed, description: fullDescription };

      setLoadingMsg("Writing your blog post...");
      const blogRaw = await callClaude(
        "You are an expert wedding blog writer for a UK wedding videography company. Write in a warm, first-person voice. Return ONLY valid JSON with keys: title (string), metaDescription (max 155 chars), content (full HTML, 900-1100 words using h2, h3, p, ul tags). No markdown wrapper.",
        `Write a venue guide blog post for ${user.businessName}.\n${baseContext}\nTarget keyword: "wedding videographer ${venue}". Include: scene-setting intro, filming highlights, lighting tips, personal anecdote if provided, insider tips, CTA to enquire.`,
        user.apiKey
      );
      const blog = JSON.parse(blogRaw.replace(/```json|```/g, "").trim());

      setGenerated({ yt, blog });
      setWizardStep(3);
    } catch (e) { setError("Generation failed: " + e.message); }
    finally { setLoading(false); setLoadingMsg(""); }
  };

  const publishToWordPress = async () => {
    const creds = btoa(`${user.wpUser}:${user.wpPass}`);
    const slug = generated.blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const res = await fetch(`${user.wpUrl.replace(/\/$/, "")}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${creds}` },
      body: JSON.stringify({ title: generated.blog.title, content: generated.blog.content, status: "draft", slug, excerpt: generated.blog.metaDescription, meta: { _seopress_titles_title: generated.yt.title, _seopress_titles_desc: generated.blog.metaDescription } }),
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e?.message || `WP error ${res.status}`); }
    const post = await res.json();
    return { id: post.id, editUrl: `${user.wpUrl.replace(/\/$/, "")}/wp-admin/post.php?post=${post.id}&action=edit` };
  };

  const handlePublish = async () => {
    setLoading(true); setError("");
    const results = {};
    try {
      setLoadingMsg("Creating WordPress draft...");
      const wpResult = await publishToWordPress();
      results.wordpress = { success: true, ...wpResult };
    } catch (e) { results.wordpress = { success: false, error: e.message }; }
    const users = getUsers();
    const userData = users[user.email];
    if (!userData.posts) userData.posts = [];
    userData.posts.unshift({ id: Date.now(), venue, date: weddingDate, location, ytTitle: generated.yt.title, blogTitle: generated.blog.title, wpPostId: results.wordpress?.id, wpEditUrl: results.wordpress?.editUrl, createdAt: new Date().toISOString() });
    users[user.email] = userData;
    saveUsers(users);
    onSaveUser(userData);
    setPublishResults(results);
    setLoading(false); setLoadingMsg("");
    setWizardStep(5);
  };

  const stepDone = s => wizardStep > s;
  const stepActive = s => wizardStep === s;

  return (
    <>
      {loading && <div className="loading-overlay"><div className="spinner"/><div className="loading-title">Generating</div><div className="loading-sub">{loadingMsg}</div></div>}
      <div className="steps">
        {[["1","Drop Video"],["2","Venue Details"],["3","Review"],["4","Publish"],["5","Done"]].map(([n,label],i,arr) => (
          <span key={n} style={{display:"contents"}}>
            <div className={`step ${stepDone(+n)?"done":stepActive(+n)?"active":""}`}>
              <div className="step-num">{stepDone(+n)?<Icon.Check/>:n}</div>
              <span className="step-label">{label}</span>
            </div>
            {i < arr.length-1 && <div className="step-line"/>}
          </span>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}<button style={{float:"right",background:"none",border:"none",color:"var(--text-dim)",cursor:"pointer"}} onClick={()=>setError("")}>✕</button></div>}

      {wizardStep === 1 && (
        <div className="card">
          <h2 className="card-title">Drop your wedding film</h2>
          <div className={`drop-zone ${dragOver?"drag-over":""} ${file?"file-selected":""}`}
            onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
            onDrop={onDrop} onClick={()=>fileRef.current.click()}>
            <input ref={fileRef} type="file" accept="video/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&setFile(e.target.files[0])}/>
            {file ? (<><div className="drop-icon">🎬</div><div className="drop-title">{file.name}</div><div className="drop-sub">{(file.size/1024/1024/1024).toFixed(2)} GB · Click to change</div></>) : (<><div className="drop-icon">📽</div><div className="drop-title">Drop your video file here</div><div className="drop-sub">MP4, MOV, MXF · Click to browse</div></>)}
          </div>
          <div style={{marginTop:20,display:"flex",justifyContent:"flex-end"}}>
            <button className="btn btn-primary" disabled={!file} onClick={()=>setWizardStep(2)}>Continue <Icon.Arrow /></button>
          </div>
        </div>
      )}

      {wizardStep === 2 && (
        <div className="card">
          <h2 className="card-title">Tell us about the wedding</h2>
          <p style={{color:"var(--text-dim)",fontSize:13,marginBottom:24}}>The more detail you provide, the richer your content.</p>
          <div className="grid-2">
            <div className="field"><label className="label">Venue Name *</label><input className="input" value={venue} onChange={e=>setVenue(e.target.value)} placeholder="Dewsall Court"/></div>
            <div className="field"><label className="label">Location / County</label><input className="input" value={location} onChange={e=>setLocation(e.target.value)} placeholder="Herefordshire"/></div>
          </div>
          <div className="field"><label className="label">Wedding Date</label><input className="input" type="date" value={weddingDate} onChange={e=>setWeddingDate(e.target.value)}/></div>
          <div className="divider"/>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:"var(--text-bright)",marginBottom:20}}>Venue & filming details</h3>
          {VENUE_QUESTIONS.map(q => (
            <div className="field" key={q.id}>
              <label className="label">{q.label} <span className="label-opt">optional</span></label>
              {q.type==="textarea"
                ? <textarea className="textarea" value={answers[q.id]||""} onChange={e=>setAnswer(q.id,e.target.value)} placeholder={q.placeholder} rows={3}/>
                : <input className="input" value={answers[q.id]||""} onChange={e=>setAnswer(q.id,e.target.value)} placeholder={q.placeholder}/>}
            </div>
          ))}
          <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:8}}>
            <button className="btn btn-ghost" onClick={()=>setWizardStep(1)}>Back</button>
            <button className="btn btn-primary" onClick={generateContent}>Generate Content <Icon.Arrow /></button>
          </div>
        </div>
      )}

      {wizardStep === 3 && generated && (
        <div className="card">
          <h2 className="card-title">Review & edit your content</h2>
          <p style={{color:"var(--text-dim)",fontSize:13,marginBottom:20}}>Edit anything before publishing.</p>
          <div className="tabs">
            <div className={`tab ${activeTab==="yt"?"active":""}`} onClick={()=>setActiveTab("yt")}>YouTube</div>
            <div className={`tab ${activeTab==="blog"?"active":""}`} onClick={()=>setActiveTab("blog")}>Blog Post</div>
          </div>
          {activeTab==="yt" && (
            <>
              <div className="field"><label className="label">YouTube Title</label>
                <input className="input" value={generated.yt.title} onChange={e=>setGenerated(g=>({...g,yt:{...g.yt,title:e.target.value}}))}/>
                <div className="char-count">{generated.yt.title?.length||0}/100</div>
              </div>
              <div className="field"><label className="label">YouTube Description</label>
                <div className="field-hint" style={{marginBottom:8}}>Business contact details & social links are included at the bottom automatically.</div>
                <textarea className="textarea" rows={12} value={generated.yt.description} onChange={e=>setGenerated(g=>({...g,yt:{...g.yt,description:e.target.value}}))}/>
              </div>
              <div className="field"><label className="label">Tags</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,padding:"12px",background:"var(--deep)",border:"1px solid var(--border)"}}>
                  {(generated.yt.tags||[]).map((t,i)=>(
                    <span key={i} className="tag tag-gold">{t}
                      <span style={{cursor:"pointer",opacity:0.6}} onClick={()=>setGenerated(g=>({...g,yt:{...g.yt,tags:g.yt.tags.filter((_,j)=>j!==i)}}))}>✕</span>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeTab==="blog" && (
            <>
              <div className="field"><label className="label">Post Title</label><input className="input" value={generated.blog.title} onChange={e=>setGenerated(g=>({...g,blog:{...g.blog,title:e.target.value}}))}/></div>
              <div className="field"><label className="label">Meta Description</label>
                <input className="input" value={generated.blog.metaDescription} onChange={e=>setGenerated(g=>({...g,blog:{...g.blog,metaDescription:e.target.value}}))}/>
                <div className="char-count">{generated.blog.metaDescription?.length||0}/155</div>
              </div>
              <div className="field"><label className="label">Blog Post Content (HTML)</label>
                <textarea className="textarea" rows={20} value={generated.blog.content} onChange={e=>setGenerated(g=>({...g,blog:{...g.blog,content:e.target.value}}))}/>
              </div>
            </>
          )}
          <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:8}}>
            <button className="btn btn-ghost" onClick={()=>setWizardStep(2)}>← Back</button>
            <button className="btn btn-ghost" onClick={generateContent}>Regenerate</button>
            <button className="btn btn-primary" onClick={()=>setWizardStep(4)}>Looks Good <Icon.Arrow /></button>
          </div>
        </div>
      )}

      {wizardStep === 4 && generated && (
        <div className="card">
          <h2 className="card-title">Ready to publish</h2>
          <div className="settings-row">
            <div><div className="settings-key">🎬 YouTube</div><div className="settings-val" style={{marginTop:4}}>{generated.yt.title}</div></div>
            <span style={{fontSize:12,color:"var(--text-dim)"}}>Copy & paste upload</span>
          </div>
          <div className="settings-row">
            <div><div className="settings-key">✍️ WordPress Draft</div><div className="settings-val" style={{marginTop:4}}>{generated.blog.title}</div></div>
            {user.wpUrl ? <span className="connected"><span className="status-dot green"/>Ready</span> : <span className="not-connected"><span className="status-dot red"/>Not connected</span>}
          </div>
          <div style={{marginTop:24,display:"flex",gap:12,justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={()=>setWizardStep(3)}>← Back</button>
            <button className="btn btn-primary" onClick={handlePublish}>Publish Now <Icon.Arrow /></button>
          </div>
        </div>
      )}

      {wizardStep === 5 && (
        <div className="card" style={{textAlign:"center"}}>
          <div className="success-icon">🎬</div>
          <h1 className="page-title">Done</h1>
          <p style={{color:"var(--text-dim)",marginBottom:8}}>{venue}{location?` · ${location}`:""}</p>
          <div className="success-links" style={{textAlign:"left"}}>
            {publishResults.wordpress?.success && (
              <a href={publishResults.wordpress.editUrl} target="_blank" rel="noreferrer" className="success-link">
                <div><div className="success-link-label">WordPress Draft Created</div><div className="success-link-url">{publishResults.wordpress.editUrl}</div></div>
                <Icon.External/>
              </a>
            )}
            {publishResults.wordpress?.success===false && <div className="alert alert-error">WordPress failed: {publishResults.wordpress.error}</div>}
            <div className="card" style={{textAlign:"left",margin:0,background:"var(--deep)"}}>
              <div className="preview-label">YouTube Description (with your business details)</div>
              <pre style={{color:"var(--text)",fontSize:12,whiteSpace:"pre-wrap",maxHeight:160,overflow:"hidden",fontFamily:"'DM Sans',sans-serif",lineHeight:1.7}}>{generated?.yt?.description?.slice(0,500)}...</pre>
              <button className="btn btn-ghost btn-sm" style={{marginTop:12}} onClick={()=>navigator.clipboard?.writeText(generated?.yt?.description||"")}>
                <Icon.Copy/> Copy Full Description
              </button>
            </div>
          </div>
          <div style={{marginTop:24}}>
            <div className="alert alert-info" style={{textAlign:"left",marginBottom:20}}>
              <strong>Next steps:</strong><br/>
              1. Review & publish your WordPress draft at the link above<br/>
              2. Upload your video to YouTube, paste the copied description<br/>
              3. Set focus keyphrase: <em>wedding videographer {venue}</em>
            </div>
            <button className="btn btn-primary" onClick={()=>{setWizardStep(1);setFile(null);setVenue("");setAnswers({});setGenerated(null);setPublishResults({});}}>+ New Film</button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function Settings({ user, onUpdate }) {
  const [form, setForm] = useState({...user});
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState("");
  const update = (k, v) => setForm(p => ({...p,[k]:v}));

  const save = () => {
    const users = getUsers();
    const updated = { ...form, instagram: (form.instagram||"").replace(/^@/,""), tiktok: (form.tiktok||"").replace(/^@/,"") };
    users[user.email] = { ...users[user.email], ...updated };
    saveUsers(users);
    onUpdate({ ...user, ...updated });
    setSaved(true); setTimeout(()=>setSaved(false),2500);
  };

  const testWP = async () => {
    try {
      const creds = btoa(`${form.wpUser}:${form.wpPass}`);
      const res = await fetch(`${form.wpUrl.replace(/\/$/, "")}/wp-json/wp/v2/users/me`, { headers: { Authorization: `Basic ${creds}` } });
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
          <div className="field"><label className="label">Your Name</label><input className="input" value={form.name} onChange={e=>update("name",e.target.value)}/></div>
          <div className="field"><label className="label">Business Name</label><input className="input" value={form.businessName} onChange={e=>update("businessName",e.target.value)}/></div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Business Profile</h2>
        <p style={{color:"var(--text-dim)",fontSize:13,marginBottom:20}}>These details appear automatically in every YouTube description.</p>
        <BusinessProfileFields form={form} update={update} />
      </div>

      <div className="card">
        <h2 className="card-title">Claude API Key</h2>
        <div className="field"><label className="label">API Key</label><input className="input" type="password" value={form.apiKey} onChange={e=>update("apiKey",e.target.value)}/></div>
        <p style={{fontSize:12,color:"var(--text-dim)"}}>Get your key at <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{color:"var(--gold)"}}>console.anthropic.com</a></p>
      </div>

      <div className="card">
        <h2 className="card-title">WordPress</h2>
        <div className="field"><label className="label">Site URL</label><input className="input" value={form.wpUrl||""} onChange={e=>update("wpUrl",e.target.value)} placeholder="https://www.your-site.com"/></div>
        <div className="grid-2">
          <div className="field"><label className="label">Username</label><input className="input" value={form.wpUser||""} onChange={e=>update("wpUser",e.target.value)}/></div>
          <div className="field"><label className="label">Application Password</label><input className="input" type="password" value={form.wpPass||""} onChange={e=>update("wpPass",e.target.value)}/></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button className="btn btn-ghost btn-sm" onClick={testWP}>Test Connection</button>
          {testResult && <span style={{fontSize:12,color:testResult.startsWith("✓")?"var(--green)":"var(--red)"}}>{testResult}</span>}
        </div>
      </div>

      <button className="btn btn-primary" onClick={save}>{saved?"✓ Saved":"Save Changes"}</button>
    </div>
  );
}

// ── History ───────────────────────────────────────────────────────────────────
function History({ user }) {
  const posts = user.posts || [];
  if (!posts.length) return (
    <div>
      <h1 className="page-title">History</h1>
      <p className="page-subtitle">Your published films and blog posts</p>
      <div className="card" style={{textAlign:"center",padding:"60px"}}>
        <div style={{fontSize:40,marginBottom:16,opacity:0.3}}>📋</div>
        <p style={{color:"var(--text-dim)"}}>No posts yet. Upload your first wedding film to get started.</p>
      </div>
    </div>
  );
  return (
    <div>
      <h1 className="page-title">History</h1>
      <p className="page-subtitle">{posts.length} film{posts.length!==1?"s":""} published</p>
      <div className="card">
        {posts.map(p=>(
          <div className="post-row" key={p.id}>
            <div>
              <div className="post-title-text">{p.venue}{p.location?` — ${p.location}`:""}</div>
              <div className="post-meta">{p.blogTitle}</div>
              <div className="post-meta" style={{marginTop:4}}>{new Date(p.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
            </div>
            {p.wpEditUrl && <a href={p.wpEditUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">WP Draft <Icon.External/></a>}
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

  useEffect(() => {
    const session = getSession();
    if (session) {
      const users = getUsers();
      const u = users[session.email];
      if (u) { setCurrentUser(u); setAuthState("app"); return; }
    }
    setAuthState(Object.keys(getUsers()).length === 0 ? "onboard" : "login");
  }, []);

  if (authState === "check") return <div style={{minHeight:"100vh",background:"var(--black)",display:"flex",alignItems:"center",justifyContent:"center"}}><div className="spinner" style={{width:40,height:40,borderWidth:3}}/></div>;
  if (authState === "onboard") return <Onboarding onComplete={u=>{setCurrentUser(u);setAuthState("app");}}/>;
  if (authState === "login") return <Login onLogin={u=>{setCurrentUser(u);setAuthState("app");}} onRegister={()=>setAuthState("onboard")}/>;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-mark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            </div>
            <span className="logo-text">FilmPost</span>
            <span className="logo-sub">by {currentUser?.businessName}</span>
          </div>
          <div className="header-actions">
            <span className="user-chip">{currentUser?.name}</span>
            <button className="btn btn-ghost btn-sm" onClick={()=>{clearSession();setCurrentUser(null);setAuthState("login");}}><Icon.Logout/> Sign out</button>
          </div>
        </header>
        <div className="main">
          <nav className="sidebar">
            <div className="nav-section">Publish</div>
            <div className={`nav-item ${page==="upload"?"active":""}`} onClick={()=>setPage("upload")}><Icon.Upload/> New Film</div>
            <div className="nav-section">Manage</div>
            <div className={`nav-item ${page==="history"?"active":""}`} onClick={()=>setPage("history")}><Icon.History/> History</div>
            <div className={`nav-item ${page==="settings"?"active":""}`} onClick={()=>setPage("settings")}><Icon.Settings/> Settings</div>
          </nav>
          <main className="content">
            {page==="upload" && <UploadWizard user={currentUser} onSaveUser={u=>setCurrentUser(u)}/>}
            {page==="history" && <History user={currentUser}/>}
            {page==="settings" && <Settings user={currentUser} onUpdate={u=>setCurrentUser(u)}/>}
          </main>
        </div>
      </div>
    </>
  );
}