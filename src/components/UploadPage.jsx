import { useState, useCallback, useRef, useEffect } from "react";
import { Icon } from "../icons";
import { supabase, VENUE_QUESTIONS, buildBusinessFooter, callClaude } from "../utils";

const CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB

export function UploadPage({ user, onSuccess }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [venueName, setVenueName] = useState("");
  const [venueAnswers, setVenueAnswers] = useState({});
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeDesc, setYoutubeDesc] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");

  // Publish results
  const [wpResult, setWpResult] = useState(null);   // { success, editUrl?, error? }
  const [ytUploadUri, setYtUploadUri] = useState(null);
  const [ytUpload, setYtUpload] = useState({ state: "idle", progress: 0, videoId: null, error: null });
  const [savedPostId, setSavedPostId] = useState(null);

  const ytUploadStarted = useRef(false);
  const wpPostIdRef = useRef(null);       // WP post ID — needed by the upload useEffect
  const blogContentRef = useRef("");      // current blogContent — needed by the upload useEffect
  const dropRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  // Keep ref in sync so the upload useEffect always reads the latest blog content
  useEffect(() => { blogContentRef.current = blogContent; }, [blogContent]);

  // ── File handling ──────────────────────────────────────────────────────────
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f && f.type.startsWith("video/")) setFile(f);
  }, []);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("video/")) setFile(f);
  };

  // ── Generate content ───────────────────────────────────────────────────────
  const generateContent = async () => {
    setLoading(true); setLoadingMsg("Crafting your content with AI..."); setError("");
    try {
      const toneInstruction = user?.tone_of_voice
        ? `\n\nWrite in a style that reflects this brand voice: ${user.tone_of_voice}`
        : "";
      const systemPrompt = `You are an expert copywriter for luxury UK wedding videographers. Write in elegant British English, using evocative but authentic language. Avoid clichés and overly salesy phrasing. Focus on emotion, atmosphere, and the couple's story.${toneInstruction}`;
      const answersText = VENUE_QUESTIONS.map(q => venueAnswers[q.id] ? `${q.label}: ${venueAnswers[q.id]}` : "").filter(Boolean).join("\n");

      const title = await callClaude(systemPrompt, `Create a YouTube title for a wedding film at "${venueName}". Elegant, include venue name, under 70 characters. Return ONLY the title, no quotes.`);
      setYoutubeTitle(title.trim());

      const footer = buildBusinessFooter(user);
      const desc = await callClaude(systemPrompt, `Write a YouTube description for this wedding film:\nVenue: ${venueName}\n${answersText}\n\nInclude an evocative opening, filming highlights, then end with this exact footer:\n\n${footer}\n\nUnder 4000 characters. Return ONLY the description text.`);
      setYoutubeDesc(desc.trim());

      const seoPlugin = user?.seo_plugin || "";
      const seoSection = seoPlugin === "yoast" ? `

After the main blog post HTML, append this section EXACTLY as shown (labels and all), with values generated from the content above:

<!-- YOAST SEO -->
SEO Title: [max 60 characters, include venue name and keyword]
Meta Description: [max 155 characters, compelling summary]
Focus Keyphrase: [single keyword or short phrase]
Slug: [url-friendly, lowercase, hyphens, no domain]
<!-- END YOAST SEO -->`
        : seoPlugin === "rankmath" ? `

After the main blog post HTML, append this section EXACTLY as shown (labels and all), with values generated from the content above:

<!-- RANK MATH SEO -->
SEO Title: [max 60 characters, include venue name and keyword]
Meta Description: [max 155 characters, compelling summary]
Focus Keyword: [single keyword or short phrase]
Canonical Slug: [url-friendly, lowercase, hyphens, no domain]
<!-- END RANK MATH SEO -->`
        : seoPlugin === "aioseo" ? `

After the main blog post HTML, append this section EXACTLY as shown (labels and all), with values generated from the content above:

<!-- ALL IN ONE SEO -->
Post Title: [max 60 characters, include venue name and keyword]
Meta Description: [max 160 characters, compelling summary]
Focus Keyphrase: [single keyword or short phrase]
Slug: [url-friendly, lowercase, hyphens, no domain]
<!-- END ALL IN ONE SEO -->`
        : "";

      const blog = await callClaude(systemPrompt, `Write an 800-1200 word blog post about filming a wedding at "${venueName}" for a wedding videographer's website.\n\n${answersText}\n\nStructure: compelling headline, immersive opening, sections on venue/atmosphere/filming highlights, subtle CTA. Use HTML: <h2>, <p>, <strong>.${seoSection}\n\nReturn ONLY the HTML (and the SEO block if requested, as plain text after the HTML).`);
      setBlogContent(blog.trim());

      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false); setLoadingMsg("");
    }
  };

  // ── Publish ────────────────────────────────────────────────────────────────
  const publishContent = async () => {
    setLoading(true); setError("");
    let wp = null;
    let uploadUri = null;

    // 1. WordPress
    if (user.wp_url && user.wp_user && user.wp_pass) {
      setLoadingMsg("Creating WordPress draft...");
      try {
        const creds = btoa(`${user.wp_user}:${user.wp_pass}`);
        const slug = youtubeTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const res = await fetch(`${user.wp_url}/wp-json/wp/v2/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Basic ${creds}` },
          body: JSON.stringify({ title: youtubeTitle, content: blogContent, status: "draft", slug, excerpt: youtubeDesc.substring(0, 155) }),
        });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          wp = { success: false, error: e?.message || `WordPress error ${res.status}` };
        } else {
          const post = await res.json();
          wp = { success: true, editUrl: `${user.wp_url}/wp-admin/post.php?post=${post.id}&action=edit` };
          wpPostIdRef.current = post.id;
        }
      } catch (e) {
        wp = { success: false, error: e.message };
      }
    }

    // 2. Initiate YouTube resumable upload session (actual upload happens after step change)
    if (user.youtube_refresh_token && file) {
      setLoadingMsg("Preparing YouTube upload...");
      try {
        const res = await fetch("/api/youtube-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: youtubeTitle, description: youtubeDesc, tags: [], refreshToken: user.youtube_refresh_token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to initiate upload");
        uploadUri = data.uploadUri;
      } catch (e) {
        // Non-fatal — user can upload manually
        console.error("YouTube upload init failed:", e.message);
      }
    }

    // 3. Save post record to Supabase
    try {
      const { data: post } = await supabase.from("posts").insert([{
        user_id: user.id,
        venue_name: venueName,
        youtube_title: youtubeTitle,
        youtube_description: youtubeDesc,
        blog_content: blogContent,
        wp_edit_url: wp?.editUrl || null,
        status: uploadUri ? "uploading" : "published",
      }]).select().single();
      if (post?.id) setSavedPostId(post.id);
    } catch (e) {
      console.error("Failed to save post:", e.message);
    }

    setWpResult(wp);
    setYtUploadUri(uploadUri);
    setLoading(false); setLoadingMsg("");
    setStep(4);
    onSuccess?.();
  };

  // ── Chunked YouTube upload (fires when step 4 reached and uploadUri is set) ─
  useEffect(() => {
    if (step !== 4 || !ytUploadUri || !file || ytUploadStarted.current) return;
    ytUploadStarted.current = true;
    let aborted = false;

    const upload = async () => {
      setYtUpload({ state: "uploading", progress: 0, videoId: null, error: null });
      try {
        const totalSize = file.size;
        const contentType = file.type || "video/mp4";
        let offset = 0;
        while (offset < totalSize && !aborted) {
          const end = Math.min(offset + CHUNK_SIZE - 1, totalSize - 1);
          const chunk = file.slice(offset, end + 1);
          const contentRange = `bytes ${offset}-${end}/${totalSize}`;
          const res = await fetch(
            `/api/youtube-upload-chunk?uploadUri=${encodeURIComponent(ytUploadUri)}&contentRange=${encodeURIComponent(contentRange)}&contentType=${encodeURIComponent(contentType)}`,
            { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: chunk }
          );
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Upload failed (${res.status})`);
          }
          const data = await res.json();
          if (data.complete && data.videoId) {
            if (!aborted) {
              setYtUpload({ state: "done", progress: 100, videoId: data.videoId, error: null });

              const youtubeUrl = `https://www.youtube.com/watch?v=${data.videoId}`;

              // Update Supabase post record
              if (savedPostId) {
                await supabase.from("posts").update({
                  youtube_url: youtubeUrl,
                  status: "published",
                }).eq("id", savedPostId);
              }

              // Inject YouTube embed into the WordPress draft
              if (wpPostIdRef.current && user.wp_url && user.wp_user && user.wp_pass) {
                const embed = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">\n  <iframe src="https://www.youtube.com/embed/${data.videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen></iframe>\n</div>`;
                const content = blogContentRef.current;
                const insertAt = content.indexOf("</p>");
                const updatedContent = insertAt !== -1
                  ? content.slice(0, insertAt + 4) + "\n\n" + embed + "\n\n" + content.slice(insertAt + 4)
                  : embed + "\n\n" + content;
                await fetch(`${user.wp_url}/wp-json/wp/v2/posts/${wpPostIdRef.current}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Basic ${btoa(`${user.wp_user}:${user.wp_pass}`)}` },
                  body: JSON.stringify({ content: updatedContent }),
                }).catch(() => {}); // Non-fatal — embed missing is better than breaking the upload flow
              }
            }
            return;
          }
          offset = end + 1;
          const progress = Math.round((offset / totalSize) * 100);
          if (!aborted) setYtUpload(u => ({ ...u, progress }));
        }
      } catch (e) {
        if (!aborted) setYtUpload({ state: "idle", progress: 0, videoId: null, error: e.message });
      }
    };
    upload();
    return () => { aborted = true; };
  }, [step, ytUploadUri, file, savedPostId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <div className="main-header"><div><h1 className="page-title">New Upload</h1></div></div>
        <div className="main-body">
          <div className="card">
            <div className="card-body">
              <div className="loading-overlay" style={{ position: "relative", background: "transparent", minHeight: 400 }}>
                <div className="spinner spinner-lg"></div>
                <h3 className="loading-title">{loadingMsg}</h3>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">New Upload</h1>
          <p className="page-description">Upload a wedding film and generate content automatically.</p>
        </div>
      </div>

      <div className="main-body">
        <div className="stepper">
          {[["Upload Video", 1], ["Venue Details", 2], ["Review & Edit", 3], ["Published", 4]].map(([label, n], i, arr) => (
            <div key={n} style={{ display: "flex", alignItems: "center", flex: i < arr.length - 1 ? 1 : "none" }}>
              <div className={`step ${step >= n ? (step > n ? "completed" : "active") : ""}`}>
                <div className="step-number">{step > n ? <Icon.Check /> : n}</div>
                <span className="step-label">{label}</span>
              </div>
              {i < arr.length - 1 && <div className={`step-line ${step > n ? "completed" : ""}`} style={{ flex: 1 }}></div>}
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Step 1 — Upload Video */}
        {step === 1 && (
          <div className="card">
            <div className="card-header"><h3 className="card-title">Select Your Video</h3></div>
            <div className="card-body">
              <div
                ref={dropRef}
                className={`upload-zone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input id="fileInput" type="file" accept="video/*" hidden onChange={handleFileSelect} />
                <div className="upload-zone-icon">{file ? <Icon.Check /> : <Icon.Upload />}</div>
                <h3 className="upload-zone-title">{file ? file.name : "Drop your video here"}</h3>
                <p className="upload-zone-desc">{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "or click to browse"}</p>
              </div>
              <div style={{ marginTop: 32 }}>
                <button className="btn btn-primary btn-lg" disabled={!file} onClick={() => setStep(2)}>
                  Continue <Icon.Arrow />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Venue Details */}
        {step === 2 && (
          <div className="card">
            <div className="card-header"><h3 className="card-title">Tell us about the venue</h3></div>
            <div className="card-body">
              <div className="field">
                <label className="label">Venue Name</label>
                <input className="input" value={venueName} onChange={e => setVenueName(e.target.value)} placeholder="e.g. Aynhoe Park" />
              </div>
              {VENUE_QUESTIONS.map(q => (
                <div className="field" key={q.id}>
                  <label className="label">{q.label}</label>
                  {q.type === "textarea" ? (
                    <textarea className="textarea" value={venueAnswers[q.id] || ""} onChange={e => setVenueAnswers(a => ({ ...a, [q.id]: e.target.value }))} placeholder={q.placeholder} />
                  ) : (
                    <input className="input" value={venueAnswers[q.id] || ""} onChange={e => setVenueAnswers(a => ({ ...a, [q.id]: e.target.value }))} placeholder={q.placeholder} />
                  )}
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary btn-lg" disabled={!venueName} onClick={generateContent}>
                  Generate Content <Icon.Arrow />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Review & Edit */}
        {step === 3 && (
          <div className="card">
            <div className="card-header"><h3 className="card-title">Review Your Content</h3></div>
            <div className="card-body">
              <div className="field">
                <label className="label">YouTube Title</label>
                <input className="input" value={youtubeTitle} onChange={e => setYoutubeTitle(e.target.value)} />
                <div className="char-count">{youtubeTitle.length}/100</div>
              </div>
              <div className="field">
                <label className="label">YouTube Description</label>
                <textarea className="textarea" value={youtubeDesc} onChange={e => setYoutubeDesc(e.target.value)} style={{ minHeight: 200 }} />
                <div className="char-count">{youtubeDesc.length}/5000</div>
              </div>
              <div className="divider"></div>
              <div className="field">
                <label className="label">Blog Post</label>
                <textarea className="textarea" value={blogContent} onChange={e => setBlogContent(e.target.value)} style={{ minHeight: 300 }} />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary btn-lg" onClick={publishContent}>
                  Publish Now <Icon.Arrow />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Results */}
        {step === 4 && (
          <div className="card">
            <div className="card-body">
              <div className="success-screen">
                <div className="success-icon-large"><Icon.Check /></div>
                <h2 className="success-title">Content Published</h2>

                <div className="success-links">
                  {/* WordPress result */}
                  {wpResult?.success ? (
                    <a href={wpResult.editUrl} target="_blank" rel="noopener noreferrer" className="success-link">
                      <div className="success-link-info">
                        <div className="success-link-label">WordPress Draft Created</div>
                        <div className="success-link-url">{wpResult.editUrl}</div>
                      </div>
                      <Icon.External />
                    </a>
                  ) : wpResult?.error ? (
                    <div className="success-link" style={{ borderColor: "var(--error)" }}>
                      <div className="success-link-info">
                        <div className="success-link-label" style={{ color: "var(--error)" }}>WordPress failed</div>
                        <div className="success-link-url">{wpResult.error}</div>
                      </div>
                    </div>
                  ) : !user.wp_url ? (
                    <div className="success-link" style={{ opacity: 0.5 }}>
                      <div className="success-link-info">
                        <div className="success-link-label">WordPress not connected</div>
                        <div className="success-link-url">Connect in Settings to auto-publish</div>
                      </div>
                    </div>
                  ) : null}

                  {/* YouTube result */}
                  {!user.youtube_refresh_token ? (
                    <div className="success-link" style={{ opacity: 0.5 }}>
                      <div className="success-link-info">
                        <div className="success-link-label">YouTube not connected</div>
                        <div className="success-link-url">Connect in Settings to auto-upload</div>
                      </div>
                    </div>
                  ) : ytUpload.state === "uploading" ? (
                    <div className="success-link">
                      <div className="success-link-info" style={{ width: "100%" }}>
                        <div className="success-link-label">Uploading to YouTube… {ytUpload.progress}%</div>
                        <div className="progress-bar" style={{ marginTop: 8 }}>
                          <div className="progress-fill" style={{ width: `${ytUpload.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ) : ytUpload.state === "done" ? (
                    <a href={`https://www.youtube.com/watch?v=${ytUpload.videoId}`} target="_blank" rel="noopener noreferrer" className="success-link">
                      <div className="success-link-info">
                        <div className="success-link-label">YouTube — Processing (set to Private)</div>
                        <div className="success-link-url">youtube.com/watch?v={ytUpload.videoId}</div>
                      </div>
                      <Icon.External />
                    </a>
                  ) : ytUpload.error ? (
                    <div className="success-link" style={{ borderColor: "var(--error)" }}>
                      <div className="success-link-info">
                        <div className="success-link-label" style={{ color: "var(--error)" }}>YouTube upload failed</div>
                        <div className="success-link-url">{ytUpload.error}</div>
                      </div>
                    </div>
                  ) : !ytUploadUri ? (
                    <div className="success-link" style={{ opacity: 0.5 }}>
                      <div className="success-link-info">
                        <div className="success-link-label">YouTube upload unavailable</div>
                        <div className="success-link-url">No file selected or upload could not be initiated</div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <button className="btn btn-primary" style={{ marginTop: 32 }} onClick={() => { setStep(1); setFile(null); setVenueName(""); setVenueAnswers({}); setYoutubeTitle(""); setYoutubeDesc(""); setBlogContent(""); setWpResult(null); setYtUploadUri(null); setYtUpload({ state: "idle", progress: 0, videoId: null, error: null }); ytUploadStarted.current = false; wpPostIdRef.current = null; blogContentRef.current = ""; }}>
                  + New Film
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
