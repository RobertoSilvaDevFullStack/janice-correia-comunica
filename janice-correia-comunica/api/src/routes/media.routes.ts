import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth'
import path from 'path'
import multer from 'multer'
import fs from 'fs'

const router = Router()

const uploadsDir = path.resolve('uploads')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}-${safeName}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Formato inválido'))
  },
})

router.post('/upload', authenticateToken, requireAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' })
    const url = `/uploads/${req.file.filename}`
    res.status(201).json({ url })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Falha no upload' })
  }
})

export default router