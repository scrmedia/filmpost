import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import { supabase } from "../utils";

export function ResetPasswordPage() {
  const token = new URLSearchParams(window.location.search).get("token");

  const [status, setStatus] = useState("validating"); // "validating" | "valid" | "invalid" | "submitting" | "done"
  const [userId, setUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    validateToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const validateToken = async () => {
    try {
      const { data, error: err } = await supabase
        .from("users")
        .select("id, reset_token_created_at")
        .eq("reset_token", token)
        .single();

      if (err || !data) { setStatus("invalid"); return; }

      // Check token is within 1 hour
      const created = new Date(data.reset_token_created_at);
      const ageMs = Date.now() - created.getTime();
      if (ageMs > 60 * 60 * 1000) { setStatus("invalid"); return; }

      setUserId(data.id);
      setStatus("valid");
    } catch (_) {
      setStatus("invalid");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      const hash = await bcrypt.hash(newPassword, 10);
      const { error: updateErr } = await supabase
        .from("users")
        .update({ password_hash: hash, reset_token: null, reset_token_created_at: null })
        .eq("id", userId);
      if (updateErr) throw new Error(updateErr.message);
      // Redirect to sign in with success flag
      window.location.href = "/?reset=success";
    } catch (e) {
      setError(e.message);
      setStatus("valid");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background, #f5f5f5)", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>FilmPost</h1>
          <p style={{ color: "var(--text-muted, #888)", fontSize: 14, margin: 0 }}>Automated publishing for wedding videographers</p>
        </div>

        <div className="card">
          <div className="card-body">
            {status === "validating" && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div className="spinner"></div>
                <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 14 }}>Validating your reset link…</p>
              </div>
            )}

            {status === "invalid" && (
              <div>
                <h3 style={{ marginBottom: 8 }}>Link expired or invalid</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 20 }}>
                  This password reset link has expired or is not valid. Reset links are only active for 1 hour.
                </p>
                <a href="/" style={{ fontSize: 14, color: "var(--accent, #0066ff)", textDecoration: "none" }}>
                  ← Back to sign in
                </a>
              </div>
            )}

            {(status === "valid" || status === "submitting") && (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: 8, fontSize: 20 }}>Choose a new password</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
                  Enter your new password below.
                </p>
                <div className="field">
                  <label className="label">New Password</label>
                  <input
                    className="input"
                    type="password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setConfirmError(""); }}
                    placeholder="New password"
                    autoFocus
                  />
                </div>
                <div className="field">
                  <label className="label">Confirm New Password</label>
                  <input
                    className="input"
                    type="password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setConfirmError(""); }}
                    placeholder="Repeat your new password"
                  />
                  {confirmError && (
                    <p style={{ fontSize: 12, color: "var(--error)", marginTop: 4 }}>{confirmError}</p>
                  )}
                </div>
                {error && <div className="alert alert-error">{error}</div>}
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%" }}
                  disabled={!newPassword || !confirmPassword || status === "submitting"}
                >
                  {status === "submitting" ? <span className="spinner"></span> : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
