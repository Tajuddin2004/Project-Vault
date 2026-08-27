import React, { useState, useEffect, useMemo } from 'react';
import { Logo, VaultLogo } from '../components/Logo';
import { VerificationTimeline } from '../components/VerificationTimeline';
import { ExecutionLogs } from '../components/ExecutionLogs';
import { HealthScore } from '../components/HealthScore';
import { ProjectEvidence } from '../components/ProjectEvidence';
import { ViewProjectModal } from '../components/dashboard/ViewProjectModal';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicFooter } from '../components/navigation/PublicFooter';
import { listGlobalProjects } from '../api/projects';

const SAMPLE_PROJECT = {
  id: 'nexora-v2.4',
  _id: 'nexora-v2.4',
  title: 'Nexora AI Video Segmenter',
  ownerName: 'Elena Rostova',
  author: 'Elena Rostova',
  faculty: 'Stanford AI Research',
  category: 'AI/ML',
  subCategory: 'AI & Machine Learning',
  healthScore: 98,
  score: 98,
  shortDesc: 'Real-time multi-object neural segmenter compiled to WebAssembly for edge video analytics.',
  description: 'Real-time multi-object neural segmenter compiled to WebAssembly for edge video analytics.',
  tech: ['PyTorch', 'FastAPI', 'CUDA', 'React', 'WebAssembly'],
  technologies: ['PyTorch', 'FastAPI', 'CUDA', 'React', 'WebAssembly'],
  thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
  thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
  githubUrl: 'https://github.com/elena-rostova/nexora-ai',
  evidence: {
    github: true,
    docker: true,
    tests: true,
    staticAnalysis: true,
  },
  buildLogs: [
    '[0.00s] Initializing isolated Docker build context...',
    '[0.04s] Pulling base image nvidia/cuda:12.0.0-devel-ubuntu22.04...',
    '[0.12s] AST Analysis: 0 critical vulnerabilities found across 42 modules.',
    '[0.28s] Executing pytest integration suite: 100% test coverage passed.',
    '[0.45s] Compiling WebAssembly bindings... Build status 200 SUCCESS.',
  ],
};

