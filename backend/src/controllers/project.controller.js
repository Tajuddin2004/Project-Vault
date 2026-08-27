import Project from '../models/Project.js';
import User from '../models/User.js';
import { fileUrl } from '../middleware/upload.middleware.js';

// ── POST /api/projects  ────────────────────────────────────────────────────────
// Creates a new project, associates it with the authenticated user.
// Accepts multipart/form-data with optional `zipFile` file field.
export async function createProject(req, res, next) {
  try {
    const owner = req.user; // set by requireAuth middleware
    const {
      title, category, subCategory, description,
      readme, githubUrl, liveUrl, thumbnailUrl, technologies,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required.' });
    }

    const projectData = {
      ownerId:    owner._id,
      ownerName:  owner.name,
      title:      title.trim(),
      category,
      subCategory: subCategory || '',
      description: description || '',
      readme:      readme || '',
      githubUrl:   githubUrl || '',
      liveUrl:     liveUrl || '',
      thumbnailUrl: thumbnailUrl || '',
      technologies: technologies
        ? (Array.isArray(technologies) ? technologies : technologies.split(',').map(t => t.trim()))
        : [],
      status: 'pending_verification',
      healthScore: 95,
    };

    // Attach uploaded file info if multer processed a file
    if (req.file) {
      projectData.zipFileUrl  = fileUrl(req, req.file);
      projectData.zipFileName = req.file.originalname;
    }

    const project = await Project.create(projectData);

    // Push project ref into the user's projects array
    await User.findByIdAndUpdate(owner._id, { $push: { projects: project._id } });

    res.status(201).json({ message: 'Project created successfully.', project });
  } catch (error) {
    next(error);
  }
}

// ── GET /api/projects  ─────────────────────────────────────────────────────────
// Global search / browse. Supports ?q= for text search, ?category=, ?status=.
export async function listProjects(req, res, next) {
  try {
    const { q, category, subCategory, status, page = 1, limit = 6 } = req.query;

    const filter = {};

    if (q && q.trim()) {
      filter.$text = { $search: q.trim() };
    }
    if (category    && category    !== 'All') filter.category    = category;
    if (subCategory && subCategory !== 'All') filter.subCategory = subCategory;
    if (status      && status      !== 'All') filter.status      = status;

    const pageNum  = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 6;
    const skip     = (pageNum - 1) * limitNum;

    const total = await Project.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum) || 1;

    const projects = await Project.find(filter)
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-readme');

    res.json({ projects, total, page: pageNum, limit: limitNum, totalPages });
  } catch (error) {
    next(error);
  }
}

export async function myProjects(req, res, next) {
  try {
    const { q, category, subCategory, status, page = 1, limit = 6 } = req.query;
    const filter = { ownerId: req.user._id };

    if (q && q.trim()) {
      filter.$or = [
        { title:       { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
        { subCategory: { $regex: q.trim(), $options: 'i' } },
      ];
    }
    if (category    && category    !== 'All') filter.category    = category;
    if (subCategory && subCategory !== 'All') filter.subCategory = subCategory;
    if (status      && status      !== 'All') filter.status      = status;

    const pageNum  = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 6;
    const skip     = (pageNum - 1) * limitNum;

    const total = await Project.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum) || 1;

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({ projects, total, page: pageNum, limit: limitNum, totalPages });
  } catch (error) {
    next(error);
  }
}

// ── GET /api/projects/:projectId  ─────────────────────────────────────────────
export async function getProject(req, res, next) {
  try {
    const project = await Project.findById(req.params.projectId).populate('ownerId', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ project });
  } catch (error) {
    next(error);
  }
}

// ── DELETE /api/projects/:projectId  ──────────────────────────────────────────
export async function deleteProject(req, res, next) {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    // Only owner or admin may delete
    if (project.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorised to delete this project.' });
    }

    await project.deleteOne();
    // Remove ref from user's projects array
    await User.findByIdAndUpdate(req.user._id, { $pull: { projects: project._id } });

    res.json({ message: 'Project deleted.' });
  } catch (error) {
    next(error);
  }
}
