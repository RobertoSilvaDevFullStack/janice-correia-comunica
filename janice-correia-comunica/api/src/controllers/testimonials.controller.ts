import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllTestimonials = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testimonials WHERE status = $1 ORDER BY display_order ASC, created_at DESC',
      ['approved']
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({ error: 'Erro ao buscar depoimentos' });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, position, company, content, avatar, rating, display_order, status } = req.body;

    const result = await pool.query(
      `INSERT INTO testimonials (name, position, company, content, avatar, rating, display_order, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, position, company, content, avatar, rating, display_order, status || 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Erro ao criar depoimento' });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, position, company, content, avatar, rating, display_order, status } = req.body;

    const result = await pool.query(
      `UPDATE testimonials
       SET name = $1, position = $2, company = $3, content = $4, avatar = $5,
           rating = $6, display_order = $7, status = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, position, company, content, avatar, rating, display_order, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Depoimento não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Erro ao atualizar depoimento' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM testimonials WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Depoimento não encontrado' });
    }

    res.json({ message: 'Depoimento deletado com sucesso' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: 'Erro ao deletar depoimento' });
  }
};
