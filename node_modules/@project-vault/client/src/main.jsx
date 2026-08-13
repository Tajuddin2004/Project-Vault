import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import { Logo, VaultLogo } from './components/Logo';
import { VerificationTimeline } from './components/VerificationTimeline';
import { ExecutionLogs } from './components/ExecutionLogs';
import { HealthScore } from './components/HealthScore';
import { ProjectEvidence } from './components/ProjectEvidence';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { authApi } from './api/auth';

// Verified Projects Dataset
const PROJECTS_DATA = [
  {
    id: 'nexora',
    title: 'Nexora AI Engine',
    category: 'AI/ML',
    bannerClass: 'project-card-banner--ai',
    score: 98,
    stars: 230,
    author: 'Elena Rostova',
    authorInitials: 'ER',
    faculty: 'Dr. K. Vance (Computer Vision Lab)',
    tech: ['PyTorch', 'FastAPI', 'CUDA', 'React'],
    shortDesc: 'Edge-optimized neural video segmentation with 4x frame latency reduction for real-time video analytics.',
    fullDesc: 'Nexora AI leverages custom WebAssembly bindings and TensorRT compilation to execute real-time 4K video segmentation directly on edge hardware. Verified by university AI labs.',
    buildLogs: [
      { type: 'cmd', text: 'docker build -t nexora-ai:v2.4 .' },
      { type: 'info', text: 'Step 1/8 : FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime' },
      { type: 'info', text: 'Step 4/8 : RUN python3 -m pytest tests/test_latency.py' },
      { type: 'success', text: '✓ 48/48 GPU benchmark unit tests PASSED (0.012s avg latency)' },
      { type: 'success', text: '✓ Faculty Audit: Certified by Dr. K. Vance' },
    ]
  },
  {
    id: 'ciphershield',
    title: 'CipherShield Audit',
    category: 'Security',
    bannerClass: 'project-card-banner--web3',
    score: 94,
    stars: 185,
    author: 'Marcus Vance',
    authorInitials: 'MV',
    faculty: 'Dr. E. Vance (Cybersecurity Lead)',
    tech: ['Rust', 'Solidity', 'Wasm', 'Go'],
    shortDesc: 'Automated zero-knowledge static analysis and vulnerability auditor for decentralized smart contracts.',
    fullDesc: 'CipherShield parses Abstract Syntax Trees (AST) across EVM bytecode to detect re-entrancy bugs, integer overflows, and unhandled exceptions before deployment.',
    buildLogs: [
      { type: 'cmd', text: 'cargo test --release -- --nocapture' },
      { type: 'info', text: 'Compiling ciphershield-core v1.2.0' },
      { type: 'success', text: '✓ 112 AST static analysis tests PASSED' },
      { type: 'success', text: '✓ Zero critical vulnerabilities detected' },
      { type: 'success', text: '✓ Security Audit Certificate Issued' },
    ]
  },
  {
    id: 'medisync',
    title: 'MediSync Telemetry',
    category: 'Fullstack',
    bannerClass: 'project-card-banner',
    score: 96,
    stars: 142,
    author: 'Aarav Patel',
    authorInitials: 'AP',
    faculty: 'Dr. Aris Thorne (BioMed Tech)',
    tech: ['React', 'Node.js', 'Docker', 'FHIR API'],
    shortDesc: 'AI-driven real-time patient triage & HIPAA-compliant telemetry analyzer for emergency care teams.',
    fullDesc: 'MediSync streams vital signs via encrypted WebSockets to alert attending physicians of acute patient decompensation up to 45 minutes before clinical symptoms manifest.',
    buildLogs: [
      { type: 'cmd', text: 'npm run test:e2e --workspace=telemetry' },
      { type: 'info', text: 'Connecting to synthetic FHIR data stream...' },
      { type: 'success', text: '✓ HIPAA compliance validation test PASSED' },
      { type: 'success', text: '✓ Faculty endorsement confirmed by BioMed Lab' },
    ]
  },
  {
    id: 'devpulse',
    title: 'DevPulse CLI Manager',
    category: 'DevTools',
    bannerClass: 'project-card-banner--dev',
    score: 93,
    stars: 310,
    author: 'Sarah Chen',
    authorInitials: 'SC',
    faculty: 'Prof. H. Sterling (Systems Lab)',
    tech: ['Rust', 'Docker', 'gRPC', 'GraphQL'],
    shortDesc: 'High-throughput local microservice manager for containerized development environments.',
    fullDesc: 'DevPulse synchronizes microservice container dependencies in sub-second time, reducing local environment bootstrap overhead from 15 minutes to under 4 seconds.',
    buildLogs: [
      { type: 'cmd', text: 'devpulse engine spinup --profile=enterprise' },
      { type: 'info', text: 'Spawning 12 isolated Docker containers...' },
      { type: 'success', text: '✓ All container health checks GREEN (3.1s startup)' },
      { type: 'success', text: '✓ Verified by Computer Science Dept' },
    ]
  },
  {
    id: 'urbannest',
    title: 'UrbanNest Analytics',
    category: 'Fullstack',
    bannerClass: 'project-card-banner',
    score: 91,
    stars: 98,
    author: 'Liam O\'Connor',
    authorInitials: 'LO',
    faculty: 'Prof. Maya Lin (Urban Spatial AI)',
    tech: ['Next.js', 'Python', 'PostgreSQL', 'Mapbox'],
    shortDesc: 'Predictive real-time housing affordability and spatial zoning analytics platform.',
    fullDesc: 'Combines satellite data with historical GIS zoning records to model urban housing expansion patterns and predict commercial real estate valuation trends.',
    buildLogs: [
      { type: 'cmd', text: 'pytest spatial_models/test_prediction.py' },
      { type: 'info', text: 'Executing GIS geospatial spatial regression...' },
      { type: 'success', text: '✓ Model confidence score: 94.8% R² score' },
      { type: 'success', text: '✓ Verified on Project Vault Engine' },
    ]
  },
  {
    id: 'aeroflow',
    title: 'AeroFlow Autonomous Swarm',
    category: 'DevTools',
    bannerClass: 'project-card-banner--dev',
    score: 89,
    stars: 115,
    author: 'Kenji Takahashi',
    authorInitials: 'KT',
    faculty: 'Dr. S. Patel (Robotics Inst.)',
    tech: ['C++', 'ROS2', 'React', 'WebSockets'],
    shortDesc: 'Real-time autonomous drone swarm pathfinder & 3D telemetry visualization suite.',
    fullDesc: 'Features decentralized collision avoidance algorithms for multi-agent autonomous drone swarms operating in GPS-denied environments.',
    buildLogs: [
      { type: 'cmd', text: 'colcon test --packages-select aeroflow_core' },
      { type: 'info', text: 'Running Gazebo 3D physics simulation...' },
      { type: 'success', text: '✓ Zero collision events across 1,000 sim hours' },
      { type: 'success', text: '✓ Faculty Audit: Approved for Flight Hardware' },
    ]
  }
];

