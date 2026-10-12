import express from 'express';
import {
  startInterview,
  submitInterview,
  getMyInterviewHistory,
  getInterviewResult
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, startInterview);
router.post('/submit', protect, submitInterview);
router.get('/my-history', protect, getMyInterviewHistory);
router.get('/:id', protect, getInterviewResult);

export default router;
