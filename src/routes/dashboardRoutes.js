import { Router } from 'express';
import { getStats } from '../controllers/dashboardController.js';
import { requireAuth, attachAccessToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, attachAccessToken);
router.get('/stats', getStats);

export default router;
