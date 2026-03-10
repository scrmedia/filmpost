import { useState, useEffect } from "react";
import { Icon } from "../icons";
import { supabase, callClaude } from "../utils";

// ── Diff engine ───────────────────────────────────────────────────────────────
// Strips HTML tags and normalises whitespace for plain-text diffing.
function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// Tokenises text into words and whitespace runs so both are preserved in output.
function tokenize(text) {
  return text.match(/\S+|\s+/g) || [];
}

// Word-level LCS diff. Returns array of { t: '='|'+'|'-', s: string }.
function diffWords(oldText, newText) {
  const a = tokenize(oldText);
  const b = tokenize(newText);
  const m = a.length;
  const n = b.length;

  // Build LCS DP table using flat Uint32Array for efficiency.
  const dp = new Uint32Array((m + 1) * (n + 1));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i * (n + 1) + j] = a[i - 1] === b[j - 1]
        ? dp[(i - 1) * (n + 1) + (j - 1)] + 1
        : Math.max(dp[(i - 1) * (n + 1) + j], dp[i * (n + 1) + (j - 1)]);
    }
  }

  // Backtrack to produce diff operations.
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

// ── BlogRewriter ──────────────────────────────────────────────────────────────
function BlogRewriter({ post, onVersionSaved }) {
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null); // { content: string, diff: op[] }
  const [showVersions, setShowVersions] = useState(false);
  const [error, setError] = useState("");

  // Synthesise v1 from blog_content for posts saved before version tracking existed.
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

      {/* Current blog content + version history toggle */}
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

      {/* Pending diff view */}
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

      {/* Tweak input — hidden while a diff is pending */}
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

// ── HistoryPage ───────────────────────────────────────────────────────────────
export function HistoryPage({ posts, user }) {
  const [localPosts, setLocalPosts] = useState(posts);
  const [expandedId, setExpandedId] = useState(null);

  // Keep in sync when App.jsx reloads posts (e.g. after a new upload).
  useEffect(() => { setLocalPosts(posts); }, [posts]);

  const handleVersionSaved = (postId, newContent, newVersions) => {
    setLocalPosts(prev =>
      prev.map(p => p.id === postId
        ? { ...p, blog_content: newContent, blog_versions: newVersions }
        : p
      )
    );
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
                  return (
                    <div key={post.id} className="upload-item-wrapper">
                      <div
                        className={`upload-item${isExpanded ? " is-expanded" : ""}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setExpandedId(isExpanded ? null : post.id)}
                      >
                        <div className="upload-thumbnail"><Icon.Video /></div>
                        <div className="upload-info">
                          <div className="upload-title">{post.youtube_title || "Untitled"}</div>
                          <div className="upload-meta">
                            <span>{post.venue_name}</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            {versionCount > 1 && (
                              <span style={{ color: "var(--accent)" }}>v{versionCount}</span>
                            )}
                          </div>
                        </div>
                        <div className={`upload-status ${post.status === "published" ? "published" : post.status === "uploading" ? "processing" : "draft"}`}>
                          <span className="status-dot"></span>
                          {post.status === "published" ? "Published" : post.status === "uploading" ? "Uploading" : "Draft"}
                        </div>
                        <div className="upload-expand-chevron">
                          {isExpanded ? "▲" : "▼"}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="upload-expanded">
                          <BlogRewriter
                            post={post}
                            user={user}
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
    </>
  );
}
