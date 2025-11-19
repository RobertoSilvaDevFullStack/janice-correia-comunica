import { Router } from 'express';
import {
  getAllMentorias,
  getMentoriaById,
  createMentoria,
  updateMentoria,
  deleteMentoria,
} from '../controllers/mentorias.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createMentoriaSchema, updateMentoriaSchema } from '../models/mentoria.schema';

const router = Router();

// Public routes
router.get('/', getAllMentorias);
router.get('/:id', getMentoriaById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, validate(createMentoriaSchema), createMentoria);
router.put('/:id', authenticateToken, requireAdmin, validate(updateMentoriaSchema), updateMentoria);
router.delete('/:id', authenticateToken, requireAdmin, deleteMentoria);

export default router;
