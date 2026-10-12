import express from 'express';
import {
  listQuestions,
  getSingleQuestion,
  addQuestion,
  editQuestion,
  removeQuestion,
  getCategories
} from '../controllers/questionController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', listQuestions);
router.get('/categories', getCategories);
router.get('/:id', getSingleQuestion);

// Admin-only question management
router.post('/', protect, requireAdmin, addQuestion);
router.put('/:id', protect, requireAdmin, editQuestion);
router.delete('/:id', protect, requireAdmin, removeQuestion);

export default router;
