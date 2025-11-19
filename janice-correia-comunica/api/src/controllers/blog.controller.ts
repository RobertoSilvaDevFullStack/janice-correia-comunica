import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { status = 'published', limit = 10, offset = 0 } = req.query;

    const result = await pool.query(
      'SELECT * FROM blog_posts WHERE status = $1 ORDER BY published_at DESC LIMIT $2 OFFSET $3',
      [status, limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      'SELECT * FROM blog_posts WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get post by slug error:', error);
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, slug, content, excerpt, category, image, keywords, meta_description, status } = req.body;

    const result = await pool.query(
      `INSERT INTO blog_posts (title, slug, content, excerpt, category, image, keywords, meta_description, status, author_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, slug, content, excerpt, category, image, keywords, meta_description, status || 'draft', req.user!.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, category, image, keywords, meta_description, status } = req.body;

    const result = await pool.query(
      `UPDATE blog_posts
       SET title = $1, slug = $2, content = $3, excerpt = $4, category = $5, image = $6,
           keywords = $7, meta_description = $8, status = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [title, slug, content, excerpt, category, image, keywords, meta_description, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Erro ao atualizar post' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
};
