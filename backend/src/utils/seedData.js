import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Project from '../models/Project.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/project_vault';

const USERS_SEED = [
  {
    name: 'Elena Rostova',
    email: 'elena@projectvault.io',
    password: 'Password123!',
    role: 'student',
    profile: {
      department: 'Computer Vision & AI Lab',
      college: 'Stanford University',
      roleTitle: 'AI RESEARCHER & EDGE COMPUTING LEAD',
      bio: 'Pioneering neural video segmentation and Wasm edge inference algorithms.',
      githubUrl: 'https://github.com/elena-rostova',
      linkedinUrl: 'https://linkedin.com/in/elena-rostova',
      skills: ['PyTorch', 'FastAPI', 'CUDA', 'React', 'WebAssembly'],
    },
  },
  {
    name: 'Marcus Vance',
    email: 'marcus@projectvault.io',
    password: 'Password123!',
    role: 'student',
    profile: {
      department: 'Cybersecurity & Web3 Lab',
      college: 'MIT Dept of EECS',
      roleTitle: 'ZERO-KNOWLEDGE SECURITY AUDITOR',
      bio: 'Static analysis and smart contract auditing for EVM bytecode.',
      githubUrl: 'https://github.com/marcus-vance',
      linkedinUrl: 'https://linkedin.com/in/marcus-vance',
      skills: ['Rust', 'Solidity', 'Wasm', 'Go', 'Zero-Knowledge Proofs'],
    },
  },
  {
    name: 'Aarav Patel',
    email: 'aarav@projectvault.io',
    password: 'Password123!',
    role: 'student',
    profile: {
      department: 'BioMed Tech & Informatics',
      college: 'Carnegie Mellon University',
      roleTitle: 'CLINICAL TELEMETRY SOFTWARE ENGINEER',
      bio: 'Real-time patient telemetry streaming and HIPAA-compliant AI triage.',
      githubUrl: 'https://github.com/aarav-patel',
      linkedinUrl: 'https://linkedin.com/in/aarav-patel',
      skills: ['React', 'Node.js', 'Docker', 'FHIR API', 'WebSockets'],
    },
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@projectvault.io',
    password: 'Password123!',
    role: 'student',
    profile: {
      department: 'Systems Engineering & Cloud',
      college: 'UC Berkeley EECS',
      roleTitle: 'SYSTEMS ARCHITECT & DISTRIBUTED DEVTLS',
      bio: 'High-throughput microservice engines and containerized local orchestration.',
      githubUrl: 'https://github.com/sarah-chen',
      linkedinUrl: 'https://linkedin.com/in/sarah-chen',
      skills: ['Rust', 'Docker', 'gRPC', 'GraphQL', 'Kubernetes'],
    },
  },
  {
    name: 'Kenji Takahashi',
    email: 'kenji@projectvault.io',
    password: 'Password123!',
    role: 'student',
    targetProjects: 20,
    profile: {
      department: 'Autonomous Systems & Robotics',
      college: 'ETH Zürich Robotics Inst.',
      roleTitle: 'ROBOTICS SWARM PATHFINDING LEAD',
      bio: 'Decentralized collision avoidance for multi-agent autonomous drone swarms.',
      githubUrl: 'https://github.com/kenji-takahashi',
      linkedinUrl: 'https://linkedin.com/in/kenji-takahashi',
      skills: ['C++', 'ROS2', 'React', 'WebSockets', 'Gazebo 3D'],
    },
  },
  {
    name: 'Tajuddin Green',
    email: 'tajuddin.green@gmail.com',
    password: 'Password123!',
    role: 'student',
    targetProjects: 5,
    profile: {
      department: 'Computer Science & AI Engineering',
      college: 'Project Vault Labs',
      roleTitle: 'FULLSTACK & AI SYSTEMS ENGINEER',
      bio: 'Building enterprise container execution engines and verified student showcase portfolios.',
      githubUrl: 'https://github.com/Tajuddin2004',
      linkedinUrl: 'https://linkedin.com/in/tajuddin',
      skills: ['React', 'Node.js', 'MongoDB', 'Python', 'Docker'],
    },
  },
];

