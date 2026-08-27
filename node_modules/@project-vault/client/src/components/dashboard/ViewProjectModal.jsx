import React from 'react';
import { toast } from 'react-toastify';
import { VerificationTimeline } from '../VerificationTimeline';
import { ExecutionLogs } from '../ExecutionLogs';
import { HealthScore } from '../HealthScore';
import { ProjectEvidence } from '../ProjectEvidence';
import { ReviewRubric } from '../ReviewRubric';

export function ViewProjectModal({ project, onClose, onSaveRubric }) {
  if (!project) return null;

  const handleRunProject = () => {
    toast.info(`⚡ Launching sandbox container for "${project.title}"... (Simulated Execution)`, {
      position: 'bottom-right',
      autoClose: 3000,
    });
  };

  return (
    <div className="dash-modal-backdrop" onClick={onClose}>
      <div className="dash-modal-card" style={{ maxWidth: 880, padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div className="dash-modal-header" style={{ marginBottom: 16 }}>
          <div>
            <span className="pv-badge pv-badge--emerald" style={{ marginBottom: 6 }}>
              <span className="pv-indicator-dot" /> {project.category} · {project.subCategory || project.subcategory}
            </span>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.75rem', fontWeight: 900 }}>{project.title}</h2>
          </div>
          <button className="dash-close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p style={{ margin: 0, color: '#475569', lineHeight: 1.6, fontSize: '0.9375rem' }}>
            {project.description}
          </p>

          {project.zipFileUrl && (
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong>📦 Associated Source Code File:</strong> {project.zipFileName || 'Uploaded Archive'}
              </div>
              <a href={project.zipFileUrl} download className="dash-btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                Download Code Archive 📥
              </a>
            </div>
          )}

          {/* 1. Verification Pipeline Step Indicator */}
          <VerificationTimeline currentStage={project.status === 'Published' || project.status === 'published' ? 'published' : 'verified'} />

          {/* 2. Health Score Breakdown */}
          <HealthScore overallScore={project.score || project.healthScore || 96} />

          {/* 3. Multi-Layer Evidence Inspector */}
          <ProjectEvidence project={project} />

          {/* 4. Execution Terminal */}
          <ExecutionLogs containerId={`cnt-${project.id || project._id}`} />

          {/* 5. Faculty Review Rubric */}
          {onSaveRubric && (
            <ReviewRubric onSaveRubric={(rubricData) => onSaveRubric(project, rubricData)} />
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
            <button className="dash-btn-ghost" onClick={onClose}>
              Close Inspector
            </button>
            <button
              type="button"
              className="dash-btn-primary"
              style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', border: 'none', cursor: 'pointer' }}
              onClick={handleRunProject}
            >
              <span>▶ Run Project</span>
            </button>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="dash-btn-primary">
                View Git Evidence ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
