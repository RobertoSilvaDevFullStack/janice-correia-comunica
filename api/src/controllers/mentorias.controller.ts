import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllMentorias = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    let query = 'SELECT * FROM mentorias ORDER BY created_at DESC';
    const params: any[] = [];
    
    if (status) {
      query = 'SELECT * FROM mentorias WHERE status = $1 ORDER BY created_at DESC';
      params.push(status);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all mentorias error:', error);
    res.status(500).json({ error: 'Erro ao buscar mentorias' });
  }
};

export const getMentoriaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM mentorias WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mentoria não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get mentoria by id error:', error);
    res.status(500).json({ error: 'Erro ao buscar mentoria' });
  }
};

export const createMentoria = async (req: Request, res: Response) => {
  try {
    const { title, description, duration, format, investment, benefits, status } = req.body;

    const result = await pool.query(
      `INSERT INTO mentorias (title, description, duration, format, investment, benefits, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, duration, format, investment, benefits, status || 'active']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create mentoria error:', error);
    res.status(500).json({ error: 'Erro ao criar mentoria' });
  }
};

export const updateMentoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, duration, format, investment, benefits, status } = req.body;

    const result = await pool.query(
      `UPDATE mentorias
       SET title = $1, description = $2, duration = $3, format = $4,
           investment = $5, benefits = $6, status = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, description, duration, format, investment, benefits, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mentoria não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update mentoria error:', error);
    res.status(500).json({ error: 'Erro ao atualizar mentoria' });
  }
};

export const deleteMentoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM mentorias WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mentoria não encontrada' });
    }

    res.json({ message: 'Mentoria deletada com sucesso' });
  } catch (error) {
    console.error('Delete mentoria error:', error);
    res.status(500).json({ error: 'Erro ao deletar mentoria' });
  }
};
