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

    // Detect available columns at runtime to support different DB schemas
    const { rows: cols } = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'leads'`
    );
    const available = new Set(cols.map((c: { column_name: string }) => c.column_name));

    const columns: string[] = ['name', 'email'];
    const values: any[] = [name, email];

    if (available.has('phone')) {
      columns.push('phone');
      values.push(phone || null);
    }
    if (available.has('company')) {
      columns.push('company');
      values.push(company || null);
    }
    if (available.has('source')) {
      columns.push('source');
      values.push(source || 'site');
    }
    if (available.has('interest')) {
      // If interest column exists, store it separately
      columns.push('interest');
      values.push(interest || null);
    }
    if (available.has('message')) {
      columns.push('message');
      values.push(finalMessage || null);
    }
    // status is optional (defaults to 'new'); include only if column exists and no default
    if (available.has('status')) {
      columns.push('status');
      values.push('new');
    }

    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const insertSql = `INSERT INTO leads (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;

    const result = await pool.query(insertSql, values);

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
