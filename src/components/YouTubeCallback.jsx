import { useEffect, useState } from "react";
import { supabase } from "../utils";

export function YouTubeCallback({ user, onComplete }) {
  const [status, setStatus] = useState("Connecting your YouTube channel...");
  const [error, setError] = useState("");

  useEffect(() => {
    const exchange = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get("code");
        if (!code) throw new Error("No authorisation code in URL");

        const res = await fetch("/api/youtube-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "exchangeCode", code }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to connect YouTube");

        if (user?.id) {
          await supabase.from("users").update({
            youtube_access_token: data.access_token,
            youtube_refresh_token: data.refresh_token,
            youtube_channel_name: data.channel_name,
          }).eq("id", user.id);
        }

        setStatus(`Connected: ${data.channel_name}`);
        setTimeout(() => onComplete({
          ...user,
          youtube_access_token: data.access_token,
          youtube_refresh_token: data.refresh_token,
          youtube_channel_name: data.channel_name,
        }), 800);
      } catch (e) {
        setError(e.message);
      }
    };
    exchange();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#fff" }}>
        {error ? (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✕</div>
            <div style={{ color: "#e05c5c", marginBottom: 16 }}>{error}</div>
            <button
              style={{ padding: "10px 24px", border: "1px solid #444", background: "transparent", color: "#fff", cursor: "pointer", borderRadius: 6 }}
              onClick={() => { window.history.replaceState({}, "", "/"); window.location.reload(); }}
            >
              Return to app
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 14, opacity: 0.7 }}>{status}</div>
          </>
        )}
      </div>
    </div>
  );
}
