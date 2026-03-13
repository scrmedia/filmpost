import { Icon } from "../icons";

export function Sidebar({ currentPage, setPage, user, onLogout }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Icon.Dashboard },
    { id: "upload", label: "New Post", icon: Icon.Upload },
    { id: "history", label: "History", icon: Icon.History },
    { id: "optimise", label: "Optimise Videos", icon: Icon.Wand },
    { id: "roundup", label: "Area Roundup", icon: Icon.MapPin },
    { id: "venues", label: "Venues", icon: Icon.MapPin },
    { id: "settings", label: "Settings", icon: Icon.Settings },
    { id: "profile", label: "Profile", icon: Icon.User },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: "28px 20px 24px", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "36px",
          fontWeight: "700",
          lineHeight: "1",
          letterSpacing: "-0.02em",
          margin: "0"
        }}>
          <span style={{ color: "#f0ece4" }}>Film</span>
          <span style={{ color: "#c8a96e", fontStyle: "italic", fontWeight: "400" }}>Post</span>
        </h1>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section-title">Menu</div>
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <span className="nav-icon"><item.icon /></span>
            {item.label}
          </div>
        ))}
        
        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <div className="nav-item" onClick={onLogout}>
            <span className="nav-icon"><Icon.Logout /></span>
            Sign Out
          </div>
        </div>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-card" onClick={() => setPage("profile")}>
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-business">{user?.business_name || "Business"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
