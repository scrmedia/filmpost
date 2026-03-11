import { useState, useEffect } from "react";
import { Icon } from "../icons";
import { supabase, callClaude } from "../utils";

// ── Diff engine ───────────────────────────────────────────────────────────────
function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(text) {
  return text.match(/\S+|\s+/g) || [];
}

function diffWords(oldText, newText) {
  const a = tokenize(oldText);
  const b = tokenize(newText);
  const m = a.length;
  const n = b.length;

  const dp = new Uint32Array((m + 1) * (n + 1));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i * (n + 1) + j] = a[i - 1] === b[j - 1]
        ? dp[(i - 1) * (n + 1) + (j - 1)] + 1
        : Math.max(dp[(i - 1) * (n + 1) + j], dp[i * (n + 1) + (j - 1)]);
    }
  }

  const ops = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.unshift({ t: "=", s: a[i - 1] }); i--; j--;
    } else if (j > 0 && (i === 0 || dp[i * (n + 1) + (j - 1)] >= dp[(i - 1) * (n + 1) + j])) {
      ops.unshift({ t: "+", s: b[j - 1] }); j--;
    } else {
      ops.unshift({ t: "-", s: a[i - 1] }); i--;
    }
  }
  return ops;
}

// ── SEO block parser ──────────────────────────────────────────────────────────
// Extracts key/value pairs from the plugin comment block appended to blog_content.
function parseSeoBlock(blogContent, plugin) {
  if (!plugin || !blogContent) return null;
  const tags = {
    yoast:    ["<!-- YOAST SEO -->",       "<!-- END YOAST SEO -->"],
    rankmath: ["<!-- RANK MATH SEO -->",   "<!-- END RANK MATH SEO -->"],
    aioseo:   ["<!-- ALL IN ONE SEO -->",  "<!-- END ALL IN ONE SEO -->"],
  };
  const [startTag, endTag] = tags[plugin] || [];
  if (!startTag) return null;
  const start = blogContent.indexOf(startTag);
  const end   = blogContent.indexOf(endTag);
  if (start === -1 || end === -1) return null;
  const block = blogContent.slice(start + startTag.length, end).trim();
  const fields = {};
  block.split("\n").forEach(line => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return;
    const key   = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key && value) fields[key] = value;
  });
  return Object.keys(fields).length > 0 ? fields : null;
}

