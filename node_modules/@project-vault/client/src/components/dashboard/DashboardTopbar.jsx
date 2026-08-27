import React from 'react';

export function DashboardTopbar({ activeTab, profileName, onAddProject }) {
  const titles = {
    home: `Welcome back, ${profileName || 'Student Builder'} 👋`,
    projects: 'Project Management & Import',
    showcase: 'Verified Public Showcase',
    profile: 'Student Profile Settings',
  };

  const subtitles = {
    home: 'Manage your verified project telemetry, container builds, and portfolio identity',
    projects: 'Import, view, and organize your repositories with container execution history',
    showcase: 'Explore top verified student engineering projects across university departments',
    profile: 'Update your bio, photo, skills, education, and verified credentials',
  };

  return (
    <header className="dash-topbar">
      <div className="dash-topbar-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="pv-badge pv-badge--emerald">
            <span className="pv-indicator-dot pv-indicator-dot--active" /> VERIFIED WORKSPACE ACTIVE
          </span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>{titles[activeTab]}</h1>
        <p style={{ margin: 0, color: '#64748b' }}>{subtitles[activeTab]}</p>
      </div>

      <div className="dash-topbar-actions">
        {activeTab === 'projects' && (
          <button className="dash-btn-primary" onClick={onAddProject}>
            <span>+ Add New Project</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
