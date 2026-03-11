import { useState, useEffect } from "react";
import { supabase } from "../utils";

const VENUE_TYPES = ["Barn", "Country House", "Manor", "Hotel", "Church", "Garden", "Marquee", "Pub", "Other"];

export function VenueFormPanel({ venue, prefillName = "", userId, onClose, onSaved }) {
  const [form, setForm] = useState({
    venue_name: venue?.venue_name || prefillName,
    location: venue?.location || "",
    venue_type: venue?.venue_type || "",
    capacity: venue?.capacity || "",
    indoor_outdoor: venue?.indoor_outdoor || "both",
    lighting_notes: venue?.lighting_notes || "",
    filming_highlights: venue?.filming_highlights || "",
    general_notes: venue?.general_notes || (venue?.style_notes || ""),
    website_url: venue?.website_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Lock body scroll while panel is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.venue_name.trim()) { setError("Venue name is required."); return; }
    if (!form.location.trim()) { setError("Town / county / region is required."); return; }
    setSaving(true);
    setError("");
    const payload = {
      venue_name: form.venue_name.trim(),
      location: form.location.trim(),
      venue_type: form.venue_type || null,
      capacity: form.capacity.trim() || null,
      indoor_outdoor: form.indoor_outdoor || "both",
      lighting_notes: form.lighting_notes.trim() || null,
      filming_highlights: form.filming_highlights.trim() || null,
      general_notes: form.general_notes.trim() || null,
      website_url: form.website_url.trim() || null,
    };

    let data, err;
    if (venue?.id) {
      ({ data, error: err } = await supabase.from("venues").update(payload).eq("id", venue.id).select().single());
    } else {
      ({ data, error: err } = await supabase.from("venues").insert([{ ...payload, user_id: userId }]).select().single());
    }

    if (err == null) {
      onSaved(data);
    } else {
      setError(err.message || "Save failed. Please try again.");
    }
    setSaving(false);
  };

  return (
    <div className="ss-backdrop" onClick={onClose}>
      <div className="ss-panel" onClick={e => e.stopPropagation()}>
        <div className="ss-panel-header">
          <h2 className="ss-panel-title">{venue ? "Edit Venue" : "Add Venue"}</h2>
          <button className="ss-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="ss-panel-body venue-form-body">
          <div className="venue-form-row">
            <div className="field">
              <label className="label">Venue Name <span className="label-required">*</span></label>
              <input className="input" value={form.venue_name} onChange={e => set("venue_name", e.target.value)} placeholder="e.g. Hampton Manor" />
            </div>
            <div className="field">
              <label className="label">Town / County / Region <span className="label-required">*</span></label>
              <input className="input" value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Solihull, West Midlands" />
            </div>
          </div>

          <div className="venue-form-row">
            <div className="field">
              <label className="label">Venue Type</label>
              <select className="input" value={form.venue_type} onChange={e => set("venue_type", e.target.value)}>
                <option value="">— Select type —</option>
                {VENUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">Capacity</label>
              <input className="input" value={form.capacity} onChange={e => set("capacity", e.target.value)} placeholder="e.g. 120 guests" />
            </div>
          </div>

          <div className="field">
            <label className="label">Indoor / Outdoor</label>
            <div className="venue-toggle">
              {["indoor", "outdoor", "both"].map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`venue-toggle-btn${form.indoor_outdoor === opt ? " active" : ""}`}
                  onClick={() => set("indoor_outdoor", opt)}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="label">Lighting Notes</label>
            <textarea
              className="textarea"
              value={form.lighting_notes}
              onChange={e => set("lighting_notes", e.target.value)}
              placeholder="e.g. Dark interior, beautiful golden hour from the south lawn, harsh overhead lights in ceremony room"
              style={{ minHeight: 80 }}
            />
          </div>

          <div className="field">
            <label className="label">Filming Highlights</label>
            <textarea
              className="textarea"
              value={form.filming_highlights}
              onChange={e => set("filming_highlights", e.target.value)}
              placeholder="e.g. Oak-lined driveway, walled garden, dramatic staircase perfect for a first look"
              style={{ minHeight: 80 }}
            />
          </div>

          <div className="field">
            <label className="label">General Notes</label>
            <textarea
              className="textarea"
              value={form.general_notes}
              onChange={e => set("general_notes", e.target.value)}
              placeholder="Any other details worth remembering…"
              style={{ minHeight: 80 }}
            />
          </div>

          <div className="field">
            <label className="label">Website URL</label>
            <input
              className="input"
              type="url"
              value={form.website_url}
              onChange={e => set("website_url", e.target.value)}
              placeholder="https://www.venuename.co.uk"
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}
        </div>

        <div className="ss-panel-footer">
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <span className="spinner" /> : venue ? "Save Changes" : "Add Venue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
