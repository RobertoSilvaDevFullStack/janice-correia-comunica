import { Router } from 'express';
import {
  getAllPalestras,
  getPalestraById,
  createPalestra,
  updatePalestra,
  deletePalestra,
} from '../controllers/palestras.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createPalestraSchema, updatePalestraSchema } from '../models/palestra.schema';

const router = Router();

// Public routes
router.get('/', getAllPalestras);
router.get('/:id', getPalestraById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, validate(createPalestraSchema), createPalestra);
router.put('/:id', authenticateToken, requireAdmin, validate(updatePalestraSchema), updatePalestra);
router.delete('/:id', authenticateToken, requireAdmin, deletePalestra);

export default router;
