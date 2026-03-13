import { useState, useCallback, useRef, useEffect } from "react";
import { Icon } from "../icons";
import { supabase, VENUE_QUESTIONS, buildBusinessFooter, callClaude } from "../utils";
import { SquarespaceExport } from "./SquarespaceExport";
import { WixExport } from "./WixExport";
import { PixiesetExport } from "./PixiesetExport";
import OtherExport from "./OtherExport";
import { VenueFormPanel } from "./VenueFormPanel";

const CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB

const PROCESSING_DELAY = 120; // seconds to wait after YouTube upload completes

const CREDIT_FIELDS = [
  { key: "photographer", label: "Photographer" },
  { key: "planner",      label: "Planner" },
  { key: "band",         label: "Band" },
  { key: "florist",      label: "Florist" },
  { key: "cake",         label: "Cake" },
  { key: "hairMakeup",   label: "Hair and Make Up" },
  { key: "stationery",   label: "Stationery" },
  { key: "dress",        label: "Dress" },
];

// Assemble Template 2 HTML from Claude's standard output
function assembleTemplate2Html(claudeOutput, credits, coupleNames, businessName) {
  // Split JSON-LD from blog HTML
  const scriptEnd = claudeOutput.indexOf("</script>");
  let jsonLd = "";
  let bodyHtml = claudeOutput;
  if (scriptEnd !== -1) {
    jsonLd = claudeOutput.slice(0, scriptEnd + "</script>".length);
    bodyHtml = claudeOutput.slice(scriptEnd + "</script>".length).trim();
  }

  // Split FAQ (and any trailing SEO block) from main body
  const faqIdx = bodyHtml.search(/<h2[^>]*>\s*Frequently Asked Questions/i);
  const mainContent = faqIdx !== -1 ? bodyHtml.slice(0, faqIdx).trim() : bodyHtml;
  const faqContent  = faqIdx !== -1 ? bodyHtml.slice(faqIdx).trim() : "";

  // Couple quote blockquote (omitted if no quote provided)
  const quoteHtml = credits.coupleQuote ? `<blockquote style="text-align:center;font-style:italic;margin:0 auto 32px;padding:0 8%;border:none;max-width:640px;">
  <p style="font-size:1.1em;line-height:1.75;margin:0 0 10px;">\u201c${credits.coupleQuote}\u201d</p>${coupleNames ? `
  <footer style="font-size:0.8em;font-variant:small-caps;letter-spacing:0.1em;color:#888;">\u2014 ${coupleNames}</footer>` : ""}
</blockquote>` : "";

  // Supplier credits sidebar
  const creditRows = [
    `<div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #e8e8e8;font-size:13px;"><span style="font-weight:600;min-width:100px;flex-shrink:0;color:#555;">Videographer</span><span>${businessName}</span></div>`,
    ...CREDIT_FIELDS
      .filter(f => (credits[f.key] || "").trim())
      .map(f => `<div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #e8e8e8;font-size:13px;"><span style="font-weight:600;min-width:100px;flex-shrink:0;color:#555;">${f.label}</span><span>${credits[f.key]}</span></div>`),
  ].join("\n");

  const supplierHtml = `<aside style="background:#f9f9f9;border-radius:8px;padding:20px;border:1px solid #eee;position:sticky;top:24px;">
  <h3 style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#999;font-weight:600;">Credits</h3>
  ${creditRows}
</aside>`;

  return `${jsonLd}
<!-- YOUTUBE_EMBED_PLACEHOLDER -->
${quoteHtml}
<div style="display:grid;grid-template-columns:2fr 1fr;gap:32px;align-items:start;margin-bottom:48px;">
  <div>
    ${mainContent}
  </div>
  <div>
    ${supplierHtml}
  </div>
</div>
${faqContent}`.trim();
}