// ── PostInfo ──────────────────────────────────────────────────────────────────
// Shows YouTube link, optional SEO data, and featured films for roundup posts.
function PostInfo({ post, allPosts, seoPlugin }) {
  const [seoOpen, setSeoOpen]     = useState(false);
  const [filmsOpen, setFilmsOpen] = useState(false);

  const seoData = parseSeoBlock(post.blog_content, seoPlugin);
  const featuredPosts = (post.featured_post_ids || [])
    .map(id => allPosts.find(p => p.id === id))
    .filter(Boolean);

  return (
    <div className="post-info-section">
      <div className="post-info-row">
        {/* YouTube link or status */}
        {post.yt_url ? (
          <a
            href={post.yt_url}
            target="_blank"
            rel="noopener noreferrer"
            className="post-info-yt-link"
          >
            <Icon.YouTube /> Watch on YouTube
          </a>
        ) : (
          <span className="post-info-yt-pending">
            {post.status === "uploading" ? "YouTube upload in progress" : "No YouTube link"}
          </span>
        )}

        {/* SEO data toggle */}
        {seoData && (
          <button className="post-info-toggle" onClick={() => setSeoOpen(o => !o)}>
            SEO Data {seoOpen ? "▲" : "▼"}
          </button>
        )}

        {/* Featured films toggle (roundup only) */}
        {featuredPosts.length > 0 && (
          <button className="post-info-toggle" onClick={() => setFilmsOpen(o => !o)}>
            {featuredPosts.length} Featured Film{featuredPosts.length !== 1 ? "s" : ""} {filmsOpen ? "▲" : "▼"}
          </button>
        )}
      </div>

      {/* SEO fields */}
      {seoOpen && seoData && (
        <div className="post-seo-data">
          {Object.entries(seoData).map(([key, value]) => (
            <div key={key} className="post-seo-field">
              <span className="post-seo-label">{key}</span>
              <span className="post-seo-value">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Featured films list */}
      {filmsOpen && featuredPosts.length > 0 && (
        <div className="post-featured-films">
          {featuredPosts.map(fp => (
            <div key={fp.id} className="post-featured-film">
              <span className="post-featured-film-venue">{fp.venue || "Unknown venue"}</span>
              {fp.yt_url ? (
                <a
                  href={fp.yt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post-featured-film-link"
                >
                  <Icon.YouTube /> Watch
                </a>
              ) : (
                <span className="post-featured-film-no-yt">No video</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── BlogRewriter ──────────────────────────────────────────────────────────────
function BlogRewriter({ post, onVersionSaved }) {
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null);
  const [showVersions, setShowVersions] = useState(false);
  const [error, setError] = useState("");

  const versions = post.blog_versions?.length > 0
    ? post.blog_versions
    : [{ v: 1, content: post.blog_content, saved_at: post.created_at }];

  const currentContent = post.blog_content || "";

  const handleTweak = async () => {
    if (!instruction.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const revised = await callClaude(
        "You are a blog post editor. Apply the user's instruction to the HTML blog post precisely. Return ONLY the revised HTML — no explanation, no preamble. Maintain all existing HTML tags and structure. Do not change the YouTube title, description, or any metadata.",
        `Here is the current blog post HTML:\n\n${currentContent}\n\nInstruction: ${instruction.trim()}\n\nReturn ONLY the revised HTML.`
      );
      const revContent = revised.trim();
      const diff = diffWords(stripHtml(currentContent), stripHtml(revContent));
      setPending({ content: revContent, diff });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeep = async () => {
    const newVersions = [
      ...versions,
      { v: versions.length + 1, content: pending.content, saved_at: new Date().toISOString() },
    ];
    try {
      const { error: err } = await supabase.from("posts").update({
        blog_content: pending.content,
        blog_versions: newVersions,
      }).eq("id", post.id);
      if (err) throw new Error(err.message);
      onVersionSaved(post.id, pending.content, newVersions);
      setPending(null);
      setInstruction("");
    } catch (e) {
      setError(e.message);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="blog-rewriter">
      <div className="blog-rewriter-section">
        <div className="blog-rewriter-label">
          <span>Blog post</span>
          {versions.length > 1 && (
            <button
              className="version-toggle-btn"
              onClick={() => setShowVersions(v => !v)}
            >
              {versions.length} versions {showVersions ? "▲" : "▼"}
            </button>
          )}
        </div>

        {showVersions && (
          <div className="version-history">
            {[...versions].reverse().map((ver, i) => (
              <div key={ver.v} className={`version-item${i === 0 ? " version-current" : ""}`}>
                <div className="version-item-meta">
                  <span className="version-badge">v{ver.v}{i === 0 ? " · current" : ""}</span>
                  <span className="version-date">{formatDate(ver.saved_at)}</span>
                </div>
                <div className="version-preview">
                  {stripHtml(ver.content).slice(0, 180)}…
                </div>
              </div>
            ))}
          </div>
        )}

        <textarea
          className="textarea"
          value={currentContent}
          readOnly
          style={{ minHeight: 180, opacity: 0.75, cursor: "default", marginTop: 12 }}
        />
      </div>

      {pending && (
        <div className="diff-view">
          <div className="diff-header">
            <span className="diff-title">Proposed revision</span>
            <div className="diff-legend">
              <span className="diff-legend-pill diff-legend-add">+ Added</span>
              <span className="diff-legend-pill diff-legend-remove">− Removed</span>
            </div>
          </div>
          <div className="diff-content">
            {pending.diff.map((op, idx) =>
              op.t === "=" ? (
                <span key={idx}>{op.s}</span>
              ) : op.t === "+" ? (
                <mark key={idx} className="diff-add">{op.s}</mark>
              ) : (
                <del key={idx} className="diff-remove">{op.s}</del>
              )
            )}
          </div>
          {error && <div className="alert alert-error" style={{ marginTop: 12 }}>{error}</div>}
          <div className="diff-actions">
            <button className="btn btn-primary" onClick={handleKeep}>Keep this version</button>
            <button className="btn btn-secondary" onClick={() => { setPending(null); setError(""); }}>Discard</button>
          </div>
        </div>
      )}

      {!pending && (
        <div className="tweak-section">
          <label className="label">Tweak blog post</label>
          <div className="tweak-input-row">
            <input
              className="input"
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && handleTweak()}
              placeholder="e.g. Make the intro shorter, add more detail about the ceremony…"
              disabled={loading}
            />
            <button
              className="btn btn-primary"
              onClick={handleTweak}
              disabled={!instruction.trim() || loading}
            >
              {loading ? <span className="spinner" /> : "Tweak blog post"}
            </button>
          </div>
          {error && <div className="alert alert-error" style={{ marginTop: 8 }}>{error}</div>}
        </div>
      )}
    </div>
  );
}

// ── DeleteConfirmDialog ───────────────────────────────────────────────────────
function DeleteConfirmDialog({ onCancel, onConfirm, deleting }) {
  return (
    <div className="delete-dialog-backdrop" onClick={onCancel}>
      <div className="delete-dialog" onClick={e => e.stopPropagation()}>
        <h3 className="delete-dialog-title">Delete this post?</h3>
        <p className="delete-dialog-body">This cannot be undone.</p>
        <div className="delete-dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={deleting}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? <span className="spinner" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── HistoryPage ───────────────────────────────────────────────────────────────
export function HistoryPage({ posts, user }) {
  const [localPosts, setLocalPosts] = useState(posts);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null); // { postId, message }

  useEffect(() => { setLocalPosts(posts); }, [posts]);

  const handleVersionSaved = (postId, newContent, newVersions) => {
    setLocalPosts(prev =>
      prev.map(p => p.id === postId
        ? { ...p, blog_content: newContent, blog_versions: newVersions }
        : p
      )
    );
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setDeleteError(null);
    const { error } = await supabase.from("posts").delete().eq("id", confirmDeleteId);
    if (error == null) {
      setLocalPosts(prev => prev.filter(p => p.id !== confirmDeleteId));
      setConfirmDeleteId(null);
      if (expandedId === confirmDeleteId) setExpandedId(null);
    } else {
      setDeleteError({ postId: confirmDeleteId, message: error.message || "Delete failed. Please try again." });
      setConfirmDeleteId(null);
    }
    setDeleting(false);
  };

  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">History</h1>
          <p className="page-description">All your published wedding films and blog posts.</p>
        </div>
      </div>

      <div className="main-body">
        <div className="card">
          <div className="card-body no-padding">
            {localPosts && localPosts.length > 0 ? (
              <div className="uploads-list">
                {localPosts.map((post) => {
                  const isExpanded = expandedId === post.id;
                  const versionCount = post.blog_versions?.length || 0;
                  const isRoundup = post.post_type === "roundup";
                  return (
                    <div key={post.id} className="upload-item-wrapper">
                      <div
                        className={`upload-item upload-item--deletable${isExpanded ? " is-expanded" : ""}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setExpandedId(isExpanded ? null : post.id)}
                      >
                        <div className="upload-thumbnail"><Icon.Video /></div>
                        <div className="upload-info">
                          <div className="upload-title">{post.yt_title || "Untitled"}</div>
                          <div className="upload-meta">
                            {isRoundup && <span className="roundup-badge">Area Roundup</span>}
                            <span>{post.venue}</span>
                            {isRoundup && post.target_keyword && (
                              <span className="upload-meta-keyword">{post.target_keyword}</span>
                            )}
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            {versionCount > 1 && (
                              <span style={{ color: "var(--accent)" }}>v{versionCount}</span>
                            )}
                          </div>
                          {/* YouTube link — always visible in row */}
                          <div className="upload-yt-row">
                            {post.yt_url ? (
                              <a
                                href={post.yt_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="upload-yt-link"
                                onClick={e => e.stopPropagation()}
                              >
                                <Icon.YouTube /> Watch on YouTube
                              </a>
                            ) : post.status === "uploading" ? (
                              <span className="upload-yt-pending">Upload pending</span>
                            ) : null}
                          </div>
                        </div>
                        <div className={`upload-status ${post.status === "published" ? "published" : post.status === "uploading" ? "processing" : "draft"}`}>
                          <span className="status-dot"></span>
                          {post.status === "published" ? "Published" : post.status === "uploading" ? "Uploading" : "Draft"}
                        </div>
                        <button
                          className="upload-delete-btn"
                          title="Delete post"
                          onClick={e => { e.stopPropagation(); setConfirmDeleteId(post.id); setDeleteError(null); }}
                        >
                          <TrashIcon />
                        </button>
                        <div className="upload-expand-chevron">
                          {isExpanded ? "▲" : "▼"}
                        </div>
                      </div>

                      {deleteError?.postId === post.id && (
                        <div className="alert alert-error" style={{ margin: "0 24px 12px" }}>
                          {deleteError.message}
                        </div>
                      )}

                      {isExpanded && (
                        <div className="upload-expanded">
                          <PostInfo
                            post={post}
                            allPosts={localPosts}
                            seoPlugin={user?.seo_plugin}
                          />
                          <BlogRewriter
                            post={post}
                            onVersionSaved={handleVersionSaved}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon"><Icon.History /></div>
                <h4 className="empty-title">No uploads yet</h4>
                <p className="empty-desc">Once you upload and publish wedding films, they will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {confirmDeleteId && (
        <DeleteConfirmDialog
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      )}
    </>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}
