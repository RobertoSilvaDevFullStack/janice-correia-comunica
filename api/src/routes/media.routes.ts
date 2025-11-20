import { Router } from 'express'
import { uploadImage } from '../controllers/media.controller'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = Router()

router.post('/upload', authenticateToken, requireAdmin, uploadImage)

export default router