import { Router } from 'express';
import {
  githubLogin,
  githubCallback,
  getProfile,
  logout,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/github', githubLogin);
router.get('/github/callback', githubCallback);
router.get('/profile', requireAuth, getProfile);
router.post('/logout', logout);

export default router;