function HomeShowcase({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProject, setActiveModalProject] = useState(null);

  const categories = ['All', 'AI/ML', 'Security', 'Fullstack', 'DevTools'];

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((project) => {
      const matchesCat = selectedCategory === 'All' || project.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.shortDesc.toLowerCase().includes(query) ||
        project.tech.some((t) => t.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
            <a className="btn btn-secondary btn-sm" href="/signin" onClick={(e) => { e.preventDefault(); onNavigate('/signin'); }}>
              Sign In
            </a>
            <a className="btn btn-primary btn-sm" href="/signup" onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }}>
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
              <a className="btn btn-primary btn-lg" href="/signup" onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }}>
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
                <strong>Helping builders turn projects into proof of work.</strong>
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
                  <VaultLogo className="brand-logo-icon" style={{ width: 14, height: 14 }} />
                  <span>SYSTEM_VERIFIED_BUILD #8942</span>
                </div>
              </div>
              <div className="window-body">
                <div className="featured-project-preview">
                  <div className="preview-badge-row">
                    <div className="score-display">
                      <span className="score-num">98</span>
                      <span className="score-max">/100</span>
                    </div>
                  </div>
                  <div className="preview-title-block">
                    <h3>Nexora AI Engine</h3>
                    <p>Edge-optimized neural video segmentation with CUDA & WebAssembly bindings.</p>
                  </div>
                  <div className="terminal-block">
                    <div className="terminal-line">
                      <span className="term-prompt">$</span>
                      <span className="term-cmd">vault-cli verify --target=repo/nexora</span>
                    </div>
                    <div className="terminal-line">
                      <span className="term-prompt">&gt;</span>
                      <span className="term-info">[INFO] Docker image compiled successfully (1.4s)</span>
                    </div>
                    <div className="terminal-line">
                      <span className="term-prompt">&gt;</span>
                      <span className="term-success">[PASS] 48/48 GPU benchmark tests passed</span>
                    </div>
                    <div className="terminal-line">
                      <span className="term-prompt">&gt;</span>
                      <span className="term-success">[AUDIT] Verified by Dr. K. Vance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-badge floating-badge--top">
              <div className="badge-icon-box badge-icon-box--emerald">✓</div>
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
        <HealthScore overallScore={98} />

        {/* 3. Multi-Layer Evidence Inspector */}
        <ProjectEvidence project={PROJECTS_DATA[0]} />

        {/* 4. Monospace Container Execution Terminal */}
        <ExecutionLogs logs={PROJECTS_DATA[0].buildLogs} containerId="cnt-nexora-v2.4" />
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

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card-item"
              onClick={() => setActiveModalProject(project)}
            >
              <div className={`project-card-banner ${project.bannerClass}`}>
                <div className="banner-top">
                  <span className="category-tag">{project.category}</span>
                  <span className="stars-count">★ {project.stars}</span>
                </div>
                <div className="banner-bottom">
                  <h3 className="project-title-large">{project.title}</h3>
                </div>
              </div>
              <div className="project-card-body">
                <p className="project-desc">{project.shortDesc}</p>
                <div className="tech-stack-row">
                  {project.tech.map((t) => (
                    <span key={t} className="tech-pill">{t}</span>
                  ))}
                </div>
                <div className="project-card-footer">
                  <div className="author-info">
                    <span className="author-avatar">{project.authorInitials}</span>
                    <span className="author-name">{project.author}</span>
                  </div>
                  <div className="health-score-pill">
                    <span>✓</span> {project.score}/100
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Feature / Why Vault Section */}
      <section className="shell" id="why-vault">
        <div className="why-section">
          <div className="why-grid">
            <div className="why-content">
              <h2>Your engineering work deserves more than a standard URL.</h2>
              <p>
                Recruiters receive thousands of generic GitHub links. Project Vault provides verified proof of execution, automated container health scores, and faculty endorsements that get you noticed.
              </p>
              <a className="btn btn-blue btn-lg" href="/signup" onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }}>
                Create Your Verified Vault <span>↗</span>
              </a>
            </div>

            <div className="why-card-panel">
              <div className="panel-header">
                <span>PROJECT HEALTH METRICS</span>
                <span style={{ color: '#94a3b8' }}>LIVE AUDIT</span>
              </div>
              <div className="metrics-row">
                <div>
                  <div className="metric-num">98%</div>
                  <div className="metric-label">Avg Pass Rate</div>
                </div>
                <div>
                  <div className="metric-num">1.4s</div>
                  <div className="metric-label">Build Speed</div>
                </div>
                <div>
                  <div className="metric-num">100%</div>
                  <div className="metric-label">Cloud Isolated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Project Details Modal */}
      {activeModalProject && (
        <div className="modal-backdrop" onClick={() => setActiveModalProject(null)}>
          <div className="modal-card" style={{ maxWidth: 840, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ marginBottom: 16 }}>
              <div>
                <span className="pv-badge pv-badge--emerald" style={{ marginBottom: 6 }}>
                  <span className="pv-indicator-dot" /> FACULTY & CONTAINER VERIFIED
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '4px 0 0' }}>{activeModalProject.title}</h2>
              </div>
              <button className="close-btn" onClick={() => setActiveModalProject(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ margin: '0 0 20px', fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
                {activeModalProject.fullDesc}
              </p>

              {/* 1. Pipeline Verification Timeline */}
              <VerificationTimeline currentStage="verified" />

              {/* 2. Health Score Metric Breakdown */}
              <HealthScore overallScore={activeModalProject.score} />

              {/* 3. Project Multi-Layer Evidence */}
              <ProjectEvidence project={activeModalProject} />

              {/* 4. Real Execution Logs */}
              <ExecutionLogs logs={activeModalProject.buildLogs} containerId={`cnt-${activeModalProject.id}-v2`} />

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <button className="btn btn-outline" onClick={() => setActiveModalProject(null)}>Close Inspector</button>
                <a className="btn btn-primary" href="https://github.com" target="_blank" rel="noreferrer">
                  View Repository Evidence ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-wrapper">
        <div className="shell">
          <div className="footer-top">
            <Logo href="/" onNavigate={onNavigate} />
            <div className="status-indicator">
              All Verification Systems Operational 🟢
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Project Vault Inc. Built for the next generation of engineers.</span>
            <div style={{ display: 'flex', gap: 24 }}>
              <a href="#how-it-works">How It Works</a>
              <a href="#showcase">Explore Showcase</a>
              <a href="#verification">Verification Audit</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [token, setToken] = useState(() => localStorage.getItem('pv_token') || null);
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('pv_user');
    return cached ? JSON.parse(cached) : {
      name: 'Student User',
      email: 'student@projectvault.io',
      role: 'student',
      profile: { department: 'Computer Science', college: 'University' },
    };
  });

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userData, authToken) => {
    if (authToken) {
      localStorage.setItem('pv_token', authToken);
      setToken(authToken);
    }
    if (userData) {
      localStorage.setItem('pv_user', JSON.stringify(userData));
      setUser(userData);
    }
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('pv_token');
    localStorage.removeItem('pv_user');
    setToken(null);
    navigate('/');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('pv_user', JSON.stringify(updatedUser));
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath === '/signin') {
    return <SignIn onNavigate={navigate} onAuthSuccess={handleLoginSuccess} />;
  }

  if (currentPath === '/signup') {
    return <SignUp onNavigate={navigate} onAuthSuccess={handleLoginSuccess} />;
  }

  if (currentPath === '/forgot-password') {
    return <ForgotPassword onNavigate={navigate} />;
  }

  if (currentPath === '/reset-password') {
    return <ResetPassword onNavigate={navigate} />;
  }

  if (currentPath === '/dashboard') {
    return (
      <Dashboard
        user={user}
        token={token}
        onNavigate={navigate}
        onLogout={handleLogout}
        updateUser={updateUser}
      />
    );
  }

  return <HomeShowcase onNavigate={navigate} user={user} />;
}

createRoot(document.getElementById('root')).render(<App />);
