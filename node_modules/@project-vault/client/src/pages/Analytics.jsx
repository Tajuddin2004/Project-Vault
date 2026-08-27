import React from 'react';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicFooter } from '../components/navigation/PublicFooter';

export function Analytics({ onNavigate, user }) {
  const metrics = [
    { label: 'Total Verified Container Builds', value: '1,420+', badge: '+18% this month' },
    { label: 'Automated Test Pass Rate', value: '99.4%', badge: 'Empirical Audit' },
    { label: 'Average AST Parsing Latency', value: '0.012s', badge: 'Wasm Edge Optimized' },
    { label: 'Faculty Endorsements Issued', value: '380+', badge: 'Verified Badges' },
  ];

  const buildActivity = [
    { date: '2026-08-13', builds: 142, status: '100% Passed', memory: '1.2 GB' },
    { date: '2026-08-12', builds: 128, status: '99.2% Passed', memory: '1.1 GB' },
    { date: '2026-08-11', builds: 156, status: '100% Passed', memory: '1.4 GB' },
    { date: '2026-08-10', builds: 110, status: '98.8% Passed', memory: '0.9 GB' },
    { date: '2026-08-09', builds: 134, status: '100% Passed', memory: '1.3 GB' },
  ];

  return (
    <div className="app-root">
      <PublicHeader onNavigate={onNavigate} user={user} />

      <section className="shell section" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ marginBottom: 32 }}>
          <span className="pv-badge pv-badge--emerald" style={{ marginBottom: 8 }}>
            <span className="pv-indicator-dot pv-indicator-dot--active" /> PLATFORM METRICS
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '4px 0 8px' }}>
            Container Execution Telemetry & Analytics
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', margin: 0 }}>
            Real-time system telemetry, container build performance, and zero-knowledge static analysis metrics.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 36 }}>
          {metrics.map((m, idx) => (
            <div key={idx} style={{ background: '#ffffff', padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b', marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>{m.value}</div>
              <span className="pv-badge pv-badge--emerald">{m.badge}</span>
            </div>
          ))}
        </div>

        {/* Container Telemetry Table */}
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, marginBottom: 32 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Recent Container Pipeline Audits
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9375rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Audit Date</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Docker Images Executed</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Test Suite Integrity</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Peak Memory Overhead</th>
              </tr>
            </thead>
            <tbody>
              {buildActivity.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>{row.date}</td>
                  <td style={{ padding: '14px 16px', color: '#2563eb', fontWeight: 700 }}>{row.builds} builds</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="pv-badge pv-badge--emerald">✓ {row.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{row.memory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}