export function UploadPage({ user, venues = [], onSuccess, onDone, onVenueAdded }) {
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

  // Hero image
  const [heroImage, setHeroImage] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);

  // Publish results
  const [wpResult, setWpResult] = useState(null);   // { success, editUrl?, error? }
  const [ytUploadUri, setYtUploadUri] = useState(null);
  const [ytUpload, setYtUpload] = useState({ state: "idle", progress: 0, videoId: null, error: null });
  const [savedPostId, setSavedPostId] = useState(null);

  // Supplier credits (Template 2 only)
  const [supplierCredits, setSupplierCredits] = useState({
    coupleQuote: "", photographer: "", planner: "", band: "",
    florist: "", cake: "", hairMakeup: "", stationery: "", dress: "",
  });
  const [suppliersExpanded, setSuppliersExpanded] = useState(false);

  // Venue library
  const [venueQuery, setVenueQuery] = useState("");
  const [showVenueSuggestions, setShowVenueSuggestions] = useState(false);
  const [selectedLibraryVenue, setSelectedLibraryVenue] = useState(null);
  const [showSaveBanner, setShowSaveBanner] = useState(false);
  const [saveVenueOpen, setSaveVenueOpen] = useState(false);

  // CMS export panels (Squarespace / Wix)
  const [ssOpen, setSsOpen] = useState(false);
  const [wixOpen, setWixOpen] = useState(false);
  const [pixiesetOpen, setPixiesetOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [cmsPublished, setCmsPublished] = useState(""); // CMS name shown in success message

  // Done button countdown (starts after YouTube upload completes)
  const [countdown, setCountdown] = useState(null); // null = not started, >0 = counting, 0 = ready

  const ytUploadStarted = useRef(false);
  const wpPostIdRef = useRef(null);       // WP post ID — needed by the upload useEffect
  const blogContentRef = useRef("");      // current blogContent — needed by the upload useEffect
  const heroImageRef = useRef(null);      // current heroImage — needed by the upload useEffect
  const dropRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  // "Already on YouTube" mode
  const [useExistingYt, setUseExistingYt] = useState(false);
  const [existingYtUrl, setExistingYtUrl] = useState("");
  const [existingYtUrlError, setExistingYtUrlError] = useState("");
  const [regenYtMeta, setRegenYtMeta] = useState(false);
  // Freshly generated YT metadata (shown in Step 3 for existing-video mode)
  const [freshYtTitle, setFreshYtTitle] = useState("");
  const [freshYtDesc, setFreshYtDesc] = useState("");
  const [freshYtTags, setFreshYtTags] = useState("");
  const [copiedYtField, setCopiedYtField] = useState(null);

  // Keep refs in sync so the upload useEffect always reads the latest values
  useEffect(() => { blogContentRef.current = blogContent; }, [blogContent]);
  useEffect(() => { heroImageRef.current = heroImage; }, [heroImage]);

  // ── YouTube URL helpers ─────────────────────────────────────────────────────
  const isValidYtUrl = (url) =>
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/.test((url || "").trim());

  const extractYtVideoId = (url) => {
    const m = (url || "").match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  };

  const copyYtField = async (field, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedYtField(field);
      setTimeout(() => setCopiedYtField(null), 2000);
    } catch (_) {}
  };

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

  const handleHeroImageSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (heroImagePreview) URL.revokeObjectURL(heroImagePreview);
    setHeroImage(f);
    setHeroImagePreview(URL.createObjectURL(f));
  };

  // ── Generate content ───────────────────────────────────────────────────────
  const generateContent = async () => {
    setLoading(true); setLoadingMsg("Crafting your content with AI..."); setError("");
    try {
      const toneInstruction = user?.tone_of_voice
        ? `\n\nWrite in a style that reflects this brand voice: ${user.tone_of_voice}`
        : "";
      const systemPrompt = `You are a wedding videographer writing about your own work. Write like a real person who films weddings for a living — warm, genuine, and specific to the day. Use plain British English. No fancy words, no flowery language, no corporate tone. Write short sentences. Be direct. Sound human. Never use these words or phrases: breathtaking, stunning, magical, timeless, seamlessly, meticulously, elegant, bespoke, enchanting, nestled, picturesque, idyllic, effortlessly, truly, really special, or any em dashes (—).${toneInstruction}`;
      const answersText = VENUE_QUESTIONS.map(q => venueAnswers[q.id] ? `${q.label}: ${venueAnswers[q.id]}` : "").filter(Boolean).join("\n");

      // Enrich prompt with saved venue library details if a library venue was selected
      const venueLibraryContext = selectedLibraryVenue ? [
        "\n\nAdditional venue details from saved library:",
        selectedLibraryVenue.venue_type && `Venue type: ${selectedLibraryVenue.venue_type}`,
        selectedLibraryVenue.location && `Location: ${selectedLibraryVenue.location}`,
        selectedLibraryVenue.indoor_outdoor && `Setting: ${selectedLibraryVenue.indoor_outdoor}`,
        selectedLibraryVenue.capacity && `Capacity: ${selectedLibraryVenue.capacity}`,
        selectedLibraryVenue.general_notes && `General notes: ${selectedLibraryVenue.general_notes}`,
      ].filter(Boolean).join("\n") : "";
      const fullAnswersText = answersText + venueLibraryContext;

      const title = await callClaude(systemPrompt, `Write a YouTube title for a wedding film at "${venueName}".\n\n${fullAnswersText}\n\nInclude the venue name. If the questionnaire includes a couple's names, you may include them. Keep it under 70 characters. Sound natural, not like a magazine headline. Return ONLY the title, no quotes.`);
      setYoutubeTitle(title.trim());

      const footer = buildBusinessFooter(user);
      const desc = await callClaude(systemPrompt, `Write a YouTube description for this wedding film:\nVenue: ${venueName}\n${fullAnswersText}\n\nStart with a short, natural opening sentence or two about the day — written like a videographer talking about a wedding they genuinely loved filming. Then cover the filming highlights in plain, specific language. No em dashes. No fancy adjectives. Just honest, warm copy.\n\nEnd with this exact footer:\n\n${footer}\n\nUnder 4000 characters. Return ONLY the description text.`);
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

      const businessName = user?.business_name || "the videographer";
      const businessUrl = user?.website || "";
      const blog = await callClaude(systemPrompt, `Write an SEO-optimised blog post (900-1200 words) for a wedding videographer's website about filming a wedding at "${venueName}".

${fullAnswersText}

Write like a videographer who was actually there. Use plain, conversational British English. Short paragraphs. Short sentences. No em dashes. No words like stunning, magical, breathtaking, timeless, seamlessly, meticulously, nestled, or picturesque.

MANDATORY STRUCTURE:

1. JSON-LD SCHEMA BLOCK (output first, before any HTML)
Output a <script type="application/ld+json"> block using VideoObject schema:
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "[generated YouTube title]",
  "description": "[2-sentence summary of the film and venue]",
  "thumbnailUrl": "PLACEHOLDER_THUMBNAIL_URL",
  "uploadDate": "PLACEHOLDER_UPLOAD_DATE",
  "author": {
    "@type": "LocalBusiness",
    "name": "${businessName}",
    "url": "${businessUrl}"
  },
  "contentLocation": {
    "@type": "Place",
    "name": "${venueName}"
  }
}

2. BLOG POST HTML

<h1>: A plain, specific headline naming the venue. No clever wordplay.

INTRODUCTION (2-3 sentences in a <p> tag): The first sentence must include the exact phrase "${venueName} wedding videographer". Summarise the post clearly. Name the venue, its location, and what made the day stand out. Write it so someone googling the venue gets a direct, useful answer.

SEO KEYPHRASE: The target keyphrase is "${venueName} wedding videographer". Beyond the introduction, it must also appear naturally in at least one H2 or H3 heading, and in the meta description if an SEO plugin block is requested below.

BODY SECTIONS using H2 headings phrased as questions couples actually search for:
- "What is ${venueName} like as a wedding venue?"
- "What is it like to film a wedding at ${venueName}?"
- "Why do couples choose ${venueName}?"
Use H3 sub-headings where they help. Keep paragraphs to 2-4 sentences. Reference the venue's county or region where you can. Use specific details from the questionnaire — real moments, not generic descriptions.

CALL TO ACTION — one final <p> with one <strong> phrase: Keep it short and genuine. One or two sentences. Not salesy.

3. FAQ SECTION
<h2>Frequently Asked Questions about Weddings at ${venueName}</h2>

3-4 Q&As using <h3> for questions and <p> for answers. Base answers on the questionnaire details. If you don't know something like guest numbers, write around it rather than making it up.

OUTBOUND LINK: ${venueAnswers.venueWebsite ? `Include one natural outbound link to the venue's own website (${venueAnswers.venueWebsite}). Use the venue name "${venueName}" as the anchor text. Place it where it reads naturally in context — do not force it.` : "No venue website has been provided, so do not invent or guess a URL."}

HTML tags allowed: <script> (JSON-LD only), <h1>, <h2>, <h3>, <p>, <strong>, <a> (for the venue outbound link only). No <html>, <body>, or <head> tags.
${seoSection}
Return ONLY the JSON-LD block followed by the blog post HTML.`);
      const finalBlog = user.blog_template === "film_suppliers"
        ? assembleTemplate2Html(blog.trim(), supplierCredits, venueAnswers.coupleNames, user.business_name || "")
        : blog.trim();
      setBlogContent(finalBlog);

      // Save history entry immediately — before any publish attempt
      try {
        const insertPayload = {
          user_id: user.id,
          venue: venueName,
          yt_title: title.trim(),
          yt_description: desc.trim(),
          blog_content: finalBlog,
          status: "draft",
          video_source: useExistingYt ? "existing" : "uploaded",
          ...(useExistingYt ? { yt_url: existingYtUrl } : {}),
        };
        const { data: post, error: insertError } = await supabase
          .from("posts")
          .insert([insertPayload])
          .select()
          .single();
        if (insertError != null) {
          console.error("[FilmPost] Post insert error:", insertError.message, insertError);
        } else if (post?.id) {
          setSavedPostId(post.id);
        }
      } catch (e) {
        console.error("[FilmPost] Exception during post insert:", e.message);
      }

      // Show save-to-library banner if this venue isn't already in the library
      const alreadySaved = venues.some(v => v.venue_name.toLowerCase() === venueName.toLowerCase());
      if (!alreadySaved) setShowSaveBanner(true);

      // Generate fresh YouTube metadata if user opted in (existing video mode)
      if (useExistingYt && regenYtMeta) {
        try {
          const fTitle = await callClaude(systemPrompt, `Write a fresh SEO-optimised YouTube title for a wedding film at "${venueName}".\n\n${fullAnswersText}\n\nInclude the venue name. If the questionnaire includes a couple's names, you may include them. Keep it under 70 characters. Sound natural, not like a magazine headline. Return ONLY the title, no quotes.`);
          const fDesc  = await callClaude(systemPrompt, `Write a YouTube description for this wedding film:\nVenue: ${venueName}\n${fullAnswersText}\n\nStart with a short, natural opening sentence or two about the day — written like a videographer talking about a wedding they genuinely loved filming. Then cover the filming highlights in plain, specific language. No em dashes. No fancy adjectives.\n\nEnd with this exact footer:\n\n${buildBusinessFooter(user)}\n\nUnder 4000 characters. Return ONLY the description text.`);
          const fTags  = await callClaude(systemPrompt, `Generate 12 relevant YouTube tags for a wedding film at "${venueName}". ${answersText ? `Wedding details: ${answersText.slice(0, 300)}` : ""} Return ONLY a comma-separated list of tags, no other text or explanation.`);
          setFreshYtTitle(fTitle.trim());
          setFreshYtDesc(fDesc.trim());
          setFreshYtTags(fTags.trim());
        } catch (e) {
          console.error("[FilmPost] Failed to generate fresh YouTube metadata:", e.message);
        }
      }

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

          // Upload hero image as WordPress featured media
          if (heroImage) {
            try {
              setLoadingMsg("Setting featured image...");
              const mediaRes = await fetch(`${user.wp_url}/wp-json/wp/v2/media`, {
                method: "POST",
                headers: {
                  Authorization: `Basic ${creds}`,
                  "Content-Type": heroImage.type,
                  "Content-Disposition": `attachment; filename="${heroImage.name}"`,
                },
                body: heroImage,
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

    // 1b. For existing YouTube videos: inject embed into WP draft immediately
    if (useExistingYt) {
      const existingVideoId = extractYtVideoId(existingYtUrl);
      if (existingVideoId && wp?.success && wpPostIdRef.current && user.wp_url && user.wp_user && user.wp_pass) {
        const embed = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">\n  <iframe src="https://www.youtube.com/embed/${existingVideoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen></iframe>\n</div>`;
        const content = blogContent;
        let updatedContent;
        if (user.blog_template === "film_suppliers") {
          updatedContent = content.includes("<!-- YOUTUBE_EMBED_PLACEHOLDER -->")
            ? content.replace("<!-- YOUTUBE_EMBED_PLACEHOLDER -->", embed)
            : embed + "\n\n" + content;
        } else {
          const insertAt = content.indexOf("</p>");
          updatedContent = insertAt !== -1
            ? content.slice(0, insertAt + 4) + "\n\n" + embed + "\n\n" + content.slice(insertAt + 4)
            : embed + "\n\n" + content;
        }
        await fetch(`${user.wp_url}/wp-json/wp/v2/posts/${wpPostIdRef.current}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Basic ${btoa(`${user.wp_user}:${user.wp_pass}`)}` },
          body: JSON.stringify({ content: updatedContent }),
        }).catch(() => {});
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

    // 3. Update (or insert) the history entry with publish results
    if (savedPostId) {
      try {
        const { error: updateError } = await supabase.from("posts").update({
          wp_edit_url: wp?.editUrl || null,
          wp_post_id: wpPostIdRef.current || null,
          status: uploadUri ? "uploading" : "published",
        }).eq("id", savedPostId);
        if (updateError != null) console.error("[FilmPost] Post update error:", updateError.message, updateError);
      } catch (e) {
        console.error("[FilmPost] Failed to update post:", e.message);
      }
    } else {
      // Fallback: initial insert in generateContent() failed — try again now with publish data
      try {
        const fallbackPayload = {
          user_id: user.id,
          venue: venueName,
          yt_title: youtubeTitle,
          yt_description: youtubeDesc,
          blog_content: blogContent,
          wp_edit_url: wp?.editUrl || null,
          wp_post_id: wpPostIdRef.current || null,
          status: uploadUri ? "uploading" : "published",
          video_source: useExistingYt ? "existing" : "uploaded",
          ...(useExistingYt ? { yt_url: existingYtUrl } : {}),
        };
        const { data: post, error: insertError } = await supabase
          .from("posts")
          .insert([fallbackPayload])
          .select()
          .single();
        if (insertError != null) {
          console.error("[FilmPost] Fallback post insert error:", insertError.message, insertError);
        } else if (post?.id) {
          setSavedPostId(post.id);
        }
      } catch (e) {
        console.error("[FilmPost] Exception during fallback post insert:", e.message);
      }
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
                  yt_url: youtubeUrl,
                  status: "published",
                }).eq("id", savedPostId);
              }

              // Set YouTube thumbnail
              if (heroImageRef.current) {
                try {
                  const arrayBuffer = await heroImageRef.current.arrayBuffer();
                  const bytes = new Uint8Array(arrayBuffer);
                  let binary = "";
                  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
                  const imageBase64 = btoa(binary);
                  console.log("[FilmPost] Uploading YouTube thumbnail — videoId:", data.videoId, "mimeType:", heroImageRef.current.type);
                  const thumbRes = await fetch("/api/youtube-thumbnail", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      videoId: data.videoId,
                      refreshToken: user.youtube_refresh_token,
                      imageBase64,
                      mimeType: heroImageRef.current.type,
                    }),
                  });
                  const thumbData = await thumbRes.json().catch(() => ({}));
                  if (!thumbRes.ok) {
                    console.error("[FilmPost] YouTube thumbnail upload failed — status:", thumbRes.status, "error:", thumbData?.error || JSON.stringify(thumbData));
                  } else {
                    console.log("[FilmPost] YouTube thumbnail uploaded successfully.");
                  }
                } catch (e) {
                  console.error("[FilmPost] YouTube thumbnail exception:", e.message);
                }
              }

              // Inject YouTube embed into the WordPress draft
              if (wpPostIdRef.current && user.wp_url && user.wp_user && user.wp_pass) {
                const embed = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">\n  <iframe src="https://www.youtube.com/embed/${data.videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen></iframe>\n</div>`;
                const content = blogContentRef.current;
                let updatedContent;
                if (user.blog_template === "film_suppliers") {
                  // Template 2: replace the placeholder comment with the embed
                  updatedContent = content.includes("<!-- YOUTUBE_EMBED_PLACEHOLDER -->")
                    ? content.replace("<!-- YOUTUBE_EMBED_PLACEHOLDER -->", embed)
                    : embed + "\n\n" + content;
                } else {
                  // Template 1: insert embed after the first closing </p>
                  const insertAt = content.indexOf("</p>");
                  updatedContent = insertAt !== -1
                    ? content.slice(0, insertAt + 4) + "\n\n" + embed + "\n\n" + content.slice(insertAt + 4)
                    : embed + "\n\n" + content;
                }
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

  // ── Post-upload countdown (2 min processing buffer after YouTube finishes) ──
  useEffect(() => {
    if (ytUpload.state !== "done") return;
    setCountdown(PROCESSING_DELAY);
  }, [ytUpload.state]);

  useEffect(() => {
    if (countdown === null || countdown === 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <div className="main-header"><div><h1 className="page-title">New Post</h1></div></div>
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
          <h1 className="page-title">New Post</h1>
          <p className="page-description">Upload a wedding film and generate content automatically.</p>
        </div>
      </div>

      <div className="main-body">
        <div className="stepper">
          {[[useExistingYt ? "Add Video" : "Upload Video", 1], ["Venue Details", 2], ["Review & Edit", 3], ["Published", 4]].map(([label, n], i, arr) => (
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

        {/* Step 1 — Upload Video / Add YouTube URL */}
        {step === 1 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{useExistingYt ? "Add Your YouTube URL" : "Select Your Video"}</h3>
            </div>
            <div className="card-body">
              {/* Mode toggle */}
              <label className="yt-mode-toggle">
                <input
                  type="checkbox"
                  checked={useExistingYt}
                  onChange={e => {
                    setUseExistingYt(e.target.checked);
                    setExistingYtUrl("");
                    setExistingYtUrlError("");
                    setFile(null);
                  }}
                />
                <div className="yt-mode-toggle-text">
                  <span className="yt-mode-toggle-label">I already have this video on YouTube</span>
                  <span className="yt-mode-toggle-desc">Skip the upload and paste an existing YouTube URL instead.</span>
                </div>
              </label>

              {useExistingYt ? (
                <div className="field" style={{ marginTop: 24 }}>
                  <label className="label">YouTube URL</label>
                  <input
                    className="input"
                    value={existingYtUrl}
                    onChange={e => { setExistingYtUrl(e.target.value); setExistingYtUrlError(""); }}
                    onBlur={() => {
                      if (existingYtUrl && !isValidYtUrl(existingYtUrl)) {
                        setExistingYtUrlError("Please enter a valid YouTube URL (e.g. https://www.youtube.com/watch?v=ABC123)");
                      }
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {existingYtUrlError && (
                    <p className="form-hint" style={{ color: "var(--error)", marginTop: 4 }}>{existingYtUrlError}</p>
                  )}
                </div>
              ) : (
                <div
                  ref={dropRef}
                  className={`upload-zone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
                  style={{ marginTop: 24 }}
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
              )}

              <div style={{ marginTop: 32 }}>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={useExistingYt ? !isValidYtUrl(existingYtUrl) : !file}
                  onClick={() => setStep(2)}
                >
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
                <div className="venue-autocomplete">
                  <input
                    className="input"
                    value={venueQuery || venueName}
                    onChange={e => {
                      const val = e.target.value;
                      setVenueQuery(val);
                      setVenueName(val);
                      setSelectedLibraryVenue(null);
                      setShowVenueSuggestions(val.length >= 1);
                    }}
                    onFocus={() => { if ((venueQuery || venueName).length >= 1) setShowVenueSuggestions(true); }}
                    onBlur={() => setTimeout(() => setShowVenueSuggestions(false), 150)}
                    placeholder="e.g. Aynhoe Park"
                    autoComplete="off"
                  />
                  {showVenueSuggestions && venues.filter(v =>
                    v.venue_name.toLowerCase().includes((venueQuery || venueName).toLowerCase())
                  ).length > 0 && (
                    <div className="venue-suggestions">
                      {venues.filter(v =>
                        v.venue_name.toLowerCase().includes((venueQuery || venueName).toLowerCase())
                      ).map(v => (
                        <div
                          key={v.id}
                          className="venue-suggestion-item"
                          onMouseDown={() => {
                            setVenueName(v.venue_name);
                            setVenueQuery(v.venue_name);
                            setSelectedLibraryVenue(v);
                            setShowVenueSuggestions(false);
                            // Pre-fill questionnaire answers from library
                            setVenueAnswers(prev => ({
                              ...prev,
                              lightingNotes: v.lighting_notes || prev.lightingNotes || "",
                              filmingHighlights: v.filming_highlights || prev.filmingHighlights || "",
                              venueWebsite: v.website_url || prev.venueWebsite || "",
                              venueStyle: v.style_notes || (v.venue_type ? `${v.venue_type} venue` : prev.venueStyle || ""),
                            }));
                          }}
                        >
                          <div className="venue-suggestion-name">{v.venue_name}</div>
                          {v.location && <div className="venue-suggestion-location">{v.location}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedLibraryVenue && (
                  <div className="venue-selected-tag">
                    <Icon.MapPin /> From your Venue Library — questionnaire pre-filled
                  </div>
                )}
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
              {/* Supplier Credits — Template 2 only */}
              {user.blog_template === "film_suppliers" && (
                <div className="supplier-section" style={{ marginTop: 24 }}>
                  <button
                    type="button"
                    className="supplier-section-toggle"
                    onClick={() => setSuppliersExpanded(e => !e)}
                  >
                    <span>Supplier Credits <span className="label-hint">(optional)</span></span>
                    <span style={{ fontSize: 11 }}>{suppliersExpanded ? "▲" : "▼"}</span>
                  </button>
                  {suppliersExpanded && (
                    <div className="supplier-section-body">
                      <div className="field">
                        <label className="label">Couple Quote <span className="label-hint">(optional)</span></label>
                        <textarea
                          className="textarea"
                          value={supplierCredits.coupleQuote}
                          onChange={e => setSupplierCredits(c => ({ ...c, coupleQuote: e.target.value }))}
                          placeholder="A quote from the couple about their wedding day…"
                          style={{ minHeight: 72 }}
                        />
                      </div>
                      <div className="field">
                        <label className="label">Videographer</label>
                        <input className="input" value={user.business_name || ""} disabled style={{ opacity: 0.55 }} />
                        <p className="form-hint">Auto-filled from your business profile.</p>
                      </div>
                      <div className="supplier-grid">
                        {CREDIT_FIELDS.map(f => (
                          <div className="field" key={f.key}>
                            <label className="label">{f.label}</label>
                            <input
                              className="input"
                              value={supplierCredits[f.key]}
                              onChange={e => setSupplierCredits(c => ({ ...c, [f.key]: e.target.value }))}
                              placeholder="Name or company"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="field" style={{ marginTop: 24 }}>
                <label className="label">
                  Hero Image <span className="label-hint">(used as YouTube thumbnail and blog featured image)</span>
                </label>
                <div
                  className={`hero-image-picker ${heroImage ? "has-image" : ""}`}
                  onClick={() => document.getElementById("heroImageInput").click()}
                >
                  <input
                    id="heroImageInput"
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
                    onClick={(e) => { e.stopPropagation(); if (heroImagePreview) URL.revokeObjectURL(heroImagePreview); setHeroImage(null); setHeroImagePreview(null); }}
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Regenerate YouTube metadata — existing video mode only */}
              {useExistingYt && (
                <div className="regen-yt-section">
                  <label className="regen-yt-label">
                    <input
                      type="checkbox"
                      checked={regenYtMeta}
                      onChange={e => setRegenYtMeta(e.target.checked)}
                    />
                    <div className="regen-yt-text">
                      <span className="regen-yt-heading">Regenerate YouTube metadata</span>
                      <span className="regen-yt-desc">
                        Generate an improved SEO title, description, and tags for your existing video.
                        You'll be able to copy these into YouTube Studio after content is generated.
                      </span>
                    </div>
                  </label>
                </div>
              )}

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
        {step === 3 && showSaveBanner && (
          <div className="venue-save-banner">
            <div className="venue-save-banner-text">
              <Icon.MapPin />
              <span>Want to save <strong>{venueName}</strong> to your Venue Library for next time?</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button className="btn btn-secondary" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => setShowSaveBanner(false)}>Dismiss</button>
              <button className="btn btn-primary" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => setSaveVenueOpen(true)}>Quick Add</button>
            </div>
          </div>
        )}

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

              {/* YouTube metadata panel — existing video mode with regen opted in */}
              {useExistingYt && freshYtTitle && (
                <div className="yt-meta-panel">
                  <div className="yt-meta-panel-header">
                    <h4 className="yt-meta-panel-title">YouTube Metadata for YouTube Studio</h4>
                    <p className="yt-meta-panel-desc">
                      Copy these into YouTube Studio to optimise your existing video.
                      These are separate from the blog post content above.
                    </p>
                  </div>
                  <div className="yt-meta-field">
                    <div className="yt-meta-field-label">
                      <span>YouTube Title</span>
                      <span className="char-count">{freshYtTitle.length}/70</span>
                    </div>
                    <div className="yt-meta-copy-row">
                      <div className="ss-text-box">{freshYtTitle}</div>
                      <button className="btn btn-secondary ss-copy-btn" onClick={() => copyYtField("title", freshYtTitle)}>
                        {copiedYtField === "title" ? <><Icon.Check /><span>Copied</span></> : <><Icon.Copy /><span>Copy</span></>}
                      </button>
                    </div>
                  </div>
                  <div className="yt-meta-field">
                    <div className="yt-meta-field-label">
                      <span>YouTube Description</span>
                    </div>
                    <div className="yt-meta-copy-row">
                      <div className="ss-text-box" style={{ whiteSpace: "pre-wrap", maxHeight: 140, overflowY: "auto" }}>{freshYtDesc}</div>
                      <button className="btn btn-secondary ss-copy-btn" onClick={() => copyYtField("desc", freshYtDesc)}>
                        {copiedYtField === "desc" ? <><Icon.Check /><span>Copied</span></> : <><Icon.Copy /><span>Copy</span></>}
                      </button>
                    </div>
                  </div>
                  <div className="yt-meta-field">
                    <div className="yt-meta-field-label">
                      <span>Recommended Tags</span>
                    </div>
                    <div className="yt-meta-copy-row">
                      <div className="ss-text-box">{freshYtTags}</div>
                      <button className="btn btn-secondary ss-copy-btn" onClick={() => copyYtField("tags", freshYtTags)}>
                        {copiedYtField === "tags" ? <><Icon.Check /><span>Copied</span></> : <><Icon.Copy /><span>Copy</span></>}
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                ) : user?.platform === "other" ? (
                  <button className="btn btn-primary btn-lg" onClick={() => setOtherOpen(true)} disabled={!savedPostId}>
                    <Icon.Globe /> Export HTML
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

        {/* Step 4 — Results */}
        {step === 4 && (
          <div className="card">
            <div className="card-body">
              <div className="success-screen">
                <div className="success-icon-large"><Icon.Check /></div>
                <h2 className="success-title">Content Published</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 520, margin: "8px auto 0", lineHeight: 1.6, textAlign: "center" }}>
                  Your film is currently being processed by YouTube. Once it has finished uploading, it will be automatically embedded in your blog post — this usually takes a few minutes. Open the WordPress draft link above, and once the YouTube video is live, double check the film has been added to your post before publishing.
                </p>

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
                  {useExistingYt ? (
                    <a href={existingYtUrl} target="_blank" rel="noopener noreferrer" className="success-link">
                      <div className="success-link-info">
                        <div className="success-link-label">Existing YouTube Video</div>
                        <div className="success-link-url">{existingYtUrl}</div>
                      </div>
                      <Icon.External />
                    </a>
                  ) : !user.youtube_refresh_token ? (
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

                {(() => {
                  // Determine Done button state
                  const ytConnected = !!user.youtube_refresh_token;
                  const ytStillUploading = !useExistingYt && ytConnected && ytUpload.state !== "done" && ytUpload.state !== "idle" && !ytUpload.error && ytUploadUri;
                  const countingDown = !useExistingYt && countdown !== null && countdown > 0;
                  const doneDisabled = ytStillUploading || countingDown;

                  let statusMsg = null;
                  if (ytStillUploading) {
                    statusMsg = "Waiting for YouTube upload to complete…";
                  } else if (countingDown) {
                    const mins = Math.floor(countdown / 60);
                    const secs = String(countdown % 60).padStart(2, "0");
                    statusMsg = `Almost ready — giving YouTube a moment to process… (${mins}:${secs} remaining)`;
                  } else if (countdown === 0) {
                    statusMsg = "Your upload is ready. You can now close this screen.";
                  }

                  return (
                    <div style={{ marginTop: 32, textAlign: "center" }}>
                      <button
                        className="btn btn-primary"
                        disabled={doneDisabled}
                        style={doneDisabled ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                        onClick={() => onDone?.()}
                      >
                        Done
                      </button>
                      {statusMsg && (
                        <p style={{ marginTop: 10, fontSize: 13, color: "var(--text-muted)" }}>{statusMsg}</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {ssOpen && (
        <SquarespaceExport
          venueName={venueName}
          youtubeTitle={youtubeTitle}
          blogContent={blogContent}
          youtubeDesc={youtubeDesc}
          heroImagePreview={heroImagePreview}
          savedPostId={savedPostId}
          onClose={() => setSsOpen(false)}
          onPublished={() => { setSsOpen(false); setCmsPublished("Squarespace"); onSuccess?.(); }}
        />
      )}
      {wixOpen && (
        <WixExport
          venueName={venueName}
          youtubeTitle={youtubeTitle}
          blogContent={blogContent}
          youtubeDesc={youtubeDesc}
          heroImagePreview={heroImagePreview}
          savedPostId={savedPostId}
          onClose={() => setWixOpen(false)}
          onPublished={() => { setWixOpen(false); setCmsPublished("Wix"); onSuccess?.(); }}
        />
      )}
      {pixiesetOpen && (
        <PixiesetExport
          venueName={venueName}
          youtubeTitle={youtubeTitle}
          blogContent={blogContent}
          youtubeDesc={youtubeDesc}
          heroImagePreview={heroImagePreview}
          savedPostId={savedPostId}
          onClose={() => setPixiesetOpen(false)}
          onPublished={() => { setPixiesetOpen(false); setCmsPublished("Pixieset"); onSuccess?.(); }}
        />
      )}
      {otherOpen && (
        <OtherExport
          blogContent={blogContent}
          metaDescription={youtubeDesc}
          urlSlug={youtubeTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
          savedPostId={savedPostId}
          onClose={() => setOtherOpen(false)}
          onPublished={() => { setOtherOpen(false); setCmsPublished("Other"); onSuccess?.(); }}
        />
      )}
      {saveVenueOpen && (
        <VenueFormPanel
          prefillName={venueName}
          userId={user.id}
          onClose={() => setSaveVenueOpen(false)}
          onSaved={() => { setSaveVenueOpen(false); setShowSaveBanner(false); onVenueAdded?.(); }}
        />
      )}
    </>
  );
}
