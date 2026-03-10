import { buildBusinessFooter } from "../utils";

export function BusinessProfileFields({ form, update }) {
  const previewFooter = buildBusinessFooter(form);
  return (
    <>
      <div className="field">
        <label className="label">Business Tagline <span className="label-hint">(optional)</span></label>
        <input className="input" value={form.tagline || ""} onChange={e => update("tagline", e.target.value)} placeholder="e.g. Cinematic wedding films across the UK & Europe" />
      </div>
      <div className="grid-2">
        <div className="field">
          <label className="label">Enquiry Email</label>
          <input className="input" type="email" value={form.enquiry_email || ""} onChange={e => update("enquiry_email", e.target.value)} placeholder="info@yourdomain.com" />
        </div>
        <div className="field">
          <label className="label">Website <span className="label-hint">(optional)</span></label>
          <input className="input" value={form.website || ""} onChange={e => update("website", e.target.value)} placeholder="https://www.yourdomain.com" />
        </div>
      </div>
      <div className="grid-2">
        <div className="field">
          <label className="label">Instagram <span className="label-hint">(optional)</span></label>
          <div className="input-prefix-group">
            <span className="prefix">@</span>
            <input className="input" value={form.instagram || ""} onChange={e => update("instagram", e.target.value)} placeholder="yourhandle" />
          </div>
        </div>
        <div className="field">
          <label className="label">TikTok <span className="label-hint">(optional)</span></label>
          <div className="input-prefix-group">
            <span className="prefix">@</span>
            <input className="input" value={form.tiktok || ""} onChange={e => update("tiktok", e.target.value)} placeholder="yourhandle" />
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Facebook Page URL <span className="label-hint">(optional)</span></label>
        <input className="input" value={form.facebook || ""} onChange={e => update("facebook", e.target.value)} placeholder="https://www.facebook.com/yourpage" />
      </div>
      {(form.enquiry_email || form.instagram || form.website) && (
        <div className="profile-preview">
          <div className="profile-preview-label">YouTube Footer Preview</div>
          <pre>{previewFooter}</pre>
        </div>
      )}
    </>
  );
}
