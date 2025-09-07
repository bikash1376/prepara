import express from 'express';
import { getAdminTests, getAdminTestById, updateAdminTest } from '../controllers/adminTestController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/tests', protect, isAdmin, getAdminTests); // Get all tests
router.get('/tests/:id', protect, isAdmin, getAdminTestById); // Get test by ID
router.put('/tests/:id', protect, isAdmin, updateAdminTest); // Update test by ID

export default router;