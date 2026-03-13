import { useState, useEffect, useCallback } from "react";
import { Icon } from "../icons";
import { supabase, callClaude, buildBusinessFooter } from "../utils";

const MAX_SELECTION = 10;

const SYSTEM_PROMPT_BASE =
  "You are a wedding videographer writing about your own work. Write like a real person who films weddings for a living — warm, genuine, and specific to the day. Use plain British English. No fancy words, no flowery language, no corporate tone. Write short sentences. Be direct. Sound human. Never use these words or phrases: breathtaking, stunning, magical, timeless, seamlessly, meticulously, elegant, bespoke, enchanting, nestled, picturesque, idyllic, effortlessly, truly, really special, or any em dashes (\u2014).";

function buildSystemPrompt(user) {
  const tone = user?.tone_of_voice
    ? `\n\nWrite in a style that reflects this brand voice: ${user.tone_of_voice}`
    : "";
  return SYSTEM_PROMPT_BASE + tone;
}

function buildEnrichmentContext(enrichment) {
  const parts = [];
  if (enrichment.venue) parts.push(`Venue: ${enrichment.venue}`);
  if (enrichment.location) parts.push(`Location / area: ${enrichment.location}`);
  if (enrichment.styleNotes) parts.push(`Wedding style: ${enrichment.styleNotes}`);
  if (enrichment.otherNotes) parts.push(`Additional notes: ${enrichment.otherNotes}`);
  return parts.length > 0 ? parts.join(". ") + "." : "";
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatViews(n) {
  const num = parseInt(n, 10);
  if (isNaN(num)) return "0 views";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
  return `${num} views`;
}

// ── CopyButton ─────────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };
  return (
    <button className="optimise-copy-btn" onClick={handleCopy} title="Copy to clipboard">
      {copied ? <Icon.Check /> : <Icon.Copy />}
    </button>
  );
}

