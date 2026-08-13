import { Router } from 'express';
import { createProject, getProject, listProjects } from '../controllers/project.controller.js';
const router = Router();
router.get('/', listProjects);
router.post('/', createProject);
router.get('/:projectId', getProject);
export default router;
