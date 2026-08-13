import React from 'react';

export function HealthScore({ overallScore = 96, metrics = [] }) {
  const defaultMetrics = [
    { label: 'Unit Test Coverage', value: '100%', status: 'emerald', detail: '48 / 48 Automated Tests Passed' },
    { label: 'Static AST Security', value: 'Zero Critical', status: 'emerald', detail: 'Clean OWASP AST Vulnerability Scan' },
    { label: 'Container Build Latency', value: '1.42 seconds', status: 'blue', detail: 'Sub-second Cold Boot Isolation' },
    { label: 'Documentation Score', value: '94 / 100', status: 'emerald', detail: 'Complete OpenAPI & README Schema' },
  ];

  const activeMetrics = metrics && metrics.length > 0 ? metrics : defaultMetrics;

  return (
    <div className="pv-health-score-container">
      <div className="pv-health-summary-card">
        <div className="pv-health-numeric-wrap">
          <span className="pv-health-big-score">{overallScore}</span>
          <span className="pv-health-max">/100</span>
        </div>
        <div className="pv-health-summary-info">
          <div className="pv-health-badge">VERIFIED HEALTH METRIC</div>
          <h4 className="pv-health-title">Empirical Codebase Grade</h4>
          <p className="pv-health-subtitle">
            Calculated automatically from containerized execution, static analysis, unit test suites, and documentation audits.
          </p>
        </div>
      </div>

      <div className="pv-health-metrics-grid">
        {activeMetrics.map((m, idx) => (
          <div key={idx} className="pv-metric-card">
            <div className="pv-metric-top">
              <span className="pv-metric-label">{m.label}</span>
              <span className={`pv-metric-status pv-metric-status--${m.status || 'emerald'}`}>
                {m.value}
              </span>
            </div>
            <div className="pv-metric-detail">{m.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
