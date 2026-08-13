import React, { useState, useEffect, useRef } from 'react';
import { Logo, VaultLogo } from '../components/Logo';
import { VerificationTimeline } from '../components/VerificationTimeline';
import { ExecutionLogs } from '../components/ExecutionLogs';
import { HealthScore } from '../components/HealthScore';
import { ProjectEvidence } from '../components/ProjectEvidence';
import { ReviewRubric } from '../components/ReviewRubric';
import { authApi } from '../api/auth';

const CATEGORIES_CONFIG = {
  'Technology': ['AI & Machine Learning', 'Cloud & Systems', 'Web3 & Security', 'Fullstack & Web', 'DevTools & CLI'],
  'Medical': ['BioMed Telemetry', 'Clinical AI Triage', 'Health Informatics', 'Medical Imaging'],
  'Real Estate': ['Spatial GIS Analytics', 'PropTech Automation', 'Housing Valuation', 'Zoning Insights'],
};

export function Dashboard({ user, token, onNavigate, onLogout, updateUser }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'projects' | 'showcase' | 'profile'
  const [projects, setProjects] = useState([
    {
      id: 'proj-1',
      title: 'Nexora AI Engine',
      category: 'Technology',
      subCategory: 'AI & Machine Learning',
      description: 'Edge-optimized neural video segmentation with CUDA & WebAssembly bindings.',
      readme: '# Nexora AI Engine\nReal-time 4K video segmentation executed on edge hardware.',
      githubUrl: 'https://github.com/example/nexora-ai',
      liveUrl: 'https://nexora.dev',
      score: 98,
      status: 'Published',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    },
    {
      id: 'proj-2',
      title: 'MediSync Telemetry',
      category: 'Medical',
      subCategory: 'BioMed Telemetry',
      description: 'AI-driven real-time patient triage & HIPAA-compliant telemetry analyzer.',
      readme: '# MediSync Telemetry\nStreams vital signs via encrypted WebSockets for patient triage.',
      githubUrl: 'https://github.com/example/medisync',
      liveUrl: 'https://medisync.health',
      score: 96,
      status: 'In Review',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    },
  ]);

  // Futuristic Profile Edit State
  const fileInputRef = useRef(null);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.profile?.department || '',
    college: user?.profile?.college || '',
    bio: user?.profile?.bio || '',
    githubUrl: user?.profile?.githubUrl || '',
    linkedinUrl: user?.profile?.linkedinUrl || '',
    avatarUrl: user?.profile?.avatarUrl || '',
    roleTitle: user?.profile?.roleTitle || 'SOFTWARE ENGINEER & AI RESEARCHER',
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || '',
    skills: user?.profile?.skills && user.profile.skills.length > 0
      ? user.profile.skills
      : ['UI/UX Design', 'Fullstack Web', 'Python & PyTorch', 'Systems & Rust', 'Docker & Cloud'],
    education: user?.profile?.education && user.profile.education.length > 0
      ? user.profile.education
      : [
          { year: '2024 - 2026', degree: 'GRADUATION / B.TECH', inst: 'University' },
          { year: '2022 - 2024', degree: 'HIGHER SECONDARY CS', inst: 'Science Academy' }
        ],
    experiences: user?.profile?.experiences && user.profile.experiences.length > 0
      ? user.profile.experiences
      : [
          { year: '2025 - CURRENT', title: 'PROJECT VAULT BUILDER', company: 'PROJECT VAULT LABS', desc: 'Designing automated container execution pipelines and zero-knowledge student proof badges.' }
        ],
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Add Project Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProj, setNewProj] = useState({
    title: '',
    category: 'Technology',
    subCategory: 'AI & Machine Learning',
    description: '',
    readme: '',
    githubUrl: '',
    liveUrl: '',
    thumbnail: '',
    zipFileName: '',
  });
  // Filter & Search State for Projects Page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedViewProject, setSelectedViewProject] = useState(null);

  // Sync state if user prop updates
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        department: user.profile?.department || '',
        college: user.profile?.college || '',
        bio: user.profile?.bio || '',
        githubUrl: user.profile?.githubUrl || '',
        linkedinUrl: user.profile?.linkedinUrl || '',
        avatarUrl: user.profile?.avatarUrl || '',
        roleTitle: user.profile?.roleTitle || 'SOFTWARE ENGINEER & AI RESEARCHER',
        phone: user.profile?.phone || '',
        location: user.profile?.location || '',
        skills: user.profile?.skills && user.profile.skills.length > 0
          ? user.profile.skills
          : ['UI/UX Design', 'Fullstack Web', 'Python & PyTorch', 'Systems & Rust', 'Docker & Cloud'],
        education: user.profile?.education && user.profile.education.length > 0
          ? user.profile.education
          : [
              { year: '2024 - 2026', degree: 'GRADUATION / B.TECH', inst: 'University' },
              { year: '2022 - 2024', degree: 'HIGHER SECONDARY CS', inst: 'Science Academy' }
            ],
        experiences: user.profile?.experiences && user.profile.experiences.length > 0
          ? user.profile.experiences
          : [
              { year: '2025 - CURRENT', title: 'PROJECT VAULT BUILDER', company: 'PROJECT VAULT LABS', desc: 'Designing automated container execution pipelines and zero-knowledge student proof badges.' }
            ],
        resumeFile: user.profile?.resumeFile || null,
      });
    }
  }, [user]);

  // Working File Photo Upload from Phone / Laptop
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setProfileData((prev) => ({ ...prev, avatarUrl: evt.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Working Resume / CV Upload Handler (PDF, DOC, DOCX)
  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const resumeObj = {
          name: file.name,
          dataUrl: evt.target.result,
          size: (file.size / 1024).toFixed(1) + ' KB',
          uploadDate: new Date().toLocaleDateString(),
        };
        setProfileData((prev) => ({ ...prev, resumeFile: resumeObj }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Skills Editor Handlers
  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!profileData.skills.includes(newSkillInput.trim())) {
      setProfileData((prev) => ({ ...prev, skills: [...prev.skills, newSkillInput.trim()] }));
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Education Timeline Item Handlers
  const handleAddEdu = () => {
    setProfileData((prev) => ({
      ...prev,
      education: [...prev.education, { year: '2024 - 2026', degree: 'GRADUATION / DEGREE', inst: 'University Name' }],
    }));
  };

  const handleUpdateEdu = (index, field, val) => {
    const updated = [...profileData.education];
    updated[index][field] = val;
    setProfileData((prev) => ({ ...prev, education: updated }));
  };

  const handleRemoveEdu = (index) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Experience Timeline Item Handlers
  const handleAddExp = () => {
    setProfileData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, { year: '2025 - CURRENT', title: 'JOB TITLE / ROLE', company: 'COMPANY / ORGANISATION', desc: 'Key responsibility & achievements.' }],
    }));
  };

  const handleUpdateExp = (index, field, val) => {
    const updated = [...profileData.experiences];
    updated[index][field] = val;
    setProfileData((prev) => ({ ...prev, experiences: updated }));
  };

  const handleRemoveExp = (index) => {
    setProfileData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  // Save Profile Handler (API + Session Storage + State)
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage('');

    try {
      if (token) {
        const res = await authApi.updateProfile({
          name: profileData.name,
          department: profileData.department,
          college: profileData.college,
          bio: profileData.bio,
          githubUrl: profileData.githubUrl,
          linkedinUrl: profileData.linkedinUrl,
          avatarUrl: profileData.avatarUrl,
          roleTitle: profileData.roleTitle,
          phone: profileData.phone,
          location: profileData.location,
          skills: profileData.skills,
          education: profileData.education,
          experiences: profileData.experiences,
          resumeFile: profileData.resumeFile,
        }, token);
        if (updateUser && res.user) {
          updateUser(res.user);
        }
      }

      // Persist locally in session & localStorage
      const updatedUser = {
        ...(user || {}),
        name: profileData.name,
        email: profileData.email,
        profile: {
          ...(user?.profile || {}),
          ...profileData,
        },
      };
      if (updateUser) updateUser(updatedUser);
      localStorage.setItem('pv_user', JSON.stringify(updatedUser));

      setProfileMessage('✓ Profile saved to database & local session!');
      setTimeout(() => setProfileMessage(''), 3500);
    } catch (err) {
      // Fallback local save if offline or token expired
      const updatedUser = {
        ...(user || {}),
        name: profileData.name,
        email: profileData.email,
        profile: {
          ...(user?.profile || {}),
          ...profileData,
        },
      };
      if (updateUser) updateUser(updatedUser);
      localStorage.setItem('pv_user', JSON.stringify(updatedUser));

      setProfileMessage('✓ Profile saved locally to session!');
      setTimeout(() => setProfileMessage(''), 3500);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProj.title.trim()) return;

    const created = {
      id: `proj-${Date.now()}`,
      title: newProj.title.trim(),
      category: newProj.category,
      subCategory: newProj.subCategory,
      description: newProj.description || 'Uploaded engineering project showcase.',
      readme: newProj.readme || `# ${newProj.title}\nProject documentation draft.`,
      githubUrl: newProj.githubUrl || 'https://github.com',
      liveUrl: newProj.liveUrl || '',
      score: 95,
      status: 'Pending Verification',
      thumbnail: newProj.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    };

    setProjects([created, ...projects]);
    setShowAddModal(false);
    setNewProj({
      title: '',
      category: 'Technology',
      subCategory: 'AI & Machine Learning',
      description: '',
      readme: '',
      githubUrl: '',
      liveUrl: '',
      thumbnail: '',
      zipFileName: '',
    });
  };

  // Completion score calculation
  const completionPercentage = (() => {
    let score = 30; // base name & email
    if (profileData.department) score += 20;
    if (profileData.bio) score += 20;
    if (profileData.githubUrl) score += 15;
    if (profileData.linkedinUrl) score += 15;
    return Math.min(score, 100);
  })();

  return (
    <div className="dash-root">
      {/* ── Sidebar Navigation ── */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <div className="dash-brand-logo" onClick={() => onNavigate('/')}>
            <VaultLogo style={{ width: 28, height: 28 }} />
            <span className="dash-brand-text">PROJECT VAULT</span>
          </div>
        </div>

        <nav className="dash-nav">
          <button
            className={`dash-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            aria-label="Home Workspace"
          >
            <div className="dash-nav-item-content">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Home</span>
            </div>
            <span className="dash-nav-badge">LIVE</span>
          </button>

          <button
            className={`dash-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
            aria-label="Projects Management"
          >
            <div className="dash-nav-item-content">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Projects</span>
            </div>
            <span className="dash-nav-badge">{projects.length}</span>
          </button>

          <button
            className={`dash-nav-item ${activeTab === 'showcase' ? 'active' : ''}`}
            onClick={() => setActiveTab('showcase')}
            aria-label="Visit Public Projects Showcase"
          >
            <div className="dash-nav-item-content">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span>Visit Projects</span>
            </div>
            <span className="dash-nav-badge">↗</span>
          </button>

          <button
            className={`dash-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            aria-label="Student Profile Settings"
          >
            <div className="dash-nav-item-content">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Profile</span>
            </div>
            <span className="dash-nav-badge">{completionPercentage}%</span>
          </button>
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user-pill">
            <div className="dash-user-avatar">
              {(profileData.name || profileData.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="dash-user-info">
              <span className="dash-user-name">{profileData.name || profileData.email || 'Student User'}</span>
              <span className="dash-user-role">Student Engineer</span>
            </div>
          </div>
          <button className="dash-logout-btn" onClick={onLogout} title="Sign Out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main Workspace Area ── */}
      <main className="dash-main">
        {/* Top bar */}
        <header className="dash-topbar">
          <div className="dash-topbar-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="pv-badge pv-badge--emerald">
                <span className="pv-indicator-dot pv-indicator-dot--active" /> VERIFIED WORKSPACE ACTIVE
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>
              {activeTab === 'home' && `Welcome back, ${profileData.name || 'Student Builder'} 👋`}
              {activeTab === 'projects' && 'Project Management & Import'}
              {activeTab === 'showcase' && 'Verified Public Showcase'}
              {activeTab === 'profile' && 'Student Profile Settings'}
            </h1>
            <p style={{ margin: 0, color: '#64748b' }}>
              {activeTab === 'home' && 'Manage your verified project telemetry, container builds, and portfolio identity'}
              {activeTab === 'projects' && 'Import, view, and organize your repositories with container execution history'}
              {activeTab === 'showcase' && 'Explore top verified student engineering projects across university departments'}
              {activeTab === 'profile' && 'Update your bio, photo, skills, education, and verified credentials'}
            </p>
          </div>

          <div className="dash-topbar-actions">
            {activeTab === 'projects' && (
              <button className="dash-btn-primary" onClick={() => setShowAddModal(true)}>
                <span>+ Add New Project</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            )}
          </div>
        </header>

        {/* ── HOME TAB: FUTURISTIC INTERACTIVE RESUME PREVIEW ── */}
        {activeTab === 'home' && (
          <div className="dash-content-stack">
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
                {/* Left Column: Skills & Education */}
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

                {/* Right Column: Bio & Experience */}
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

                  {/* Portfolio Links */}
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

            {/* ── LIVE VERIFICATION WORKSPACE IN-PAGE INSPECTOR ── */}
            <div className="dash-card">
              <div className="dash-card-header" style={{ marginBottom: 16 }}>
                <div>
                  <div className="dash-eyebrow">VERIFICATION ENGINE</div>
                  <h2>Active Project Verification Suite</h2>
                </div>
              </div>

              {/* 1. Verification Timeline */}
              <VerificationTimeline currentStage="verified" />

              {/* 2. Health Score Metric Breakdown */}
              <HealthScore overallScore={98} />

              {/* 3. Multi-Layer Evidence Inspector */}
              <ProjectEvidence project={projects[0]} />

              {/* 4. Monospace Execution Terminal */}
              <ExecutionLogs containerId="cnt-active-workspace-01" />

              {/* 5. Faculty Structured Review Rubric */}
              <ReviewRubric onSaveRubric={(rubricData) => {
                const updated = projects.map(p => p.id === projects[0]?.id ? { ...p, score: rubricData.totalScore, status: 'Published' } : p);
                setProjects(updated);
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
                    <div
                      className="dash-proj-thumb"
                      style={{ backgroundImage: `url(${proj.thumbnail})` }}
                    >
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
                        <button
                          className="dash-btn-view"
                          onClick={() => setSelectedViewProject(proj)}
                        >
                          View Showcase →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {activeTab === 'projects' && (() => {
          const filteredProjects = projects.filter((proj) => {
            const matchesSearch =
              proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              proj.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCat = selectedCategory === 'All' || proj.category === selectedCategory;
            const matchesStat = selectedStatus === 'All' || proj.status === selectedStatus;
            return matchesSearch && matchesCat && matchesStat;
          });

          return (
            <div className="dash-content-stack">
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <div className="dash-eyebrow">MANAGEMENT</div>
                    <h2>All Uploaded Projects ({filteredProjects.length})</h2>
                  </div>
                </div>

                {/* Search & Category Filter Bar */}
                <div className="dash-filter-bar">
                  <div className="dash-search-input-wrap">
                    <svg className="dash-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search projects by title, stack, keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="dash-search-input"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="dash-filter-select"
                  >
                    <option value="All">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Medical">Medical</option>
                    <option value="Real Estate">Real Estate</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="dash-filter-select"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="In Review">In Review</option>
                    <option value="Pending Verification">Pending Verification</option>
                  </select>

                  {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All') && (
                    <button
                      className="dash-btn-ghost btn-sm"
                      onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedStatus('All'); }}
                    >
                      Clear Filters ✕
                    </button>
                  )}
                </div>

                {/* Projects Displayed as Cards */}
                {filteredProjects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                    <p style={{ margin: 0, fontWeight: 600 }}>No projects match your search filters.</p>
                  </div>
                ) : (
                  <div className="dash-projects-grid">
                    {filteredProjects.map((proj) => (
                      <div key={proj.id} className="dash-project-card">
                        <div
                          className="dash-proj-thumb"
                          style={{ backgroundImage: `url(${proj.thumbnail})` }}
                        >
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
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <button
                                className="dash-btn-view"
                                onClick={() => setSelectedViewProject(proj)}
                              >
                                View Showcase →
                              </button>
                              <button
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                                onClick={() => setProjects(projects.filter(p => p.id !== proj.id))}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ── SHOWCASE TAB ── */}
        {activeTab === 'showcase' && (
          <div className="dash-content-stack">
            <div className="dash-card">
              <div className="dash-card-header">
                <h2>Public Showcase Gallery</h2>
                <button className="dash-btn-ghost" onClick={() => onNavigate('/')}>
                  View Full Public Site ↗
                </button>
              </div>
              <p style={{ color: '#64748b', margin: '0 0 20px' }}>
                Your published projects appear in this curated list for recruiters and faculty.
              </p>

              <div className="dash-projects-grid">
                {projects.map((proj) => (
                  <div key={proj.id} className="dash-project-card">
                    <div className="dash-proj-thumb" style={{ backgroundImage: `url(${proj.thumbnail})` }}>
                      <span className="dash-proj-cat">{proj.category}</span>
                    </div>
                    <div className="dash-proj-body">
                      <h4 className="dash-proj-title">{proj.title}</h4>
                      <p className="dash-proj-desc">{proj.description}</p>
                      <div className="dash-proj-footer">
                        <span className="dash-proj-score">★ {proj.score}/100</span>
                        <button className="dash-btn-view" onClick={() => setSelectedViewProject(proj)}>
                          View Project →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE TAB: FUTURISTIC INTERACTIVE EDITOR ── */}
        {activeTab === 'profile' && (
          <div className="dash-content-stack">
            <div className="dash-card" style={{ maxWidth: 760 }}>
              <div className="dash-card-header">
                <div>
                  <div className="dash-eyebrow">PORTFOLIO EDITOR</div>
                  <h2>Futuristic Student Profile Editor</h2>
                </div>
              </div>

              {profileMessage && (
                <div className="dash-alert-msg">{profileMessage}</div>
              )}

              <form onSubmit={handleProfileSave} className="dash-form">
                {/* 1. Working Photo Upload Zone */}
                <div className="avatar-upload-zone">
                  <div
                    className="avatar-upload-preview"
                    style={profileData.avatarUrl ? { backgroundImage: `url(${profileData.avatarUrl})` } : {}}
                  >
                    {!profileData.avatarUrl && (profileData.name || profileData.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 6px', fontSize: '0.9375rem', color: '#0b192c' }}>Profile Photo</h4>
                    <p style={{ margin: '0 0 12px', fontSize: '0.8125rem', color: '#64748b' }}>
                      Upload high-resolution headshot photo from your phone or laptop.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handlePhotoUpload}
                    />
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="dash-btn-primary btn-sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        📷 Upload Photo from Device
                      </button>
                      {profileData.avatarUrl && (
                        <button
                          type="button"
                          className="dash-btn-ghost btn-sm"
                          onClick={() => setProfileData({ ...profileData, avatarUrl: '' })}
                          style={{ color: '#ef4444' }}
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Personal Details */}
                <div className="dash-form-row">
                  <div className="dash-form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="dash-input"
                    />
                  </div>

                  <div className="dash-form-group">
                    <label>Specialization / Role Title</label>
                    <input
                      type="text"
                      placeholder="e.g. SOFTWARE ENGINEER & AI RESEARCHER"
                      value={profileData.roleTitle}
                      onChange={(e) => setProfileData({ ...profileData, roleTitle: e.target.value })}
                      className="dash-input"
                    />
                  </div>
                </div>

                <div className="dash-form-row">
                  <div className="dash-form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={profileData.email}
                      className="dash-input"
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                  </div>

                  <div className="dash-form-group">
                    <label>Phone Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. +1 (234) 097-864"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="dash-input"
                    />
                  </div>
                </div>

                <div className="dash-form-row">
                  <div className="dash-form-group">
                    <label>Location / City</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="dash-input"
                    />
                  </div>

                  <div className="dash-form-group">
                    <label>Department / Major</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Engineering"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      className="dash-input"
                    />
                  </div>
                </div>

                <div className="dash-form-group">
                  <label>College / University</label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford University"
                    value={profileData.college}
                    onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                    className="dash-input"
                  />
                </div>

                <div className="dash-form-group">
                  <label>Career Objective / Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your technical focus and engineering background..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="dash-input"
                  />
                </div>

                {/* 3. Interactive Skills Manager */}
                <div className="dash-form-group">
                  <label>Technical Skills & Capabilities</label>
                  <div className="resume-skills-list" style={{ marginBottom: 10 }}>
                    {profileData.skills.map((sk, idx) => (
                      <span key={idx} className="resume-skill-tag" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        {sk}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(sk)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, fontSize: '0.75rem', fontWeight: 800 }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Add new skill (e.g. PyTorch, Rust, UI/UX)..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(e); }}
                      className="dash-input"
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="dash-btn-ghost" onClick={handleAddSkill}>
                      + Add Skill
                    </button>
                  </div>
                </div>

                {/* 4. Interactive Education Timeline Editor */}
                <div className="dash-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ margin: 0 }}>Education Timeline</label>
                    <button type="button" className="dash-btn-ghost btn-sm" onClick={handleAddEdu}>
                      + Add Node
                    </button>
                  </div>

                  {profileData.education.map((edu, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 10 }}>
                      <div className="dash-form-row">
                        <input
                          type="text"
                          placeholder="Year Range (e.g. 2024 - 2026)"
                          value={edu.year}
                          onChange={(e) => handleUpdateEdu(idx, 'year', e.target.value)}
                          className="dash-input"
                        />
                        <input
                          type="text"
                          placeholder="Degree Title (e.g. B.Tech CS)"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEdu(idx, 'degree', e.target.value)}
                          className="dash-input"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <input
                          type="text"
                          placeholder="University / Institution Name"
                          value={edu.inst}
                          onChange={(e) => handleUpdateEdu(idx, 'inst', e.target.value)}
                          className="dash-input"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEdu(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '0.8125rem' }}
                        >
                          Delete Node
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 5. Interactive Experience & Verified Work Editor */}
                <div className="dash-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ margin: 0 }}>Experience & Verified Projects</label>
                    <button type="button" className="dash-btn-ghost btn-sm" onClick={handleAddExp}>
                      + Add Item
                    </button>
                  </div>

                  {profileData.experiences.map((exp, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 10 }}>
                      <div className="dash-form-row">
                        <input
                          type="text"
                          placeholder="Year Range (e.g. 2025 - CURRENT)"
                          value={exp.year}
                          onChange={(e) => handleUpdateExp(idx, 'year', e.target.value)}
                          className="dash-input"
                        />
                        <input
                          type="text"
                          placeholder="Role / Job Title"
                          value={exp.title}
                          onChange={(e) => handleUpdateExp(idx, 'title', e.target.value)}
                          className="dash-input"
                        />
                      </div>
                      <div className="dash-form-row" style={{ marginTop: 8 }}>
                        <input
                          type="text"
                          placeholder="Company / Labs"
                          value={exp.company}
                          onChange={(e) => handleUpdateExp(idx, 'company', e.target.value)}
                          className="dash-input"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExp(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '0.8125rem', textAlign: 'right' }}
                        >
                          Delete Item
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Description of technical work & achievements..."
                        value={exp.desc}
                        onChange={(e) => handleUpdateExp(idx, 'desc', e.target.value)}
                        className="dash-input"
                        style={{ marginTop: 8 }}
                      />
                    </div>
                  ))}
                </div>

                {/* 6. Resume & CV Management */}
                <div className="dash-form-group" style={{ background: '#f8fafc', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <label style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
                        📄 Verified Resume & CV Document
                      </label>
                      <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: '#64748b' }}>
                        Upload your resume in PDF or Word format (.pdf, .doc, .docx). You can download it at any time.
                      </p>
                    </div>

                    {profileData.resumeFile && (
                      <span className="pv-badge pv-badge--emerald">
                        <span className="pv-indicator-dot" /> VERIFIED ATTACHMENT
                      </span>
                    )}
                  </div>

                  {profileData.resumeFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: 12, borderRadius: 10, border: '1px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                          📄
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.875rem', color: '#0f172a' }}>
                            {profileData.resumeFile.name}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Size: {profileData.resumeFile.size} · Uploaded: {profileData.resumeFile.uploadDate}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <a
                          href={profileData.resumeFile.dataUrl}
                          download={profileData.resumeFile.name || `${profileData.name || 'Student'}_Resume.pdf`}
                          className="dash-btn-primary btn-sm"
                          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          <span>📥 Download</span>
                        </a>

                        <label className="dash-btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
                          <span>Replace</span>
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display: 'none' }} />
                        </label>

                        <button
                          type="button"
                          className="dash-btn-ghost btn-sm"
                          onClick={() => setProfileData({ ...profileData, resumeFile: null })}
                          style={{ color: '#ef4444' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ border: '2px dashed #cbd5e1', borderRadius: 12, padding: 20, textAlign: 'center', background: '#ffffff' }}>
                      <div style={{ fontSize: '1.75rem', marginBottom: 6 }}>📤</div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '0.9375rem', color: '#0f172a' }}>No Resume Uploaded Yet</h4>
                      <p style={{ margin: '0 0 12px', fontSize: '0.8125rem', color: '#64748b' }}>
                        Upload your technical resume (PDF or Word, max 10MB) to make it available for faculty & recruiters.
                      </p>
                      <label className="dash-btn-primary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span>Upload Resume File</span>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display: 'none' }} />
                      </label>
                    </div>
                  )}
                </div>

                {/* 7. Social URLs */}
                <div className="dash-form-row">
                  <div className="dash-form-group">
                    <label>GitHub Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={profileData.githubUrl}
                      onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                      className="dash-input"
                    />
                  </div>

                  <div className="dash-form-group">
                    <label>LinkedIn Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={profileData.linkedinUrl}
                      onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                      className="dash-input"
                    />
                  </div>
                </div>

                <button type="submit" className="dash-btn-primary" disabled={isSavingProfile} style={{ width: '100%', marginTop: 8 }}>
                  {isSavingProfile ? 'Saving Profile...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── ADD NEW PROJECT MODAL ── */}
      {showAddModal && (
        <div className="dash-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="dash-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h2>Add New Project</h2>
              <button className="dash-close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="dash-form">
              <div className="dash-form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AeroFlow Autonomous Swarm"
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  className="dash-input"
                />
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Category *</label>
                  <select
                    value={newProj.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const sub = CATEGORIES_CONFIG[cat][0];
                      setNewProj({ ...newProj, category: cat, subCategory: sub });
                    }}
                    className="dash-input"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Medical">Medical</option>
                    <option value="Real Estate">Real Estate</option>
                  </select>
                </div>

                <div className="dash-form-group">
                  <label>Sub-Category *</label>
                  <select
                    value={newProj.subCategory}
                    onChange={(e) => setNewProj({ ...newProj, subCategory: e.target.value })}
                    className="dash-input"
                  >
                    {CATEGORIES_CONFIG[newProj.category].map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="dash-form-group">
                <label>Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief high-level summary of what your project accomplishes..."
                  value={newProj.description}
                  onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                  className="dash-input"
                />
              </div>

              <div className="dash-form-group">
                <label>GitHub Repository URL (Primary Import)</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repo-name"
                  value={newProj.githubUrl}
                  onChange={(e) => setNewProj({ ...newProj, githubUrl: e.target.value })}
                  className="dash-input"
                />
              </div>

              <div className="dash-form-group">
                <label>Working / Live Demo Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://myproject.demo.com"
                  value={newProj.liveUrl}
                  onChange={(e) => setNewProj({ ...newProj, liveUrl: e.target.value })}
                  className="dash-input"
                />
              </div>

              <div className="dash-form-group">
                <label>Thumbnail Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProj.thumbnail}
                  onChange={(e) => setNewProj({ ...newProj, thumbnail: e.target.value })}
                  className="dash-input"
                />
              </div>

              <div className="dash-modal-footer">
                <button type="button" className="dash-btn-ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-btn-primary">
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIEW PROJECT MODAL WITH VERIFICATION SUITE ── */}
      {selectedViewProject && (
        <div className="dash-modal-backdrop" onClick={() => setSelectedViewProject(null)}>
          <div className="dash-modal-card" style={{ maxWidth: 880, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header" style={{ marginBottom: 16 }}>
              <div>
                <span className="pv-badge pv-badge--emerald" style={{ marginBottom: 6 }}>
                  <span className="pv-indicator-dot" /> {selectedViewProject.category} · {selectedViewProject.subCategory}
                </span>
                <h2 style={{ margin: '4px 0 0', fontSize: '1.75rem', fontWeight: 900 }}>{selectedViewProject.title}</h2>
              </div>
              <button className="dash-close-btn" onClick={() => setSelectedViewProject(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ margin: 0, color: '#475569', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                {selectedViewProject.description}
              </p>

              {/* 1. Verification Pipeline Step Indicator */}
              <VerificationTimeline currentStage={selectedViewProject.status === 'Published' ? 'published' : 'verified'} />

              {/* 2. Empirical Health Score Metric Breakdown */}
              <HealthScore overallScore={selectedViewProject.score || 96} />

              {/* 3. Multi-Layer Evidence Inspector */}
              <ProjectEvidence project={selectedViewProject} />

              {/* 4. Monospace Container Execution Terminal */}
              <ExecutionLogs containerId={`cnt-${selectedViewProject.id}`} />

              {/* 5. Faculty Structured Review Rubric Toolkit */}
              <ReviewRubric onSaveRubric={(rubricData) => {
                const updated = projects.map(p => p.id === selectedViewProject.id ? { ...p, score: rubricData.totalScore, status: 'Published' } : p);
                setProjects(updated);
              }} />

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <button className="dash-btn-ghost" onClick={() => setSelectedViewProject(null)}>
                  Close Inspector
                </button>
                {selectedViewProject.githubUrl && (
                  <a href={selectedViewProject.githubUrl} target="_blank" rel="noreferrer" className="dash-btn-primary">
                    View Git Evidence ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
