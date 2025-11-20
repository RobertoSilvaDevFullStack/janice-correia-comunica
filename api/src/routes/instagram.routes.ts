import { Router } from 'express'
import { getInstagramFeed } from '../controllers/instagram.controller'

const router = Router()

router.get('/feed', getInstagramFeed)

export default router