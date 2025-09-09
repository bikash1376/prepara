import express from 'express';
import {
  setUserRole,
  getUserProfile,
  syncUser
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Clerk authentication routes
router.post('/set-role', protect, setUserRole);
router.get('/profile', protect, getUserProfile);
router.post('/webhook', syncUser); // Clerk webhook endpoint

export default router;