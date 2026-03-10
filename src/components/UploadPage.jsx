import { useState, useCallback, useRef } from "react";
import { Icon } from "../icons";
import { supabase, VENUE_QUESTIONS, buildBusinessFooter, callClaude } from "../utils";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const dropRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f && f.type.startsWith("video/")) setFile(f);
  }, []);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("video/")) setFile(f);
  };

  const generateContent = async () => {
    setLoading(true);
    setLoadingMsg("Crafting your content with AI...");
    setError("");
    try {
      const systemPrompt = `You are an expert copywriter for luxury UK wedding videographers. Write in elegant British English, using evocative but authentic language. Avoid clichés and overly salesy phrasing. Focus on emotion, atmosphere, and the couple's story.`;

      const answersText = VENUE_QUESTIONS.map(q => {
        const ans = venueAnswers[q.id];
        return ans ? `${q.label}: ${ans}` : "";
      }).filter(Boolean).join("\n");

      const userPromptTitle = `Create a YouTube title for a wedding film at "${venueName}". It should be elegant, include the venue name, and be under 70 characters. Return ONLY the title, no quotes.`;
      const title = await callClaude(systemPrompt, userPromptTitle);
      setYoutubeTitle(title.trim());

      const footer = buildBusinessFooter(user);
      const userPromptDesc = `Write a YouTube description for this wedding film:
Venue: ${venueName}
${answersText}

Include:
1. An evocative opening paragraph about the venue and day
2. A brief mention of highlights
3. End with this exact footer (don't modify it):

${footer}

Keep it under 4000 characters total. Return ONLY the description text.`;
      const desc = await callClaude(systemPrompt, userPromptDesc);
      setYoutubeDesc(desc.trim());

      const userPromptBlog = `Write an 800-1200 word blog post about filming a wedding at "${venueName}" for a wedding videographer's website.

Details about the venue and day:
${answersText}

Structure:
- Compelling headline
- Opening that draws the reader in
- Sections about the venue, the atmosphere, filming highlights
- A subtle call-to-action for couples considering this venue
- Use HTML formatting with <h2>, <p>, <strong> tags

Make it feel personal and authentic, not generic. Return ONLY the HTML content.`;
      const blog = await callClaude(systemPrompt, userPromptBlog);
      setBlogContent(blog.trim());

      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  const publishContent = async () => {
    setLoading(true);
    setLoadingMsg("Publishing to YouTube...");
    setError("");
    try {
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(r => setTimeout(r, 200));
      }

      const { error: err } = await supabase
        .from("posts")
        .insert([{
          user_id: user.id,
          venue_name: venueName,
          youtube_title: youtubeTitle,
          youtube_description: youtubeDesc,
          blog_content: blogContent,
          youtube_url: "https://youtube.com/watch?v=example",
          wordpress_url: "https://yourblog.com/post-example",
          status: "published"
        }])
        .select()
        .single();

      if (err) throw new Error(err.message);

      setResult({
        youtubeUrl: "https://youtube.com/watch?v=example",
        wordpressUrl: "https://yourblog.com/post-example"
      });
      setStep(4);
      onSuccess?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  if (loading) {
    return (
      <>
        <div className="main-header">
          <div>
            <h1 className="page-title">New Upload</h1>
          </div>
        </div>
        <div className="main-body">
          <div className="card">
            <div className="card-body">
              <div className="loading-overlay" style={{ position: "relative", background: "transparent", minHeight: 400 }}>
                <div className="spinner spinner-lg"></div>
                <h3 className="loading-title">{loadingMsg}</h3>
                {uploadProgress > 0 && (
                  <div style={{ width: 300, marginTop: 20 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p style={{ textAlign: "center", marginTop: 10, color: "var(--text-muted)" }}>{uploadProgress}%</p>
                  </div>
                )}
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
          <h1 className="page-title">New Upload</h1>
          <p className="page-description">Upload a wedding film and generate content automatically.</p>
        </div>
      </div>

      <div className="main-body">
        <div className="stepper">
          <div className={`step ${step >= 1 ? (step > 1 ? "completed" : "active") : ""}`}>
            <div className="step-number">{step > 1 ? <Icon.Check /> : "1"}</div>
            <span className="step-label">Upload Video</span>
          </div>
          <div className={`step-line ${step > 1 ? "completed" : ""}`}></div>
          <div className={`step ${step >= 2 ? (step > 2 ? "completed" : "active") : ""}`}>
            <div className="step-number">{step > 2 ? <Icon.Check /> : "2"}</div>
            <span className="step-label">Venue Details</span>
          </div>
          <div className={`step-line ${step > 2 ? "completed" : ""}`}></div>
          <div className={`step ${step >= 3 ? (step > 3 ? "completed" : "active") : ""}`}>
            <div className="step-number">{step > 3 ? <Icon.Check /> : "3"}</div>
            <span className="step-label">Review & Edit</span>
          </div>
          <div className={`step-line ${step > 3 ? "completed" : ""}`}></div>
          <div className={`step ${step === 4 ? "completed" : ""}`}>
            <div className="step-number">{step === 4 ? <Icon.Check /> : "4"}</div>
            <span className="step-label">Published</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Select Your Video</h3>
            </div>
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
                <div className="upload-zone-icon">
                  {file ? <Icon.Check /> : <Icon.Upload />}
                </div>
                <h3 className="upload-zone-title">
                  {file ? file.name : "Drop your video here"}
                </h3>
                <p className="upload-zone-desc">
                  {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "or click to browse"}
                </p>
              </div>

              <div style={{ marginTop: 32 }}>
                <button 
                  className="btn btn-primary btn-lg" 
                  disabled={!file}
                  onClick={() => setStep(2)}
                >
                  Continue <Icon.Arrow />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tell us about the venue</h3>
            </div>
            <div className="card-body">
              <div className="field">
                <label className="label">Venue Name</label>
                <input 
                  className="input" 
                  value={venueName} 
                  onChange={e => setVenueName(e.target.value)} 
                  placeholder="e.g. Aynhoe Park" 
                />
              </div>

              {VENUE_QUESTIONS.map(q => (
                <div className="field" key={q.id}>
                  <label className="label">{q.label}</label>
                  {q.type === "textarea" ? (
                    <textarea
                      className="textarea"
                      value={venueAnswers[q.id] || ""}
                      onChange={e => setVenueAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                      placeholder={q.placeholder}
                    />
                  ) : (
                    <input
                      className="input"
                      value={venueAnswers[q.id] || ""}
                      onChange={e => setVenueAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                      placeholder={q.placeholder}
                    />
                  )}
                </div>
              ))}

              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button 
                  className="btn btn-primary btn-lg" 
                  disabled={!venueName}
                  onClick={generateContent}
                >
                  Generate Content <Icon.Arrow />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Review Your Content</h3>
            </div>
            <div className="card-body">
              <div className="field">
                <label className="label">YouTube Title</label>
                <input 
                  className="input" 
                  value={youtubeTitle} 
                  onChange={e => setYoutubeTitle(e.target.value)} 
                />
                <div className="char-count">{youtubeTitle.length}/100</div>
              </div>

              <div className="field">
                <label className="label">YouTube Description</label>
                <textarea 
                  className="textarea" 
                  value={youtubeDesc} 
                  onChange={e => setYoutubeDesc(e.target.value)}
                  style={{ minHeight: 200 }}
                />
                <div className="char-count">{youtubeDesc.length}/5000</div>
              </div>

              <div className="divider"></div>

              <div className="field">
                <label className="label">Blog Post</label>
                <textarea 
                  className="textarea" 
                  value={blogContent} 
                  onChange={e => setBlogContent(e.target.value)}
                  style={{ minHeight: 300 }}
                />
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

        {step === 4 && result && (
          <div className="card">
            <div className="card-body">
              <div className="success-screen">
                <div className="success-icon-large">
                  <Icon.Check />
                </div>
                <h2 className="success-title">Successfully Published</h2>
                <p className="success-desc">Your wedding film is now live on YouTube and your blog post has been created.</p>

                <div className="success-links">
                  <a href={result.youtubeUrl} target="_blank" rel="noopener noreferrer" className="success-link">
                    <div className="success-link-info">
                      <div className="success-link-label">YouTube Video</div>
                      <div className="success-link-url">{result.youtubeUrl}</div>
                    </div>
                    <Icon.External />
                  </a>
                  <a href={result.wordpressUrl} target="_blank" rel="noopener noreferrer" className="success-link">
                    <div className="success-link-info">
                      <div className="success-link-label">Blog Post</div>
                      <div className="success-link-url">{result.wordpressUrl}</div>
                    </div>
                    <Icon.External />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
