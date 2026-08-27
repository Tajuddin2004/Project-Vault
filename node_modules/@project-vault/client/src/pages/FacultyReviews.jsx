import React, { useState } from 'react';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicFooter } from '../components/navigation/PublicFooter';

export function FacultyReviews({ onNavigate, user }) {
  const [selectedTab, setSelectedTab] = useState('audit');

  const pendingSubmissions = [
    { title: 'Nexora AI Engine v2.4', student: 'Elena Rostova', univ: 'Stanford', status: 'Approved', score: 98 },
    { title: 'CipherShield Zero Knowledge', student: 'Marcus Vance', univ: 'MIT', status: 'Under Review', score: 96 },
    { title: 'MediSync BioMed Telemetry', student: 'Aarav Patel', univ: 'CMU', status: 'Approved', score: 95 },
    { title: 'DevPulse Microservice Engine', student: 'Sarah Chen', univ: 'UC Berkeley', status: 'Approved', score: 94 },
  ];

  return (
    <div className="app-root">
      <PublicHeader onNavigate={onNavigate} user={user} />

      <section className="shell section" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ marginBottom: 32 }}>
          <span className="pv-badge pv-badge--emerald" style={{ marginBottom: 8 }}>
            <span className="pv-indicator-dot pv-indicator-dot--active" /> ACADEMIC AUDIT PORTAL
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '4px 0 8px' }}>
            Faculty & Academic Review Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', margin: 0 }}>
            Structured rubric evaluation toolkit for professors, lab directors, and academic evaluators.
          </p>
        </div>

        {/* Audit Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 36 }}>
          {pendingSubmissions.map((sub, idx) => (
            <div key={idx} style={{ background: '#ffffff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
              <span className="pv-badge pv-badge--emerald" style={{ marginBottom: 10 }}>{sub.status}</span>
              <h3 style={{ margin: '6px 0 4px', fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>{sub.title}</h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.875rem', color: '#64748b' }}>
                Student: <strong>{sub.student}</strong> ({sub.univ})
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.9375rem' }}>Evaluated Score: {sub.score}/100</span>
                <button
                  className="dash-btn-ghost btn-sm"
                  onClick={() => onNavigate('/explore')}
                >
                  Inspect Submission →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Academic Rubric Criteria */}
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Faculty Evaluation Rubric Criteria
          </h3>
          <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: '0.9375rem' }}>
            Submissions are scored dynamically across four core software engineering dimensions:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #cbd5e1' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: 4 }}>1. Code Quality & AST (25 Pts)</strong>
              <span style={{ fontSize: '0.8125rem', color: '#475569' }}>Linter pass rate, type safety, modular design patterns.</span>
            </div>

            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #cbd5e1' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: 4 }}>2. Security & Vulnerabilities (25 Pts)</strong>
              <span style={{ fontSize: '0.8125rem', color: '#475569' }}>Zero critical CVEs, secret leak detection, dependency auditing.</span>
            </div>

            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #cbd5e1' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: 4 }}>3. Build & Docker Execution (25 Pts)</strong>
              <span style={{ fontSize: '0.8125rem', color: '#475569' }}>Container compilation, zero build crashes, sub-second boot.</span>
            </div>

            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #cbd5e1' }}>
              <strong style={{ color: '#2563eb', display: 'block', marginBottom: 4 }}>4. Documentation & Proof (25 Pts)</strong>
              <span style={{ fontSize: '0.8125rem', color: '#475569' }}>Comprehensive README, API schemas, execution screenshots.</span>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}
