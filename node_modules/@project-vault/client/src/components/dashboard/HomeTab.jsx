import React from 'react';
import { VerificationTimeline } from '../VerificationTimeline';
import { ExecutionLogs } from '../ExecutionLogs';
import { HealthScore } from '../HealthScore';
import { ProjectEvidence } from '../ProjectEvidence';
import { ReviewRubric } from '../ReviewRubric';

export function HomeTab({ profileData, completionPercentage, projects, setActiveTab, handleResumeUpload, onUpdateProjects }) {
  return (
    <div className="dash-content-stack">
      {/* Futuristic Resume Preview Card */}
      <div className="resume-card">
        <div className="resume-header">
          <div
            className="resume-photo-box"
            style={profileData.avatarUrl ? { backgroundImage: `url(${profileData.avatarUrl})` } : {}}
          >
            {!profileData.avatarUrl && (profileData.name || profileData.email || 'U').charAt(0).toUpperCase()}
          </div>

          <div className="resume-header-info">
            <h2 className="resume-name">{profileData.name || profileData.email || 'Student Developer'}</h2>
            <div className="resume-role-banner">
              {profileData.roleTitle || 'SOFTWARE ENGINEER & AI RESEARCHER'}
            </div>
            <div className="resume-contact-bar">
              <span>e: {profileData.email}</span>
              {profileData.phone && <span>| p: {profileData.phone}</span>}
              {profileData.location && <span>| {profileData.location}</span>}
              {profileData.college && <span>| {profileData.college}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <button className="dash-btn-primary btn-sm" onClick={() => setActiveTab('profile')}>
              Edit Profile ⚡
            </button>

            {profileData.resumeFile ? (
              <a
                href={profileData.resumeFile.dataUrl}
                download={profileData.resumeFile.name || `${profileData.name || 'Student'}_Resume.pdf`}
                className="dash-btn-primary btn-sm"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                title={`Download ${profileData.resumeFile.name}`}
              >
                <span>📥 Download Resume</span>
              </a>
            ) : (
              <label
                className="dash-btn-ghost btn-sm"
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem' }}
                title="Upload your PDF or Word resume"
              >
                <span>📄 Upload Resume</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>
        </div>

        <div className="resume-body-grid">
          {/* Left Column */}
          <div className="resume-left-col">
            <div>
              <h3 className="resume-section-title">SKILLS</h3>
              <div className="resume-skills-list">
                {profileData.skills.map((sk, idx) => (
                  <span key={idx} className="resume-skill-tag">• {sk}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="resume-section-title">EDUCATION</h3>
              <div className="resume-timeline">
                {profileData.education.map((edu, idx) => (
                  <div key={idx} className="resume-timeline-item">
                    <div className="resume-timeline-date">{edu.year}</div>
                    <div className="resume-timeline-title">{edu.degree}</div>
                    <div className="resume-timeline-sub">{edu.inst}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="resume-section-title">VERIFICATION</h3>
              <div style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontWeight: 700, color: '#059669', marginBottom: 4 }}>
                  <span>✓</span> VERIFIED BUILDER IDENTITY
                </div>
                <div>Faculty Audit Endorsed • Strength: {completionPercentage}%</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="resume-right-col">
            {profileData.bio && (
              <div>
                <h3 className="resume-section-title">CAREER OBJECTIVE</h3>
                <p className="resume-bio-text">{profileData.bio}</p>
              </div>
            )}

            <div>
              <h3 className="resume-section-title">EXPERIENCE & VERIFIED PROJECTS</h3>
              {profileData.experiences.map((exp, idx) => (
                <div key={idx} className="resume-exp-card">
                  <div className="resume-exp-header">
                    <h4 className="resume-exp-title">{exp.title}</h4>
                    <span className="resume-exp-company">{exp.company}</span>
                  </div>
                  <div className="resume-timeline-date" style={{ marginBottom: 4 }}>{exp.year}</div>
                  <p className="resume-exp-desc">{exp.desc}</p>
                </div>
              ))}
            </div>

            {(profileData.githubUrl || profileData.linkedinUrl) && (
              <div>
                <h3 className="resume-section-title">PORTFOLIO LINKS</h3>
                <div className="dash-profile-links">
                  {profileData.githubUrl && (
                    <a href={profileData.githubUrl} target="_blank" rel="noreferrer">🐙 GitHub Profile</a>
                  )}
                  {profileData.linkedinUrl && (
                    <a href={profileData.linkedinUrl} target="_blank" rel="noreferrer">💼 LinkedIn Profile</a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Verification Workspace */}
      <div className="dash-card">
        <div className="dash-card-header" style={{ marginBottom: 16 }}>
          <div>
            <div className="dash-eyebrow">VERIFICATION ENGINE</div>
            <h2>Active Project Verification Suite</h2>
          </div>
        </div>
        <VerificationTimeline currentStage="verified" />
        <HealthScore overallScore={98} />
        <ProjectEvidence project={projects[0]} />
        <ExecutionLogs containerId="cnt-active-workspace-01" />
        <ReviewRubric onSaveRubric={(rubricData) => {
          const updated = projects.map(p =>
            p.id === projects[0]?.id ? { ...p, score: rubricData.totalScore, status: 'Published' } : p
          );
          onUpdateProjects(updated);
        }} />
      </div>

      {/* Projects Overview */}
      <section className="dash-card">
        <div className="dash-card-header">
          <div>
            <div className="dash-eyebrow">YOUR SHOWCASE</div>
            <h2>Projects Overview ({projects.length})</h2>
          </div>
          <button className="dash-btn-ghost" onClick={() => setActiveTab('projects')}>
            Manage All Projects →
          </button>
        </div>

        <div className="dash-projects-grid">
          {projects.map((proj) => (
            <div key={proj.id} className="dash-project-card">
              <div className="dash-proj-thumb" style={{ backgroundImage: `url(${proj.thumbnail})` }}>
                <span className="dash-proj-cat">{proj.category}</span>
                <span className={`dash-proj-status ${proj.status === 'Published' ? 'published' : 'review'}`}>
                  {proj.status}
                </span>
              </div>
              <div className="dash-proj-body">
                <h4 className="dash-proj-title">{proj.title}</h4>
                <p className="dash-proj-desc">{proj.description}</p>
                <div className="dash-proj-subcat">Tag: {proj.subCategory}</div>
                <div className="dash-proj-footer">
                  <span className="dash-proj-score">✓ Score: {proj.score}/100</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
