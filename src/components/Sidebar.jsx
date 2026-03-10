import { Icon } from "../icons";

export function Sidebar({ currentPage, setPage, user, onLogout }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Icon.Dashboard },
    { id: "upload", label: "New Upload", icon: Icon.Upload },
    { id: "history", label: "History", icon: Icon.History },
    { id: "settings", label: "Settings", icon: Icon.Settings },
    { id: "profile", label: "Profile", icon: Icon.User },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">FP</div>
          <div className="logo-text">
            <span className="logo-title">FilmPost</span>
            <span className="logo-subtitle">Wedding Films</span>
          </div>
        </div>
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
