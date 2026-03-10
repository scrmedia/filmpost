import { Icon } from "../icons";

export function Dashboard({ user, posts, setPage }) {
  const totalVideos = posts?.length || 0;
  const totalBlogs = posts?.filter(p => p.wordpress_url)?.length || 0;
  const thisMonth = posts?.filter(p => {
    const d = new Date(p.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  })?.length || 0;
  
  const recentPosts = posts?.slice(0, 5) || [];

  const activities = [
    { icon: "success", text: "Video published to YouTube", time: "2 hours ago" },
    { icon: "success", text: "Blog post created on WordPress", time: "2 hours ago" },
    { icon: "default", text: "New upload started", time: "3 hours ago" },
  ];

  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">Welcome back, {user?.name?.split(" ")[0] || "there"}. Here's your publishing overview.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setPage("upload")}>
            <Icon.Plus /> New Upload
          </button>
        </div>
      </div>
      
      <div className="main-body">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon"><Icon.YouTube /></div>
              <div className="stat-trend up"><Icon.TrendUp /> 12%</div>
            </div>
            <div className="stat-value">{totalVideos}</div>
            <div className="stat-label">Videos Published</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon"><Icon.Blog /></div>
              <div className="stat-trend up"><Icon.TrendUp /> 8%</div>
            </div>
            <div className="stat-value">{totalBlogs}</div>
            <div className="stat-label">Blog Posts Created</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon"><Icon.Video /></div>
            </div>
            <div className="stat-value">{thisMonth}</div>
            <div className="stat-label">This Month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon"><Icon.TrendUp /></div>
            </div>
            <div className="stat-value">{Math.round(totalVideos / Math.max(1, 3))}x</div>
            <div className="stat-label">Avg. per Month</div>
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
                    {recentPosts.map((post, i) => (
                      <div key={i} className="upload-item">
                        <div className="upload-thumbnail"><Icon.Video /></div>
                        <div className="upload-info">
                          <div className="upload-title">{post.youtube_title || "Untitled"}</div>
                          <div className="upload-meta">
                            <span>{post.venue_name}</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="upload-status published">
                          <span className="status-dot"></span>
                          Published
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon"><Icon.Film /></div>
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
                <div className="quick-action-icon"><Icon.Upload /></div>
                <h4 className="quick-action-title">New Upload</h4>
                <p className="quick-action-desc">Upload a wedding film to YouTube and generate a blog post with AI.</p>
              </div>
              <div className="quick-action-card" onClick={() => setPage("settings")}>
                <div className="quick-action-icon"><Icon.YouTube /></div>
                <h4 className="quick-action-title">Connect YouTube</h4>
                <p className="quick-action-desc">Link your YouTube channel to enable direct publishing.</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-aside">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
              </div>
              <div className="card-body">
                {activities.map((activity, i) => (
                  <div key={i} className="activity-item">
                    <div className={`activity-icon ${activity.icon}`}><Icon.Check /></div>
                    <div className="activity-content">
                      <p className="activity-text">{activity.text}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
