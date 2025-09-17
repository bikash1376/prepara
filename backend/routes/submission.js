import express from 'express';
import {
  submitTest,
  getSubmissionHistory,
  getSubmissionReview,
  getTestSubmissions,
  getUserSubmissions
} from '../controllers/submissionController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Student routes (protected)

// In your routes/submissionRoutes.js file, before your routes
// router.use((req, res, next) => {
//   console.log('Incoming Authorization Header:', req.headers.authorization);
//   next();
// });

// ... then your router.get(...) definition


router.post('/submit', protect, submitTest);
router.get('/history', protect, getSubmissionHistory);
router.get('/review/:submissionId', protect, getSubmissionReview);

// Admin routes (protected + admin only)
router.get('/test/:testId', protect, isAdmin, getTestSubmissions);
router.get('/user/:userId', protect, isAdmin, getUserSubmissions);

export default router;
