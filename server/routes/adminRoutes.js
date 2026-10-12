import express from 'express';
import {
  getAdminStats,
  listAllUsers,
  listAllResults
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, requireAdmin, getAdminStats);
router.get('/users', protect, requireAdmin, listAllUsers);
router.get('/results', protect, requireAdmin, listAllResults);

export default router;
