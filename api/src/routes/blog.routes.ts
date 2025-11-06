import { Router } from 'express';
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blog.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createPostSchema, updatePostSchema } from '../models/blog.schema';

const router = Router();

// Public routes
router.get('/posts', getAllPosts);
router.get('/posts/:slug', getPostBySlug);

// Admin routes
router.post('/posts', authenticateToken, requireAdmin, validate(createPostSchema), createPost);
router.put('/posts/:id', authenticateToken, requireAdmin, validate(updatePostSchema), updatePost);
router.delete('/posts/:id', authenticateToken, requireAdmin, deletePost);

export default router;
