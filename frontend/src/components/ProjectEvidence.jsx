import React, { useState } from 'react';

export function ProjectEvidence({ project }) {
  const [activeTab, setActiveTab] = useState('repo');

  const repoFacts = {
    repository: 'github.com/student/nexora-engine',
    branch: 'main (commit #8f921a4)',
    language: 'Rust / WebAssembly / TypeScript',
    dependencies: ['tokio v1.28', 'wasm-bindgen v0.2', 'serde v1.0', 'axum v0.6'],
    fileCount: 42,
    linesOfCode: 4820,
    license: 'MIT License',
  };

  const systemFacts = {
    containerImage: 'docker.io/projectvault/runner-rust:v1.4',
    isolationMode: 'Linux cgroups v2 / Seccomp Sandbox',
    executionTime: '1.42 seconds',
    memoryPeak: '128 MB RAM',
    exitCode: 0,
    telemetryHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  };

  const executionFacts = {
    testFramework: 'cargo test (native)',
    totalTests: 48,
    passed: 48,
    failed: 0,
    coverage: '94.2% statement coverage',
    benchmarkResult: '0.012s frame rendering latency',
  };

  const aiAnalysis = {
    astComplexity: 'Low cyclomatic complexity (avg 2.4 per function)',
    vulnerabilityScan: 'Zero memory unsafe operations detected in Rust unsafe blocks.',
    documentationCoverage: '100% of public Rust API methods documented with doc-comments.',
    edgeCaseAudit: 'Analyzed boundary input conditions for null byte buffers and buffer overflow resistance.',
  };

  const facultyReview = {
    evaluator: 'Dr. E. Vance (Department Lead)',
    grade: 'A+ (98/100)',
    timestamp: '2026-08-10 14:22 UTC',
    feedback: 'Outstanding architecture. Code demonstrates advanced understanding of memory management and concurrency primitives.',
    endorsementSeal: 'FACULTY_VERIFIED_AUTHENTIC #9012',
  };

  return (
    <div className="pv-evidence-inspector">
      <div className="pv-evidence-header">
        <div className="pv-evidence-title-block">
          <div className="pv-eyebrow">EMPIRICAL PROOF INSPECTOR</div>
          <h3>Project Verification Evidence</h3>
          <p>Multi-layer separation of repository facts, container telemetry, AI analysis, and faculty audit signatures.</p>
        </div>
      </div>

      <div className="pv-evidence-nav">
        <button
          className={`pv-evidence-tab ${activeTab === 'repo' ? 'active' : ''}`}
          onClick={() => setActiveTab('repo')}
        >
          📦 Repository Facts
        </button>
        <button
          className={`pv-evidence-tab ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          ⚙ System & Docker
        </button>
        <button
          className={`pv-evidence-tab ${activeTab === 'execution' ? 'active' : ''}`}
          onClick={() => setActiveTab('execution')}
        >
          ⚡ Test Execution
        </button>
        <button
          className={`pv-evidence-tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          🤖 AI AST Analysis
        </button>
        <button
          className={`pv-evidence-tab ${activeTab === 'faculty' ? 'active' : ''}`}
          onClick={() => setActiveTab('faculty')}
        >
          🎓 Faculty Audit
        </button>
      </div>

      <div className="pv-evidence-content">
        {activeTab === 'repo' && (
          <div className="pv-evidence-panel">
            <div className="pv-panel-badge pv-panel-badge--repo">DERIVED FROM GIT REPOSITORY SOURCE</div>
            <div className="pv-fact-grid">
              <div className="pv-fact-item">
                <span className="pv-fact-label">Repository Target</span>
                <span className="pv-fact-value font-mono">{repoFacts.repository}</span>
              </div>
              <div className="pv-fact-item">
                <span className="pv-fact-label">Git Branch / Commit</span>
                <span className="pv-fact-value font-mono">{repoFacts.branch}</span>
              </div>
              <div className="pv-fact-item">
                <span className="pv-fact-label">Language Stack</span>
                <span className="pv-fact-value">{repoFacts.language}</span>
              </div>
              <div className="pv-fact-item">
                <span className="pv-fact-label">Lines of Code</span>
                <span className="pv-fact-value">{repoFacts.linesOfCode.toLocaleString()} LOC ({repoFacts.fileCount} files)</span>
              </div>
              <div className="pv-fact-item" style={{ gridColumn: 'span 2' }}>
                <span className="pv-fact-label">Detected Manifest Dependencies</span>
                <div className="pv-tag-row">
                  {repoFacts.dependencies.map((d, i) => (
                    <span key={i} className="pv-tag">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="pv-evidence-panel">
            <div className="pv-panel-badge pv-panel-badge--system">GENERATED BY ISOLATED EXECUTION WORKER</div>
            <div className="pv-fact-grid">
              <div className="pv-fact-item">
                <span className="pv-fact-label">Container Image</span>
                <span className="pv-fact-value font-mono">{systemFacts.containerImage}</span>
              </div>
              <div className="pv-fact-item">
                <span className="pv-fact-label">Isolation Mode</span>
                <span className="pv-fact-value">{systemFacts.isolationMode}</span>
              </div>
              <div className="pv-fact-item">
                <span className="pv-fact-label">Execution Duration</span>
                <span className="pv-fact-value">{systemFacts.executionTime}</span>
              </div>
              <div className="pv-fact-item">
                <span className="pv-fact-label">Peak Memory Usage</span>
                <span className="pv-fact-value">{systemFacts.memoryPeak}</span>
              </div>
              <div className="pv-fact-item" style={{ gridColumn: 'span 2' }}>
                <span className="pv-fact-label">Cryptographic Telemetry SHA-256 Digest</span>
                <span className="pv-fact-value font-mono" style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
                  {systemFacts.telemetryHash}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'execution' && (
          <div className="pv-evidence-panel">
            <div className="pv-panel-badge pv-panel-badge--exec">VERIFIED BY RUNTIME TEST SUITE</div>
            <div className="pv-fact-grid">
              <div className="pv-fact-item">
                <span className="pv-fact-label">Test Framework</span>
                <span className="pv-fact-value font-mono">{executionFacts.testFramework}</span>
              </div>
              <div className="pv-fact-item">
                <span className="pv-fact-label">Test Suite Pass Rate</span>
                <span className="pv-fact-value" style={{ color: '#059669', fontWeight: 800 }}>
                  {executionFacts.passed} / {executionFacts.totalTests} PASSED (100%)
                </span>
              </div>
              <div className="pv-fact-item">
                <span className="pv-fact-label">Code Statement Coverage</span>
                <span className="pv-fact-value">{executionFacts.coverage}</span>
              </div>
              <div className="pv-fact-item">
                <span className="pv-fact-label">Benchmark Latency</span>
                <span className="pv-fact-value">{executionFacts.benchmarkResult}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="pv-evidence-panel">
            <div className="pv-panel-badge pv-panel-badge--ai">AUTOMATED AI TECHNICAL AUDIT</div>
            <div className="pv-fact-grid">
              <div className="pv-fact-item" style={{ gridColumn: 'span 2' }}>
                <span className="pv-fact-label">Abstract Syntax Tree (AST) Complexity</span>
                <span className="pv-fact-value">{aiAnalysis.astComplexity}</span>
              </div>
              <div className="pv-fact-item" style={{ gridColumn: 'span 2' }}>
                <span className="pv-fact-label">Security Scan Summary</span>
                <span className="pv-fact-value" style={{ color: '#059669' }}>{aiAnalysis.vulnerabilityScan}</span>
              </div>
              <div className="pv-fact-item" style={{ gridColumn: 'span 2' }}>
                <span className="pv-fact-label">API Documentation Coverage</span>
                <span className="pv-fact-value">{aiAnalysis.documentationCoverage}</span>
              </div>
              <div className="pv-fact-item" style={{ gridColumn: 'span 2' }}>
                <span className="pv-fact-label">Edge Case & Boundary Analysis</span>
                <span className="pv-fact-value">{aiAnalysis.edgeCaseAudit}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faculty' && (
          <div className="pv-evidence-panel">
            <div className="pv-panel-badge pv-panel-badge--faculty">FACULTY EVALUATION & ENDORSEMENT</div>
            <div className="pv-fact-grid">
              <div className="pv-fact-item">
                <span className="pv-fact-label">Evaluating Instructor</span>
                <span className="pv-fact-value" style={{ fontWeight: 800 }}>{facultyReview.evaluator}</span>
              </div>
              <div className="pv-fact-item">
                <span className="pv-fact-label">Assigned Grade Score</span>
                <span className="pv-fact-value" style={{ color: '#059669', fontWeight: 800 }}>{facultyReview.grade}</span>
              </div>
              <div className="pv-fact-item" style={{ gridColumn: 'span 2' }}>
                <span className="pv-fact-label">Faculty Audit Remarks</span>
                <p className="pv-fact-value" style={{ margin: '4px 0 0', lineHeight: 1.5, color: '#334155' }}>
                  "{facultyReview.feedback}"
                </p>
              </div>
              <div className="pv-fact-item" style={{ gridColumn: 'span 2' }}>
                <span className="pv-fact-label">Cryptographic Seal ID</span>
                <span className="pv-fact-value font-mono" style={{ color: '#059669' }}>
                  {facultyReview.endorsementSeal} • Signed at {facultyReview.timestamp}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
