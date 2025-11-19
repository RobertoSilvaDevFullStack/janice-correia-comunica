import { Request, Response } from 'express'
import pool from '../config/database'

export const getStats = async (req: Request, res: Response) => {
  try {
    const [{ rows: leadsMonth }, { rows: blogCount }, { rows: testimonialsCount }] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS count FROM leads WHERE created_at >= NOW() - INTERVAL '30 days'`),
      pool.query(`SELECT COUNT(*)::int AS count FROM blog_posts WHERE status = 'published'`),
      pool.query(`SELECT COUNT(*)::int AS count FROM testimonials WHERE status = 'approved'`),
    ])

    res.json({
      leadsMonth: leadsMonth[0]?.count || 0,
      blogPosts: blogCount[0]?.count || 0,
      testimonials: testimonialsCount[0]?.count || 0,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    res.status(500).json({ error: 'Erro ao obter estatísticas' })
  }
}