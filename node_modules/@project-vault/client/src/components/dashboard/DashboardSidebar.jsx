import React from 'react';
import { VaultLogo } from '../icons/VaultLogo';

export function DashboardSidebar({ activeTab, setActiveTab, profileData, completionPercentage, projectCount, onLogout }) {
  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar-header">
        <div className="dash-brand-logo" onClick={() => window.history.pushState({}, '', '/')}>
          <VaultLogo style={{ width: 28, height: 28 }} />
          <span className="dash-brand-text">PROJECT VAULT</span>
        </div>
      </div>

      <nav className="dash-nav">
        <button
          className={`dash-nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
          aria-label="Home Workspace"
        >
          <div className="dash-nav-item-content">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
          </div>
          <span className="dash-nav-badge">LIVE</span>
        </button>

        <button
          className={`dash-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
          aria-label="Projects Management"
        >
          <div className="dash-nav-item-content">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Projects</span>
          </div>
          <span className="dash-nav-badge">{projectCount}</span>
        </button>

        <button
          className={`dash-nav-item ${activeTab === 'showcase' ? 'active' : ''}`}
          onClick={() => setActiveTab('showcase')}
          aria-label="Visit Public Projects Showcase"
        >
          <div className="dash-nav-item-content">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span>Visit Projects</span>
          </div>
          <span className="dash-nav-badge">↗</span>
        </button>

        <button
          className={`dash-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
          aria-label="Student Profile Settings"
        >
          <div className="dash-nav-item-content">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profile</span>
          </div>
          <span className="dash-nav-badge">{completionPercentage}%</span>
        </button>
      </nav>

      <div className="dash-sidebar-footer">
        <div className="dash-user-pill">
          <div className="dash-user-avatar">
            {(profileData.name || profileData.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="dash-user-info">
            <span className="dash-user-name">{profileData.name || profileData.email || 'Student User'}</span>
            <span className="dash-user-role">Student Engineer</span>
          </div>
        </div>
        <button className="dash-logout-btn" onClick={onLogout} title="Sign Out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}
