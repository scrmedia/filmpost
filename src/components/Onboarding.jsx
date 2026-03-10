import { useState, useEffect, useRef } from "react";
import bcrypt from "bcryptjs";
import { supabase } from "../utils";
import { BusinessProfileFields } from "./BusinessProfileFields";

// Extract the 11-character YouTube video ID from any common YouTube URL format.
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function Onboarding({ onComplete }) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "", business_name: "",
    tagline: "", enquiry_email: "", website: "", instagram: "", tiktok: "", facebook: "",
    wp_url: "", wp_user: "", wp_pass: "",
  });
  const [createdUser, setCreatedUser] = useState(null); // set after account creation, used in step 3
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [wpSaved, setWpSaved] = useState(false);
  const [ytLoading, setYtLoading] = useState(false);

  // ── Background video state ──────────────────────────────────────────────────
  const [filmPool, setFilmPool] = useState([]);
  const [currentFilm, setCurrentFilm] = useState(null);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef(null);
  const transitionRef = useRef(null);

  useEffect(() => {
    fetchFilmPool();
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(transitionRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Part 3: fetch pool of eligible films ────────────────────────────────────
  const fetchFilmPool = async () => {
    try {
      const { data } = await supabase
        .from("posts")
        .select("youtube_url, youtube_title, users!inner(business_name, website)")
        .eq("status", "published")
        .not("youtube_url", "is", null)
        .eq("users.featured_opt_in", true);

      if (!data || data.length === 0) return;

      const films = data
        .map(p => ({
          youtube_url: p.youtube_url,
          youtube_title: p.youtube_title,
          business_name: p.users?.business_name,
          website: p.users?.website,
        }))
        .filter(f => extractYouTubeId(f.youtube_url));

      if (films.length === 0) return;

      setFilmPool(films);
      const first = films[Math.floor(Math.random() * films.length)];
      setCurrentFilm(first);
      // Small delay so the iframe has a moment to initialise before fading in
      setTimeout(() => setVisible(true), 300);
    } catch (_) {
      // Silent fail — fall back to solid dark background
    }
  };

  // ── Part 4: rotate film every 30 seconds ────────────────────────────────────
  useEffect(() => {
    if (filmPool.length === 0) return;

    intervalRef.current = setInterval(() => {
      // Fade out
      setVisible(false);
      transitionRef.current = setTimeout(() => {
        // Pick a different random film
        setCurrentFilm(prev => {
          if (filmPool.length === 1) return filmPool[0];
          const currentIdx = filmPool.indexOf(prev);
          let nextIdx;
          do {
            nextIdx = Math.floor(Math.random() * filmPool.length);
          } while (nextIdx === currentIdx);
          return filmPool[nextIdx];
        });
        // Fade in after swap
        setTimeout(() => setVisible(true), 50);
      }, 600); // matches CSS transition duration
    }, 30000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(transitionRef.current);
    };
  }, [filmPool]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e?.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data, error: err } = await supabase.from("users").select("*").eq("email", form.email).single();
      if (err || !data) throw new Error("Invalid credentials");
      if (!data.password_hash) throw new Error("Account has no password set — please create a new account");
      const valid = await bcrypt.compare(form.password, data.password_hash);
      if (!valid) throw new Error("Invalid credentials");
      onComplete(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Signup ─────────────────────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e?.preventDefault();
    setError(""); setLoading(true);
    try {
      if (step === 1) {
        if (!form.name || !form.email || !form.password) throw new Error("All fields required");
        setStep(2); setLoading(false); return;
      }
      if (step === 2) {
        if (!form.business_name) throw new Error("Business name required");
        const hash = await bcrypt.hash(form.password, 10);
        const { data, error: err } = await supabase.from("users").insert([{
          name: form.name, email: form.email, password_hash: hash,
          business_name: form.business_name, tagline: form.tagline,
          enquiry_email: form.enquiry_email || form.email,
          website: form.website, instagram: form.instagram,
          tiktok: form.tiktok, facebook: form.facebook,
        }]).select().single();
        if (err) throw new Error(err.message);
        localStorage.setItem("filmpost_user", JSON.stringify(data));
        setCreatedUser(data);
        setStep(3); setLoading(false); return;
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── WordPress save (step 3) ────────────────────────────────────────────────
  const saveWordPress = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { wp_url, wp_user, wp_pass } = form;
      if (!wp_url || !wp_user || !wp_pass) throw new Error("All WordPress fields required");
      const cleanUrl = wp_url.replace(/\/$/, "");
      const testRes = await fetch(`${cleanUrl}/wp-json/wp/v2/users/me`, {
        headers: { Authorization: `Basic ${btoa(`${wp_user}:${wp_pass}`)}` },
      });
      if (!testRes.ok) throw new Error("Could not verify WordPress credentials");
      const updated = { ...createdUser, wp_url: cleanUrl, wp_user, wp_pass };
      await supabase.from("users").update({ wp_url: cleanUrl, wp_user, wp_pass }).eq("id", createdUser.id);
      localStorage.setItem("filmpost_user", JSON.stringify(updated));
      setCreatedUser(updated);
      setWpSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── YouTube connect (step 3) ───────────────────────────────────────────────
  const connectYouTube = async () => {
    setYtLoading(true); setError("");
    try {
      const res = await fetch("/api/youtube-auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAuthUrl" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get auth URL");
      window.location.href = data.url;
    } catch (e) {
      setError(e.message); setYtLoading(false);
    }
  };

  const finish = () => onComplete(createdUser);

  // ── Part 4: build embed URL ─────────────────────────────────────────────────
  const videoId = currentFilm ? extractYouTubeId(currentFilm.youtube_url) : null;
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0`
    : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>

      {/* Part 4: Fullscreen muted autoplaying video background */}
      {embedUrl && (
        <div className="video-bg-layer" style={{ opacity: visible ? 1 : 0 }}>
          <iframe
            key={videoId}
            src={embedUrl}
            className="video-bg-iframe"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="background film"
            frameBorder="0"
          />
          <div className="video-bg-overlay" />
        </div>
      )}

      {/* Part 5: Credit overlay — bottom-left pill */}
      {currentFilm && (
        <div className="video-credit" style={{ opacity: visible ? 1 : 0 }}>
          {currentFilm.website
            ? (
              <a
                href={currentFilm.website}
                target="_blank"
                rel="noopener noreferrer"
                className="video-credit-name"
              >
                {currentFilm.business_name}
              </a>
            )
            : <span className="video-credit-name">{currentFilm.business_name}</span>
          }
          {currentFilm.youtube_title && (
            <span className="video-credit-title">{currentFilm.youtube_title}</span>
          )}
        </div>
      )}

      {/* Existing login/signup card — transparent bg when video is playing */}
      <div
        className="onboarding-container"
        style={{
          background: currentFilm ? "transparent" : undefined,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="onboarding-card">
          <div className="onboarding-logo">
            <h1>FilmPost</h1>
            <p>Automated publishing for wedding videographers</p>
          </div>

          <div className="card">
            <div className="card-body">
              {isLogin ? (
                /* ── Login form ── */
                <form onSubmit={handleLogin}>
                  <div className="field">
                    <label className="label">Email</label>
                    <input className="input" type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div className="field">
                    <label className="label">Password</label>
                    <input className="input" type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Enter your password" />
                  </div>
                  {error && <div className="alert alert-error">{error}</div>}
                  <button className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={loading}>
                    {loading ? <span className="spinner"></span> : "Sign In"}
                  </button>
                </form>
              ) : step === 3 ? (
                /* ── Step 3: Connect integrations ── */
                <div>
                  <div className="onboarding-step">Step 3 of 3</div>
                  <h3 style={{ marginBottom: 8, fontSize: 22 }}>Connect your integrations</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
                    Connect your publishing channels. You can also do this later in Settings.
                  </p>

                  {/* WordPress */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span className="label" style={{ marginBottom: 0 }}>WordPress Site</span>
                      {wpSaved && <span style={{ color: "var(--success)", fontSize: 13 }}>✓ Connected</span>}
                    </div>
                    {!wpSaved ? (
                      <form onSubmit={saveWordPress} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <input className="input" placeholder="https://yourdomain.com" value={form.wp_url} onChange={e => update("wp_url", e.target.value)} />
                        <input className="input" placeholder="WordPress username" value={form.wp_user} onChange={e => update("wp_user", e.target.value)} />
                        <input className="input" type="password" placeholder="Application password" value={form.wp_pass} onChange={e => update("wp_pass", e.target.value)} />
                        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                          Generate an app password in WordPress → Users → Profile → Application Passwords
                        </p>
                        <button className="btn btn-secondary" type="submit" disabled={loading}>
                          {loading ? "Verifying..." : "Connect WordPress"}
                        </button>
                      </form>
                    ) : (
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{form.wp_url}</div>
                    )}
                  </div>

                  {/* YouTube */}
                  <div style={{ marginBottom: 24 }}>
                    <div className="label" style={{ marginBottom: 12 }}>YouTube Channel</div>
                    <button className="btn btn-secondary" style={{ width: "100%" }} onClick={connectYouTube} disabled={ytLoading}>
                      {ytLoading ? "Redirecting to Google..." : "Connect YouTube"}
                    </button>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
                      You'll be redirected to Google to authorise access.
                    </p>
                  </div>

                  {error && <div className="alert alert-error">{error}</div>}

                  <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={finish}>
                    Finish Setup
                  </button>
                  <button type="button" className="btn btn-ghost" style={{ width: "100%", marginTop: 12 }} onClick={finish}>
                    Skip for now
                  </button>
                </div>
              ) : (
                /* ── Sign-up steps 1 & 2 ── */
                <form onSubmit={handleSignup}>
                  {step === 1 ? (
                    <>
                      <div className="onboarding-step">Step 1 of 3</div>
                      <h3 style={{ marginBottom: 24, fontSize: 22 }}>Create your account</h3>
                      <div className="field">
                        <label className="label">Full Name</label>
                        <input className="input" value={form.name} onChange={e => update("name", e.target.value)} placeholder="John Smith" />
                      </div>
                      <div className="field">
                        <label className="label">Email</label>
                        <input className="input" type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" />
                      </div>
                      <div className="field">
                        <label className="label">Password</label>
                        <input className="input" type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Create a password" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="onboarding-step">Step 2 of 3</div>
                      <h3 style={{ marginBottom: 24, fontSize: 22 }}>Your business details</h3>
                      <div className="field">
                        <label className="label">Business Name</label>
                        <input className="input" value={form.business_name} onChange={e => update("business_name", e.target.value)} placeholder="Your Wedding Films" />
                      </div>
                      <BusinessProfileFields form={form} update={update} />
                    </>
                  )}
                  {error && <div className="alert alert-error">{error}</div>}
                  <button className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={loading}>
                    {loading ? <span className="spinner"></span> : step === 1 ? "Continue" : "Continue"}
                  </button>
                  {step === 2 && (
                    <button type="button" className="btn btn-ghost" style={{ width: "100%", marginTop: 12 }} onClick={() => setStep(1)}>
                      Back
                    </button>
                  )}
                </form>
              )}

              {step !== 3 && (
                <>
                  <div className="divider-text"><span>or</span></div>
                  <button className="btn btn-secondary" style={{ width: "100%" }}
                    onClick={() => { setIsLogin(!isLogin); setStep(1); setError(""); }}>
                    {isLogin ? "Create an Account" : "Sign In Instead"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
