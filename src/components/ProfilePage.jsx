import { useState, useEffect } from "react";
import { Icon } from "../icons";
import { supabase } from "../utils";
import { BusinessProfileFields } from "./BusinessProfileFields";

const SEO_PLUGINS = [
  { value: "", label: "None / not sure" },
  { value: "yoast", label: "Yoast SEO" },
  { value: "rankmath", label: "Rank Math" },
  { value: "aioseo", label: "All in One SEO" },
];

const PLATFORMS = [
  { value: "wordpress",   label: "WordPress",   icon: "WordPress" },
  { value: "squarespace", label: "Squarespace", icon: "Squarespace" },
  { value: "wix",         label: "Wix",         icon: "Wix" },
  { value: "pixieset",    label: "Pixieset",    icon: "Pixieset" },
];

export function ProfilePage({ user, onUpdate }) {
  const [form, setForm] = useState({
    business_name: user?.business_name || "",
    tagline: user?.tagline || "",
    enquiry_email: user?.enquiry_email || "",
    website: user?.website || "",
    instagram: user?.instagram || "",
    tiktok: user?.tiktok || "",
    facebook: user?.facebook || "",
    tone_of_voice: user?.tone_of_voice || "",
    seo_plugin: user?.seo_plugin || "",
    platform: user?.platform || "",
    featured_opt_in: user?.featured_opt_in || false,
  });
  // Keep form in sync if parent re-renders with updated user data
  useEffect(() => {
    setForm({
      business_name: user?.business_name || "",
      tagline: user?.tagline || "",
      enquiry_email: user?.enquiry_email || "",
      website: user?.website || "",
      instagram: user?.instagram || "",
      tiktok: user?.tiktok || "",
      facebook: user?.facebook || "",
      tone_of_voice: user?.tone_of_voice || "",
      seo_plugin: user?.seo_plugin || "",
      platform: user?.platform || "",
      featured_opt_in: user?.featured_opt_in || false,
    });
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const { error: err } = await supabase
        .from("users")
        .update(form)
        .eq("id", user.id);
      if (err) throw new Error(err.message);
      onUpdate?.({ ...user, ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-description">Manage your business information and branding.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner"></span> : saved ? <><Icon.Check /> Saved</> : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="main-body">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Business Details</h3>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
            <div className="field">
              <label className="label">Business Name</label>
              <input className="input" value={form.business_name} onChange={e => update("business_name", e.target.value)} />
            </div>
            <BusinessProfileFields form={form} update={update} />
          </div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <h3 className="card-title">Content Preferences</h3>
          </div>
          <div className="card-body">
            <div className="field">
              <label className="label">Tone of Voice <span className="label-hint">(optional)</span></label>
              <textarea
                className="input"
                rows={3}
                value={form.tone_of_voice}
                onChange={e => update("tone_of_voice", e.target.value)}
                placeholder="e.g. Warm and romantic, cinematic storytelling with a personal touch. Avoid corporate language."
              />
              <p className="form-hint">Used by AI when generating YouTube descriptions and blog posts.</p>
            </div>
            <div className="grid-2">
              <div className="field">
                <label className="label">Publishing Platform</label>
                <div className="platform-picker">
                  {PLATFORMS.map(p => {
                    const LogoIcon = Icon[p.icon];
                    return (
                      <button
                        key={p.value}
                        type="button"
                        className={`platform-card${form.platform === p.value ? " platform-card--selected" : ""}`}
                        onClick={() => update("platform", p.value)}
                      >
                        <LogoIcon />
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="field">
                <label className="label">SEO Plugin <span className="label-hint">(WordPress only)</span></label>
                <select className="input" value={form.seo_plugin} onChange={e => update("seo_plugin", e.target.value)}>
                  {SEO_PLUGINS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <h3 className="card-title">Community &amp; Visibility</h3>
          </div>
          <div className="card-body">
            <label className="featured-opt-in-label">
              <input
                type="checkbox"
                className="featured-opt-in-checkbox"
                checked={form.featured_opt_in}
                onChange={e => update("featured_opt_in", e.target.checked)}
              />
              <div className="featured-opt-in-text">
                <span className="featured-opt-in-heading">Feature my films on the FilmPost homepage</span>
                <span className="featured-opt-in-desc">
                  Allow a randomly selected film from my portfolio to play as a background video on the login screen, alongside my business name.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
