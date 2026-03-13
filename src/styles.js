export const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --background: #09090b;
    --surface: #0f0f12;
    --surface-elevated: #18181b;
    --border: #27272a;
    --border-subtle: #1f1f23;
    --text-primary: #fafafa;
    --text-secondary: #a1a1aa;
    --text-muted: #52525b;
    --accent: #c9a96e;
    --accent-hover: #d4b87a;
    --accent-muted: rgba(201, 169, 110, 0.15);
    --success: #22c55e;
    --error: #ef4444;
    --warning: #f59e0b;
    --radius-sm: 6px;
    --radius: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --shadow-glow: 0 0 60px -15px rgba(201, 169, 110, 0.15);
    --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--background);
    color: var(--text-primary);
    min-height: 100vh;
    font-size: 14px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4 {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 500;
    letter-spacing: -0.02em;
  }

  /* Layout */
  .app-layout {
    display: flex;
    min-height: 100vh;
  }
  
  /* Sidebar */
  .sidebar {
    width: 260px;
    background: var(--surface);
    border-right: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 50;
  }
  
  .sidebar-header {
    padding: 24px;
    border-bottom: 1px solid var(--border-subtle);
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--accent), #8a6f42);
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--background);
    font-weight: 600;
    font-size: 16px;
    font-family: 'Playfair Display', serif;
  }
  
  .logo-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .logo-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  
  .logo-subtitle {
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .nav-section-title {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 16px 12px 8px;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: var(--radius);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 14px;
    font-weight: 400;
  }
  
  .nav-item:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
  }
  
  .nav-item.active {
    background: var(--accent-muted);
    color: var(--accent);
  }
  
  .nav-item.active .nav-icon {
    color: var(--accent);
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: var(--transition);
  }
  
  .nav-item:hover .nav-icon {
    color: var(--text-secondary);
  }
  
  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid var(--border-subtle);
  }
  
  .user-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--surface-elevated);
    border-radius: var(--radius);
    cursor: pointer;
    transition: var(--transition);
  }
  
  .user-card:hover {
    background: var(--border);
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), #8a6f42);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--background);
    font-weight: 600;
    font-size: 14px;
  }
  
  .user-info {
    flex: 1;
    min-width: 0;
  }
  
  .user-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .user-business {
    font-size: 11px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    margin-left: 260px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow-x: hidden;
  }
  
  .main-header {
    padding: 24px 32px;
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
    position: sticky;
    top: 0;
    z-index: 40;
  }
  
  .page-title {
    font-size: 28px;
    color: var(--text-primary);
  }
  
  .page-description {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 4px;
    font-family: 'Inter', sans-serif;
  }
  
  .header-actions {
    display: flex;
    gap: 12px;
  }
  
  .main-body {
    flex: 1;
    padding: 32px;
  }
  
  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    border-radius: var(--radius);
    cursor: pointer;
    transition: var(--transition);
    border: none;
    white-space: nowrap;
  }
  
  .btn-primary {
    background: var(--accent);
    color: var(--background);
  }
  
  .btn-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(201, 169, 110, 0.25);
  }
  
  .btn-secondary {
    background: var(--surface-elevated);
    color: var(--text-primary);
    border: 1px solid var(--border);
  }
  
  .btn-secondary:hover {
    background: var(--border);
    border-color: var(--text-muted);
  }
  
  .btn-ghost {
    background: transparent;
    color: var(--text-secondary);
    padding: 10px 16px;
  }
  
  .btn-ghost:hover {
    background: var(--surface-elevated);
    color: var(--text-primary);
  }
  
  .btn-sm {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .btn-lg {
    padding: 16px 32px;
    font-size: 16px;
    border-radius: var(--radius-lg);
  }
  
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }
  
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: 24px;
    transition: var(--transition);
  }
  
  .stat-card:hover {
    border-color: var(--border);
    box-shadow: var(--shadow-glow);
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-muted);
    color: var(--accent);
  }
  
  .stat-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .stat-trend.up {
    color: var(--success);
  }
  
  .stat-trend.down {
    color: var(--error);
  }
  
  .stat-value {
    font-size: 36px;
    font-weight: 600;
    color: var(--text-primary);
    font-family: 'Playfair Display', serif;
    line-height: 1;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 13px;
    color: var(--text-secondary);
  }
  
  /* Cards */
  .card {
    background: var(--surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-subtle);
  }
  
  .card-title {
    font-size: 18px;
    color: var(--text-primary);
  }
  
  .card-body {
    padding: 24px;
  }
  
  .card-body.no-padding {
    padding: 0;
  }
  
  /* Recent Uploads */
  .uploads-list {
    display: flex;
    flex-direction: column;
  }
  
  .upload-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-subtle);
    transition: var(--transition);
    cursor: pointer;
  }
  
  .upload-item:last-child {
    border-bottom: none;
  }
  
  .upload-item:hover {
    background: var(--surface-elevated);
  }
  
  .upload-thumbnail {
    width: 80px;
    height: 48px;
    background: var(--surface-elevated);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    flex-shrink: 0;
    overflow: hidden;
  }
  
  .upload-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .upload-info {
    flex: 1;
    min-width: 0;
  }
  
  .upload-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .upload-meta {
    font-size: 12px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .upload-status {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .upload-status.published {
    background: rgba(34, 197, 94, 0.1);
    color: var(--success);
  }
  
  .upload-status.processing {
    background: rgba(245, 158, 11, 0.1);
    color: var(--warning);
  }
  
  .upload-status.draft {
    background: var(--surface-elevated);
    color: var(--text-muted);
  }
  
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
  
  /* Quick Actions */
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }
  
  .quick-action-card {
    background: var(--surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: 24px;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .quick-action-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
  }
  
  .quick-action-card.primary {
    background: linear-gradient(135deg, var(--accent), #8a6f42);
    border-color: transparent;
  }
  
  .quick-action-card.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(201, 169, 110, 0.3);
  }
  
  .quick-action-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent-muted);
    color: var(--accent);
  }
  
  .quick-action-card.primary .quick-action-icon {
    background: rgba(9, 9, 11, 0.2);
    color: var(--background);
  }
  
  .quick-action-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: var(--text-primary);
  }
  
  .quick-action-card.primary .quick-action-title {
    color: var(--background);
  }
  
  .quick-action-desc {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
  }
  
  .quick-action-card.primary .quick-action-desc {
    color: rgba(9, 9, 11, 0.7);
  }
  
  /* Dashboard Grid Layout */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }
  
  .dashboard-main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .dashboard-aside {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  /* Empty State */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
    text-align: center;
  }
  
  .empty-icon {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-lg);
    background: var(--surface-elevated);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    margin-bottom: 20px;
  }
  
  .empty-title {
    font-size: 18px;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  .empty-desc {
    font-size: 14px;
    color: var(--text-secondary);
    max-width: 320px;
    margin-bottom: 24px;
  }
  
  /* Activity Feed */
  .activity-item {
    display: flex;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--surface-elevated);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    flex-shrink: 0;
  }
  
  .activity-icon.success {
    background: rgba(34, 197, 94, 0.1);
    color: var(--success);
  }
  
  .activity-content {
    flex: 1;
  }
  
  .activity-text {
    font-size: 13px;
    color: var(--text-primary);
    margin-bottom: 2px;
  }
  
  .activity-time {
    font-size: 12px;
    color: var(--text-muted);
  }
  
  /* Forms */
  .field {
    margin-bottom: 24px;
  }
  
  .label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  .label-hint {
    font-weight: 400;
    color: var(--text-muted);
    margin-left: 4px;
  }
  
  .input, .textarea, .select {
    width: 100%;
    background: var(--surface-elevated);
    border: 1px solid var(--border);
    color: var(--text-primary);
    padding: 12px 16px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    border-radius: var(--radius);
    transition: var(--transition);
    outline: none;
  }
  
  .input:focus, .textarea:focus, .select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-muted);
  }
  
  .input::placeholder, .textarea::placeholder {
    color: var(--text-muted);
  }
  
  .textarea {
    resize: vertical;
    min-height: 120px;
    line-height: 1.6;
  }
  
  .input-group {
    display: flex;
    gap: 12px;
  }
  
  .input-prefix-group {
    display: flex;
    align-items: stretch;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--surface-elevated);
    transition: var(--transition);
  }
  
  .input-prefix-group:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-muted);
  }
  
  .input-prefix-group .prefix {
    padding: 12px 14px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  
  .input-prefix-group .input {
    border: none;
    border-radius: 0;
    background: transparent;
  }
  
  .input-prefix-group .input:focus {
    box-shadow: none;
  }
  
  /* Upload Zone */
  .upload-zone {
    border: 2px dashed var(--border);
    border-radius: var(--radius-lg);
    padding: 60px 40px;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
    background: var(--surface);
  }
  
  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--accent);
    background: var(--accent-muted);
  }
  
  .upload-zone.has-file {
    border-color: var(--accent);
    border-style: solid;
    background: var(--accent-muted);
  }
  
  .upload-zone-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    border-radius: var(--radius-lg);
    background: var(--surface-elevated);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }
  
  .upload-zone:hover .upload-zone-icon {
    background: var(--accent-muted);
    color: var(--accent);
  }
  
  .upload-zone-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  .upload-zone-desc {
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  /* Progress */
  .progress-bar {
    height: 6px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent-hover));
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  /* Stepper */
  .stepper {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }
  
  .step {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    transition: var(--transition);
  }
  
  .step.active .step-number {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-muted);
  }
  
  .step.completed .step-number {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--background);
  }
  
  .step-label {
    font-size: 14px;
    color: var(--text-muted);
    font-weight: 500;
  }
  
  .step.active .step-label {
    color: var(--text-primary);
  }
  
  .step-line {
    flex: 1;
    height: 2px;
    background: var(--border);
    margin: 0 16px;
  }
  
  .step-line.completed {
    background: var(--accent);
  }
  
  /* Alerts */
  .alert {
    padding: 16px 20px;
    border-radius: var(--radius);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  .alert-info {
    background: var(--accent-muted);
    border: 1px solid var(--accent);
    color: var(--text-primary);
  }
  
  .alert-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid var(--error);
    color: var(--text-primary);
  }
  
  .alert-success {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid var(--success);
    color: var(--text-primary);
  }
  
  .alert-icon {
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  /* Tags */
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background: var(--surface-elevated);
    color: var(--text-secondary);
  }
  
  .tag.gold {
    background: var(--accent-muted);
    color: var(--accent);
  }
  
  /* Loading */
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  
  .spinner-lg {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(9, 9, 11, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    gap: 24px;
  }
  
  .loading-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: var(--text-primary);
  }
  
  .loading-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  /* Settings */
  .settings-section {
    margin-bottom: 32px;
  }
  
  .settings-section-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 16px;
    font-family: 'Playfair Display', serif;
  }
  
  .settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  
  .settings-row:last-child {
    border-bottom: none;
  }
  
  .settings-key {
    font-size: 14px;
    color: var(--text-primary);
  }
  
  .settings-value {
    font-size: 13px;
    color: var(--text-muted);
    font-family: monospace;
  }
  
  .connected-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--success);
  }
  
  .disconnected-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--error);
  }
  
  /* Tabs */
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: 24px;
    gap: 4px;
  }
  
  .tab {
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: var(--transition);
  }
  
  .tab:hover {
    color: var(--text-secondary);
  }
  
  .tab.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
  }
  
  /* Onboarding */
  .onboarding-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: var(--background);
  }
  
  .onboarding-card {
    width: 100%;
    max-width: 480px;
  }
  
  .onboarding-logo {
    text-align: center;
    margin-bottom: 48px;
  }
  
  .onboarding-logo h1 {
    font-size: 42px;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  .onboarding-logo p {
    font-size: 15px;
    color: var(--text-secondary);
  }
  
  .onboarding-step {
    font-size: 12px;
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .divider {
    height: 1px;
    background: var(--border-subtle);
    margin: 24px 0;
  }
  
  .divider-text {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 24px 0;
  }
  
  .divider-text::before,
  .divider-text::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-subtle);
  }
  
  .divider-text span {
    font-size: 12px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  /* Success Screen */
  .success-screen {
    text-align: center;
    padding: 40px;
  }
  
  .success-icon-large {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    border-radius: 50%;
    background: rgba(34, 197, 94, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--success);
  }
  
  .success-title {
    font-size: 28px;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  .success-desc {
    font-size: 15px;
    color: var(--text-secondary);
    margin-bottom: 32px;
  }
  
  .success-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
  }
  
  .success-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: var(--surface-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    text-decoration: none;
    transition: var(--transition);
  }
  
  .success-link:hover {
    border-color: var(--accent);
    background: var(--surface);
  }
  
  .success-link-info {
    text-align: left;
  }
  
  .success-link-label {
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }
  
  .success-link-url {
    font-size: 14px;
    color: var(--accent);
  }
  
  /* Grid layouts */
  .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  /* Profile Preview */
  .profile-preview {
    background: var(--surface-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    margin-top: 20px;
  }
  
  .profile-preview-label {
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .profile-preview pre {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    white-space: pre-wrap;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  /* Posts list */
  .post-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  
  .post-row:last-child {
    border-bottom: none;
  }
  
  .post-title-text {
    font-size: 14px;
    color: var(--text-primary);
    margin-bottom: 4px;
    font-weight: 500;
  }
  
  .post-meta {
    font-size: 12px;
    color: var(--text-muted);
  }
  
  /* Char count */
  .char-count {
    font-size: 12px;
    color: var(--text-muted);
    text-align: right;
    margin-top: 6px;
  }
  
  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
  }
  
  /* History page — expandable rows */
  .upload-item-wrapper {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--border-subtle);
  }

  .upload-item-wrapper:last-child {
    border-bottom: none;
  }

  /* Override the original :last-child rule — border is now on the wrapper */
  .upload-item-wrapper .upload-item {
    border-bottom: none;
  }

  .upload-item.is-expanded {
    background: var(--surface-elevated);
  }

  .upload-expand-chevron {
    padding: 0 20px;
    color: var(--text-muted);
    font-size: 11px;
    flex-shrink: 0;
  }

  /* Delete button — hidden until row is hovered */
  .upload-item--deletable .upload-delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.15s, background 0.15s, color 0.15s;
  }
  .upload-item--deletable:hover .upload-delete-btn {
    opacity: 1;
  }
  .upload-item--deletable .upload-delete-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger, #ef4444);
  }

  /* Delete confirmation dialog */
  .delete-dialog-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .delete-dialog {
    background: var(--surface-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius);
    padding: 28px 32px;
    width: 360px;
    max-width: calc(100vw - 40px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  }
  .delete-dialog-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 8px;
  }
  .delete-dialog-body {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0 0 24px;
  }
  .delete-dialog-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  .btn-danger {
    background: #ef4444;
    color: #fff;
    border: none;
  }
  .btn-danger:hover:not(:disabled) {
    background: #dc2626;
  }

  .upload-expanded {
    border-top: 1px solid var(--border-subtle);
    background: var(--surface);
  }

  /* Blog rewriter panel */
  .blog-rewriter {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .blog-rewriter-section {
    display: flex;
    flex-direction: column;
  }

  .blog-rewriter-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .version-toggle-btn {
    background: none;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 11px;
    padding: 2px 10px;
    cursor: pointer;
    transition: var(--transition);
  }

  .version-toggle-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  /* Version history list */
  .version-history {
    display: flex;
    flex-direction: column;
    gap: 1px;
    margin-bottom: 12px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .version-item {
    padding: 10px 14px;
    background: var(--surface-elevated);
  }

  .version-item.version-current {
    background: rgba(201, 169, 110, 0.06);
  }

  .version-item-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  .version-badge {
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
    letter-spacing: 0.05em;
  }

  .version-date {
    font-size: 11px;
    color: var(--text-muted);
  }

  .version-preview {
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Diff view */
  .diff-view {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .diff-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: var(--surface-elevated);
    border-bottom: 1px solid var(--border-subtle);
  }

  .diff-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .diff-legend {
    display: flex;
    gap: 8px;
  }

  .diff-legend-pill {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 20px;
  }

  .diff-legend-add {
    background: rgba(34, 197, 94, 0.15);
    color: #4ade80;
  }

  .diff-legend-remove {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
  }

  .diff-content {
    padding: 16px;
    font-size: 13px;
    line-height: 1.75;
    color: var(--text-secondary);
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 360px;
    overflow-y: auto;
    background: var(--surface);
  }

  mark.diff-add {
    background: rgba(34, 197, 94, 0.18);
    color: #4ade80;
    border-radius: 2px;
    text-decoration: none;
  }

  del.diff-remove {
    background: rgba(239, 68, 68, 0.12);
    color: #f87171;
    text-decoration: line-through;
    border-radius: 2px;
  }

  .diff-actions {
    display: flex;
    gap: 10px;
    padding: 12px 16px;
    background: var(--surface-elevated);
    border-top: 1px solid var(--border-subtle);
  }

  /* Tweak input */
  .tweak-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .tweak-input-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .tweak-input-row .input {
    flex: 1;
  }

  .tweak-input-row .btn {
    flex-shrink: 0;
    white-space: nowrap;
  }

  /* Hero image picker (Upload step 2) */
  .hero-image-picker {
    border: 2px dashed var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    cursor: pointer;
    transition: var(--transition);
    min-height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-elevated);
  }

  .hero-image-picker:hover {
    border-color: var(--accent);
    background: var(--surface);
  }

  .hero-image-picker.has-image {
    border-style: solid;
    border-color: var(--accent);
    min-height: unset;
  }

  .hero-image-preview {
    width: 100%;
    max-height: 280px;
    object-fit: cover;
    display: block;
  }

  .hero-image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: var(--text-muted);
    font-size: 13px;
    padding: 32px;
  }

  /* Featured film background (Onboarding page) */
  .video-bg-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    transition: opacity 0.6s ease;
    pointer-events: none;
    overflow: hidden;
  }

  .video-bg-iframe {
    position: absolute;
    top: 50%;
    left: 50%;
    /* Scale to cover viewport while preserving 16:9 */
    width: 177.78vh;
    height: 100vh;
    min-width: 100%;
    min-height: 56.25vw;
    transform: translate(-50%, -50%);
    pointer-events: none;
    border: none;
  }

  .video-bg-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.52);
  }

  /* Part 5: Credit pill — bottom-left corner */
  .video-credit {
    position: fixed;
    bottom: 24px;
    left: 24px;
    z-index: 10;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 8px 16px;
    transition: opacity 0.6s ease;
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-width: 300px;
  }

  .video-credit-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--accent);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  .video-credit-name:hover {
    text-decoration: underline;
  }

  .video-credit-title {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  /* Community & Visibility opt-in toggle (ProfilePage) */
  .featured-opt-in-label {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    cursor: pointer;
    padding: 4px 0;
  }

  .featured-opt-in-checkbox {
    width: 16px;
    height: 16px;
    margin-top: 2px;
    flex-shrink: 0;
    accent-color: var(--accent);
    cursor: pointer;
  }

  .featured-opt-in-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .featured-opt-in-heading {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1.4;
  }

  .featured-opt-in-desc {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  /* Mobile banner — hidden on desktop, shown on mobile */
  .mobile-banner {
    display: none;
  }

  /* Mobile bottom navigation — hidden on desktop */
  .mobile-bottom-nav {
    display: none;
  }

  /* Utility: hide an element only on mobile */
  /* (applied with JS className, overridden in the media query below) */

  /* Mobile Responsive */
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    /* Hide upload-related elements on mobile */
    .hide-on-mobile {
      display: none !important;
    }

    /* Sidebar is off-screen; mobile nav replaces it */
    .sidebar {
      transform: translateX(-100%);
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .main-content {
      margin-left: 0;
      /* Extra bottom padding so content isn't hidden behind the bottom nav.
         Add safe-area-inset-bottom so the nav bar clears the iOS home indicator. */
      padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
    }

    .main-header {
      padding: 16px 20px;
    }

    .main-body {
      padding: 20px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .grid-2 {
      grid-template-columns: 1fr;
    }

    .quick-actions {
      grid-template-columns: 1fr;
    }

    /* Mobile informational banner */
    .mobile-banner {
      display: block;
      background: var(--surface-elevated);
      border-bottom: 1px solid var(--border-subtle);
      padding: 12px 20px;
      font-size: 13px;
      color: var(--text-secondary);
      text-align: center;
      line-height: 1.5;
      position: sticky;
      top: 0;
      z-index: 45;
    }

    /* Mobile bottom navigation bar */
    .mobile-bottom-nav {
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--surface);
      border-top: 1px solid var(--border-subtle);
      z-index: 50;
      padding: 6px 0;
      padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
    }

    .mobile-nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 8px 4px;
      cursor: pointer;
      color: var(--text-muted);
      transition: var(--transition);
    }

    .mobile-nav-item.active {
      color: var(--accent);
    }

    .mobile-nav-item:active {
      opacity: 0.7;
    }

    .mobile-nav-icon {
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mobile-nav-label {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    /* ── Mobile history card layout ────────────────────────────────────────────
       Switch from flex row to CSS grid so the title text gets the full second
       column width instead of competing with the status pill, delete btn, and
       chevron on a single line.  Layout:
         [thumb]  [title / meta / yt-link]  [delete]  [chevron]
         [thumb]  [status pill            ]
    ── */
    .upload-item {
      display: grid;
      grid-template-columns: 60px 1fr auto auto;
      grid-template-rows: auto auto;
      column-gap: 12px;
      row-gap: 0;
      padding: 16px;
      align-items: start;
    }

    .upload-thumbnail {
      grid-column: 1;
      grid-row: 1 / 3;
      width: 60px;
      height: 60px;
      align-self: start;
    }

    .upload-info {
      grid-column: 2;
      grid-row: 1;
      min-width: 0;
    }

    .upload-status {
      grid-column: 2;
      grid-row: 2;
      margin-top: 6px;
      align-self: center;
    }

    /* Delete button: always visible on touch (no hover state on mobile) */
    .upload-item--deletable .upload-delete-btn {
      grid-column: 3;
      grid-row: 1;
      opacity: 1;
      align-self: start;
    }

    .upload-expand-chevron {
      grid-column: 4;
      grid-row: 1;
      padding: 0 4px;
      align-self: start;
    }

    /* Allow meta chips to wrap onto multiple lines on narrow screens */
    .upload-meta {
      flex-wrap: wrap;
      gap: 4px 8px;
    }

    /* Give YouTube link a little more breathing room */
    .upload-yt-row {
      margin-top: 6px;
    }
  }

  /* ── Platform picker (ProfilePage + Onboarding) ──────────── */

  .platform-picker {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .platform-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 14px 18px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    min-width: 90px;
    transition: var(--transition);
  }

  .platform-card:hover {
    border-color: var(--text-muted);
    color: var(--text-primary);
  }

  .platform-card--selected {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-muted);
  }

  /* ── Squarespace Export Panel ─────────────────────────────── */

  .ss-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 200;
    animation: ss-fade-in 0.2s ease;
  }

  @keyframes ss-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes ss-slide-in {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }

  .ss-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 560px;
    background: var(--surface-elevated);
    border-left: 1px solid var(--border);
    z-index: 201;
    display: flex;
    flex-direction: column;
    animation: ss-slide-in 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .ss-panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 28px 28px 20px;
    border-bottom: 1px solid var(--border-subtle);
    flex-shrink: 0;
  }

  .ss-panel-title {
    font-size: 22px;
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
  }

  .ss-panel-subtitle {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .ss-close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: var(--transition);
  }

  .ss-close-btn:hover {
    color: var(--text-primary);
    background: var(--border);
  }

  .ss-steps {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }

  .ss-step {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px 28px;
    border-bottom: 1px solid var(--border-subtle);
    transition: opacity 0.25s ease;
  }

  .ss-step--checked {
    opacity: 0.45;
  }

  .ss-step--checked .ss-step-title {
    text-decoration: line-through;
    text-decoration-color: var(--text-muted);
  }

  .ss-checkbox {
    width: 22px;
    height: 22px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--border);
    background: var(--surface);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
    transition: var(--transition);
    color: var(--background);
  }

  .ss-checkbox--checked {
    background: var(--success);
    border-color: var(--success);
  }

  .ss-checkbox:hover:not(.ss-checkbox--checked) {
    border-color: var(--text-secondary);
  }

  .ss-step-body {
    flex: 1;
    min-width: 0;
  }

  .ss-step-label {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 10px;
  }

  .ss-step-num {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
  }

  .ss-step-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .ss-step-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ss-instruction {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .ss-tip {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
    padding: 8px 12px;
    background: var(--surface);
    border-radius: var(--radius-sm);
    border-left: 2px solid var(--accent);
    margin-top: 4px;
  }

  .ss-copy-row {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .ss-text-box {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    color: var(--text-primary);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 8px 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  .ss-text-box--mono {
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    color: var(--accent);
  }

  .ss-copy-btn {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    font-size: 13px;
  }

  .ss-copy-btn--done {
    color: var(--success) !important;
    border-color: var(--success) !important;
  }

  .ss-image-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .ss-thumbnail {
    width: 80px;
    height: 56px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    flex-shrink: 0;
  }

  .ss-panel-footer {
    padding: 20px 28px 28px;
    border-top: 1px solid var(--border-subtle);
    flex-shrink: 0;
    background: var(--surface-elevated);
  }

  /* ── Other Platform HTML Export ─────────────────────────────────────────────── */

  .other-export-panel {
    max-width: 720px;
  }

  .other-export-body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    flex: 1;
  }

  .other-export-hint {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;
  }

  .other-export-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .other-export-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .other-export-section-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
  }

  .other-export-code {
    background: #1a1a2e;
    color: #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    font-size: 12px;
    font-family: monospace;
    overflow-y: auto;
    max-height: 400px;
    white-space: pre-wrap;
    word-break: break-all;
    margin: 0;
  }

  .other-export-meta-text {
    font-size: 13px;
    color: var(--text);
    background: var(--surface-alt, var(--surface));
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 12px;
    margin: 0;
  }

  .other-export-slug {
    font-size: 13px;
    font-family: monospace;
    background: var(--surface-alt, var(--surface));
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    display: block;
  }

  .other-export-seo-tip {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0;
  }

  .other-export-published-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--success, #10b981);
    font-weight: 500;
  }

  /* ── Venue Library ─────────────────────────────────────────────────────────── */

  .venue-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .venue-card {
    background: var(--surface-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    flex-direction: column;
  }

  .venue-card:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    transform: translateY(-1px);
  }

  .venue-card-body {
    padding: 20px 20px 12px;
    flex: 1;
  }

  .venue-card-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .venue-card-location {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 10px;
  }

  .venue-card-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .venue-badge {
    font-size: 11px;
    font-weight: 500;
    color: var(--accent);
    background: rgba(99, 102, 241, 0.1);
    border-radius: 20px;
    padding: 2px 10px;
    text-transform: capitalize;
  }

  .venue-card-footer {
    padding: 10px 20px 14px;
    border-top: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .venue-card-posts {
    font-size: 12px;
    color: var(--text-muted);
  }

  .venue-card-actions {
    display: flex;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .venue-card:hover .venue-card-actions {
    opacity: 1;
  }

  .venue-card-action-btn {
    font-size: 12px;
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--surface-elevated);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
  }

  .venue-card-action-btn:hover {
    background: var(--surface-card);
    color: var(--text-primary);
    border-color: var(--accent);
  }

  .venue-card-action-delete:hover {
    background: rgba(239,68,68,0.08);
    color: #ef4444;
    border-color: #ef4444;
  }

  /* Venue form panel */
  .venue-form-body {
    padding: 24px 28px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .venue-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .label-required {
    color: var(--error, #ef4444);
    margin-left: 2px;
  }

  .venue-toggle {
    display: flex;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    width: fit-content;
  }

  .venue-toggle-btn {
    padding: 7px 18px;
    border: none;
    background: var(--surface-elevated);
    color: var(--text-muted);
    font-size: 13px;
    cursor: pointer;
    transition: var(--transition);
    border-right: 1px solid var(--border);
  }

  .venue-toggle-btn:last-child {
    border-right: none;
  }

  .venue-toggle-btn.active {
    background: var(--accent);
    color: #fff;
  }

  /* Venue detail panel */
  .venue-detail-body {
    padding: 24px 28px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .venue-detail-facts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--surface-elevated);
    border-radius: var(--radius-sm);
    padding: 16px;
  }

  .venue-detail-fact {
    display: flex;
    gap: 12px;
    font-size: 13px;
    align-items: baseline;
  }

  .venue-detail-fact-label {
    font-weight: 600;
    color: var(--text-muted);
    min-width: 80px;
    flex-shrink: 0;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .venue-detail-fact-value {
    color: var(--text-primary);
  }

  .venue-detail-link {
    color: var(--accent);
    text-decoration: none;
    font-size: 13px;
    word-break: break-all;
  }

  .venue-detail-link:hover {
    text-decoration: underline;
  }

  .venue-detail-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .venue-detail-section-title {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .venue-detail-text {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  .venue-linked-posts {
    display: flex;
    flex-direction: column;
    gap: 1px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .venue-linked-post {
    padding: 12px 14px;
    background: var(--surface-elevated);
    cursor: pointer;
    transition: var(--transition);
  }

  .venue-linked-post:hover {
    background: var(--surface-card);
  }

  .venue-linked-post-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .venue-linked-post-meta {
    font-size: 11px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .venue-linked-post-status {
    padding: 1px 8px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    background: var(--surface-card);
    color: var(--text-muted);
  }

  .venue-linked-post-status.published {
    background: rgba(34, 197, 94, 0.1);
    color: var(--success);
  }

  /* Venue autocomplete */
  .venue-autocomplete {
    position: relative;
  }

  .venue-suggestions {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: var(--surface-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    z-index: 100;
    overflow: hidden;
    max-height: 220px;
    overflow-y: auto;
  }

  .venue-suggestion-item {
    padding: 10px 14px;
    cursor: pointer;
    transition: var(--transition);
    border-bottom: 1px solid var(--border-subtle);
  }

  .venue-suggestion-item:last-child {
    border-bottom: none;
  }

  .venue-suggestion-item:hover {
    background: var(--surface-elevated);
  }

  .venue-suggestion-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .venue-suggestion-location {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .venue-selected-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--accent);
    margin-top: 6px;
  }

  .venue-selected-tag svg {
    flex-shrink: 0;
  }

  /* Save-to-library banner */
  .venue-save-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: rgba(99, 102, 241, 0.07);
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-radius: var(--radius);
    padding: 14px 20px;
    margin-bottom: 16px;
  }

  .venue-save-banner-text {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .venue-save-banner-text svg {
    color: var(--accent);
    flex-shrink: 0;
  }

  /* ── Blog Template picker ──────────────────────────────────────────────────── */

  .template-picker {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .template-card {
    border: 2px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    background: var(--surface-card);
    user-select: none;
  }

  .template-card:hover {
    border-color: var(--accent);
  }

  .template-card--selected {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }

  .template-card-preview {
    background: #f0f0f2;
    padding: 14px 12px;
    flex: 1;
    min-height: 155px;
    display: flex;
    flex-direction: column;
  }

  .template-card-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    background: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    z-index: 1;
  }

  .template-card-badge svg {
    width: 11px;
    height: 11px;
  }

  .template-card-info {
    padding: 12px 16px 14px;
    border-top: 1px solid var(--border-subtle);
  }

  .template-card-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 5px;
  }

  .template-card-desc {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
    margin: 0;
  }

  /* Wireframe elements */
  .template-wireframe {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
  }

  .wf-h1 {
    height: 8px;
    width: 62%;
    background: #333;
    border-radius: 2px;
  }

  .wf-h2 {
    height: 6px;
    width: 50%;
    background: #444;
    border-radius: 2px;
  }

  .wf-text {
    height: 4px;
    background: #c8c8c8;
    border-radius: 2px;
  }

  .wf-gap {
    height: 8px;
    flex-shrink: 0;
  }

  .wf-gap-sm {
    height: 4px;
    flex-shrink: 0;
  }

  .wf-video {
    width: 100%;
    height: 36px;
    background: #b8b8b8;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .wf-credits-box {
    background: #e4e4e4;
    border-radius: 3px;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .wf-credit-row {
    height: 4px;
    background: #c0c0c0;
    border-radius: 2px;
    width: 85%;
  }

  /* Supplier credits collapsible section */
  .supplier-section {
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .supplier-section-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 16px;
    background: var(--surface-elevated);
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 500;
    text-align: left;
    transition: var(--transition);
  }

  .supplier-section-toggle:hover {
    background: var(--surface-card);
  }

  .supplier-section-body {
    padding: 20px 16px 16px;
    border-top: 1px solid var(--border-subtle);
    background: var(--surface);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .supplier-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 16px;
    margin-top: 4px;
  }

  /* Roundup post selector grid */
  .roundup-post-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  .roundup-post-card {
    border: 2px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    position: relative;
    background: var(--surface);
    user-select: none;
  }

  .roundup-post-card:hover {
    border-color: var(--accent);
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  .roundup-post-card--selected {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, var(--surface));
  }

  .roundup-post-card--disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .roundup-post-card-check {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 22px;
    height: 22px;
    background: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    z-index: 1;
  }

  .roundup-post-card-check svg {
    width: 11px;
    height: 11px;
  }

  .roundup-post-card-thumb {
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--border);
  }

  .roundup-post-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .roundup-post-card-no-thumb {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }

  .roundup-post-card-info {
    padding: 10px;
  }

  .roundup-post-card-venue {
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.3;
  }

  .roundup-post-card-date {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 3px;
  }

  .roundup-post-card-no-yt {
    font-size: 11px;
    color: var(--text-secondary);
    margin-top: 3px;
    font-style: italic;
  }

  /* External YouTube video input section */
  .external-video-section {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }

  .external-video-heading {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    margin: 0 0 4px;
  }

  .external-video-hint {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0 0 12px;
  }

  .external-video-input-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .external-video-input-row .input {
    flex: 1;
  }

  .external-video-error {
    font-size: 12px;
    color: var(--error);
    margin: 6px 0 0;
  }

  /* Combined reorderable selection list */
  .selection-list {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .selection-list-heading {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .selection-list-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
  }

  .selection-list-reorder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }

  .selection-list-reorder-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    padding: 2px 4px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s, background 0.15s;
  }

  .selection-list-reorder-btn:hover:not(:disabled) {
    color: var(--text);
    background: var(--border);
  }

  .selection-list-reorder-btn:disabled {
    opacity: 0.25;
    cursor: default;
  }

  .selection-list-index {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    min-width: 16px;
    text-align: center;
  }

  .selection-list-thumb {
    width: 80px;
    flex-shrink: 0;
    aspect-ratio: 16 / 9;
    border-radius: 4px;
    overflow: hidden;
    background: var(--border);
  }

  .selection-list-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .selection-list-no-thumb {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }

  .selection-list-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .selection-list-venue {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .selection-list-meta {
    font-size: 11px;
    color: var(--text-muted);
  }

  .selection-list-no-yt {
    color: var(--text-secondary);
    font-style: italic;
  }

  .selection-list-venue-input {
    font-size: 13px;
  }

  .selection-list-notes-input {
    font-size: 12px;
    min-height: 52px;
    resize: vertical;
  }

  .selection-list-remove {
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    padding: 4px 6px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s, background 0.15s;
    align-self: flex-start;
  }

  .selection-list-remove:hover {
    color: var(--error);
    background: color-mix(in srgb, var(--error) 10%, transparent);
  }

  /* YouTube link and keyword in history row */
  .upload-yt-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
    min-height: 18px;
  }

  .upload-yt-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.15s;
  }

  .upload-yt-link:hover { opacity: 0.75; }

  .upload-yt-link svg { width: 13px; height: 13px; }

  .upload-yt-pending {
    font-size: 12px;
    color: var(--text-muted);
    font-style: italic;
  }

  .upload-meta-keyword {
    color: var(--text-secondary);
    font-style: italic;
    font-size: 11px;
  }

  /* PostInfo section (YouTube full link, SEO data, featured films) */
  .post-info-section {
    padding: 16px 24px 0;
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: 4px;
  }

  .post-info-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding-bottom: 14px;
  }

  .post-info-yt-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--accent);
    text-decoration: none;
    transition: opacity 0.15s;
  }

  .post-info-yt-link:hover { opacity: 0.75; }

  .post-info-yt-link svg { width: 15px; height: 15px; }

  .post-info-yt-pending {
    font-size: 13px;
    color: var(--text-muted);
    font-style: italic;
  }

  .post-info-toggle {
    background: none;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-secondary);
    font-size: 12px;
    padding: 3px 10px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }

  .post-info-toggle:hover {
    border-color: var(--accent);
    color: var(--text);
  }

  /* SEO data panel */
  .post-seo-data {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 0 14px;
    border-top: 1px solid var(--border-subtle);
  }

  .post-seo-field {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 8px;
    font-size: 12px;
    line-height: 1.4;
  }

  .post-seo-label {
    color: var(--text-muted);
    font-weight: 500;
    flex-shrink: 0;
  }

  .post-seo-value {
    color: var(--text);
    word-break: break-word;
  }

  /* Featured films panel (roundup posts) */
  .post-featured-films {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 0 14px;
    border-top: 1px solid var(--border-subtle);
  }

  .post-featured-film {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 10px;
    background: var(--surface-elevated);
    border-radius: 6px;
    font-size: 13px;
  }

  .post-featured-film-venue {
    color: var(--text);
    font-weight: 500;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .post-featured-film-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--accent);
    text-decoration: none;
    flex-shrink: 0;
    font-weight: 500;
    transition: opacity 0.15s;
  }

  .post-featured-film-link:hover { opacity: 0.75; }

  .post-featured-film-link svg { width: 12px; height: 12px; }

  .post-featured-film-no-yt {
    font-size: 12px;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  /* Area Roundup badge in History */
  .roundup-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    color: var(--accent);
    border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
    border-radius: 4px;
    padding: 1px 6px;
    line-height: 1.6;
    flex-shrink: 0;
  }

  /* "Already on YouTube" mode toggle on Step 1 */
  .yt-mode-toggle {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .yt-mode-toggle:hover { border-color: var(--accent); }

  .yt-mode-toggle input[type="checkbox"] {
    margin-top: 2px;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    accent-color: var(--accent);
    cursor: pointer;
  }

  .yt-mode-toggle-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .yt-mode-toggle-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  .yt-mode-toggle-desc {
    font-size: 12px;
    color: var(--text-muted);
  }

  /* Regenerate YouTube metadata section on Step 2 */
  .regen-yt-section {
    margin-top: 24px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .regen-yt-label {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
  }

  .regen-yt-label input[type="checkbox"] {
    margin-top: 2px;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    accent-color: var(--accent);
    cursor: pointer;
  }

  .regen-yt-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .regen-yt-heading {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  .regen-yt-desc {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  /* YouTube metadata panel on Step 3 (existing video mode) */
  .yt-meta-panel {
    margin-top: 24px;
    border: 1px solid var(--accent);
    border-radius: 8px;
    overflow: hidden;
  }

  .yt-meta-panel-header {
    padding: 14px 16px 12px;
    background: color-mix(in srgb, var(--accent) 8%, var(--surface));
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
  }

  .yt-meta-panel-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    margin: 0 0 4px;
  }

  .yt-meta-panel-desc {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0;
    line-height: 1.5;
  }

  .yt-meta-field {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-subtle);
  }

  .yt-meta-field:last-child { border-bottom: none; }

  .yt-meta-field-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .yt-meta-copy-row {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }

  .yt-meta-copy-row .ss-text-box {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
    overflow: auto;
    text-overflow: unset;
    max-height: 160px;
  }

  .yt-meta-copy-row .ss-copy-btn {
    flex-shrink: 0;
  }

  /* ============================================================
     Optimise Existing Videos
  ============================================================ */

  .optimise-video-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (max-width: 900px) {
    .optimise-video-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .optimise-video-grid {
      grid-template-columns: 1fr;
    }
  }

  .optimise-video-card {
    position: relative;
    border: 2px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    overflow: hidden;
    cursor: pointer;
    background: var(--surface);
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .optimise-video-card:hover {
    border-color: var(--border);
    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  }

  .optimise-video-card.selected {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }

  .optimise-card-thumb-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: var(--bg);
    overflow: hidden;
  }

  .optimise-card-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .optimise-card-thumb-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    background: var(--bg);
  }

  .optimise-card-checkbox {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    border: 2px solid rgba(255,255,255,0.85);
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: background 0.15s, border-color 0.15s;
  }

  .optimise-video-card.selected .optimise-card-checkbox {
    background: var(--accent);
    border-color: var(--accent);
  }

  .optimise-card-body {
    padding: 12px;
  }

  .optimise-card-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    margin: 0 0 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .optimise-card-desc {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0 0 8px;
  }

  .optimise-card-meta {
    display: flex;
    gap: 10px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .optimise-browse-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--border-subtle);
    gap: 12px;
    flex-wrap: wrap;
  }

  .optimise-selection-cap-notice {
    font-size: 13px;
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, var(--surface));
    border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
    border-radius: var(--radius);
    padding: 8px 12px;
    margin-bottom: 12px;
  }

  .optimise-enrich-panel {
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: 20px;
    background: var(--surface);
  }

  .optimise-selection-summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-subtle);
    max-height: 200px;
    overflow-y: auto;
  }

  .optimise-summary-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .optimise-summary-thumb {
    width: 48px;
    height: 27px;
    object-fit: cover;
    border-radius: 3px;
    flex-shrink: 0;
    background: var(--bg);
  }

  .optimise-summary-title {
    font-size: 13px;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .optimise-generating {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 40px 20px;
    text-align: center;
  }

  .optimise-generating-status {
    font-size: 14px;
    color: var(--text-muted);
  }

  .optimise-review-card {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 20px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: 20px;
    background: var(--surface);
    margin-bottom: 16px;
  }

  @media (max-width: 700px) {
    .optimise-review-card {
      grid-template-columns: 1fr;
    }
  }

  .optimise-review-thumb-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .optimise-review-thumb {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: var(--radius);
    background: var(--bg);
    display: block;
  }

  .optimise-review-video-title {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.4;
  }

  .optimise-before-after {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .optimise-field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .optimise-field-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .optimise-field-before {
    font-size: 13px;
    color: var(--text-muted);
    background: var(--bg);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius);
    padding: 8px 10px;
    line-height: 1.5;
    max-height: 80px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .optimise-field-after-row {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .optimise-copy-btn {
    flex-shrink: 0;
    background: var(--surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius);
    padding: 6px 8px;
    cursor: pointer;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s, border-color 0.15s;
  }

  .optimise-copy-btn:hover {
    color: var(--accent);
    border-color: var(--accent);
  }

  .optimise-tag-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .optimise-tag-chip {
    font-size: 11px;
    background: color-mix(in srgb, var(--accent) 12%, var(--surface));
    color: var(--accent);
    border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
    border-radius: 100px;
    padding: 2px 8px;
  }

  .optimise-approve-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }

  .optimise-approve-label {
    font-size: 13px;
    color: var(--text-muted);
    cursor: pointer;
    user-select: none;
  }

  .optimise-progress-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border-subtle);
    font-size: 13px;
    color: var(--text);
  }

  .optimise-progress-row:last-child {
    border-bottom: none;
  }

  .optimise-progress-status {
    margin-left: auto;
    flex-shrink: 0;
  }

  .optimise-progress-thumb {
    width: 56px;
    height: 32px;
    object-fit: cover;
    border-radius: 3px;
    flex-shrink: 0;
    background: var(--bg);
  }

  .optimise-done {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px 20px;
    text-align: center;
  }

  .optimise-done-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--accent) 15%, var(--surface));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    font-size: 22px;
  }

  .optimise-steps {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .optimise-step {
    color: var(--text-muted);
  }

  .optimise-step.active {
    color: var(--text);
    font-weight: 600;
  }

  .optimise-step.done {
    color: var(--accent);
  }

  .optimise-step-sep {
    color: var(--border);
  }
`;
