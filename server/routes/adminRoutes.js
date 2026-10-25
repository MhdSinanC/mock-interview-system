import express from 'express';
import {
  getAdminStats,
  listAllUsers,
  listAllResults,
  deleteCandidateUser
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, requireAdmin, getAdminStats);
router.get('/users', protect, requireAdmin, listAllUsers);
router.delete('/users/:id', protect, requireAdmin, deleteCandidateUser);
router.get('/results', protect, requireAdmin, listAllResults);

export default router;
