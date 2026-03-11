import { useState, useEffect } from "react";
import { Icon } from "../icons";
import { supabase } from "../utils";

export function SquarespaceExport({
  venueName,
  youtubeTitle,
  blogContent,
  youtubeDesc,
  heroImagePreview,
  savedPostId,
  onClose,
  onPublished,
}) {
  const storageKey = savedPostId ? `ss_export_${savedPostId}` : null;

  const [checked, setChecked] = useState(() => {
    if (!storageKey) return {};
    try { return JSON.parse(localStorage.getItem(storageKey)) || {}; }
    catch { return {}; }
  });

  const [copied, setCopied] = useState(null); // step number currently showing "Copied"
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  // Persist checked state across open/close
  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  // Lock body scroll while panel is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const allChecked = [1, 2, 3, 4, 5, 6].every(n => checked[n]);
  const toggle = n => setChecked(c => ({ ...c, [n]: !c[n] }));

  const copy = async (text, stepNum) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(stepNum);
      setTimeout(() => setCopied(null), 2000);
    } catch (_) { /* clipboard not available */ }
  };

  const metaDesc = youtubeDesc ? youtubeDesc.substring(0, 155) : "";
  const slug = venueName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-wedding-videographer";

  const downloadImage = () => {
    if (!heroImagePreview) return;
    const a = document.createElement("a");
    a.href = heroImagePreview;
    a.download = `${slug}-featured-image.jpg`;
    a.click();
  };

  const handleMarkPublished = async () => {
    setPublishing(true);
    setPublishError("");
    try {
      if (savedPostId) {
        const { error } = await supabase
          .from("posts")
          .update({ status: "published" })
          .eq("id", savedPostId);
        if (error) throw new Error(error.message);
      }
      if (storageKey) localStorage.removeItem(storageKey);
      onPublished?.();
    } catch (e) {
      setPublishError(e.message);
      setPublishing(false);
    }
  };

  const CopyBtn = ({ text, stepNum, label }) => (
    <button
      className={`btn btn-secondary ss-copy-btn${copied === stepNum ? " ss-copy-btn--done" : ""}`}
      onClick={() => copy(text, stepNum)}
    >
      {copied === stepNum
        ? <><Icon.Check /><span>Copied</span></>
        : <><Icon.Copy /><span>{label}</span></>}
    </button>
  );

  const steps = [
    {
      num: 1,
      title: "Open Squarespace",
      body: (
        <>
          <p className="ss-instruction">Open your Squarespace dashboard and create a new blog post.</p>
          <a
            href="https://www.squarespace.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Open Squarespace <Icon.External />
          </a>
        </>
      ),
    },
    {
      num: 2,
      title: "Post Title",
      body: (
        <div className="ss-copy-row">
          <div className="ss-text-box">{youtubeTitle}</div>
          <CopyBtn text={youtubeTitle} stepNum={2} label="Copy Title" />
        </div>
      ),
    },
    {
      num: 3,
      title: "Blog Content",
      body: (
        <>
          <CopyBtn text={blogContent} stepNum={3} label="Copy Blog Content" />
          <p className="ss-tip">
            In Squarespace, add a Code Block and paste the content there — this keeps your headings and formatting intact.
          </p>
        </>
      ),
    },
    {
      num: 4,
      title: "Featured Image",
      body: heroImagePreview ? (
        <div className="ss-image-row">
          <img src={heroImagePreview} alt="Featured" className="ss-thumbnail" />
          <div>
            <p className="ss-instruction">Upload this image as the Featured Image in your Squarespace post settings.</p>
            <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={downloadImage}>
              Download Image
            </button>
          </div>
        </div>
      ) : (
        <p className="ss-instruction" style={{ opacity: 0.4 }}>No hero image was uploaded — you can add one directly in Squarespace.</p>
      ),
    },
    {
      num: 5,
      title: "Meta Description",
      body: (
        <div className="ss-copy-row">
          <div className="ss-text-box">{metaDesc}</div>
          <CopyBtn text={metaDesc} stepNum={5} label="Copy Meta Description" />
        </div>
      ),
    },
    {
      num: 6,
      title: "URL Slug",
      body: (
        <>
          <div className="ss-copy-row">
            <div className="ss-text-box ss-text-box--mono">{slug}</div>
            <CopyBtn text={slug} stepNum={6} label="Copy Slug" />
          </div>
          <p className="ss-tip">
            Paste this into the URL field in your Squarespace post settings for the best SEO result.
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="ss-backdrop" onClick={onClose} />
      <div className="ss-panel" role="dialog" aria-modal="true" aria-label="Publish to Squarespace">

        {/* Header */}
        <div className="ss-panel-header">
          <div>
            <h2 className="ss-panel-title">Publish to Squarespace</h2>
            <p className="ss-panel-subtitle">Follow each step and check it off as you go.</p>
          </div>
          <button className="ss-close-btn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Steps */}
        <div className="ss-steps">
          {steps.map(({ num, title, body }) => (
            <div key={num} className={`ss-step${checked[num] ? " ss-step--checked" : ""}`}>
              <button
                className={`ss-checkbox${checked[num] ? " ss-checkbox--checked" : ""}`}
                onClick={() => toggle(num)}
                aria-label={`Step ${num}: ${checked[num] ? "unmark" : "mark"} complete`}
              >
                {checked[num] && <Icon.Check />}
              </button>
              <div className="ss-step-body">
                <div className="ss-step-label">
                  <span className="ss-step-num">Step {num}</span>
                  <span className="ss-step-title">{title}</span>
                </div>
                <div className="ss-step-content">{body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="ss-panel-footer">
          {publishError && (
            <div className="alert alert-error" style={{ marginBottom: 12 }}>{publishError}</div>
          )}
          <button
            className="btn btn-primary btn-lg"
            disabled={!allChecked || publishing}
            style={!allChecked || publishing ? { opacity: 0.4, cursor: "not-allowed" } : {}}
            onClick={handleMarkPublished}
          >
            {publishing ? "Saving…" : "Mark as Published"}
          </button>
          {!allChecked && (
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>
              Tick all six steps above to mark as published.
            </p>
          )}
        </div>

      </div>
    </>
  );
}
