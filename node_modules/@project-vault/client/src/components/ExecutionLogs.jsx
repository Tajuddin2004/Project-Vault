import React, { useState } from 'react';

export function ExecutionLogs({ logs = [], containerId = 'cnt-8942-ec2', exitCode = 0, duration = '1.42s' }) {
  const [copied, setCopied] = useState(false);

  const defaultLogs = [
    { time: '00:00.01', type: 'sys', msg: 'Initiating container runtime environment node:22-alpine...' },
    { time: '00:00.12', type: 'cmd', msg: '$ docker build -t vault-runner/project-src:latest .' },
    { time: '00:00.45', type: 'info', msg: '[DOCKER] Step 1/6: Installing build tools & gcc toolchain' },
    { time: '00:00.88', type: 'info', msg: '[DOCKER] Step 2/6: Executing static dependency tree validation' },
    { time: '00:01.05', type: 'cmd', msg: '$ npm run test --workspace=backend -- --ci --coverage' },
    { time: '00:01.20', type: 'pass', msg: 'PASS src/__tests__/auth.test.js (12/12 passed)' },
    { time: '00:01.31', type: 'pass', msg: 'PASS src/__tests__/verification.test.js (8/8 passed)' },
    { time: '00:01.40', type: 'sys', msg: '[AUDIT] Cryptographic SHA-256 evidence hash generated.' },
    { time: '00:01.42', type: 'sys', msg: `Container process exited with status code ${exitCode}. Telemetry stream closed.` },
  ];

  const activeLogs = logs && logs.length > 0 ? logs : defaultLogs;

  const handleCopyLogs = () => {
    const text = activeLogs.map((l) => `[${l.time || 'LOG'}] ${l.msg || l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pv-execution-terminal" role="region" aria-label="Container Execution Logs">
      <div className="pv-terminal-bar">
        <div className="pv-terminal-title">
          <span className="pv-terminal-dot" />
          <span>DOCKER CONTAINER TELEMETRY // ID: {containerId}</span>
        </div>
        <div className="pv-terminal-meta">
          <span className="pv-meta-badge">Exit Status: {exitCode}</span>
          <span className="pv-meta-badge">Duration: {duration}</span>
          <button className="pv-btn-terminal" onClick={handleCopyLogs} aria-label="Copy logs to clipboard">
            {copied ? '✓ Copied' : 'Copy Logs'}
          </button>
        </div>
      </div>

      <div className="pv-terminal-body font-mono">
        {activeLogs.map((log, idx) => {
          const isString = typeof log === 'string';
          const logText = isString ? log : (log.msg || log.text || '');
          const logType = isString
            ? (log.includes('SUCCESS') || log.includes('PASS') ? 'pass' : log.includes('ERR') || log.includes('Error') ? 'err' : 'info')
            : (log.type || 'info');
          const logTime = isString ? null : (log.time || `00:0${idx}`);

          return (
            <div key={idx} className={`pv-log-line pv-log-${logType}`}>
              {logTime && <span className="pv-log-time">[{logTime}]</span>}
              <span className="pv-log-text">{logText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
