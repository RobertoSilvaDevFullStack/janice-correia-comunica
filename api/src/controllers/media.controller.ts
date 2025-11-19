import { Request, Response } from 'express'
import Busboy from 'busboy'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
const uuidv4 = () => crypto.randomUUID()

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED = new Set(['image/jpeg','image/png','image/gif'])

export const uploadImage = (req: Request, res: Response) => {
  try {
    const busboy = Busboy({ headers: req.headers })
    let saved = false

    const uploadsDir = path.join(__dirname, '..', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    busboy.on('file', (name: string, file: NodeJS.ReadableStream, info: { filename: string; encoding: string; mimeType: string }) => {
      const { mimeType, filename } = info
      if (!ALLOWED.has(mimeType)) {
        file.resume()
        return res.status(400).json({ error: 'Formato de imagem inválido. Use JPG, PNG ou GIF.' })
      }

      let size = 0
      const ext = path.extname(filename) || '.jpg'
      const finalName = `${uuidv4()}${ext}`
      const savePath = path.join(uploadsDir, finalName)
      const write = fs.createWriteStream(savePath)

      file.on('data', (data: Buffer) => {
        size += data.length
        if (size > MAX_SIZE) {
          write.destroy()
          file.resume()
          fs.unlink(savePath, () => {})
          return res.status(413).json({ error: 'Arquivo excede 5MB' })
        }
      })

      file.pipe(write)
      write.on('finish', () => {
        saved = true
        const base = process.env.PUBLIC_UPLOAD_BASE_URL || `${req.protocol}://${req.get('host')}`
        const url = `${base}/uploads/${finalName}`
        res.status(201).json({ url })
      })
      write.on('error', (err) => {
        fs.unlink(savePath, () => {})
        res.status(500).json({ error: 'Falha ao salvar imagem' })
      })
    })

    busboy.on('finish', () => {
      if (!saved) {
        res.status(400).json({ error: 'Nenhum arquivo enviado' })
      }
    })

    req.pipe(busboy)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar upload' })
  }
}