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

  .app-layout { display: flex; min-height: 100vh; }
  
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
  
  .sidebar-header { padding: 24px; border-bottom: 1px solid var(--border-subtle); }
  .logo { display: flex; align-items: center; gap: 12px; }
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
  .logo-text { display: flex; flex-direction: column; gap: 2px; }
  .logo-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: var(--text-primary); letter-spacing: -0.01em; }
  .logo-subtitle { font-size: 11px; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase; }
  
  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
  .nav-section-title { font-size: 11px; font-weight: 500; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase; padding: 16px 12px 8px; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: var(--radius); color: var(--text-secondary); cursor: pointer; transition: var(--transition); font-size: 14px; font-weight: 400; }
  .nav-item:hover { background: var(--surface-elevated); color: var(--text-primary); }
  .nav-item.active { background: var(--accent-muted); color: var(--accent); }
  .nav-item.active .nav-icon { color: var(--accent); }
  .nav-icon { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: var(--transition); }
  .nav-item:hover .nav-icon { color: var(--text-secondary); }
  
  .sidebar-footer { padding: 16px; border-top: 1px solid var(--border-subtle); }
  .user-card { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--surface-elevated); border-radius: var(--radius); cursor: pointer; transition: var(--transition); }
  .user-card:hover { background: var(--border); }
  .user-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #8a6f42); display: flex; align-items: center; justify-content: center; color: var(--background); font-weight: 600; font-size: 14px; }
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 13px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-business { font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  
  .main-content { flex: 1; margin-left: 260px; min-height: 100vh; display: flex; flex-direction: column; }
  .main-header { padding: 24px 32px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; background: var(--surface); position: sticky; top: 0; z-index: 40; }
  .page-title { font-size: 28px; color: var(--text-primary); }
  .page-description { font-size: 14px; color: var(--text-secondary); margin-top: 4px; font-family: 'Inter', sans-serif; }
  .header-actions { display: flex; gap: 12px; }
  .main-body { flex: 1; padding: 32px; }
  
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; border-radius: var(--radius); cursor: pointer; transition: var(--transition); border: none; white-space: nowrap; }
  .btn-primary { background: var(--accent); color: var(--background); }
  .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(201, 169, 110, 0.25); }
  .btn-secondary { background: var(--surface-elevated); color: var(--text-primary); border: 1px solid var(--border); }
  .btn-secondary:hover { background: var(--border); border-color: var(--text-muted); }
  .btn-ghost { background: transparent; color: var(--text-secondary); padding: 10px 16px; }
  .btn-ghost:hover { background: var(--surface-elevated); color: var(--text-primary); }
  .btn-sm { padding: 8px 16px; font-size: 13px; }
  .btn-lg { padding: 16px 32px; font-size: 16px; border-radius: var(--radius-lg); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px; transition: var(--transition); }
  .stat-card:hover { border-color: var(--border); box-shadow: var(--shadow-glow); }
  .stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .stat-icon { width: 40px; height: 40px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; background: var(--accent-muted); color: var(--accent); }
  .stat-trend { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 500; }
  .stat-trend.up { color: var(--success); }
  .stat-trend.down { color: var(--error); }
  .stat-value { font-size: 36px; font-weight: 600; color: var(--text-primary); font-family: 'Playfair Display', serif; line-height: 1; margin-bottom: 4px; }
  .stat-label { font-size: 13px; color: var(--text-secondary); }
  
  .card { background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; }
  .card-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border-subtle); }
  .card-title { font-size: 18px; color: var(--text-primary); }
  .card-body { padding: 24px; }
  .card-body.no-padding { padding: 0; }
  
  .uploads-list { display: flex; flex-direction: column; }
  .upload-item { display: flex; align-items: center; gap: 16px; padding: 16px 24px; border-bottom: 1px solid var(--border-subtle); transition: var(--transition); cursor: pointer; }
  .upload-item:last-child { border-bottom: none; }
  .upload-item:hover { background: var(--surface-elevated); }
  .upload-thumbnail { width: 80px; height: 48px; background: var(--surface-elevated); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0; overflow: hidden; }
  .upload-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
  .upload-info { flex: 1; min-width: 0; }
  .upload-title { font-size: 14px; font-weight: 500; color: var(--text-primary); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .upload-meta { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 12px; }
  .upload-status { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  .upload-status.published { background: rgba(34, 197, 94, 0.1); color: var(--success); }
  .upload-status.processing { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
  .upload-status.draft { background: var(--surface-elevated); color: var(--text-muted); }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  
  .quick-actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .quick-action-card { background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px; cursor: pointer; transition: var(--transition); display: flex; flex-direction: column; gap: 16px; }
  .quick-action-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow-glow); }
  .quick-action-card.primary { background: linear-gradient(135deg, var(--accent), #8a6f42); border-color: transparent; }
  .quick-action-card.primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201, 169, 110, 0.3); }
  .quick-action-icon { width: 48px; height: 48px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; background: var(--accent-muted); color: var(--accent); }
  .quick-action-card.primary .quick-action-icon { background: rgba(9, 9, 11, 0.2); color: var(--background); }
  .quick-action-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--text-primary); }
  .quick-action-card.primary .quick-action-title { color: var(--background); }
  .quick-action-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
  .quick-action-card.primary .quick-action-desc { color: rgba(9, 9, 11, 0.7); }
  
  .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
  .dashboard-main { display: flex; flex-direction: column; gap: 24px; }
  .dashboard-aside { display: flex; flex-direction: column; gap: 24px; }
  
  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 40px; text-align: center; }
  .empty-icon { width: 64px; height: 64px; border-radius: var(--radius-lg); background: var(--surface-elevated); display: flex; align-items: center; justify-content: center; color: var(--text-muted); margin-bottom: 20px; }
  .empty-title { font-size: 18px; color: var(--text-primary); margin-bottom: 8px; }
  .empty-desc { font-size: 14px; color: var(--text-secondary); max-width: 320px; margin-bottom: 24px; }
  
  .activity-item { display: flex; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--border-subtle); }
  .activity-item:last-child { border-bottom: none; }
  .activity-icon { width: 32px; height: 32px; border-radius: 50%; background: var(--surface-elevated); display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0; }
  .activity-icon.success { background: rgba(34, 197, 94, 0.1); color: var(--success); }
  .activity-content { flex: 1; }
  .activity-text { font-size: 13px; color: var(--text-primary); margin-bottom: 2px; }
  .activity-time { font-size: 12px; color: var(--text-muted); }
  
  .field { margin-bottom: 24px; }
  .label { display: block; font-size: 13px; font-weight: 500; color: var(--text-primary); margin-bottom: 8px; }
  .label-hint { font-weight: 400; color: var(--text-muted); margin-left: 4px; }
  .input, .textarea, .select { width: 100%; background: var(--surface-elevated); border: 1px solid var(--border); color: var(--text-primary); padding: 12px 16px; font-family: 'Inter', sans-serif; font-size: 14px; border-radius: var(--radius); transition: var(--transition); outline: none; }
  .input:focus, .textarea:focus, .select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-muted); }
  .input::placeholder, .textarea::placeholder { color: var(--text-muted); }
  .textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
  .input-group { display: flex; gap: 12px; }
  .input-prefix-group { display: flex; align-items: stretch; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: var(--surface-elevated); transition: var(--transition); }
  .input-prefix-group:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-muted); }
  .input-prefix-group .prefix { padding: 12px 14px; background: var(--surface); border-right: 1px solid var(--border); color: var(--text-muted); font-size: 14px; display: flex; align-items: center; }
  .input-prefix-group .input { border: none; border-radius: 0; background: transparent; }
  .input-prefix-group .input:focus { box-shadow: none; }
  
  .upload-zone { border: 2px dashed var(--border); border-radius: var(--radius-lg); padding: 60px 40px; text-align: center; cursor: pointer; transition: var(--transition); background: var(--surface); }
  .upload-zone:hover, .upload-zone.drag-over { border-color: var(--accent); background: var(--accent-muted); }
  .upload-zone.has-file { border-color: var(--accent); border-style: solid; background: var(--accent-muted); }
  .upload-zone-icon { width: 64px; height: 64px; margin: 0 auto 20px; border-radius: var(--radius-lg); background: var(--surface-elevated); display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
  .upload-zone:hover .upload-zone-icon { background: var(--accent-muted); color: var(--accent); }
  .upload-zone-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text-primary); margin-bottom: 8px; }
  .upload-zone-desc { font-size: 14px; color: var(--text-secondary); }
  
  .progress-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-hover)); border-radius: 3px; transition: width 0.3s ease; }
  
  .stepper { display: flex; align-items: center; margin-bottom: 40px; }
  .step { display: flex; align-items: center; gap: 12px; }
  .step-number { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: var(--text-muted); transition: var(--transition); }
  .step.active .step-number { border-color: var(--accent); color: var(--accent); background: var(--accent-muted); }
  .step.completed .step-number { border-color: var(--accent); background: var(--accent); color: var(--background); }
  .step-label { font-size: 14px; color: var(--text-muted); font-weight: 500; }
  .step.active .step-label { color: var(--text-primary); }
  .step-line { flex: 1; height: 2px; background: var(--border); margin: 0 16px; }
  .step-line.completed { background: var(--accent); }
  
  .alert { padding: 16px 20px; border-radius: var(--radius); display: flex; align-items: flex-start; gap: 12px; font-size: 14px; margin-bottom: 20px; }
  .alert-info { background: var(--accent-muted); border: 1px solid var(--accent); color: var(--text-primary); }
  .alert-error { background: rgba(239, 68, 68, 0.1); border: 1px solid var(--error); color: var(--text-primary); }
  .alert-success { background: rgba(34, 197, 94, 0.1); border: 1px solid var(--success); color: var(--text-primary); }
  .alert-icon { flex-shrink: 0; margin-top: 2px; }
  
  .tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; background: var(--surface-elevated); color: var(--text-secondary); }
  .tag.gold { background: var(--accent-muted); color: var(--accent); }
  
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
  .spinner-lg { width: 40px; height: 40px; border-width: 3px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  
  .loading-overlay { position: fixed; inset: 0; background: rgba(9, 9, 11, 0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1000; gap: 24px; }
  .loading-title { font-family: 'Playfair Display', serif; font-size: 24px; color: var(--text-primary); }
  .loading-subtitle { font-size: 14px; color: var(--text-secondary); }
  
  .settings-section { margin-bottom: 32px; }
  .settings-section-title { font-size: 16px; font-weight: 500; color: var(--text-primary); margin-bottom: 16px; font-family: 'Playfair Display', serif; }
  .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border-subtle); }
  .settings-row:last-child { border-bottom: none; }
  .settings-key { font-size: 14px; color: var(--text-primary); }
  .settings-value { font-size: 13px; color: var(--text-muted); font-family: monospace; }
  .connected-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--success); }
  .disconnected-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--error); }
  
  .tabs { display: flex; border-bottom: 1px solid var(--border-subtle); margin-bottom: 24px; gap: 4px; }
  .tab { padding: 12px 20px; font-size: 14px; font-weight: 500; color: var(--text-muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: var(--transition); }
  .tab:hover { color: var(--text-secondary); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
  
  .onboarding-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; background: var(--background); }
  .onboarding-card { width: 100%; max-width: 480px; }
  .onboarding-logo { text-align: center; margin-bottom: 48px; }
  .onboarding-logo h1 { font-size: 42px; color: var(--text-primary); margin-bottom: 8px; }
  .onboarding-logo p { font-size: 15px; color: var(--text-secondary); }
  .onboarding-step { font-size: 12px; color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; }
  
  .divider { height: 1px; background: var(--border-subtle); margin: 24px 0; }
  .divider-text { display: flex; align-items: center; gap: 16px; margin: 24px 0; }
  .divider-text::before, .divider-text::after { content: ''; flex: 1; height: 1px; background: var(--border-subtle); }
  .divider-text span { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
  
  .success-screen { text-align: center; padding: 40px; }
  .success-icon-large { width: 80px; height: 80px; margin: 0 auto 24px; border-radius: 50%; background: rgba(34, 197, 94, 0.1); display: flex; align-items: center; justify-content: center; color: var(--success); }
  .success-title { font-size: 28px; color: var(--text-primary); margin-bottom: 8px; }
  .success-desc { font-size: 15px; color: var(--text-secondary); margin-bottom: 32px; }
  .success-links { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
  .success-link { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: var(--surface-elevated); border: 1px solid var(--border); border-radius: var(--radius); text-decoration: none; transition: var(--transition); }
  .success-link:hover { border-color: var(--accent); background: var(--surface); }
  .success-link-info { text-align: left; }
  .success-link-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
  .success-link-url { font-size: 14px; color: var(--accent); }
  
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  
  .profile-preview { background: var(--surface-elevated); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin-top: 20px; }
  .profile-preview-label { font-size: 11px; color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 12px; }
  .profile-preview pre { font-family: 'Inter', sans-serif; font-size: 13px; white-space: pre-wrap; color: var(--text-secondary); line-height: 1.6; }
  
  .post-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border-subtle); }
  .post-row:last-child { border-bottom: none; }
  .post-title-text { font-size: 14px; color: var(--text-primary); margin-bottom: 4px; font-weight: 500; }
  .post-meta { font-size: 12px; color: var(--text-muted); }
  .char-count { font-size: 12px; color: var(--text-muted); text-align: right; margin-top: 6px; }
  
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
  
  @media (max-width: 1024px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .dashboard-grid { grid-template-columns: 1fr; }
  }
  
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .main-content { margin-left: 0; }
    .main-header { padding: 16px 20px; }
    .main-body { padding: 20px; }
    .stats-grid { grid-template-columns: 1fr; }
    .grid-2 { grid-template-columns: 1fr; }
    .quick-actions { grid-template-columns: 1fr; }
  }
`;