// ── BrowsePhase ────────────────────────────────────────────────────────────────
function BrowsePhase({ user, videos, setVideos, selected, setSelected, onNext }) {
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(videos.length === 0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [capNotice, setCapNotice] = useState(false);

  const fetchPage = useCallback(async (pageToken = null) => {
    const res = await fetch("/api/youtube-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: user.youtube_refresh_token, pageToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load videos");
    return data;
  }, [user.youtube_refresh_token]);

  useEffect(() => {
    if (videos.length > 0) return; // already loaded — keep list on back navigation
    let cancelled = false;
    setLoading(true);
    fetchPage()
      .then(data => {
        if (cancelled) return;
        setVideos(data.videos || []);
        setNextPageToken(data.nextPageToken || null);
      })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [fetchPage, videos.length, setVideos]);

  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchPage(nextPageToken);
      setVideos(prev => [...prev, ...(data.videos || [])]);
      setNextPageToken(data.nextPageToken || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const toggleSelect = (videoId) => {
    setCapNotice(false);
    if (selected.has(videoId)) {
      setSelected(prev => { const s = new Set(prev); s.delete(videoId); return s; });
    } else {
      if (selected.size >= MAX_SELECTION) {
        setCapNotice(true);
        return;
      }
      setSelected(prev => new Set(prev).add(videoId));
    }
  };

  if (!user.youtube_refresh_token) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><Icon.YouTube /></div>
        <h4 className="empty-title">YouTube not connected</h4>
        <p className="empty-desc">Connect your YouTube account in Settings to optimise existing videos.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="optimise-loading">
        <span className="spinner spinner-lg" />
        <p>Loading your YouTube uploads...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (videos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><Icon.Video /></div>
        <h4 className="empty-title">No uploads found</h4>
        <p className="empty-desc">No videos were found on your connected YouTube channel.</p>
      </div>
    );
  }

  return (
    <>
      {capNotice && (
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          Maximum {MAX_SELECTION} videos can be optimised at once.
        </div>
      )}

      <div className="optimise-video-grid">
        {videos.map(video => {
          const isSelected = selected.has(video.id);
          return (
            <div
              key={video.id}
              className={`optimise-video-card${isSelected ? " is-selected" : ""}`}
              onClick={() => toggleSelect(video.id)}
            >
              <div className="optimise-card-thumb-wrap">
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title} className="optimise-card-thumb" />
                ) : (
                  <div className="optimise-card-thumb-placeholder"><Icon.Video /></div>
                )}
                <div className={`optimise-card-checkbox${isSelected ? " checked" : ""}`}>
                  {isSelected && <Icon.Check />}
                </div>
              </div>
              <div className="optimise-card-body">
                <div className="optimise-card-title">{video.title}</div>
                <div className="optimise-card-desc">{video.description}</div>
                <div className="optimise-card-meta">
                  <span>{formatDate(video.publishedAt)}</span>
                  <span>{formatViews(video.viewCount)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {nextPageToken && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button className="btn btn-secondary" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? <span className="spinner" /> : "Load more videos"}
          </button>
        </div>
      )}

      <div className="optimise-browse-footer">
        <span className="optimise-selected-label">
          {selected.size > 0
            ? `${selected.size} video${selected.size !== 1 ? "s" : ""} selected`
            : "Select videos to optimise"}
        </span>
        <button className="btn btn-primary" onClick={onNext} disabled={selected.size === 0}>
          Optimise selected ({selected.size}) →
        </button>
      </div>
    </>
  );
}

// ── EnrichPhase ────────────────────────────────────────────────────────────────
function EnrichPhase({ selectedVideos, enrichment, setEnrichment, onBack, onNext }) {
  return (
    <>
      <div className="optimise-enrich-panel">
        <div className="optimise-selection-summary">
          <p className="optimise-selection-summary-label">
            {selectedVideos.length} video{selectedVideos.length !== 1 ? "s" : ""} selected:
          </p>
          <div className="optimise-selection-thumbs">
            {selectedVideos.map(v => (
              <div key={v.id} className="optimise-selection-thumb-item">
                {v.thumbnailUrl
                  ? <img src={v.thumbnailUrl} alt={v.title} className="optimise-selection-thumb" />
                  : <div className="optimise-selection-thumb optimise-selection-thumb--blank"><Icon.Video /></div>
                }
                <span className="optimise-selection-thumb-title">{v.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="optimise-enrich-fields">
          <p className="optimise-enrich-note">
            These details are optional and will be applied to all selected videos.
            Leave blank and Claude will use each video's existing title and description only.
          </p>
          <div className="form-group">
            <label className="label">Venue name</label>
            <input className="input" placeholder="e.g. Brinkburn Priory"
              value={enrichment.venue}
              onChange={e => setEnrichment(p => ({ ...p, venue: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="label">Location / area</label>
            <input className="input" placeholder="e.g. Northumberland, The Cotswolds"
              value={enrichment.location}
              onChange={e => setEnrichment(p => ({ ...p, location: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="label">Wedding style notes</label>
            <input className="input" placeholder="e.g. relaxed outdoor ceremony, golden hour light"
              value={enrichment.styleNotes}
              onChange={e => setEnrichment(p => ({ ...p, styleNotes: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="label">Other notes</label>
            <input className="input" placeholder="Anything else to help generate better content"
              value={enrichment.otherNotes}
              onChange={e => setEnrichment(p => ({ ...p, otherNotes: e.target.value }))} />
          </div>
        </div>
      </div>

      <div className="optimise-phase-footer">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext}>Generate content →</button>
      </div>
    </>
  );
}

// ── GeneratingPhase ────────────────────────────────────────────────────────────
function GeneratingPhase({ selectedVideos, enrichment, user, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Starting...");
  const total = selectedVideos.length;

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const systemPrompt = buildSystemPrompt(user);
      const enrichmentContext = buildEnrichmentContext(enrichment);
      const footer = buildBusinessFooter(user);
      const results = [];

      for (let i = 0; i < selectedVideos.length; i++) {
        if (cancelled) return;
        const video = selectedVideos[i];
        setCurrentIndex(i);
        setProgressLabel(`Generating video ${i + 1} of ${total}...`);

        try {
          const ctx = enrichmentContext ? ` ${enrichmentContext}` : "";

          // Title
          const titlePrompt = `Generate a new YouTube title for this wedding film. Current title: "${video.title}".${ctx} Max 70 characters. Include venue name and/or location if available. Sound natural. Return ONLY the title, nothing else.`;
          const newTitle = (await callClaude(systemPrompt, titlePrompt)).trim();

          // Description + tags
          const footerInstruction = footer
            ? `End with this exact footer:\n\n${footer}\n\n`
            : "";
          const descPrompt = `Write a new YouTube description for this wedding film. Current title: "${video.title}". Current description: "${video.description.slice(0, 500)}".${ctx} Start with a short warm opening paragraph. Weave in relevant keywords naturally. Include location and venue references where available. ${footerInstruction}Also return 12 comma-separated tags on a final line starting with "TAGS:". Under 4000 characters total.`;
          const rawDesc = (await callClaude(systemPrompt, descPrompt)).trim();

          const tagsMarker = rawDesc.lastIndexOf("\nTAGS:");
          let newDescription = rawDesc;
          let newTags = [];
          if (tagsMarker !== -1) {
            newDescription = rawDesc.slice(0, tagsMarker).trim();
            newTags = rawDesc.slice(tagsMarker + "\nTAGS:".length).trim().split(",").map(t => t.trim()).filter(Boolean);
          }

          results.push({ video, newTitle, newDescription, newTags, error: null });
        } catch (e) {
          results.push({ video, newTitle: "", newDescription: "", newTags: [], error: e.message });
        }
      }

      if (!cancelled) {
        setProgressLabel("Done!");
        onComplete(results);
      }
    };

    run();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="optimise-generating">
      <span className="spinner spinner-lg" />
      <p className="optimise-generating-label">{progressLabel}</p>
      <div className="optimise-progress-bar-track">
        <div
          className="optimise-progress-bar-fill"
          style={{ width: total > 0 ? `${Math.round((currentIndex / total) * 100)}%` : "0%" }}
        />
      </div>
      {selectedVideos.map((v, i) => (
        <div key={v.id} className="optimise-progress-row">
          <span className={`optimise-progress-status${i < currentIndex ? " done" : i === currentIndex ? " active" : ""}`}>
            {i < currentIndex
              ? <span style={{ color: "var(--success)" }}><Icon.Check /></span>
              : i === currentIndex
              ? <span className="spinner" />
              : <span className="optimise-progress-dot" />}
          </span>
          <span className="optimise-progress-title">{v.title}</span>
        </div>
      ))}
    </div>
  );
}

// ── ReviewPhase ────────────────────────────────────────────────────────────────
function ReviewPhase({ results, reviewed, setReviewed, approved, setApproved, onBack, onPush }) {
  const approvedCount = results.filter(r => approved.has(r.video.id)).length;

  const toggleApprove = (videoId) => {
    setApproved(prev => {
      const s = new Set(prev);
      if (s.has(videoId)) s.delete(videoId); else s.add(videoId);
      return s;
    });
  };

  const updateReviewed = (videoId, field, value) => {
    setReviewed(prev => ({ ...prev, [videoId]: { ...(prev[videoId] || {}), [field]: value } }));
  };

  return (
    <>
      <p className="optimise-review-intro">
        Review and edit the generated content below. Only approved videos will be pushed to YouTube.
      </p>

      {results.map(result => {
        const { video, newTitle, newDescription, newTags, error } = result;
        const rev = reviewed[video.id] || {};
        const isApproved = approved.has(video.id);
        const editedTitle = rev.title !== undefined ? rev.title : newTitle;
        const editedDesc = rev.description !== undefined ? rev.description : newDescription;

        return (
          <div key={video.id} className={`optimise-review-card${!isApproved ? " is-unapproved" : ""}`}>
            <div className="optimise-review-card-header">
              <div className="optimise-review-thumb-wrap">
                {video.thumbnailUrl
                  ? <img src={video.thumbnailUrl} alt={video.title} className="optimise-review-thumb" />
                  : <div className="optimise-review-thumb-blank"><Icon.Video /></div>
                }
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="upload-yt-link"
                  style={{ marginTop: 8 }}
                >
                  <Icon.YouTube /> View on YouTube
                </a>
              </div>
              <label className="optimise-approve-label">
                <input type="checkbox" checked={isApproved} onChange={() => toggleApprove(video.id)} />
                Approve
              </label>
            </div>

            {error ? (
              <div className="alert alert-error" style={{ margin: "12px 0" }}>
                Generation failed: {error}
              </div>
            ) : (
              <div className="optimise-before-after">
                {/* Title */}
                <div className="optimise-ba-row">
                  <div className="optimise-ba-col">
                    <div className="optimise-ba-label">Current title</div>
                    <div className="optimise-ba-readonly">{video.title}</div>
                  </div>
                  <div className="optimise-ba-col">
                    <div className="optimise-ba-label optimise-ba-label--new">
                      New title <CopyButton text={editedTitle} />
                    </div>
                    <input className="input" value={editedTitle} disabled={!isApproved}
                      onChange={e => updateReviewed(video.id, "title", e.target.value)} />
                    <div className="optimise-char-count" style={{ color: editedTitle.length > 70 ? "var(--error)" : "var(--text-muted)" }}>
                      {editedTitle.length}/70
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="optimise-ba-row">
                  <div className="optimise-ba-col">
                    <div className="optimise-ba-label">Current description</div>
                    <textarea className="textarea" value={video.description} readOnly rows={6}
                      style={{ opacity: 0.55, cursor: "default", resize: "none" }} />
                  </div>
                  <div className="optimise-ba-col">
                    <div className="optimise-ba-label optimise-ba-label--new">
                      New description <CopyButton text={editedDesc} />
                    </div>
                    <textarea className="textarea" value={editedDesc} rows={10} disabled={!isApproved}
                      onChange={e => updateReviewed(video.id, "description", e.target.value)} />
                  </div>
                </div>

                {/* Tags */}
                {newTags.length > 0 && (
                  <div className="optimise-tags-row">
                    <div className="optimise-ba-label">
                      Proposed tags <CopyButton text={newTags.join(", ")} />
                    </div>
                    <div className="optimise-tag-chips">
                      {newTags.map((tag, i) => <span key={i} className="optimise-tag-chip">{tag}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="optimise-phase-footer">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onPush} disabled={approvedCount === 0}>
          Push {approvedCount} approved update{approvedCount !== 1 ? "s" : ""} to YouTube →
        </button>
      </div>
    </>
  );
}

// ── PushingPhase ───────────────────────────────────────────────────────────────
function PushingPhase({ results, reviewed, approved, enrichment, user, onComplete }) {
  const [statuses, setStatuses] = useState({});
  const approvedResults = results.filter(r => approved.has(r.video.id));

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const outcomes = {};

      for (const result of approvedResults) {
        if (cancelled) return;
        const { video, newTitle, newDescription, newTags } = result;
        const rev = reviewed[video.id] || {};
        const finalTitle = rev.title !== undefined ? rev.title : newTitle;
        const finalDesc = rev.description !== undefined ? rev.description : newDescription;

        setStatuses(prev => ({ ...prev, [video.id]: "pushing" }));

        try {
          const res = await fetch("/api/youtube-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              videoId: video.id,
              title: finalTitle,
              description: finalDesc,
              tags: newTags,
              categoryId: video.categoryId,
              refreshToken: user.youtube_refresh_token,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Update failed");

          await supabase.from("posts").insert([{
            user_id: user.id,
            venue: enrichment.venue || "",
            target_keyword: enrichment.location || "",
            yt_url: `https://www.youtube.com/watch?v=${video.id}`,
            yt_title: finalTitle,
            yt_description: finalDesc,
            status: "published",
          }]);

          outcomes[video.id] = { success: true };
          setStatuses(prev => ({ ...prev, [video.id]: "success" }));
        } catch (e) {
          outcomes[video.id] = { success: false, error: e.message };
          setStatuses(prev => ({ ...prev, [video.id]: "error:" + e.message }));
        }
      }

      if (!cancelled) onComplete(outcomes);
    };

    run();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="optimise-generating">
      <p style={{ color: "var(--text-secondary)", marginBottom: 20, fontSize: 14 }}>
        Pushing updates to YouTube...
      </p>
      {approvedResults.map(result => {
        const status = statuses[result.video.id];
        const isError = status?.startsWith("error:");
        return (
          <div key={result.video.id} className="optimise-progress-row">
            <span className="optimise-progress-status">
              {!status || status === "pushing"
                ? <span className="spinner" />
                : status === "success"
                ? <span style={{ color: "var(--success)" }}><Icon.Check /></span>
                : <span style={{ color: "var(--error)", fontWeight: 600 }}>✕</span>}
            </span>
            <span className="optimise-progress-title">{result.video.title}</span>
            {isError && <span className="optimise-push-error">{status.slice(6)}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ── DonePhase ──────────────────────────────────────────────────────────────────
function DonePhase({ outcomes, onOptimiseMore, onDone }) {
  const entries = Object.entries(outcomes);
  const successes = entries.filter(([, v]) => v.success).length;
  const failures = entries.filter(([, v]) => !v.success);

  return (
    <div className="optimise-done">
      <div className="empty-icon" style={{
        background: successes > 0 ? "rgba(34, 197, 94, 0.1)" : "var(--surface-elevated)",
        color: successes > 0 ? "var(--success)" : "var(--text-muted)",
      }}>
        <Icon.Check />
      </div>
      <h3 className="empty-title">
        {successes} video{successes !== 1 ? "s" : ""} updated successfully
        {failures.length > 0 ? `, ${failures.length} failed` : ""}
      </h3>
      {failures.length > 0 && (
        <div className="optimise-failures">
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Failed updates:</p>
          {failures.map(([videoId, outcome]) => (
            <div key={videoId} className="optimise-failure-row">
              <span style={{ color: "var(--error)", fontSize: 13 }}>{outcome.error}</span>
            </div>
          ))}
        </div>
      )}
      <div className="optimise-done-actions">
        <button className="btn btn-secondary" onClick={onOptimiseMore}>Optimise more videos</button>
        <button className="btn btn-primary" onClick={onDone}>Go to History</button>
      </div>
    </div>
  );
}

// ── OptimisePage ───────────────────────────────────────────────────────────────
export function OptimisePage({ user, onPostSaved, onDone }) {
  const [phase, setPhase] = useState("browse");
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [enrichment, setEnrichment] = useState({ venue: "", location: "", styleNotes: "", otherNotes: "" });
  const [generationResults, setGenerationResults] = useState([]);
  const [reviewed, setReviewed] = useState({});
  const [approved, setApproved] = useState(new Set());
  const [pushOutcomes, setPushOutcomes] = useState({});

  const selectedVideos = videos.filter(v => selected.has(v.id));

  const handleGenerationComplete = (results) => {
    setGenerationResults(results);
    setApproved(new Set(results.filter(r => !r.error).map(r => r.video.id)));
    setPhase("review");
  };

  const handlePushComplete = (outcomes) => {
    setPushOutcomes(outcomes);
    onPostSaved?.();
    setPhase("done");
  };

  const handleOptimiseMore = () => {
    setSelected(new Set());
    setEnrichment({ venue: "", location: "", styleNotes: "", otherNotes: "" });
    setGenerationResults([]);
    setReviewed({});
    setApproved(new Set());
    setPushOutcomes({});
    setPhase("browse");
    // videos intentionally kept — no re-fetch needed
  };

  const STEP_LABELS = ["Select Videos", "Add Context", "Generating", "Review & Edit", "Done"];
  const STEP_PHASES = ["browse", "enrich", "generating", "review", "done"];
  const currentStep = STEP_PHASES.indexOf(phase);

  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">Optimise Existing Videos</h1>
          <p className="page-description">
            Re-generate SEO titles, descriptions, and tags for your existing YouTube uploads.
          </p>
        </div>
      </div>

      <div className="main-body">
        <div className="optimise-steps">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className={`optimise-step${i < currentStep ? " done" : i === currentStep ? " active" : ""}`}>
              <div className="optimise-step-dot">
                {i < currentStep ? <Icon.Check /> : <span>{i + 1}</span>}
              </div>
              <span className="optimise-step-label">{label}</span>
            </div>
          ))}
        </div>

        {phase === "browse" && (
          <BrowsePhase
            user={user}
            videos={videos}
            setVideos={setVideos}
            selected={selected}
            setSelected={setSelected}
            onNext={() => setPhase("enrich")}
          />
        )}

        {phase === "enrich" && (
          <EnrichPhase
            selectedVideos={selectedVideos}
            enrichment={enrichment}
            setEnrichment={setEnrichment}
            onBack={() => setPhase("browse")}
            onNext={() => setPhase("generating")}
          />
        )}

        {phase === "generating" && (
          <GeneratingPhase
            selectedVideos={selectedVideos}
            enrichment={enrichment}
            user={user}
            onComplete={handleGenerationComplete}
          />
        )}

        {phase === "review" && (
          <ReviewPhase
            results={generationResults}
            reviewed={reviewed}
            setReviewed={setReviewed}
            approved={approved}
            setApproved={setApproved}
            onBack={() => setPhase("enrich")}
            onPush={() => setPhase("pushing")}
          />
        )}

        {phase === "pushing" && (
          <PushingPhase
            results={generationResults}
            reviewed={reviewed}
            approved={approved}
            enrichment={enrichment}
            user={user}
            onComplete={handlePushComplete}
          />
        )}

        {phase === "done" && (
          <DonePhase
            outcomes={pushOutcomes}
            onOptimiseMore={handleOptimiseMore}
            onDone={onDone}
          />
        )}
      </div>
    </>
  );
}
