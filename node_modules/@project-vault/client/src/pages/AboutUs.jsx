import React from 'react';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicFooter } from '../components/navigation/PublicFooter';

export function AboutUs({ onNavigate, user }) {
  return (
    <div className="app-root">
      <PublicHeader onNavigate={onNavigate} user={user} />

      <section className="shell section" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <span className="pv-badge pv-badge--emerald" style={{ marginBottom: 8 }}>
            <span className="pv-indicator-dot pv-indicator-dot--active" /> OUR MISSION & SYSTEM ARCHITECTURE
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '8px 0 16px', color: '#0f172a' }}>
            Empowering Next-Gen Engineers with Verified Proof of Work
          </h1>
          <p style={{ color: '#475569', fontSize: '1.125rem', lineHeight: 1.7, marginBottom: 32 }}>
            Traditional resume links and GitHub URLs fail to capture the true execution quality of student engineering projects. Project Vault bridges academia and industry by automatically compiling container builds, running security static analysis, and generating faculty-verified credentials.
          </p>

          {/* Core Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 40 }}>
            <div style={{ background: '#ffffff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🐳</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.125rem', fontWeight: 800 }}>Automated Sandboxing</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                Every repository submission is containerized in an isolated environment to verify dependencies, run unit tests, and compute latency.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🛡️</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.125rem', fontWeight: 800 }}>Empirical Health Scores</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                Static analysis engines evaluate Abstract Syntax Trees (AST) to measure code cleanliness, security vulnerability free status, and test coverage.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🎓</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.125rem', fontWeight: 800 }}>Faculty Endorsements</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                Professors and research leads review projects against standardized rubrics to issue tamper-proof digital certificates.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', padding: 36, borderRadius: 20, textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 10px', fontSize: '1.75rem', fontWeight: 900 }}>Ready to Build Your Verified Portfolio?</h2>
            <p style={{ margin: '0 0 20px', color: '#cbd5e1', fontSize: '1rem' }}>
              Create your account today and turn cold repositories into verified execution telemetry.
            </p>
            <a
              className="btn btn-primary btn-lg"
              href="/signup"
              onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }}
            >
              Get Started Free <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}
