import express from 'express';
import {
  startInterview,
  submitInterview,
  getMyInterviewHistory,
  getInterviewResult
} from '../controllers/interviewController.js';
import { protect, requireCandidate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, requireCandidate, startInterview);
router.post('/submit', protect, requireCandidate, submitInterview);
router.get('/my-history', protect, requireCandidate, getMyInterviewHistory);
router.get('/:id', protect, getInterviewResult);

export default router;
