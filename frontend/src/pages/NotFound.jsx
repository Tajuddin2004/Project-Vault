import React from 'react';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicFooter } from '../components/navigation/PublicFooter';

export function NotFound({ onNavigate, user }) {
  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader onNavigate={onNavigate} user={user} />

      <main className="shell section" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 80 }}>
        <div style={{ maxWidth: 560, textAlign: 'center', background: '#ffffff', padding: '48px 32px', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.06)' }}>
          <span className="pv-badge pv-badge--red" style={{ marginBottom: 16, background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' }}>
            <span className="pv-indicator-dot" style={{ background: '#dc2626' }} /> 404 ERROR — PAGE NOT FOUND
          </span>

          <div style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, color: '#0f172a', margin: '16px 0 12px', letterSpacing: '-0.03em' }}>
            404
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
            Lost in the Sandbox Execution Layer?
          </h2>

          <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6, margin: '0 0 28px' }}>
            The requested page URL or resource route does not exist or has been moved to another location within the Project Vault platform.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="dash-btn-ghost"
              onClick={() => onNavigate('/')}
              style={{ padding: '10px 20px' }}
            >
              ← Return Home
            </button>
            <button
              className="dash-btn-primary"
              onClick={() => onNavigate(user ? '/dashboard' : '/explore')}
              style={{ padding: '10px 20px' }}
            >
              {user ? 'Go to Workspace Dashboard ⚡' : 'Explore Projects ↗'}
            </button>
          </div>
        </div>
      </main>

      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}
