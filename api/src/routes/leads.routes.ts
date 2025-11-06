import { Router } from 'express';
import { createLead, getAllLeads, updateLeadStatus } from '../controllers/leads.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createLeadSchema } from '../models/lead.schema';

const router = Router();

// Public route
router.post('/', validate(createLeadSchema), createLead);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getAllLeads);
router.patch('/:id/status', authenticateToken, requireAdmin, updateLeadStatus);

export default router;
