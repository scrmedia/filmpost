import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// ── Supabase client ───────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = `
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
    grid-template-columns: repeat(2, 1fr);
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
    .sidebar {
      transform: translateX(-100%);
    }
    
    .sidebar.open {
      transform: translateX(0);
    }
    
    .main-content {
      margin-left: 0;
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
  }
`;

const VENUE_QUESTIONS = [
  { id: "venueStyle", label: "Venue Style / Character", placeholder: "e.g. Rustic barn, grand manor, modern minimalist...", type: "text" },
  { id: "venueSetting", label: "Surrounding Setting & Scenery", placeholder: "e.g. Rolling Cotswold hills, woodland, lakeside...", type: "text" },
  { id: "filmingHighlights", label: "Best Spots for Filming", placeholder: "e.g. Oak-lined driveway, walled garden, dramatic staircase...", type: "textarea" },
  { id: "lightingNotes", label: "Lighting Character", placeholder: "e.g. Flood of natural light, moody candlelit reception...", type: "text" },
  { id: "droneAccess", label: "Drone / Aerial Access", placeholder: "e.g. Full drone access, stunning aerial approach...", type: "text" },
  { id: "coupleType", label: "Typical Couple Vibe", placeholder: "e.g. Laid-back, romantic, fun & alternative...", type: "text" },
  { id: "standoutMemory", label: "A Standout or Memorable Moment", placeholder: "Share a specific story — a moment that made a wedding here unforgettable...", type: "textarea" },
  { id: "proTip", label: "Your Pro Videographer Tip", placeholder: "What advice would you give couples to get the most from filming here?", type: "textarea" },
  { id: "coupleNames", label: "Featured Couple's Names", placeholder: "e.g. Emily & James — leave blank to omit", type: "text" },
];

function buildBusinessFooter(user) {
  const lines = [];
  lines.push(`${user.business_name}`);
  if (user.tagline) lines.push(user.tagline);
  lines.push("");
  if (user.enquiry_email) lines.push(`Enquiries: ${user.enquiry_email}`);
  if (user.website) lines.push(`${user.website}`);
  if (user.instagram) lines.push(`Instagram: instagram.com/${user.instagram.replace(/^@/, "")}`);
  if (user.tiktok) lines.push(`TikTok: @${user.tiktok.replace(/^@/, "")}`);
  if (user.facebook) lines.push(`Facebook: ${user.facebook}`);
  lines.push("");
  lines.push("—");
  lines.push(`To enquire about having ${user.business_name} film your wedding, visit our website or drop us an email.`);
  return lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");
}

async function callClaude(systemPrompt, userPrompt) {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }
  const data = await response.json();
  return data.content?.[0]?.text || "";
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  Upload: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  History: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Arrow: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  External: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Copy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  YouTube: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>,
  Blog: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/></svg>,
  Video: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M10 12l4-2.5v5L10 12z" fill="currentColor" stroke="none"/></svg>,
  TrendUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Film: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
  Play: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
};

// ── Business Profile Fields ───────────────────────────────────────────────────
function BusinessProfileFields({ form, update }) {
  const previewFooter = buildBusinessFooter(form);
  return (
    <>
      <div className="field">
        <label className="label">Business Tagline <span className="label-hint">(optional)</span></label>
        <input className="input" value={form.tagline || ""} onChange={e => update("tagline", e.target.value)} placeholder="e.g. Cinematic wedding films across the UK & Europe" />
      </div>
      <div className="grid-2">
        <div className="field">
          <label className="label">Enquiry Email</label>
          <input className="input" type="email" value={form.enquiry_email || ""} onChange={e => update("enquiry_email", e.target.value)} placeholder="info@yourdomain.com" />
        </div>
        <div className="field">
          <label className="label">Website <span className="label-hint">(optional)</span></label>
          <input className="input" value={form.website || ""} onChange={e => update("website", e.target.value)} placeholder="https://www.yourdomain.com" />
        </div>
      </div>
      <div className="grid-2">
        <div className="field">
          <label className="label">Instagram <span className="label-hint">(optional)</span></label>
          <div className="input-prefix-group">
            <span className="prefix">@</span>
            <input className="input" value={form.instagram || ""} onChange={e => update("instagram", e.target.value)} placeholder="yourhandle" />
          </div>
        </div>
        <div className="field">
          <label className="label">TikTok <span className="label-hint">(optional)</span></label>
          <div className="input-prefix-group">
            <span className="prefix">@</span>
            <input className="input" value={form.tiktok || ""} onChange={e => update("tiktok", e.target.value)} placeholder="yourhandle" />
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Facebook Page URL <span className="label-hint">(optional)</span></label>
        <input className="input" value={form.facebook || ""} onChange={e => update("facebook", e.target.value)} placeholder="https://www.facebook.com/yourpage" />
      </div>
      {(form.enquiry_email || form.instagram || form.website) && (
        <div className="profile-preview">
          <div className="profile-preview-label">YouTube Footer Preview</div>
          <pre>{previewFooter}</pre>
        </div>
      )}
    </>
  );
}

// ── Sidebar Component ─────────────────────────────────────────────────────────
function Sidebar({ currentPage, setPage, user, onLogout }) {
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

// ── Dashboard Component ───────────────────────────────────────────────────────
function Dashboard({ user, posts, setPage }) {
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
              <div className="stat-icon">
                <Icon.YouTube />
              </div>
              <div className="stat-trend up">
                <Icon.TrendUp /> 12%
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
              <div className="stat-trend up">
                <Icon.TrendUp /> 8%
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
                <Icon.TrendUp />
              </div>
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
                    <div className={`activity-icon ${activity.icon}`}>
                      <Icon.Check />
                    </div>
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

// ── Onboarding ────────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "", business_name: "",
    tagline: "", enquiry_email: "", website: "", instagram: "", tiktok: "", facebook: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("users")
        .select("*")
        .eq("email", form.email)
        .single();
      if (err || !data) throw new Error("Invalid credentials");
      const valid = await bcrypt.compare(form.password, data.password_hash);
      if (!valid) throw new Error("Invalid credentials");
      onComplete(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (step === 1) {
        if (!form.name || !form.email || !form.password) throw new Error("All fields required");
        setStep(2);
        setLoading(false);
        return;
      }
      if (!form.business_name) throw new Error("Business name required");
      const hash = await bcrypt.hash(form.password, 10);
      const { data, error: err } = await supabase
        .from("users")
        .insert([{
          name: form.name,
          email: form.email,
          password_hash: hash,
          business_name: form.business_name,
          tagline: form.tagline,
          enquiry_email: form.enquiry_email || form.email,
          website: form.website,
          instagram: form.instagram,
          tiktok: form.tiktok,
          facebook: form.facebook,
        }])
        .select()
        .single();
      if (err) throw new Error(err.message);
      onComplete(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-logo">
          <h1>FilmPost</h1>
          <p>Automated publishing for wedding videographers</p>
        </div>

        <div className="card">
          <div className="card-body">
            {isLogin ? (
              <form onSubmit={handleLogin}>
                <div className="field">
                  <label className="label">Email</label>
                  <input 
                    className="input" 
                    type="email" 
                    value={form.email} 
                    onChange={e => update("email", e.target.value)} 
                    placeholder="you@example.com" 
                  />
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <input 
                    className="input" 
                    type="password" 
                    value={form.password} 
                    onChange={e => update("password", e.target.value)} 
                    placeholder="Enter your password" 
                  />
                </div>
                {error && <div className="alert alert-error">{error}</div>}
                <button className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={loading}>
                  {loading ? <span className="spinner"></span> : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup}>
                {step === 1 ? (
                  <>
                    <div className="onboarding-step">Step 1 of 2</div>
                    <h3 style={{ marginBottom: 24, fontSize: 22 }}>Create your account</h3>
                    <div className="field">
                      <label className="label">Full Name</label>
                      <input className="input" value={form.name} onChange={e => update("name", e.target.value)} placeholder="John Smith" />
                    </div>
                    <div className="field">
                      <label className="label">Email</label>
                      <input className="input" type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div className="field">
                      <label className="label">Password</label>
                      <input className="input" type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="Create a password" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="onboarding-step">Step 2 of 2</div>
                    <h3 style={{ marginBottom: 24, fontSize: 22 }}>Your business details</h3>
                    <div className="field">
                      <label className="label">Business Name</label>
                      <input className="input" value={form.business_name} onChange={e => update("business_name", e.target.value)} placeholder="Your Wedding Films" />
                    </div>
                    <BusinessProfileFields form={form} update={update} />
                  </>
                )}
                {error && <div className="alert alert-error">{error}</div>}
                <button className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={loading}>
                  {loading ? <span className="spinner"></span> : step === 1 ? "Continue" : "Create Account"}
                </button>
                {step === 2 && (
                  <button type="button" className="btn btn-ghost" style={{ width: "100%", marginTop: 12 }} onClick={() => setStep(1)}>
                    Back
                  </button>
                )}
              </form>
            )}

            <div className="divider-text">
              <span>or</span>
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ width: "100%" }} 
              onClick={() => { setIsLogin(!isLogin); setStep(1); setError(""); }}
            >
              {isLogin ? "Create an Account" : "Sign In Instead"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Upload Page ───────────────────────────────────────────────────────────────
function UploadPage({ user, onSuccess }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [venueName, setVenueName] = useState("");
  const [venueAnswers, setVenueAnswers] = useState({});
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeDesc, setYoutubeDesc] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const dropRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f && f.type.startsWith("video/")) setFile(f);
  }, []);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("video/")) setFile(f);
  };

  const generateContent = async () => {
    setLoading(true);
    setLoadingMsg("Crafting your content with AI...");
    setError("");
    try {
      const systemPrompt = `You are an expert copywriter for luxury UK wedding videographers. Write in elegant British English, using evocative but authentic language. Avoid clichés and overly salesy phrasing. Focus on emotion, atmosphere, and the couple's story.`;

      const answersText = VENUE_QUESTIONS.map(q => {
        const ans = venueAnswers[q.id];
        return ans ? `${q.label}: ${ans}` : "";
      }).filter(Boolean).join("\n");

      const userPromptTitle = `Create a YouTube title for a wedding film at "${venueName}". It should be elegant, include the venue name, and be under 70 characters. Return ONLY the title, no quotes.`;
      const title = await callClaude(systemPrompt, userPromptTitle);
      setYoutubeTitle(title.trim());

      const footer = buildBusinessFooter(user);
      const userPromptDesc = `Write a YouTube description for this wedding film:
Venue: ${venueName}
${answersText}

Include:
1. An evocative opening paragraph about the venue and day
2. A brief mention of highlights
3. End with this exact footer (don't modify it):

${footer}

Keep it under 4000 characters total. Return ONLY the description text.`;
      const desc = await callClaude(systemPrompt, userPromptDesc);
      setYoutubeDesc(desc.trim());

      const userPromptBlog = `Write an 800-1200 word blog post about filming a wedding at "${venueName}" for a wedding videographer's website.

Details about the venue and day:
${answersText}

Structure:
- Compelling headline
- Opening that draws the reader in
- Sections about the venue, the atmosphere, filming highlights
- A subtle call-to-action for couples considering this venue
- Use HTML formatting with <h2>, <p>, <strong> tags

Make it feel personal and authentic, not generic. Return ONLY the HTML content.`;
      const blog = await callClaude(systemPrompt, userPromptBlog);
      setBlogContent(blog.trim());

      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  const publishContent = async () => {
    setLoading(true);
    setLoadingMsg("Publishing to YouTube...");
    setError("");
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(r => setTimeout(r, 200));
      }

      const { data, error: err } = await supabase
        .from("posts")
        .insert([{
          user_id: user.id,
          venue_name: venueName,
          youtube_title: youtubeTitle,
          youtube_description: youtubeDesc,
          blog_content: blogContent,
          youtube_url: "https://youtube.com/watch?v=example",
          wordpress_url: "https://yourblog.com/post-example",
          status: "published"
        }])
        .select()
        .single();

      if (err) throw new Error(err.message);

      setResult({
        youtubeUrl: "https://youtube.com/watch?v=example",
        wordpressUrl: "https://yourblog.com/post-example"
      });
      setStep(4);
      onSuccess?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  if (loading) {
    return (
      <>
        <div className="main-header">
          <div>
            <h1 className="page-title">New Upload</h1>
          </div>
        </div>
        <div className="main-body">
          <div className="card">
            <div className="card-body">
              <div className="loading-overlay" style={{ position: "relative", background: "transparent", minHeight: 400 }}>
                <div className="spinner spinner-lg"></div>
                <h3 className="loading-title">{loadingMsg}</h3>
                {uploadProgress > 0 && (
                  <div style={{ width: 300, marginTop: 20 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p style={{ textAlign: "center", marginTop: 10, color: "var(--text-muted)" }}>{uploadProgress}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">New Upload</h1>
          <p className="page-description">Upload a wedding film and generate content automatically.</p>
        </div>
      </div>

      <div className="main-body">
        <div className="stepper">
          <div className={`step ${step >= 1 ? (step > 1 ? "completed" : "active") : ""}`}>
            <div className="step-number">{step > 1 ? <Icon.Check /> : "1"}</div>
            <span className="step-label">Upload Video</span>
          </div>
          <div className={`step-line ${step > 1 ? "completed" : ""}`}></div>
          <div className={`step ${step >= 2 ? (step > 2 ? "completed" : "active") : ""}`}>
            <div className="step-number">{step > 2 ? <Icon.Check /> : "2"}</div>
            <span className="step-label">Venue Details</span>
          </div>
          <div className={`step-line ${step > 2 ? "completed" : ""}`}></div>
          <div className={`step ${step >= 3 ? (step > 3 ? "completed" : "active") : ""}`}>
            <div className="step-number">{step > 3 ? <Icon.Check /> : "3"}</div>
            <span className="step-label">Review & Edit</span>
          </div>
          <div className={`step-line ${step > 3 ? "completed" : ""}`}></div>
          <div className={`step ${step === 4 ? "completed" : ""}`}>
            <div className="step-number">{step === 4 ? <Icon.Check /> : "4"}</div>
            <span className="step-label">Published</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Select Your Video</h3>
            </div>
            <div className="card-body">
              <div
                ref={dropRef}
                className={`upload-zone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input id="fileInput" type="file" accept="video/*" hidden onChange={handleFileSelect} />
                <div className="upload-zone-icon">
                  {file ? <Icon.Check /> : <Icon.Upload />}
                </div>
                <h3 className="upload-zone-title">
                  {file ? file.name : "Drop your video here"}
                </h3>
                <p className="upload-zone-desc">
                  {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "or click to browse"}
                </p>
              </div>

              <div style={{ marginTop: 32 }}>
                <button 
                  className="btn btn-primary btn-lg" 
                  disabled={!file}
                  onClick={() => setStep(2)}
                >
                  Continue <Icon.Arrow />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tell us about the venue</h3>
            </div>
            <div className="card-body">
              <div className="field">
                <label className="label">Venue Name</label>
                <input 
                  className="input" 
                  value={venueName} 
                  onChange={e => setVenueName(e.target.value)} 
                  placeholder="e.g. Aynhoe Park" 
                />
              </div>

              {VENUE_QUESTIONS.map(q => (
                <div className="field" key={q.id}>
                  <label className="label">{q.label}</label>
                  {q.type === "textarea" ? (
                    <textarea
                      className="textarea"
                      value={venueAnswers[q.id] || ""}
                      onChange={e => setVenueAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                      placeholder={q.placeholder}
                    />
                  ) : (
                    <input
                      className="input"
                      value={venueAnswers[q.id] || ""}
                      onChange={e => setVenueAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                      placeholder={q.placeholder}
                    />
                  )}
                </div>
              ))}

              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button 
                  className="btn btn-primary btn-lg" 
                  disabled={!venueName}
                  onClick={generateContent}
                >
                  Generate Content <Icon.Arrow />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Review Your Content</h3>
            </div>
            <div className="card-body">
              <div className="field">
                <label className="label">YouTube Title</label>
                <input 
                  className="input" 
                  value={youtubeTitle} 
                  onChange={e => setYoutubeTitle(e.target.value)} 
                />
                <div className="char-count">{youtubeTitle.length}/100</div>
              </div>

              <div className="field">
                <label className="label">YouTube Description</label>
                <textarea 
                  className="textarea" 
                  value={youtubeDesc} 
                  onChange={e => setYoutubeDesc(e.target.value)}
                  style={{ minHeight: 200 }}
                />
                <div className="char-count">{youtubeDesc.length}/5000</div>
              </div>

              <div className="divider"></div>

              <div className="field">
                <label className="label">Blog Post</label>
                <textarea 
                  className="textarea" 
                  value={blogContent} 
                  onChange={e => setBlogContent(e.target.value)}
                  style={{ minHeight: 300 }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary btn-lg" onClick={publishContent}>
                  Publish Now <Icon.Arrow />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div className="card">
            <div className="card-body">
              <div className="success-screen">
                <div className="success-icon-large">
                  <Icon.Check />
                </div>
                <h2 className="success-title">Successfully Published</h2>
                <p className="success-desc">Your wedding film is now live on YouTube and your blog post has been created.</p>

                <div className="success-links">
                  <a href={result.youtubeUrl} target="_blank" rel="noopener noreferrer" className="success-link">
                    <div className="success-link-info">
                      <div className="success-link-label">YouTube Video</div>
                      <div className="success-link-url">{result.youtubeUrl}</div>
                    </div>
                    <Icon.External />
                  </a>
                  <a href={result.wordpressUrl} target="_blank" rel="noopener noreferrer" className="success-link">
                    <div className="success-link-info">
                      <div className="success-link-label">Blog Post</div>
                      <div className="success-link-url">{result.wordpressUrl}</div>
                    </div>
                    <Icon.External />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── History Page ──────────────────────────────────────────────────────────────
function HistoryPage({ posts }) {
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

// ── Settings Page ─────────────────────────────────────────────────────────────
function SettingsPage({ user }) {
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
                    <button className="btn btn-secondary btn-sm">Connect</button>
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
                    <button className="btn btn-secondary btn-sm">Connect</button>
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

// ── Profile Page ──────────────────────────────────────────────────────────────
function ProfilePage({ user, onUpdate }) {
  const [form, setForm] = useState({
    business_name: user?.business_name || "",
    tagline: user?.tagline || "",
    enquiry_email: user?.enquiry_email || "",
    website: user?.website || "",
    instagram: user?.instagram || "",
    tiktok: user?.tiktok || "",
    facebook: user?.facebook || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update(form)
        .eq("id", user.id);
      if (error) throw error;
      onUpdate?.({ ...user, ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-description">Manage your business information and branding.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner"></span> : saved ? <><Icon.Check /> Saved</> : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="main-body">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Business Details</h3>
          </div>
          <div className="card-body">
            <div className="field">
              <label className="label">Business Name</label>
              <input className="input" value={form.business_name} onChange={e => update("business_name", e.target.value)} />
            </div>
            <BusinessProfileFields form={form} update={update} />
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("filmpost_user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      loadPosts(u.id);
    }
    setLoading(false);
  }, []);

  const loadPosts = async (userId) => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setPosts(data || []);
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
          {page === "settings" && <SettingsPage user={user} />}
          {page === "profile" && <ProfilePage user={user} onUpdate={(u) => { setUser(u); localStorage.setItem("filmpost_user", JSON.stringify(u)); }} />}
        </main>
      </div>
    </>
  );
}
