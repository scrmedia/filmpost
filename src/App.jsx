import { useState, useEffect } from "react";
import { styles } from "./styles";
import { supabase } from "./utils";
import { Icon } from "./icons";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Onboarding } from "./components/Onboarding";
import { UploadPage } from "./components/UploadPage";
import { HistoryPage } from "./components/HistoryPage";
import { SettingsPage } from "./components/SettingsPage";
import { ProfilePage } from "./components/ProfilePage";
import { VenuePage } from "./components/VenuePage";
import { YouTubeCallback } from "./components/YouTubeCallback";
import { RoundupPage } from "./components/RoundupPage";

const isYTCallback = window.location.pathname === "/youtube/callback";

const isMobile = () => window.innerWidth <= 768;

const MOBILE_NAV_ITEMS = [
  { id: "history", label: "History", icon: Icon.History },
  { id: "profile", label: "Profile", icon: Icon.User },
  { id: "settings", label: "Settings", icon: Icon.Settings },
];

export default function App() {
  // Read user synchronously so it's available on the very first render.
  // This is critical for the YouTube OAuth callback path — YouTubeCallback
  // mounts immediately (before any useEffect fires) and needs a populated user.
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("filmpost_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [page, setPage] = useState(() => isMobile() ? "history" : "dashboard");
  const [uploadKey, setUploadKey] = useState(0);
  const [posts, setPosts] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // On mobile, redirect away from upload (and dashboard) to history
  useEffect(() => {
    if (isMobile() && page === "upload") {
      setPage("history");
    }
  }, [page]);

  useEffect(() => {
    if (user) { loadPosts(user.id); loadVenues(user.id); }
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPosts = async (userId) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error == null) setPosts(data || []);
  };

  const loadVenues = async (userId) => {
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .eq("user_id", userId)
      .order("venue_name");
    if (error == null) setVenues(data || []);
  };

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("filmpost_user", JSON.stringify(u));
    loadPosts(u.id);
    loadVenues(u.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("filmpost_user");
    setPage("dashboard");
  };

  const saveUser = (u) => {
    setUser(u);
    localStorage.setItem("filmpost_user", JSON.stringify(u));
  };

  if (isYTCallback) {
    return (
      <>
        <style>{styles}</style>
        <YouTubeCallback
          user={user}
          onComplete={(u) => {
            saveUser(u);
            window.history.replaceState({}, "", "/");
            window.location.reload();
          }}
        />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-overlay">
          <div className="spinner spinner-lg"></div>
          <h3 className="loading-title">Loading FilmPost</h3>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <style>{styles}</style>
        <Onboarding onComplete={handleLogin} />
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app-layout">
        <Sidebar
          currentPage={page}
          setPage={(p) => { if (p === "upload") setUploadKey(k => k + 1); setPage(p); }}
          user={user}
          onLogout={handleLogout}
        />
        <main className="main-content">
          {/* Mobile-only informational banner */}
          <div className="mobile-banner">
            To upload a wedding film and generate content, visit FilmPost on your desktop or laptop.
          </div>

          {page === "dashboard" && <Dashboard user={user} posts={posts} setPage={setPage} />}
          {page === "upload" && <UploadPage key={uploadKey} user={user} venues={venues} onSuccess={() => loadPosts(user.id)} onDone={() => { loadPosts(user.id); setPage("dashboard"); }} onVenueAdded={() => loadVenues(user.id)} />}
          {page === "history" && <HistoryPage posts={posts} user={user} />}
          {page === "venues" && <VenuePage user={user} posts={posts} venues={venues} onVenuesChange={() => loadVenues(user.id)} setPage={setPage} />}
          {page === "settings" && <SettingsPage user={user} onSaveUser={saveUser} />}
          {page === "profile" && <ProfilePage user={user} onUpdate={saveUser} />}
          {page === "roundup" && <RoundupPage user={user} posts={posts} onDone={() => { loadPosts(user.id); setPage("history"); }} />}
        </main>
      </div>

      {/* Mobile-only bottom navigation (History, Profile, Settings) */}
      <nav className="mobile-bottom-nav">
        {MOBILE_NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`mobile-nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <span className="mobile-nav-icon"><item.icon /></span>
            <span className="mobile-nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </>
  );
}
