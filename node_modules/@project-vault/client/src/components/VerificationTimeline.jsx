import React from 'react';
import { VERIFICATION_STAGES } from '../utils/constants';

export function VerificationTimeline({ currentStage = 'verified', timestamp = '2026-08-12 23:45 UTC', onStageClick }) {
  const currentIndex = VERIFICATION_STAGES.findIndex((s) => s.id === currentStage);
  const activeIndex = currentIndex >= 0 ? currentIndex : 4; // Default to verified

  return (
    <div className="pv-verification-timeline" role="region" aria-label="Verification Pipeline Progress">
      <div className="pv-timeline-header">
        <div className="pv-timeline-title-wrap">
          <span className="pv-badge pv-badge--emerald">
            <span className="pv-indicator-dot pv-indicator-dot--active" /> VERIFICATION PIPELINE
          </span>
          <span className="pv-timeline-time">Last Execution Audit: {timestamp}</span>
        </div>
        <div className="pv-timeline-status">
          Stage {activeIndex + 1} of {VERIFICATION_STAGES.length}: <strong>{VERIFICATION_STAGES[activeIndex]?.label.toUpperCase()}</strong>
        </div>
      </div>

      <div className="pv-pipeline-track">
        {VERIFICATION_STAGES.map((stage, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isPending = idx > activeIndex;

          return (
            <div
              key={stage.id}
              className={`pv-pipeline-step ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''} ${isPending ? 'is-pending' : ''}`}
              onClick={() => onStageClick && onStageClick(stage.id)}
              tabIndex={0}
              role="button"
              aria-label={`Stage ${idx + 1}: ${stage.label}. ${isDone ? 'Completed' : isCurrent ? 'Active' : 'Pending'}`}
            >
              <div className="pv-step-node">
                {isDone ? '✓' : idx + 1}
              </div>
              <div className="pv-step-info">
                <span className="pv-step-name">{stage.label}</span>
                <span className="pv-step-desc">{stage.desc}</span>
              </div>
              {idx < VERIFICATION_STAGES.length - 1 && <div className="pv-step-connector" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
