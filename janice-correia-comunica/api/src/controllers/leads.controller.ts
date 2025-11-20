import { Request, Response } from 'express';
import pool from '../config/database';

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, interest, message, company, source } = req.body as {
      name: string;
      email: string;
      phone?: string;
      interest?: string;
      message?: string;
      company?: string;
      source?: string;
    };

    const finalMessage = [
      interest ? `Interesse: ${interest}` : null,
      message || null,
    ]
      .filter(Boolean)
      .join('\n');

    const result = await pool.query(
      `INSERT INTO leads (name, email, phone, company, message, source, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new')
       RETURNING *`,
      [name, email, phone || null, company || null, finalMessage || null, source || 'site']
    );

    res.status(201).json({
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      lead: result.rows[0],
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
};

export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM leads';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Get all leads error:', error);
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE leads SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do lead' });
  }
};
