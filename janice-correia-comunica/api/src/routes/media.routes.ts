import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth'
import fs from 'fs'
import path from 'path'

const router = Router()

router.post('/upload', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { filename, data } = req.body as { filename?: string; data?: string }
    if (!filename || !data) {
      return res.status(400).json({ error: 'Arquivo inválido' })
    }

    let base64 = data
    let mime = ''
    const match = /^data:(.+);base64,(.+)$/.exec(data)
    if (match) {
      mime = match[1]
      base64 = match[2]
    }

    const buffer = Buffer.from(base64, 'base64')
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const finalName = `${Date.now()}-${safeName}`
    const uploadsDir = path.resolve('uploads')
    const filePath = path.join(uploadsDir, finalName)

    fs.mkdirSync(uploadsDir, { recursive: true })
    fs.writeFileSync(filePath, buffer)

    const url = `/uploads/${finalName}`
    res.status(201).json({ url })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Falha no upload' })
  }
})

export default router