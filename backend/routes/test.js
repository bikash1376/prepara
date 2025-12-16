// addTest

import express from 'express';
import { addTest, deleteTest, getAllTests, getTestById, updateTest, getAllTestsWithStatus, checkTestAccess, toggleTestVisibility } from '../controllers/testController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';


const testRoutes = express.Router();

testRoutes.post('/add', protect, isAdmin, addTest);
testRoutes.get('/all', getAllTests);
testRoutes.get('/with-status', protect, getAllTestsWithStatus);
testRoutes.get('/:id/access', protect, checkTestAccess);
testRoutes.get('/:id', getTestById);
testRoutes.put('/:id', protect, isAdmin, updateTest);
testRoutes.patch('/:id/toggle-visibility', protect, isAdmin, toggleTestVisibility);
testRoutes.delete('/:id', protect, isAdmin, deleteTest);

export default testRoutes;