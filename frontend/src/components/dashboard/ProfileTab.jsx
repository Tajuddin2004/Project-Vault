import React, { useRef, useState } from 'react';

export function ProfileTab({
  profileData,
  setProfileData,
  isSavingProfile,
  profileMessage,
  handleProfileSave,
  handlePhotoUpload,
  handleResumeUpload,
}) {
  const fileInputRef = useRef(null);
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!profileData.skills.includes(newSkillInput.trim())) {
      setProfileData((prev) => ({ ...prev, skills: [...prev.skills, newSkillInput.trim()] }));
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skillToRemove) }));
  };

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
    setProfileData((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

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
    setProfileData((prev) => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));
  };

  return (
    <div className="dash-content-stack">
      <div className="dash-card" style={{ maxWidth: 760 }}>
        <div className="dash-card-header">
          <div>
            <div className="dash-eyebrow">PORTFOLIO EDITOR</div>
            <h2>Futuristic Student Profile Editor</h2>
          </div>
        </div>

        {profileMessage && <div className="dash-alert-msg">{profileMessage}</div>}

        <form onSubmit={handleProfileSave} className="dash-form">
          {/* 1. Photo Upload */}
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
              <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="button" className="dash-btn-primary btn-sm" onClick={() => fileInputRef.current?.click()}>
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
              <input type="text" required value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="dash-input" />
            </div>
            <div className="dash-form-group">
              <label>Specialization / Role Title</label>
              <input type="text" placeholder="e.g. SOFTWARE ENGINEER & AI RESEARCHER" value={profileData.roleTitle} onChange={(e) => setProfileData({ ...profileData, roleTitle: e.target.value })} className="dash-input" />
            </div>
          </div>

          <div className="dash-form-row">
            <div className="dash-form-group">
              <label>Email Address</label>
              <input type="email" disabled value={profileData.email} className="dash-input" style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="dash-form-group">
              <label>Phone Number (Optional)</label>
              <input type="text" placeholder="e.g. +1 (234) 097-864" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="dash-input" />
            </div>
          </div>

          <div className="dash-form-row">
            <div className="dash-form-group">
              <label>Location / City</label>
              <input type="text" placeholder="e.g. San Francisco, CA" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} className="dash-input" />
            </div>
            <div className="dash-form-group">
              <label>Department / Major</label>
              <input type="text" placeholder="e.g. Computer Engineering" value={profileData.department} onChange={(e) => setProfileData({ ...profileData, department: e.target.value })} className="dash-input" />
            </div>
          </div>

          <div className="dash-form-group">
            <label>College / University</label>
            <input type="text" placeholder="e.g. Stanford University" value={profileData.college} onChange={(e) => setProfileData({ ...profileData, college: e.target.value })} className="dash-input" />
          </div>

          <div className="dash-form-group">
            <label>Career Objective / Bio</label>
            <textarea rows={3} placeholder="Describe your technical focus and engineering background..." value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} className="dash-input" />
          </div>

          {/* 3. Skills Manager */}
          <div className="dash-form-group">
            <label>Technical Skills & Capabilities</label>
            <div className="resume-skills-list" style={{ marginBottom: 10 }}>
              {profileData.skills.map((sk, idx) => (
                <span key={idx} className="resume-skill-tag" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                  {sk}
                  <button type="button" onClick={() => handleRemoveSkill(sk)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, fontSize: '0.75rem', fontWeight: 800 }}>✕</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" placeholder="Add new skill (e.g. PyTorch, Rust, UI/UX)..." value={newSkillInput} onChange={(e) => setNewSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(e); }} className="dash-input" style={{ flex: 1 }} />
              <button type="button" className="dash-btn-ghost" onClick={handleAddSkill}>+ Add Skill</button>
            </div>
          </div>

          {/* 4. Education Timeline Editor */}
          <div className="dash-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ margin: 0 }}>Education Timeline</label>
              <button type="button" className="dash-btn-ghost btn-sm" onClick={handleAddEdu}>+ Add Node</button>
            </div>
            {profileData.education.map((edu, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 10 }}>
                <div className="dash-form-row">
                  <input type="text" placeholder="Year Range (e.g. 2024 - 2026)" value={edu.year} onChange={(e) => handleUpdateEdu(idx, 'year', e.target.value)} className="dash-input" />
                  <input type="text" placeholder="Degree Title (e.g. B.Tech CS)" value={edu.degree} onChange={(e) => handleUpdateEdu(idx, 'degree', e.target.value)} className="dash-input" />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input type="text" placeholder="University / Institution Name" value={edu.inst} onChange={(e) => handleUpdateEdu(idx, 'inst', e.target.value)} className="dash-input" style={{ flex: 1 }} />
                  <button type="button" onClick={() => handleRemoveEdu(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '0.8125rem' }}>Delete Node</button>
                </div>
              </div>
            ))}
          </div>

          {/* 5. Experience Editor */}
          <div className="dash-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ margin: 0 }}>Experience & Verified Projects</label>
              <button type="button" className="dash-btn-ghost btn-sm" onClick={handleAddExp}>+ Add Item</button>
            </div>
            {profileData.experiences.map((exp, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 10 }}>
                <div className="dash-form-row">
                  <input type="text" placeholder="Year Range (e.g. 2025 - CURRENT)" value={exp.year} onChange={(e) => handleUpdateExp(idx, 'year', e.target.value)} className="dash-input" />
                  <input type="text" placeholder="Role / Job Title" value={exp.title} onChange={(e) => handleUpdateExp(idx, 'title', e.target.value)} className="dash-input" />
                </div>
                <div className="dash-form-row" style={{ marginTop: 8 }}>
                  <input type="text" placeholder="Company / Labs" value={exp.company} onChange={(e) => handleUpdateExp(idx, 'company', e.target.value)} className="dash-input" />
                  <button type="button" onClick={() => handleRemoveExp(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '0.8125rem', textAlign: 'right' }}>Delete Item</button>
                </div>
                <textarea rows={2} placeholder="Description of technical work & achievements..." value={exp.desc} onChange={(e) => handleUpdateExp(idx, 'desc', e.target.value)} className="dash-input" style={{ marginTop: 8 }} />
              </div>
            ))}
          </div>

          {/* 6. Resume Manager */}
          <div className="dash-form-group" style={{ background: '#f8fafc', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <label style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>📄 Verified Resume & CV Document</label>
                <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: '#64748b' }}>Upload your resume in PDF or Word format (.pdf, .doc, .docx). You can download it at any time.</p>
              </div>
              {profileData.resumeFile && (
                <span className="pv-badge pv-badge--emerald"><span className="pv-indicator-dot" /> VERIFIED ATTACHMENT</span>
              )}
            </div>

            {profileData.resumeFile ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: 12, borderRadius: 10, border: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>📄</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: '#0f172a' }}>{profileData.resumeFile.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Size: {profileData.resumeFile.size} · Uploaded: {profileData.resumeFile.uploadDate}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={profileData.resumeFile.dataUrl} download={profileData.resumeFile.name || `${profileData.name || 'Student'}_Resume.pdf`} className="dash-btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span>📥 Download</span>
                  </a>
                  <label className="dash-btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
                    <span>Replace</span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display: 'none' }} />
                  </label>
                  <button type="button" className="dash-btn-ghost btn-sm" onClick={() => setProfileData({ ...profileData, resumeFile: null })} style={{ color: '#ef4444' }}>Remove</button>
                </div>
              </div>
            ) : (
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: 12, padding: 20, textAlign: 'center', background: '#ffffff' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: 6 }}>📤</div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.9375rem', color: '#0f172a' }}>No Resume Uploaded Yet</h4>
                <p style={{ margin: '0 0 12px', fontSize: '0.8125rem', color: '#64748b' }}>Upload your technical resume (PDF or Word, max 10MB) to make it available for faculty & recruiters.</p>
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
              <input type="url" placeholder="https://github.com/username" value={profileData.githubUrl} onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })} className="dash-input" />
            </div>
            <div className="dash-form-group">
              <label>LinkedIn Profile URL</label>
              <input type="url" placeholder="https://linkedin.com/in/username" value={profileData.linkedinUrl} onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })} className="dash-input" />
            </div>
          </div>

          <button type="submit" className="dash-btn-primary" disabled={isSavingProfile} style={{ width: '100%', marginTop: 8 }}>
            {isSavingProfile ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
