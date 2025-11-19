import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth'
import { getStats } from '../controllers/admin.controller'

const router = Router()

router.get('/stats', authenticateToken, requireAdmin, getStats)

export default router