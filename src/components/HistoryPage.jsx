import { Icon } from "../icons";

export function HistoryPage({ posts }) {
  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">History</h1>
          <p className="page-description">All your published wedding films and blog posts.</p>
        </div>
      </div>

      <div className="main-body">
        <div className="card">
          <div className="card-body no-padding">
            {posts && posts.length > 0 ? (
              <div className="uploads-list">
                {posts.map((post, i) => (
                  <div key={i} className="upload-item">
                    <div className="upload-thumbnail">
                      <Icon.Video />
                    </div>
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
                <div className="empty-icon">
                  <Icon.History />
                </div>
                <h4 className="empty-title">No uploads yet</h4>
                <p className="empty-desc">Once you upload and publish wedding films, they will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