// Subcategories by Category
const CATEGORIES = {
  Technology: ['AI & Machine Learning', 'Cloud & Systems', 'Web3 & Security', 'Fullstack & Web', 'DevTools & CLI'],
  Medical: ['BioMed Telemetry', 'Clinical AI Triage', 'Health Informatics', 'Medical Imaging'],
  'Real Estate': ['Spatial GIS Analytics', 'PropTech Automation', 'Housing Valuation', 'Zoning Insights'],
};

const SAMPLE_THUMBNAILS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
];

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB.');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('✓ Cleared previous database collections.');

    const createdUsers = [];

    for (const userData of USERS_SEED) {
      const passwordHash = await bcrypt.hash(userData.password, 10);

      const user = await User.create({
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role,
        isEmailVerified: true,
        profile: userData.profile,
        projects: [],
      });

      console.log(`✓ Created User: ${user.name} (${user.email})`);

      const userProjectIds = [];
      const numProjects = userData.targetProjects || 20;

      // Generate target projects for user
      for (let i = 1; i <= numProjects; i++) {
        const catKeys = Object.keys(CATEGORIES);
        const category = catKeys[i % catKeys.length];
        const subCats = CATEGORIES[category];
        const subCategory = subCats[i % subCats.length];
        const score = Math.floor(88 + Math.random() * 12);

        const project = await Project.create({
          ownerId: user._id,
          ownerName: user.name,
          title: `${user.name.split(' ')[0]}'s ${subCategory} System #${i}`,
          category,
          subCategory,
          description: `High-performance ${subCategory.toLowerCase()} implementation built by ${user.name} for enterprise benchmark suite #${i}.`,
          readme: `# ${user.name.split(' ')[0]}'s Project #${i}\nDetailed documentation for ${subCategory}.`,
          thumbnailUrl: SAMPLE_THUMBNAILS[i % SAMPLE_THUMBNAILS.length],
          githubUrl: `${user.profile.githubUrl}/project-${i}`,
          liveUrl: `https://demo-project-${i}.${user.name.split(' ')[0].toLowerCase()}.io`,
          technologies: user.profile.skills,
          status: i % 3 === 0 ? 'pending_verification' : 'published',
          healthScore: score,
        });

        userProjectIds.push(project._id);
      }

      // Update user with their 20 project references
      user.projects = userProjectIds;
      await user.save();
      console.log(`  └─ Created ${userProjectIds.length} associated projects for ${user.name}`);

      createdUsers.push({
        name: user.name,
        email: user.email,
        password: userData.password,
        role: user.role,
        projectsCount: userProjectIds.length,
      });
    }

    // Write USER_CREDENTIALS.md file for the user
    const credentialsContent = `# 🔑 Project Vault — User Credentials & Test Accounts

Generated on: ${new Date().toLocaleString()}

All accounts below have been seeded into the MongoDB database with **20 projects each** (total **100 projects**).

| Name | Email | Password | Role | Projects |
|---|---|---|---|---|
${createdUsers
  .map(
    (u) =>
      `| **${u.name}** | \`${u.email}\` | \`${u.password}\` | \`${u.role}\` | **${u.projectsCount} Projects** |`
  )
  .join('\n')}

---

### How to Test:
1. Use any of the email & password pairs above to log in via the **Sign In** page.
2. In the **Projects** tab, you will see their **20 projects** paginated **4 projects per page** (5 pages total).
3. In the **Visit Projects / Showcase** tab, you will see all **100 global projects** paginated **4 projects per page** (25 pages total) with author profile cards and sub-category filtering.
`;

    const credentialsFilePath = path.join(__dirname, '../../../USER_CREDENTIALS.md');
    fs.writeFileSync(credentialsFilePath, credentialsContent);
    console.log(`\n✓ Credentials file written to: ${credentialsFilePath}`);

    console.log('\n✅ Data Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seed();
