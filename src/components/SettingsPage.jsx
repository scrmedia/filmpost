import { useState } from "react";
import { Icon } from "../icons";

export function SettingsPage({ user }) {
  const [ytConnected, setYtConnected] = useState(false);
  const [wpConnected, setWpConnected] = useState(false);

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
              <div className="settings-row">
                <div>
                  <div className="settings-key" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon.YouTube /> YouTube Channel
                  </div>
                </div>
                <div>
                  {ytConnected ? (
                    <span className="connected-badge"><span className="status-dot" style={{ background: "var(--success)" }}></span> Connected</span>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => setYtConnected(true)}>Connect</button>
                  )}
                </div>
              </div>

              <div className="settings-row">
                <div>
                  <div className="settings-key" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon.Blog /> WordPress Site
                  </div>
                </div>
                <div>
                  {wpConnected ? (
                    <span className="connected-badge"><span className="status-dot" style={{ background: "var(--success)" }}></span> Connected</span>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => setWpConnected(true)}>Connect</button>
                  )}
                </div>
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
