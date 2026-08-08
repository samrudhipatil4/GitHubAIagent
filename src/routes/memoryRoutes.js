import { Router } from 'express';
import {
  getUserPreferences,
  updateUserPreferences,
  listConversations,
  getConversationById,
  getActivity,
} from '../controllers/memoryController.js';
import { requireAuth, attachAccessToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, attachAccessToken);

router.get('/preferences', getUserPreferences);
router.put('/preferences', updateUserPreferences);
router.get('/conversations', listConversations);
router.get('/conversations/:id', getConversationById);
router.get('/activity', getActivity);

export default router;
