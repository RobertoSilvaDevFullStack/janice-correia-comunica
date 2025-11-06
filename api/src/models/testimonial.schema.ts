import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  position: z.string().max(100),
  company: z.string().max(100),
  content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres').max(500),
  avatar: z.string().url('URL do avatar inválida').optional(),
  rating: z.number().min(1).max(5).optional(),
  display_order: z.number().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
