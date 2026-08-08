import { Router } from 'express';
import { getTools } from '../controllers/mcpController.js';
import { requireAuth, attachAccessToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, attachAccessToken);
router.get('/tools', getTools);

export default router;
