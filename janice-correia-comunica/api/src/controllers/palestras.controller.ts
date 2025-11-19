import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllPalestras = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    let query = 'SELECT * FROM palestras ORDER BY created_at DESC';
    const params: any[] = [];
    
    if (status) {
      query = 'SELECT * FROM palestras WHERE status = $1 ORDER BY created_at DESC';
      params.push(status);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all palestras error:', error);
    res.status(500).json({ error: 'Erro ao buscar palestras' });
  }
};

export const getPalestraById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM palestras WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Palestra não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get palestra by id error:', error);
    res.status(500).json({ error: 'Erro ao buscar palestra' });
  }
};

export const createPalestra = async (req: Request, res: Response) => {
  try {
    const { title, description, duration, target_audience, image, topics, status } = req.body;

    const result = await pool.query(
      `INSERT INTO palestras (title, description, duration, target_audience, image, topics, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, duration, target_audience, image, topics, status || 'active']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create palestra error:', error);
    res.status(500).json({ error: 'Erro ao criar palestra' });
  }
};

export const updatePalestra = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, duration, target_audience, image, topics, status } = req.body;

    const result = await pool.query(
      `UPDATE palestras
       SET title = $1, description = $2, duration = $3, target_audience = $4,
           image = $5, topics = $6, status = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, description, duration, target_audience, image, topics, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Palestra não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update palestra error:', error);
    res.status(500).json({ error: 'Erro ao atualizar palestra' });
  }
};

export const deletePalestra = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM palestras WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Palestra não encontrada' });
    }

    res.json({ message: 'Palestra deletada com sucesso' });
  } catch (error) {
    console.error('Delete palestra error:', error);
    res.status(500).json({ error: 'Erro ao deletar palestra' });
  }
};
