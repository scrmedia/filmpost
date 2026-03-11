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
      /* Extra bottom padding so content isn't hidden behind the bottom nav */
      padding-bottom: 72px;
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
      padding: 10px 20px;
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
`;
