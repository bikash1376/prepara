import express from 'express';
import { studentGetAllTests, studentGetTestById, studentGetTestResults, studentSubmitTest } from '../controllers/studentTestController.js';
import { protect } from '../middlewares/authMiddleware.js';

const studentTestRoutes = express.Router();

studentTestRoutes.get('/all', protect, studentGetAllTests);

studentTestRoutes.get('/:id', protect, studentGetTestById);

studentTestRoutes.post('/:id/submit', protect, studentSubmitTest);

studentTestRoutes.get('/:id/results', protect, studentGetTestResults);



export default studentTestRoutes;