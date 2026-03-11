import { useState, useRef } from "react";
import { Icon } from "../icons";
import { supabase, callClaude } from "../utils";
import { SquarespaceExport } from "./SquarespaceExport";
import { WixExport } from "./WixExport";
import { PixiesetExport } from "./PixiesetExport";

function getYtThumbnail(ytUrl) {
  if (!ytUrl) return null;
  const match = ytUrl.match(/[?&]v=([^&]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export function RoundupPage({ user, posts, onDone }) {
  const [step, setStep] = useState(1);
  const [targetArea, setTargetArea] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [selectedPostIds, setSelectedPostIds] = useState([]);

  // Hero image (optional — used as WordPress featured image)
  const [heroImage, setHeroImage] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const heroImageRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");

  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeDesc, setYoutubeDesc] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [savedPostId, setSavedPostId] = useState(null);

  const [wpResult, setWpResult] = useState(null);
  const [cmsPublished, setCmsPublished] = useState("");
  const [ssOpen, setSsOpen] = useState(false);
  const [wixOpen, setWixOpen] = useState(false);
  const [pixiesetOpen, setPixiesetOpen] = useState(false);

  // Keep heroImageRef in sync for the publish step
  const handleHeroImageSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (heroImagePreview) URL.revokeObjectURL(heroImagePreview);
    setHeroImage(f);
    setHeroImagePreview(URL.createObjectURL(f));
    heroImageRef.current = f;
  };

  // All posts available for selection (any with content)
  const availablePosts = (posts || []).filter(p => p.post_type !== "roundup");
  const selectedPosts = availablePosts.filter(p => selectedPostIds.includes(p.id));

  const togglePost = (id) => {
    setSelectedPostIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 6 ? [...prev, id] : prev
    );
  };

  const handleAreaChange = (val) => {
    setTargetArea(val);
    // Auto-suggest keyword only if user hasn't manually edited it
    setTargetKeyword(prev => {
      if (!prev || prev === `Wedding videographer in ${targetArea}`) {
        return val ? `Wedding videographer in ${val}` : "";
      }
      return prev;
    });
  };

  // ── Generate ───────────────────────────────────────────────────────────────
  const generateContent = async () => {
    setLoading(true);
    setLoadingMsg("Crafting your roundup post with AI...");
    setError("");
    try {
      const toneInstruction = user?.tone_of_voice
        ? `\n\nWrite in a style that reflects this brand voice: ${user.tone_of_voice}`
        : "";
      const systemPrompt = `You are a wedding videographer writing about your own work. Write like a real person who films weddings for a living — warm, genuine, and specific to the day. Use plain British English. No fancy words, no flowery language, no corporate tone. Write short sentences. Be direct. Sound human. Never use these words or phrases: breathtaking, stunning, magical, timeless, seamlessly, meticulously, elegant, bespoke, enchanting, nestled, picturesque, idyllic, effortlessly, truly, really special, or any em dashes (—).${toneInstruction}`;

      const postSummaries = selectedPosts.map((p, i) => {
        const summary = p.blog_content
          ? p.blog_content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300)
          : "";
        const ytId = p.yt_url?.match(/[?&]v=([^&]+)/)?.[1];
        return [
          `Wedding ${i + 1}: ${p.yt_title || p.venue || "Untitled"}`,
          `Venue: ${p.venue || "Unknown"}`,
          `Date: ${new Date(p.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`,
          p.yt_url ? `YouTube URL: ${p.yt_url}` : "",
          ytId ? `YouTube Embed ID: ${ytId}` : "",
          summary ? `Content summary: ${summary}` : "",
        ].filter(Boolean).join("\n");
      }).join("\n\n---\n\n");

      const seoPlugin = user?.seo_plugin || "";
      const seoSection = seoPlugin === "yoast"
        ? `\n\nAfter the main blog post HTML, append this section EXACTLY as shown:\n\n<!-- YOAST SEO -->\nSEO Title: [max 60 characters, include area and keyword]\nMeta Description: [max 155 characters]\nFocus Keyphrase: [single keyword or short phrase]\nSlug: [url-friendly, lowercase, hyphens, no domain]\n<!-- END YOAST SEO -->`
        : seoPlugin === "rankmath"
        ? `\n\nAfter the main blog post HTML, append:\n\n<!-- RANK MATH SEO -->\nSEO Title: [max 60 characters]\nMeta Description: [max 155 characters]\nFocus Keyword: [single keyword]\nCanonical Slug: [url-friendly slug]\n<!-- END RANK MATH SEO -->`
        : seoPlugin === "aioseo"
        ? `\n\nAfter the main blog post HTML, append:\n\n<!-- ALL IN ONE SEO -->\nPost Title: [max 60 characters]\nMeta Description: [max 160 characters]\nFocus Keyphrase: [single keyword]\nSlug: [url-friendly slug]\n<!-- END ALL IN ONE SEO -->`
        : "";

      const businessName = user?.business_name || "the videographer";
      const businessUrl = user?.website || "";

      const blog = await callClaude(systemPrompt, `Write a long-form SEO blog post (1,200–1,800 words) for a wedding videographer's website targeting the search term "${targetKeyword}".

TARGET AREA: ${targetArea}
TARGET KEYWORD: ${targetKeyword}${additionalNotes ? `\nADDITIONAL CONTEXT: ${additionalNotes}` : ""}

FEATURED WEDDINGS (reference each one in the post):
${postSummaries}

Write like a videographer who was actually at each wedding. Use plain, conversational British English. Short paragraphs. Short sentences. No em dashes. No words like stunning, magical, breathtaking, timeless, seamlessly, meticulously, nestled, or picturesque.

MANDATORY STRUCTURE:

1. JSON-LD SCHEMA BLOCK (output first, before any HTML)
Output a <script type="application/ld+json"> block using ItemList schema:
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "${targetKeyword}",
  "description": "[1-sentence description of the videographer's work in ${targetArea}]",
  "author": {
    "@type": "LocalBusiness",
    "name": "${businessName}",
    "url": "${businessUrl}"
  },
  "itemListElement": [
    // one ListItem per featured wedding with position, name, url
  ]
}

2. BLOG POST HTML

<h1>: A plain, specific headline naturally incorporating "${targetKeyword}". No clever wordplay.

INTRODUCTION (2-3 sentences in a <p> tag): The first sentence must include the exact phrase "${targetKeyword}". Establish the videographer's experience filming in ${targetArea}. Reference the weddings featured.

SEO KEYPHRASE: "${targetKeyword}" must also appear naturally in at least one H2 or H3 heading.

FEATURED WEDDINGS — one H2 section per wedding:
- H2 heading naming the venue and a short descriptive phrase
- Immediately after the H2, output a YouTube embed placeholder in this exact format (use the Embed ID provided for each wedding, or omit if no Embed ID was given):
  <!-- EMBED:[YOUTUBE_EMBED_ID] -->
- 2-4 sentences about that specific wedding/venue drawing from the content summary

"WHY CHOOSE US FOR YOUR ${targetArea.toUpperCase()} WEDDING FILM?" SECTION
Use that exact H2 text. 2-3 short paragraphs about local knowledge and approach.

CALL TO ACTION: One final <p> with one <strong> phrase. Short and genuine. Not salesy.

3. FAQ SECTION
<h2>Frequently Asked Questions about Wedding Videography in ${targetArea}</h2>
3-4 Q&As using <h3> for questions and <p> for answers. Area-specific questions.

HTML tags allowed: <script> (JSON-LD only), <h1>, <h2>, <h3>, <p>, <strong>. No <html>, <body>, or <head> tags.
${seoSection}

Return ONLY the JSON-LD block followed by the blog post HTML.`);

      // Replace <!-- EMBED:VIDEO_ID --> placeholders with actual iframes
      const processedBlog = blog.trim().replace(
        /<!--\s*EMBED:([A-Za-z0-9_-]+)\s*-->/g,
        (_, videoId) =>
          `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:16px 0;">\n  <iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen></iframe>\n</div>`
      );
      setBlogContent(processedBlog);

      // Title = target keyword (most SEO-effective for a roundup)
      const title = targetKeyword;
      setYoutubeTitle(title);

      // Meta description
      const desc = await callClaude(
        systemPrompt,
        `Write a meta description (under 155 characters) for a blog post about wedding videography in ${targetArea}. Target keyword: "${targetKeyword}". Mention that it covers ${selectedPosts.length} real weddings. Return ONLY the description text, no quotes.`
      );
      setYoutubeDesc(desc.trim());

      // Save to posts table
      try {
        const { data: post, error: insertError } = await supabase
          .from("posts")
          .insert([{
            user_id: user.id,
            venue: targetArea,
            target_keyword: targetKeyword,
            yt_title: title,
            yt_description: desc.trim(),
            blog_content: processedBlog,
            status: "draft",
            post_type: "roundup",
          }])
          .select()
          .single();
        if (insertError == null && post?.id) setSavedPostId(post.id);
      } catch (e) {
        console.error("[FilmPost] Roundup post insert failed:", e.message);
      }

      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  // ── Publish ────────────────────────────────────────────────────────────────
  const publishContent = async () => {
    setLoading(true);
    setError("");
    let wp = null;

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
          if (heroImageRef.current) {
            try {
              setLoadingMsg("Setting featured image...");
              const mediaRes = await fetch(`${user.wp_url}/wp-json/wp/v2/media`, {
                method: "POST",
                headers: {
                  Authorization: `Basic ${creds}`,
                  "Content-Type": heroImageRef.current.type,
                  "Content-Disposition": `attachment; filename="${heroImageRef.current.name}"`,
                },
                body: heroImageRef.current,
              });
              if (mediaRes.ok) {
                const media = await mediaRes.json();
                await fetch(`${user.wp_url}/wp-json/wp/v2/posts/${post.id}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Basic ${creds}` },
                  body: JSON.stringify({ featured_media: media.id }),
                });
              }
            } catch (e) {
              console.error("Failed to set WordPress featured image:", e.message);
            }
          }
        }
      } catch (e) {
        wp = { success: false, error: e.message };
      }
    }

    if (savedPostId) {
      try {
        await supabase.from("posts").update({
          wp_edit_url: wp?.editUrl || null,
          status: "published",
        }).eq("id", savedPostId);
      } catch (e) {
        console.error("Failed to update roundup post:", e.message);
      }
    }

    setWpResult(wp);
    setLoading(false);
    setLoadingMsg("");
    setStep(4);
  };

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <div className="main-header"><div><h1 className="page-title">Area Roundup Post</h1></div></div>
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

  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">Area Roundup Post</h1>
          <p className="page-description">Generate a long-form blog post targeting a regional search term.</p>
        </div>
      </div>

      <div className="main-body">
        <div className="stepper">
          {[["Area & Keyword", 1], ["Select Weddings", 2], ["Review & Edit", 3], ["Published", 4]].map(([label, n], i, arr) => (
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

        {/* Step 1 — Area & Keyword */}
        {step === 1 && (
          <div className="card">
            <div className="card-header"><h3 className="card-title">Target Area &amp; Keyword</h3></div>
            <div className="card-body">
              <div className="field">
                <label className="label">Target Area</label>
                <input
                  className="input"
                  value={targetArea}
                  onChange={e => handleAreaChange(e.target.value)}
                  placeholder="e.g. Warwickshire, Birmingham, The Cotswolds"
                />
                <p className="form-hint">The geographic area this post targets.</p>
              </div>
              <div className="field">
                <label className="label">Target Keyword</label>
                <input
                  className="input"
                  value={targetKeyword}
                  onChange={e => setTargetKeyword(e.target.value)}
                  placeholder="e.g. Wedding videographer in Warwickshire"
                />
                <p className="form-hint">The exact phrase you want this post to rank for.</p>
              </div>
              <div className="field">
                <label className="label">Additional Notes <span className="label-hint">(optional)</span></label>
                <textarea
                  className="textarea"
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="Anything extra to mention — local landmarks, your experience in the area, types of venues you've filmed at…"
                  style={{ minHeight: 80 }}
                />
              </div>
              <div className="field">
                <label className="label">
                  Hero Image <span className="label-hint">(optional — used as WordPress featured image)</span>
                </label>
                <div
                  className={`hero-image-picker ${heroImage ? "has-image" : ""}`}
                  onClick={() => document.getElementById("roundupHeroImageInput").click()}
                >
                  <input
                    id="roundupHeroImageInput"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    hidden
                    onChange={handleHeroImageSelect}
                  />
                  {heroImagePreview ? (
                    <img src={heroImagePreview} alt="Hero preview" className="hero-image-preview" />
                  ) : (
                    <div className="hero-image-placeholder">
                      <Icon.Upload />
                      <span>Click to upload JPG or PNG</span>
                    </div>
                  )}
                </div>
                {heroImage && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ marginTop: 8, fontSize: 12, padding: "4px 10px" }}
                    onClick={() => { if (heroImagePreview) URL.revokeObjectURL(heroImagePreview); setHeroImage(null); setHeroImagePreview(null); heroImageRef.current = null; }}
                  >
                    Remove image
                  </button>
                )}
              </div>
              <div style={{ marginTop: 24 }}>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!targetArea.trim() || !targetKeyword.trim()}
                  onClick={() => setStep(2)}
                >
                  Continue <Icon.Arrow />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Select weddings */}
        {step === 2 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Select Past Weddings to Feature</h3>
            </div>
            <div className="card-body">
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, marginTop: 0 }}>
                Choose 3–6 weddings to feature in this roundup.
              </p>
              <p style={{ fontSize: 12, color: selectedPostIds.length >= 3 ? "var(--accent)" : "var(--text-muted)", marginBottom: 16, fontWeight: 500 }}>
                {selectedPostIds.length} selected{selectedPostIds.length >= 6 ? " — maximum reached" : selectedPostIds.length >= 3 ? "" : ` — select at least ${3 - selectedPostIds.length} more`}
              </p>
              {availablePosts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><Icon.Film /></div>
                  <h4 className="empty-title">No posts yet</h4>
                  <p className="empty-desc">Create some standard wedding posts first, then come back to build a roundup.</p>
                </div>
              ) : (
                <div className="roundup-post-grid">
                  {availablePosts.map(post => {
                    const selected = selectedPostIds.includes(post.id);
                    const thumb = getYtThumbnail(post.yt_url);
                    const disabled = !selected && selectedPostIds.length >= 6;
                    return (
                      <div
                        key={post.id}
                        className={`roundup-post-card${selected ? " roundup-post-card--selected" : ""}${disabled ? " roundup-post-card--disabled" : ""}`}
                        onClick={() => !disabled && togglePost(post.id)}
                      >
                        {selected && (
                          <div className="roundup-post-card-check"><Icon.Check /></div>
                        )}
                        <div className="roundup-post-card-thumb">
                          {thumb
                            ? <img src={thumb} alt="" className="roundup-post-card-img" />
                            : <div className="roundup-post-card-no-thumb"><Icon.Video /></div>
                          }
                        </div>
                        <div className="roundup-post-card-info">
                          <div className="roundup-post-card-venue">{post.venue || "Unknown venue"}</div>
                          <div className="roundup-post-card-date">
                            {new Date(post.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                          </div>
                          {!post.yt_url && (
                            <div className="roundup-post-card-no-yt">No YouTube link</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={selectedPostIds.length < 3}
                  onClick={generateContent}
                >
                  Generate Post <Icon.Arrow />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div className="card">
            <div className="card-header"><h3 className="card-title">Review Your Content</h3></div>
            <div className="card-body">
              <div className="field">
                <label className="label">Post Title</label>
                <input className="input" value={youtubeTitle} onChange={e => setYoutubeTitle(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Meta Description</label>
                <textarea className="textarea" value={youtubeDesc} onChange={e => setYoutubeDesc(e.target.value)} style={{ minHeight: 80 }} />
                <div className="char-count">{youtubeDesc.length}/155</div>
              </div>
              <div className="divider"></div>
              <div className="field">
                <label className="label">Blog Post</label>
                <textarea className="textarea" value={blogContent} onChange={e => setBlogContent(e.target.value)} style={{ minHeight: 400 }} />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                {user?.platform === "squarespace" ? (
                  <button className="btn btn-primary btn-lg" onClick={() => setSsOpen(true)}>
                    Export for Squarespace <Icon.Arrow />
                  </button>
                ) : user?.platform === "wix" ? (
                  <button className="btn btn-primary btn-lg" onClick={() => setWixOpen(true)}>
                    Export for Wix <Icon.Arrow />
                  </button>
                ) : user?.platform === "pixieset" ? (
                  <button className="btn btn-primary btn-lg" onClick={() => setPixiesetOpen(true)}>
                    Export for Pixieset <Icon.Arrow />
                  </button>
                ) : (
                  <button className="btn btn-primary btn-lg" onClick={publishContent}>
                    Publish Now <Icon.Arrow />
                  </button>
                )}
              </div>
              {cmsPublished && (
                <div className="alert alert-success" style={{ marginTop: 16 }}>
                  Post marked as published in {cmsPublished}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <div className="card">
            <div className="card-body">
              <div className="success-screen">
                <div className="success-icon-large"><Icon.Check /></div>
                <h2 className="success-title">Roundup Post Created</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 520, margin: "8px auto 0", lineHeight: 1.6, textAlign: "center" }}>
                  Your area roundup post has been saved as a draft and is ready to review before publishing.
                </p>
                <div className="success-links">
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
                </div>
                <div style={{ marginTop: 32, textAlign: "center" }}>
                  <button className="btn btn-primary" onClick={() => onDone?.()}>Done</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {ssOpen && (
        <SquarespaceExport
          venueName={targetArea}
          youtubeTitle={youtubeTitle}
          blogContent={blogContent}
          youtubeDesc={youtubeDesc}
          heroImagePreview={heroImagePreview}
          savedPostId={savedPostId}
          onClose={() => setSsOpen(false)}
          onPublished={() => { setSsOpen(false); setCmsPublished("Squarespace"); }}
        />
      )}
      {wixOpen && (
        <WixExport
          venueName={targetArea}
          youtubeTitle={youtubeTitle}
          blogContent={blogContent}
          youtubeDesc={youtubeDesc}
          heroImagePreview={heroImagePreview}
          savedPostId={savedPostId}
          onClose={() => setWixOpen(false)}
          onPublished={() => { setWixOpen(false); setCmsPublished("Wix"); }}
        />
      )}
      {pixiesetOpen && (
        <PixiesetExport
          venueName={targetArea}
          youtubeTitle={youtubeTitle}
          blogContent={blogContent}
          youtubeDesc={youtubeDesc}
          heroImagePreview={heroImagePreview}
          savedPostId={savedPostId}
          onClose={() => setPixiesetOpen(false)}
          onPublished={() => { setPixiesetOpen(false); setCmsPublished("Pixieset"); }}
        />
      )}
    </>
  );
}
