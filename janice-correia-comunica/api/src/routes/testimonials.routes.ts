import { Router } from 'express';
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonials.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createTestimonialSchema, updateTestimonialSchema } from '../models/testimonial.schema';

const router = Router();

// Public route
router.get('/', getAllTestimonials);

// Admin routes
router.post('/', authenticateToken, requireAdmin, validate(createTestimonialSchema), createTestimonial);
router.put('/:id', authenticateToken, requireAdmin, validate(updateTestimonialSchema), updateTestimonial);
router.delete('/:id', authenticateToken, requireAdmin, deleteTestimonial);

export default router;
