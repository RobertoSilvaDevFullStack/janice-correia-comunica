import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  content: z.string().min(100, 'Conteúdo deve ter no mínimo 100 caracteres'),
  excerpt: z.string().max(300, 'Resumo deve ter no máximo 300 caracteres'),
  category: z.string().min(2),
  image: z.string().url('URL da imagem inválida'),
  keywords: z.array(z.string()).optional(),
  meta_description: z.string().max(160, 'Meta descrição deve ter no máximo 160 caracteres'),
  status: z.enum(['draft', 'published']).optional(),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
