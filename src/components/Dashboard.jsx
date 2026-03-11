import { Icon } from "../icons";

export function Dashboard({ user, posts, setPage }) {
  const totalVideos = posts?.length || 0;
  const totalBlogs = posts?.filter(p => p.wp_edit_url)?.length || 0;
  const thisMonth = posts?.filter(p => {
    const d = new Date(p.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  })?.length || 0;

  const publishedCount = posts?.filter(p => p.status === "published").length || 0;
  const minutesSaved = publishedCount * 60;
  const timeSavedDisplay = minutesSaved === 0
    ? null
    : minutesSaved < 60
      ? `${minutesSaved}m`
      : minutesSaved % 60 === 0
        ? `${minutesSaved / 60}h`
        : `${Math.floor(minutesSaved / 60)}h ${minutesSaved % 60}m`;

  const recentPosts = posts?.slice(0, 5) || [];

  // Build activity feed from real post data
  const activities = (posts || []).slice(0, 5).flatMap(p => {
    const date = new Date(p.created_at);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const timeAgo = diffMins < 60
      ? `${diffMins}m ago`
      : diffMins < 1440
        ? `${Math.floor(diffMins / 60)}h ago`
        : `${Math.floor(diffMins / 1440)}d ago`;
    const events = [];
    if (p.yt_url) events.push({ icon: "success", text: `Video uploaded — ${p.venue || "Untitled"}`, time: timeAgo });
    if (p.wp_edit_url) events.push({ icon: "success", text: `Blog draft created — ${p.venue || "Untitled"}`, time: timeAgo });
    if (!p.yt_url && !p.wp_edit_url) events.push({ icon: "default", text: `Content generated — ${p.venue || "Untitled"}`, time: timeAgo });
    return events;
  }).slice(0, 5);

  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">Welcome back, {user?.name?.split(" ")[0] || "there"}. Here's your publishing overview.</p>
        </div>
        <div className="header-actions hide-on-mobile">
          <button className="btn btn-primary" onClick={() => setPage("upload")}>
            <Icon.Plus /> New Upload
          </button>
        </div>
      </div>
      
      <div className="main-body">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <Icon.YouTube />
              </div>
            </div>
            <div className="stat-value">{totalVideos}</div>
            <div className="stat-label">Videos Published</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <Icon.Blog />
              </div>
            </div>
            <div className="stat-value">{totalBlogs}</div>
            <div className="stat-label">Blog Posts Created</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <Icon.Video />
              </div>
            </div>
            <div className="stat-value">{thisMonth}</div>
            <div className="stat-label">This Month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <Icon.History />
              </div>
            </div>
            <div className="stat-value">{timeSavedDisplay || "—"}</div>
            <div className="stat-label">Time Saved</div>
          </div>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-main">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Uploads</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setPage("history")}>
                  View All <Icon.ChevronRight />
                </button>
              </div>
              <div className="card-body no-padding">
                {recentPosts.length > 0 ? (
                  <div className="uploads-list">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="upload-item">
                        <div className="upload-thumbnail">
                          <Icon.Video />
                        </div>
                        <div className="upload-info">
                          <div className="upload-title">{post.yt_title || "Untitled"}</div>
                          <div className="upload-meta">
                            <span>{post.venue}</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className={`upload-status ${post.status === "published" ? "published" : post.status === "uploading" ? "processing" : "draft"}`}>
                          <span className="status-dot"></span>
                          {post.status === "published" ? "Published" : post.status === "uploading" ? "Uploading" : "Draft"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Icon.Film />
                    </div>
                    <h4 className="empty-title">No uploads yet</h4>
                    <p className="empty-desc">Start by uploading your first wedding film to YouTube and create a blog post automatically.</p>
                    <button className="btn btn-primary" onClick={() => setPage("upload")}>
                      <Icon.Upload /> Upload Your First Video
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="quick-actions">
              <div className="quick-action-card primary" onClick={() => setPage("upload")}>
                <div className="quick-action-icon">
                  <Icon.Upload />
                </div>
                <h4 className="quick-action-title">New Upload</h4>
                <p className="quick-action-desc">Upload a wedding film to YouTube and generate a blog post with AI.</p>
              </div>
              <div className="quick-action-card" onClick={() => setPage("settings")}>
                <div className="quick-action-icon">
                  <Icon.YouTube />
                </div>
                {user?.youtube_access_token ? (
                  <>
                    <h4 className="quick-action-title">YouTube Connected</h4>
                    <p className="quick-action-desc">{user.youtube_channel_name || "Channel connected"} — manage in Settings.</p>
                  </>
                ) : (
                  <>
                    <h4 className="quick-action-title">Connect YouTube</h4>
                    <p className="quick-action-desc">Link your YouTube channel to enable direct publishing.</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="dashboard-aside">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
              </div>
              <div className="card-body">
                {activities.length > 0 ? activities.map((activity, i) => (
                  <div key={i} className="activity-item">
                    <div className={`activity-icon ${activity.icon}`}>
                      <Icon.Check />
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">{activity.text}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                )) : (
                  <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>No activity yet — publish your first film to get started.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
