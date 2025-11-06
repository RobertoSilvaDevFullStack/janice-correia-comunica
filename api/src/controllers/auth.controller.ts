import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email, passwordHash, name, 'admin']
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};
