import { z } from 'zod';

export const createMentoriaSchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres').max(200),
  description: z.string().min(50, 'Descrição deve ter no mínimo 50 caracteres'),
  duration: z.string().min(3, 'Duração é obrigatória').max(100),
  format: z.enum(['individual', 'group', 'both'], {
    errorMap: () => ({ message: 'Formato deve ser individual, group ou both' })
  }),
  investment: z.string().min(3, 'Investimento é obrigatório').max(100),
  benefits: z.array(z.string().min(5)).min(1, 'Adicione pelo menos um benefício'),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateMentoriaSchema = createMentoriaSchema.partial();

export type CreateMentoriaInput = z.infer<typeof createMentoriaSchema>;
export type UpdateMentoriaInput = z.infer<typeof updateMentoriaSchema>;
