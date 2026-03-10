import { useState, useEffect } from "react";
import { styles } from "./styles";
import { supabase } from "./utils";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Onboarding } from "./components/Onboarding";
import { UploadPage } from "./components/UploadPage";
import { HistoryPage } from "./components/HistoryPage";
import { SettingsPage } from "./components/SettingsPage";
import { ProfilePage } from "./components/ProfilePage";
import { YouTubeCallback } from "./components/YouTubeCallback";

const isYTCallback = window.location.pathname === "/youtube/callback";

export default function App() {
  // Read user synchronously so it's available on the very first render.
  // This is critical for the YouTube OAuth callback path — YouTubeCallback
  // mounts immediately (before any useEffect fires) and needs a populated user.
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("filmpost_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [page, setPage] = useState("dashboard");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadPosts(user.id);
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPosts = async (userId) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error) setPosts(data || []);
  };

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("filmpost_user", JSON.stringify(u));
    loadPosts(u.id);
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
          setPage={setPage}
          user={user}
          onLogout={handleLogout}
        />
        <main className="main-content">
          {page === "dashboard" && <Dashboard user={user} posts={posts} setPage={setPage} />}
          {page === "upload" && <UploadPage user={user} onSuccess={() => loadPosts(user.id)} />}
          {page === "history" && <HistoryPage posts={posts} />}
          {page === "settings" && <SettingsPage user={user} onSaveUser={saveUser} />}
          {page === "profile" && <ProfilePage user={user} onUpdate={saveUser} />}
        </main>
      </div>
    </>
  );
}
