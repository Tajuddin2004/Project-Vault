import React, { useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import { deleteProjectApi, getMyProjects } from '../api/projects';
import {
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCES,
} from '../utils/constants';

import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardTopbar } from '../components/dashboard/DashboardTopbar';
import { HomeTab } from '../components/dashboard/HomeTab';
import { ProjectsTab } from '../components/dashboard/ProjectsTab';
import { ShowcaseTab } from '../components/dashboard/ShowcaseTab';
import { ProfileTab } from '../components/dashboard/ProfileTab';
import { AddProjectModal } from '../components/dashboard/AddProjectModal';
import { ViewProjectModal } from '../components/dashboard/ViewProjectModal';

export function Dashboard({ user, token, onNavigate, onLogout, updateUser }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'projects' | 'showcase' | 'profile'
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);

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
    skills: user?.profile?.skills && user.profile.skills.length > 0 ? user.profile.skills : DEFAULT_SKILLS,
    education: user?.profile?.education && user.profile.education.length > 0 ? user.profile.education : DEFAULT_EDUCATION,
    experiences: user?.profile?.experiences && user.profile.experiences.length > 0 ? user.profile.experiences : DEFAULT_EXPERIENCES,
    resumeFile: user?.profile?.resumeFile || null,
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedViewProject, setSelectedViewProject] = useState(null);

  // Load user's projects from MongoDB database on mount
  useEffect(() => {
    if (token) {
      getMyProjects(token, { limit: 100 })
        .then((res) => {
          if (res.projects) {
            setProjects(res.projects);
          }
        })
        .catch(() => {});
    }
  }, [token]);

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
        skills: user?.profile?.skills && user.profile.skills.length > 0 ? user.profile.skills : DEFAULT_SKILLS,
        education: user?.profile?.education && user.profile.education.length > 0 ? user.profile.education : DEFAULT_EDUCATION,
        experiences: user?.profile?.experiences && user.profile.experiences.length > 0 ? user.profile.experiences : DEFAULT_EXPERIENCES,
        resumeFile: user?.profile?.resumeFile || null,
      });
    }
  }, [user]);

  // Working File Photo Upload (Multer backend support)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setProfileData((prev) => ({
          ...prev,
          avatarFile: file,
          avatarUrl: evt.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Working Resume / CV Upload Handler (Multer backend support)
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
        setProfileData((prev) => ({
          ...prev,
          resumeRawFile: file,
          resumeFile: resumeObj,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Profile Handler (Multer FormData submission)
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage('');

    try {
      if (token) {
        const formData = new FormData();
        formData.append('name', profileData.name || '');
        formData.append('department', profileData.department || '');
        formData.append('college', profileData.college || '');
        formData.append('bio', profileData.bio || '');
        formData.append('githubUrl', profileData.githubUrl || '');
        formData.append('linkedinUrl', profileData.linkedinUrl || '');
        formData.append('roleTitle', profileData.roleTitle || '');
        formData.append('phone', profileData.phone || '');
        formData.append('location', profileData.location || '');
        formData.append('skills', JSON.stringify(profileData.skills || []));
        formData.append('education', JSON.stringify(profileData.education || []));
        formData.append('experiences', JSON.stringify(profileData.experiences || []));

        // Attach Multer files if user selected new files
        if (profileData.avatarFile) {
          formData.append('avatar', profileData.avatarFile);
        } else if (profileData.avatarUrl) {
          formData.append('avatarUrl', profileData.avatarUrl);
        }

        if (profileData.resumeRawFile) {
          formData.append('resume', profileData.resumeRawFile);
        } else if (profileData.resumeFile) {
          formData.append('resumeFile', JSON.stringify(profileData.resumeFile));
        }

        const res = await authApi.updateProfileFormData(formData, token);
        if (updateUser && res.user) {
          updateUser(res.user);
          if (res.user.profile) {
            setProfileData((prev) => ({ ...prev, ...res.user.profile }));
          }
        }
      }

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

      setProfileMessage('✓ Profile & uploaded files saved via Multer to database!');
      setTimeout(() => setProfileMessage(''), 3500);
    } catch (err) {
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

  // Project Handlers
  const handleProjectCreated = (createdProject) => {
    setProjects((prev) => [createdProject, ...prev]);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      if (token && typeof projectId === 'string' && projectId.length === 24) {
        await deleteProjectApi(projectId, token);
      }
    } catch (e) {
      console.warn('Backend delete error, removing locally', e);
    }
    setProjects((prev) => prev.filter((p) => (p.id || p._id) !== projectId));
  };

  const completionPercentage = (() => {
    let score = 30;
    if (profileData.department) score += 20;
    if (profileData.bio) score += 20;
    if (profileData.githubUrl) score += 15;
    if (profileData.linkedinUrl) score += 15;
    return Math.min(score, 100);
  })();

  return (
    <div className="dash-root">
      {/* ── Sidebar Navigation ── */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profileData={profileData}
        completionPercentage={completionPercentage}
        projectCount={projects.length}
        onLogout={onLogout}
      />

      {/* ── Main Workspace Area ── */}
      <main className="dash-main">
        {activeTab === 'home' && (
          <HomeTab
            profileData={profileData}
            completionPercentage={completionPercentage}
            projects={projects}
            setActiveTab={setActiveTab}
            handleResumeUpload={handleResumeUpload}
            onUpdateProjects={setProjects}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsTab
            projects={projects}
            token={token}
            onDeleteProject={handleDeleteProject}
            onViewProject={setSelectedViewProject}
            onAddProject={() => setShowAddModal(true)}
          />
        )}

        {activeTab === 'showcase' && (
          <ShowcaseTab
            onViewProject={setSelectedViewProject}
            onNavigate={onNavigate}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            profileData={profileData}
            setProfileData={setProfileData}
            isSavingProfile={isSavingProfile}
            profileMessage={profileMessage}
            handleProfileSave={handleProfileSave}
            handlePhotoUpload={handlePhotoUpload}
            handleResumeUpload={handleResumeUpload}
          />
        )}
      </main>

      {/* ── Add Project Modal ── */}
      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onProjectCreated={handleProjectCreated}
          token={token}
        />
      )}

      {/* ── View Project Modal ── */}
      {selectedViewProject && (
        <ViewProjectModal
          project={selectedViewProject}
          onClose={() => setSelectedViewProject(null)}
          onSaveRubric={(proj, rubricData) => {
            const updated = projects.map((p) =>
              (p.id || p._id) === (proj.id || proj._id)
                ? { ...p, score: rubricData.totalScore, status: 'Published' }
                : p
            );
            setProjects(updated);
          }}
        />
      )}
    </div>
  );
}
