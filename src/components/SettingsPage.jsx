import { useState } from "react";
import { supabase } from "../utils";
import { Icon } from "../icons";

export function SettingsPage({ user, onSaveUser }) {
  const [wpForm, setWpForm] = useState({ wp_url: user?.wp_url || "", wp_user: user?.wp_user || "", wp_pass: user?.wp_pass || "" });
  const [wpOpen, setWpOpen] = useState(false);
  const [wpLoading, setWpLoading] = useState(false);
  const [wpError, setWpError] = useState("");
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState("");

  const ytConnected = !!user?.youtube_access_token;
  const wpConnected = !!user?.wp_url;

  const connectYouTube = async () => {
    setYtLoading(true);
    setYtError("");
    try {
      const res = await fetch("/api/youtube-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAuthUrl" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get auth URL");
      window.location.href = data.url;
    } catch (e) {
      setYtError(e.message);
      setYtLoading(false);
    }
  };

  const disconnectYouTube = async () => {
    const updated = { ...user, youtube_access_token: null, youtube_refresh_token: null, youtube_channel_name: null };
    await supabase.from("users").update({ youtube_access_token: null, youtube_refresh_token: null, youtube_channel_name: null }).eq("id", user.id);
    onSaveUser(updated);
  };

  const saveWordPress = async (e) => {
    e.preventDefault();
    setWpLoading(true);
    setWpError("");
    try {
      const { wp_url, wp_user, wp_pass } = wpForm;
      if (!wp_url || !wp_user || !wp_pass) throw new Error("All WordPress fields are required");
      const cleanUrl = wp_url.replace(/\/$/, "");
      // Verify credentials
      const testRes = await fetch(`${cleanUrl}/wp-json/wp/v2/users/me`, {
        headers: { Authorization: `Basic ${btoa(`${wp_user}:${wp_pass}`)}` },
      });
      if (!testRes.ok) throw new Error("Could not verify WordPress credentials — check your URL and app password");
      await supabase.from("users").update({ wp_url: cleanUrl, wp_user, wp_pass }).eq("id", user.id);
      onSaveUser({ ...user, wp_url: cleanUrl, wp_user, wp_pass });
      setWpOpen(false);
    } catch (e) {
      setWpError(e.message);
    } finally {
      setWpLoading(false);
    }
  };

  const disconnectWordPress = async () => {
    await supabase.from("users").update({ wp_url: null, wp_user: null, wp_pass: null }).eq("id", user.id);
    onSaveUser({ ...user, wp_url: null, wp_user: null, wp_pass: null });
    setWpForm({ wp_url: "", wp_user: "", wp_pass: "" });
  };

  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-description">Manage your integrations and account settings.</p>
        </div>
      </div>

      <div className="main-body">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Integrations</h3>
          </div>
          <div className="card-body">
            <div className="settings-section">

              {/* YouTube */}
              <div className="settings-row">
                <div>
                  <div className="settings-key" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon.YouTube /> YouTube Channel
                  </div>
                  {ytConnected && <div className="settings-value" style={{ marginTop: 4 }}>{user.youtube_channel_name || "Connected"}</div>}
                  {ytError && <div style={{ color: "var(--error)", fontSize: 13, marginTop: 4 }}>{ytError}</div>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {ytConnected ? (
                    <>
                      <span className="connected-badge"><span className="status-dot" style={{ background: "var(--success)" }}></span> Connected</span>
                      <button className="btn btn-ghost btn-sm" onClick={disconnectYouTube}>Disconnect</button>
                    </>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={connectYouTube} disabled={ytLoading}>
                      {ytLoading ? "Connecting..." : "Connect"}
                    </button>
                  )}
                </div>
              </div>

              {/* WordPress */}
              <div className="settings-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <div>
                    <div className="settings-key" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon.Blog /> WordPress Site
                    </div>
                    {wpConnected && <div className="settings-value" style={{ marginTop: 4 }}>{user.wp_url}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {wpConnected ? (
                      <>
                        <span className="connected-badge"><span className="status-dot" style={{ background: "var(--success)" }}></span> Connected</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => setWpOpen(o => !o)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" onClick={disconnectWordPress}>Disconnect</button>
                      </>
                    ) : (
                      <button className="btn btn-secondary btn-sm" onClick={() => setWpOpen(o => !o)}>Connect</button>
                    )}
                  </div>
                </div>

                {wpOpen && (
                  <form onSubmit={saveWordPress} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">WordPress URL</label>
                      <input className="input" placeholder="https://yourdomain.com" value={wpForm.wp_url}
                        onChange={e => setWpForm(f => ({ ...f, wp_url: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Username</label>
                      <input className="input" placeholder="your-wp-username" value={wpForm.wp_user}
                        onChange={e => setWpForm(f => ({ ...f, wp_user: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Application Password</label>
                      <input className="input" type="password" placeholder="xxxx xxxx xxxx xxxx" value={wpForm.wp_pass}
                        onChange={e => setWpForm(f => ({ ...f, wp_pass: e.target.value }))} />
                      <p className="form-hint">Generate one in WordPress → Users → Profile → Application Passwords</p>
                    </div>
                    {wpError && <div style={{ color: "var(--error)", fontSize: 13 }}>{wpError}</div>}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-primary btn-sm" type="submit" disabled={wpLoading}>
                        {wpLoading ? "Verifying..." : "Save"}
                      </button>
                      <button className="btn btn-ghost btn-sm" type="button" onClick={() => { setWpOpen(false); setWpError(""); }}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <h3 className="card-title">Account</h3>
          </div>
          <div className="card-body">
            <div className="settings-row">
              <div className="settings-key">Email</div>
              <div className="settings-value">{user?.email}</div>
            </div>
            <div className="settings-row">
              <div className="settings-key">Account Created</div>
              <div className="settings-value">{new Date(user?.created_at || Date.now()).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
