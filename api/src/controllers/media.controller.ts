import { Request, Response } from 'express'
import Busboy from 'busboy'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'

const ALLOWED = new Set(['image/jpeg','image/png','image/gif'])
const MAX_SIZE = 5 * 1024 * 1024

export const uploadImage = (req: Request, res: Response) => {
  try {
    const busboy = Busboy({ headers: req.headers })
    let finished = false

    busboy.on('file', (name: string, file: NodeJS.ReadableStream, info: { filename: string; encoding: string; mimeType: string }) => {
      if (!ALLOWED.has(info.mimeType)) {
        file.resume()
        if (!finished) {
          finished = true
          return res.status(400).json({ error: 'Formato inválido. Use JPG, PNG ou GIF' })
        }
        return
      }

      const ext = info.filename.includes('.') ? info.filename.split('.').pop() : 'png'
      const finalName = `${uuidv4()}.${ext}`
      const uploadsDir = path.join(__dirname, '..', 'uploads')
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
      const targetPath = path.join(uploadsDir, finalName)
      const write = fs.createWriteStream(targetPath)

      let size = 0
      file.on('data', (data: Buffer) => {
        size += data.length
        if (size > MAX_SIZE) {
          file.resume()
          write.destroy()
          if (!finished) {
            finished = true
            return res.status(413).json({ error: 'Arquivo excede 5MB' })
          }
        }
      })

      file.pipe(write)

      write.on('finish', () => {
        const base = process.env.PUBLIC_UPLOAD_BASE_URL || `${req.protocol}://${req.get('host')}`
        const url = `${base}/uploads/${finalName}`
        if (!finished) {
          finished = true
          return res.status(201).json({ url })
        }
      })

      write.on('error', (err) => {
        console.error('Upload error:', err)
        if (!finished) {
          finished = true
          return res.status(500).json({ error: 'Falha ao salvar arquivo' })
        }
      })
    })

    busboy.on('error', (err: unknown) => {
      console.error('Busboy error:', err)
      if (!finished) {
        finished = true
        return res.status(500).json({ error: 'Falha no processamento do upload' })
      }
    })

    busboy.on('finish', () => {
      if (!finished) {
        finished = true
        return res.status(400).json({ error: 'Nenhum arquivo enviado' })
      }
    })

    req.pipe(busboy)
  } catch (e) {
    console.error('Upload handler error:', e)
    return res.status(500).json({ error: 'Erro interno no upload' })
  }
}