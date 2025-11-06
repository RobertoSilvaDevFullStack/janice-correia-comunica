import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { loginSchema, registerSchema } from '../models/auth.schema';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', authenticateToken, requireAdmin, validate(registerSchema), register);

export default router;