const LANDING_FALLBACK_PROJECTS = [
  SAMPLE_PROJECT,
  {
    id: 'ciphershield-v1',
    _id: 'ciphershield-v1',
    title: 'CipherShield ZK Verifier',
    ownerName: 'Marcus Vance',
    author: 'Marcus Vance',
    faculty: 'MIT EECS',
    category: 'Security',
    subCategory: 'Web3 & Security',
    healthScore: 96,
    score: 96,
    shortDesc: 'Zero-knowledge static analysis engine for smart contract Bytecode validation.',
    description: 'Zero-knowledge static analysis engine for smart contract Bytecode validation.',
    tech: ['Rust', 'Solidity', 'Wasm', 'Go'],
    technologies: ['Rust', 'Solidity', 'Wasm', 'Go'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    githubUrl: 'https://github.com/marcus-vance/ciphershield',
  },
  {
    id: 'medisync-telemetry',
    _id: 'medisync-telemetry',
    title: 'MediSync Telemetry Engine',
    ownerName: 'Aarav Patel',
    author: 'Aarav Patel',
    faculty: 'Carnegie Mellon University',
    category: 'Medical',
    subCategory: 'BioMed Telemetry',
    healthScore: 95,
    score: 95,
    shortDesc: 'Clinical streaming telemetry engine with automated HIPAA-compliant FHIR API parsing.',
    description: 'Clinical streaming telemetry engine with automated HIPAA-compliant FHIR API parsing.',
    tech: ['React', 'Node.js', 'Docker', 'FHIR API'],
    technologies: ['React', 'Node.js', 'Docker', 'FHIR API'],
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    githubUrl: 'https://github.com/aarav-patel/medisync',
  },
  {
    id: 'devpulse-orchestrator',
    _id: 'devpulse-orchestrator',
    title: 'DevPulse Microservice Engine',
    ownerName: 'Sarah Chen',
    author: 'Sarah Chen',
    faculty: 'UC Berkeley EECS',
    category: 'DevTools',
    subCategory: 'DevTools & CLI',
    healthScore: 94,
    score: 94,
    shortDesc: 'High-throughput gRPC microservice orchestrator for local containerized development.',
    description: 'High-throughput gRPC microservice orchestrator for local containerized development.',
    tech: ['Rust', 'Docker', 'gRPC', 'Kubernetes'],
    technologies: ['Rust', 'Docker', 'gRPC', 'Kubernetes'],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    githubUrl: 'https://github.com/sarah-chen/devpulse',
  },
];

export function HomeShowcase({ onNavigate, user }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [dbProjects, setDbProjects] = useState([]);

  const categories = ['All', 'AI/ML', 'Security', 'Fullstack', 'DevTools', 'Medical'];

  useEffect(() => {
    let isMounted = true;
    listGlobalProjects({ limit: 12 })
      .then((res) => {
        if (isMounted && res.projects && res.projects.length > 0) {
          setDbProjects(res.projects);
        }
      })
      .catch(() => { });
    return () => {
      isMounted = false;
    };
  }, []);

  const projectsToDisplay = dbProjects.length > 0 ? dbProjects : LANDING_FALLBACK_PROJECTS;

  const filteredProjects = useMemo(() => {
    return projectsToDisplay.filter((project) => {
      const cat = project.category || 'Fullstack';
      const matchesCat =
        selectedCategory === 'All' ||
        cat.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'AI/ML' && (cat === 'Technology' || cat === 'AI/ML')) ||
        (selectedCategory === 'DevTools' && (cat === 'Technology' || cat === 'DevTools'));

      const query = searchQuery.toLowerCase();
      const title = (project.title || '').toLowerCase();
      const desc = (project.shortDesc || project.description || '').toLowerCase();
      const techList = project.technologies || project.tech || [];
      const matchesSearch =
        title.includes(query) ||
        desc.includes(query) ||
        techList.some((t) => t.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });
  }, [projectsToDisplay, selectedCategory, searchQuery]);

  return (
    <div className="app-root">
      {/* Navigation Header */}
      <header className="header-wrapper">
        <nav className="nav shell" aria-label="Main Navigation">
          <Logo href="/" onNavigate={onNavigate} />
          <div className="nav__links">
            <a href="#how-it-works">How It Works</a>
            <a href="#showcase">Explore Showcase</a>
            <a href="#verification">Verification Audit</a>
            <a href="#why-vault">Why Project Vault</a>
          </div>
          <div className="nav__actions">
            <a
              className="btn btn-secondary btn-sm"
              href="/signin"
              onClick={(e) => { e.preventDefault(); onNavigate('/signin'); }}
            >
              Sign In
            </a>
            <a
              className="btn btn-primary btn-sm"
              href="/signup"
              onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }}
            >
              Get Started <span>↗</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section shell" id="how-it-works">
        <div className="hero-bg-grid" />
        <div className="hero-grid">
          <div className="hero-content">
            <h1>
              Turn your projects into <span className="gradient-text">verified proof.</span>
            </h1>
            <p className="hero-description">
              Bring your code out of cold repositories. Project Vault provides automated container builds, security scans, and faculty audit credentials for next-gen builders.
            </p>
            <div className="hero-actions">
              <a
                className="btn btn-primary btn-lg"
                href="/signup"
                onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }}
              >
                Submit Your Project <span>↗</span>
              </a>
              <a className="btn btn-outline btn-lg" href="#showcase">
                Explore Showcase <span>↓</span>
              </a>
            </div>
            <div className="hero-proof-bar">
              <div className="avatar-group">
                <span className="avatar-pill avatar-pill--1">ER</span>
                <span className="avatar-pill avatar-pill--2">MV</span>
                <span className="avatar-pill avatar-pill--3">AP</span>
                <span className="avatar-pill avatar-pill--4">SC</span>
              </div>
              <div className="proof-text">
                <strong>1,400+ Verified Builds</strong> from Stanford, MIT & CMU labs
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card-window">
              <div className="window-header">
                <div className="window-dots">
                  <span className="window-dot window-dot--red" />
                  <span className="window-dot window-dot--yellow" />
                  <span className="window-dot window-dot--green" />
                </div>
                <div className="window-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
                  </svg>
                  <span>CONTAINER_PIPELINE.DOCKERFILE</span>
                </div>
              </div>
              <div className="window-body">
                <div className="terminal-block">
                  <div className="terminal-line">
                    <span className="term-prompt">$</span>
                    <span className="term-cmd">FROM nvidia/cuda:12.0.0-devel-ubuntu22.04</span>
                  </div>
                  <div className="terminal-line">
                    <span className="term-prompt">$</span>
                    <span className="term-cmd">WORKDIR /workspace/nexora</span>
                  </div>
                  <div className="terminal-line">
                    <span className="term-dim"># Inject empirical health telemetry AST auditor</span>
                  </div>
                  <div className="terminal-line">
                    <span className="term-prompt">$</span>
                    <span className="term-cmd">RUN cargo build --release --target wasm32-wasi</span>
                  </div>
                  <div className="terminal-line">
                    <span className="term-prompt">$</span>
                    <span className="term-success">CMD ["project-vault", "inspect", "--strict"]</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-badge floating-badge--top">
              <div className="badge-icon-box">✓</div>
              <div className="badge-details">
                <small>HEALTH SCORE</small>
                <strong>98 / 100 (A+)</strong>
              </div>
            </div>

            <div className="floating-badge floating-badge--bottom">
              <div className="badge-icon-box badge-icon-box--blue">⚡</div>
              <div className="badge-details">
                <small>CONTAINER TIME</small>
                <strong>0.012s Latency</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partners Banner */}
      <section className="trusted-section">
        <div className="shell trusted-content">
          <p>BUILT FOR DISCOVERY ACROSS LEADING INSTITUTIONS</p>
          <div className="trusted-logos">
            <span className="partner-logo">MIT COMPUTER SCIENCE</span>
            <span className="partner-logo">STANFORD AI LAB</span>
            <span className="partner-logo">CARNEGIE MELLON</span>
            <span className="partner-logo">UC BERKELEY EECS</span>
            <span className="partner-logo">ETH ZÜRICH</span>
          </div>
        </div>
      </section>

      {/* Automated Live Verification Workspace Inspector Section */}
      <section className="section shell" id="verification">
        <div className="section-header" style={{ marginBottom: 24 }}>
          <h2>Interactive Engineering Execution Inspector</h2>
          <p>Real-time container execution telemetry, empirical code health breakdown, and multi-layer proof inspector.</p>
        </div>

        {/* 1. Verification Timeline Component */}
        <VerificationTimeline currentStage="verified" />

        {/* 2. Empirical Health Score Metric Breakdown */}
        <HealthScore overallScore={SAMPLE_PROJECT.healthScore} />

        {/* 3. Multi-Layer Evidence Inspector */}
        <ProjectEvidence project={SAMPLE_PROJECT} />

        {/* 4. Monospace Container Execution Terminal */}
        <ExecutionLogs logs={SAMPLE_PROJECT.buildLogs} containerId="cnt-nexora-v2.4" />
      </section>

      {/* Showcase & Real-Time Search / Filter */}
      <section className="section shell" id="showcase">
        <div className="showcase-header">
          <div>
            <h2 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800 }}>Explore Verified Work</h2>
          </div>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, stack (e.g. PyTorch, Rust, React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="showcase-controls">
          <div className="filter-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' ? 'All Projects' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="dash-projects-grid">
          {filteredProjects.map((proj) => {
            const authorName = proj.ownerName || proj.author || 'Verified Builder';
            const initial = authorName.charAt(0).toUpperCase();

            return (
              <div
                key={proj.id || proj._id}
                className="dash-project-card"
                onClick={() => setActiveModalProject(proj)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="dash-proj-thumb"
                  style={{
                    backgroundImage: `url(${proj.thumbnailUrl || proj.thumbnail || SAMPLE_PROJECT.thumbnail})`,
                  }}
                >
                  <span className="dash-proj-cat">{proj.category}</span>
                </div>

                <div className="dash-proj-body">
                  <h4 className="dash-proj-title">{proj.title}</h4>
                  <p className="dash-proj-desc">{proj.shortDesc || proj.description}</p>
                  {proj.subCategory && (
                    <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, marginTop: 4 }}>
                      Tag: {proj.subCategory}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8125rem', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}>
                      {initial}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {authorName}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {proj.faculty || 'Verified Student Engineer'}
                      </span>
                    </div>
                  </div>

                  <div className="dash-proj-footer" style={{ marginTop: 12 }}>
                    <span className="dash-proj-score">★ {proj.score || proj.healthScore || 96}/100</span>
                    <button className="dash-btn-view" onClick={(e) => { e.stopPropagation(); setActiveModalProject(proj); }}>
                      View Project →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section" id="why-vault">
        <div className="shell footer-content">
          <div className="footer-brand">
            <div className="footer-logo" onClick={() => onNavigate('/')} style={{ cursor: 'pointer' }}>
              <VaultLogo style={{ width: 24, height: 24 }} />
              <span>PROJECT VAULT</span>
            </div>
            <p>Verified engineering telemetry, container execution proofs, and faculty credentials for next-gen student builders.</p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>EXPLORE</h4>
              <a href="/explore" onClick={(e) => { e.preventDefault(); onNavigate('/explore'); }}>
                Project Directory
              </a>
              <a href="/leaderboard" onClick={(e) => { e.preventDefault(); onNavigate('/leaderboard'); }}>
                University Leaderboard
              </a>
              <a href="/analytics" onClick={(e) => { e.preventDefault(); onNavigate('/analytics'); }}>
                Telemetry Analytics
              </a>
            </div>

            <div className="footer-col">
              <h4>ACADEMICS</h4>
              <a href="/faculty-reviews" onClick={(e) => { e.preventDefault(); onNavigate('/faculty-reviews'); }}>
                Faculty Audit Portal
              </a>
              <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('/about'); }}>
                Architecture & Vision
              </a>
              <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}>
                Help & Support
              </a>
            </div>

            <div className="footer-col">
              <h4>ACCOUNT</h4>
              <a href="/signin" onClick={(e) => { e.preventDefault(); onNavigate('/signin'); }}>
                Student Sign In
              </a>
              <a href="/signup" onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }}>
                Register Vault Account
              </a>
              <a href="/dashboard" onClick={(e) => { e.preventDefault(); onNavigate('/dashboard'); }}>
                Workspace Dashboard
              </a>
            </div>
          </div>
        </div>

        <div className="shell footer-bottom">
          <span>© 2026 Project Vault Labs. All rights reserved. Enterprise-grade execution telemetry.</span>
        </div>
      </footer>

      {/* View Project Inspector Modal */}
      {activeModalProject && (
        <ViewProjectModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </div>
  );
}
