import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import repoRoutes from './repoRoutes.js';
import chatRoutes from './chatRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import memoryRoutes from './memoryRoutes.js';
import mcpRoutes from './mcpRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/repos', repoRoutes);
router.use('/chat', chatRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/memory', memoryRoutes);
router.use('/mcp', mcpRoutes);

export default router;
