import React, { useState, useRef } from 'react';
import { CATEGORIES_CONFIG } from '../../utils/constants';
import { createProjectApi } from '../../api/projects';

export function AddProjectModal({ onClose, onProjectCreated, token }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [newProj, setNewProj] = useState({
    title: '',
    category: 'Technology',
    subCategory: 'AI & Machine Learning',
    description: '',
    githubUrl: '',
    liveUrl: '',
    thumbnail: '',
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProj.title.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      // Build FormData payload for multipart/form-data upload
      const formData = new FormData();
      formData.append('title', newProj.title.trim());
      formData.append('category', newProj.category);
      formData.append('subCategory', newProj.subCategory);
      formData.append('description', newProj.description);
      formData.append('githubUrl', newProj.githubUrl);
      formData.append('liveUrl', newProj.liveUrl);
      formData.append('thumbnailUrl', newProj.thumbnail);

      if (selectedFile) {
        formData.append('zipFile', selectedFile);
      }

      let createdProject;
      if (token) {
        const res = await createProjectApi(formData, token);
        createdProject = res.project;
      } else {
        // Fallback local creation if operating unauthenticated
        createdProject = {
          id: `proj-${Date.now()}`,
          title: newProj.title.trim(),
          category: newProj.category,
          subCategory: newProj.subCategory,
          description: newProj.description || 'Uploaded engineering project showcase.',
          githubUrl: newProj.githubUrl || 'https://github.com',
          liveUrl: newProj.liveUrl || '',
          score: 95,
          status: 'Pending Verification',
          thumbnail: newProj.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
          zipFileName: selectedFile ? selectedFile.name : '',
        };
      }

      onProjectCreated(createdProject);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to publish project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-modal-backdrop" onClick={onClose}>
      <div className="dash-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="dash-modal-header">
          <h2>Add New Project</h2>
          <button className="dash-close-btn" onClick={onClose}>✕</button>
        </div>

        {errorMsg && (
          <div className="dash-alert-msg" style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="dash-form">
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

          {/* Project Source Code / Archive File Upload */}
          <div className="dash-form-group" style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px dashed #cbd5e1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, margin: '0 0 6px' }}>
              <span>📦 Upload Project Archive / Code File (.zip, .tar, .rar)</span>
            </label>
            <p style={{ margin: '0 0 10px', fontSize: '0.8125rem', color: '#64748b' }}>
              Upload source code archive or demo asset (max 50MB). Stored securely on server via Multer.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".zip,.rar,.tar,.gz,image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {selectedFile ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  📄 {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="dash-btn-ghost btn-sm"
                onClick={() => fileInputRef.current?.click()}
                style={{ width: '100%' }}
              >
                + Choose Zip / Code File from Device
              </button>
            )}
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
            <button type="button" className="dash-btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="dash-btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
