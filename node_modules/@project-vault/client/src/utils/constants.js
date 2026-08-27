// ─────────────────────────────────────────────────────────────────────────────
// Project Vault — Global Constants
// All shared, static data lives here. Import what you need in each module.
// ─────────────────────────────────────────────────────────────────────────────

// ── Password Reset ────────────────────────────────────────────────────────────
/** Token validity window shown to the user on the Reset Password page. */
export const RESET_MINUTES = 30;

// ── Project Categories ────────────────────────────────────────────────────────
/** Category → sub-category mapping used in the Add Project modal and filters. */
export const CATEGORIES_CONFIG = {
  Technology: [
    'AI & Machine Learning',
    'Cloud & Systems',
    'Web3 & Security',
    'Fullstack & Web',
    'DevTools & CLI',
  ],
  Medical: [
    'BioMed Telemetry',
    'Clinical AI Triage',
    'Health Informatics',
    'Medical Imaging',
  ],
  'Real Estate': [
    'Spatial GIS Analytics',
    'PropTech Automation',
    'Housing Valuation',
    'Zoning Insights',
  ],
};

// ── Verification Pipeline Stages ──────────────────────────────────────────────
/** Ordered stages of the Project Vault verification pipeline. */
export const VERIFICATION_STAGES = [
  { id: 'imported',  label: 'Imported',  desc: 'Git Hook Connected'        },
  { id: 'analyzed',  label: 'Analyzed',  desc: 'AST & Dependencies'        },
  { id: 'built',     label: 'Built',     desc: 'Docker Image Compiled'     },
  { id: 'executed',  label: 'Executed',  desc: 'Unit Tests & Scans'        },
  { id: 'verified',  label: 'Verified',  desc: 'Proof Telemetry Saved'     },
  { id: 'reviewed',  label: 'Reviewed',  desc: 'Faculty Evaluation'        },
  { id: 'published', label: 'Published', desc: 'Public Credible Proof'     },
];

// ── Showcase / Landing Page Projects ─────────────────────────────────────────
/** Sample verified projects displayed on the landing page showcase. */
export const PROJECTS_DATA = [];

// ── Default Dashboard Project Seeds ──────────────────────────────────────────
/** Seed projects shown in the Dashboard on first load (empty by default, loaded from MongoDB). */
export const DEFAULT_PROJECTS = [];

// ── Default Profile Seeds ─────────────────────────────────────────────────────
/** Default skill tags shown when a new user hasn't set any skills yet. */
export const DEFAULT_SKILLS = [
  'UI/UX Design',
  'Fullstack Web',
  'Python & PyTorch',
  'Systems & Rust',
  'Docker & Cloud',
];

/** Default education timeline entries shown for a new user profile. */
export const DEFAULT_EDUCATION = [
  { year: '2024 - 2026', degree: 'GRADUATION / B.TECH', inst: 'University' },
  { year: '2022 - 2024', degree: 'HIGHER SECONDARY CS', inst: 'Science Academy' },
];

/** Default experience entries shown for a new user profile. */
export const DEFAULT_EXPERIENCES = [
  {
    year: '2025 - CURRENT',
    title: 'PROJECT VAULT BUILDER',
    company: 'PROJECT VAULT LABS',
    desc: 'Designing automated container execution pipelines and zero-knowledge student proof badges.',
  },
];
