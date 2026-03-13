import { useState } from "react";
import { supabase } from "../utils";
import { Icon } from "../icons";

export default function OtherExport({ blogContent, metaDescription, urlSlug, savedPostId, onClose, onPublished }) {
  const [copied, setCopied] = useState(null); // "html" | "meta" | "slug"
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const copy = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleMarkPublished = async () => {
    setPublishing(true);
    await supabase.from("posts").update({ status: "published" }).eq("id", savedPostId);
    setPublished(true);
    setPublishing(false);
    onPublished?.();
  };

  return (
    <div className="ss-backdrop" onClick={onClose}>
      <div className="ss-panel other-export-panel" onClick={e => e.stopPropagation()}>
        <div className="ss-panel-header">
          <h2 className="ss-panel-title">Export HTML</h2>
          <button className="ss-close-btn" onClick={onClose}><Icon.X /></button>
        </div>

        <div className="other-export-body">
          <p className="other-export-hint">
            Copy the HTML below and paste it into your CMS's HTML/code block or custom post editor.
          </p>

          <div className="other-export-section">
            <div className="other-export-section-header">
              <span className="other-export-section-label">Full Blog HTML</span>
              <button className="btn btn-secondary btn-sm" onClick={() => copy(blogContent, "html")}>
                {copied === "html" ? <><Icon.Check /> Copied!</> : <><Icon.Copy /> Copy HTML</>}
              </button>
            </div>
            <pre className="other-export-code">{blogContent}</pre>
          </div>

          <div className="other-export-section">
            <div className="other-export-section-header">
              <span className="other-export-section-label">Meta Description</span>
              <button className="btn btn-secondary btn-sm" onClick={() => copy(metaDescription, "meta")}>
                {copied === "meta" ? <><Icon.Check /> Copied!</> : <><Icon.Copy /> Copy</>}
              </button>
            </div>
            <p className="other-export-meta-text">{metaDescription}</p>
          </div>

          <div className="other-export-section">
            <div className="other-export-section-header">
              <span className="other-export-section-label">URL Slug</span>
              <button className="btn btn-secondary btn-sm" onClick={() => copy(urlSlug, "slug")}>
                {copied === "slug" ? <><Icon.Check /> Copied!</> : <><Icon.Copy /> Copy</>}
              </button>
            </div>
            <code className="other-export-slug">{urlSlug}</code>
            <p className="other-export-seo-tip">💡 Use this as your post URL slug for best SEO results.</p>
          </div>
        </div>

        <div className="ss-panel-footer">
          {published ? (
            <span className="other-export-published-badge"><Icon.Check /> Marked as published</span>
          ) : (
            <button className="btn btn-primary" onClick={handleMarkPublished} disabled={publishing}>
              {publishing ? "Saving…" : "Mark as Published"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
