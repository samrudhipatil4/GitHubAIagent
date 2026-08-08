import { Router } from 'express';
import { sendMessage, getHistory } from '../controllers/chatController.js';
import { requireAuth, attachAccessToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, attachAccessToken);

router.post('/', sendMessage);
router.get('/history', getHistory);

export default router;
