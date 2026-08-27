import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  myProjects,
} from '../controllers/project.controller.js';

const router = Router();

// Public routes
router.get('/', listProjects); // Global search & browse

// Authenticated user routes
router.get('/mine', requireAuth, myProjects); // User's own projects search
router.post('/', requireAuth, upload.single('zipFile'), createProject); // Add project with multer zip upload
router.get('/:projectId', getProject);
router.delete('/:projectId', requireAuth, deleteProject);

export default router;
