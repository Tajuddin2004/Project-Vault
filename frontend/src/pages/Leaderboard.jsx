import React, { useState } from 'react';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicFooter } from '../components/navigation/PublicFooter';

export function Leaderboard({ onNavigate, user }) {
  const [filterDepartment, setFilterDepartment] = useState('All');

  const topBuilders = [
    { rank: 1, name: 'Elena Rostova', college: 'Stanford University', dept: 'Computer Vision & AI Lab', score: 98, totalProjects: 20, badge: '🥇 Gold Builder' },
    { rank: 2, name: 'Marcus Vance', college: 'MIT Dept of EECS', dept: 'Cybersecurity & Web3 Lab', score: 96, totalProjects: 20, badge: '🥈 Silver Builder' },
    { rank: 3, name: 'Aarav Patel', college: 'Carnegie Mellon University', dept: 'BioMed Tech & Informatics', score: 95, totalProjects: 20, badge: '🥉 Bronze Builder' },
    { rank: 4, name: 'Sarah Chen', college: 'UC Berkeley EECS', dept: 'Systems Engineering & Cloud', score: 94, totalProjects: 20, badge: '⭐ Top Systems' },
    { rank: 5, name: 'Kenji Takahashi', college: 'ETH Zürich Robotics Inst.', dept: 'Autonomous Systems & Robotics', score: 93, totalProjects: 20, badge: '⭐ Top Swarm AI' },
  ];

  const filtered = topBuilders.filter(
    (b) => filterDepartment === 'All' || b.dept.toLowerCase().includes(filterDepartment.toLowerCase())
  );

  return (
    <div className="app-root">
      <PublicHeader onNavigate={onNavigate} user={user} />

      <section className="shell section" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ marginBottom: 32 }}>
          <span className="pv-badge pv-badge--emerald" style={{ marginBottom: 8 }}>
            <span className="pv-indicator-dot pv-indicator-dot--active" /> ACADEMIC RANKINGS
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '4px 0 8px' }}>
            University & Student Builder Leaderboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', margin: 0 }}>
            Rankings based on empirical container health scores, faculty audit endorsements, and verified project publications.
          </p>
        </div>

        {/* Podium for Top 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 36 }}>
          {topBuilders.slice(0, 3).map((builder) => (
            <div
              key={builder.rank}
              style={{
                background: builder.rank === 1 ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#ffffff',
                color: builder.rank === 1 ? '#ffffff' : '#0f172a',
                padding: 24,
                borderRadius: 16,
                border: builder.rank === 1 ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 4 }}>
                  {builder.badge}
                </div>
                <h3 style={{ margin: '4px 0', fontSize: '1.25rem', fontWeight: 800 }}>{builder.name}</h3>
                <p style={{ margin: '0 0 12px', fontSize: '0.875rem', opacity: 0.8 }}>{builder.college}</p>
                <div style={{ fontSize: '0.8125rem', padding: '4px 8px', borderRadius: 6, background: builder.rank === 1 ? 'rgba(255,255,255,0.1)' : '#f1f5f9', display: 'inline-block' }}>
                  {builder.dept}
                </div>
              </div>

              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: builder.rank === 1 ? '1px solid rgba(255,255,255,0.15)' : '1px solid #e2e8f0', paddingTop: 12 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{builder.totalProjects} Verified Projects</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: builder.rank === 1 ? '#10b981' : '#2563eb' }}>
                  {builder.score}/100
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="dash-filter-bar" style={{ marginBottom: 20 }}>
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>Filter Department:</span>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="dash-filter-select"
          >
            <option value="All">All Departments</option>
            <option value="AI">AI & Vision Labs</option>
            <option value="Cybersecurity">Cybersecurity & Web3</option>
            <option value="BioMed">BioMed & Telemetry</option>
            <option value="Systems">Systems & Cloud</option>
            <option value="Robotics">Robotics & Swarms</option>
          </select>
        </div>

        {/* Full Table */}
        <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9375rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Rank</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Student Builder</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>University / Institution</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Specialization Department</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Published Vaults</th>
                <th style={{ padding: '14px 20px', fontWeight: 700 }}>Health Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.rank} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 800, color: '#2563eb' }}>#{b.rank}</td>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#0f172a' }}>{b.name}</td>
                  <td style={{ padding: '16px 20px', color: '#475569' }}>{b.college}</td>
                  <td style={{ padding: '16px 20px', color: '#64748b' }}>{b.dept}</td>
                  <td style={{ padding: '16px 20px', fontWeight: 600 }}>{b.totalProjects} Projects</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className="pv-badge pv-badge--emerald">✓ {b.score}/100</span>
                  </td>
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
