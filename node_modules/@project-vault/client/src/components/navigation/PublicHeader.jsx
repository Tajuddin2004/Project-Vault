import React from 'react';
import { Logo } from '../Logo';

export function PublicHeader({ onNavigate }) {
  return (
    <header className="header-wrapper">
      <nav className="nav shell" aria-label="Main Navigation">
        <Logo href="/" onNavigate={onNavigate} />

        <div className="nav__links">
          <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('/explore'); }}>
            Explore Projects
          </a>
          <a href="/leaderboard" onClick={(e) => { e.preventDefault(); onNavigate('/leaderboard'); }}>
            Leaderboard
          </a>
          <a href="/analytics" onClick={(e) => { e.preventDefault(); onNavigate('/analytics'); }}>
            Telemetry Analytics
          </a>
          <a href="/faculty-reviews" onClick={(e) => { e.preventDefault(); onNavigate('/faculty-reviews'); }}>
            Faculty Audit
          </a>
          <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('/about'); }}>
            About
          </a>
          <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}>
            Support
          </a>
        </div>

        <div className="nav__actions">
          <a
            className="btn btn-secondary btn-sm"
            href="/signin"
            onClick={(e) => { e.preventDefault(); onNavigate('/signin'); }}
          >
            Sign In
          </a>
          <a
            className="btn btn-primary btn-sm"
            href="/signup"
            onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }}
          >
            Get Started <span>↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
