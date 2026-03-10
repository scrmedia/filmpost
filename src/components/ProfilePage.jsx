import { useState } from "react";
import { Icon } from "../icons";
import { supabase } from "../utils";
import { BusinessProfileFields } from "./BusinessProfileFields";

export function ProfilePage({ user, onUpdate }) {
  const [form, setForm] = useState({
    business_name: user?.business_name || "",
    tagline: user?.tagline || "",
    enquiry_email: user?.enquiry_email || "",
    website: user?.website || "",
    instagram: user?.instagram || "",
    tiktok: user?.tiktok || "",
    facebook: user?.facebook || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update(form)
        .eq("id", user.id);
      if (error) throw error;
      onUpdate?.({ ...user, ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
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
            <div className="field">
              <label className="label">Business Name</label>
              <input className="input" value={form.business_name} onChange={e => update("business_name", e.target.value)} />
            </div>
            <BusinessProfileFields form={form} update={update} />
          </div>
        </div>
      </div>
    </>
  );
}
