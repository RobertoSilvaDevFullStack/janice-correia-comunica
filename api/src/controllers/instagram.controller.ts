import { Request, Response } from 'express'

type InstaItem = {
  id: string
  caption?: string
  media_url?: string
  permalink?: string
  thumbnail_url?: string
  media_type?: string
}

let cache: { timestamp: number; data: InstaItem[] } | null = null
const CACHE_MS = 5 * 60 * 1000

export const getInstagramFeed = async (req: Request, res: Response) => {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN
    if (!token) {
      return res.status(503).json({ error: 'Instagram não configurado' })
    }

    if (cache && Date.now() - cache.timestamp < CACHE_MS) {
      return res.json(cache.data)
    }

    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,thumbnail_url,media_type&access_token=${encodeURIComponent(token)}`
    const resp = await fetch(url)
    if (!resp.ok) {
      const text = await resp.text()
      console.error('Instagram API error:', resp.status, text)
      return res.status(502).json({ error: 'Falha ao obter feed do Instagram' })
    }
    const json = await resp.json() as { data?: InstaItem[] }
    const items = (json.data || []).filter(i => i.media_url && i.permalink)

    cache = { timestamp: Date.now(), data: items }
    return res.json(items)
  } catch (e) {
    console.error('Instagram controller error:', e)
    return res.status(500).json({ error: 'Erro interno ao carregar feed do Instagram' })
  }
}