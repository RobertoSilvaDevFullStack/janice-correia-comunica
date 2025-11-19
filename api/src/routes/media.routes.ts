import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth'
import { uploadImage } from '../controllers/media.controller'

const router = Router()

router.post('/upload', authenticateToken, requireAdmin, uploadImage)

export default router