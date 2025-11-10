import { z } from 'zod';

export const createPalestraSchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres').max(200),
  description: z.string().min(50, 'Descrição deve ter no mínimo 50 caracteres'),
  duration: z.number().min(15, 'Duração mínima é 15 minutos').max(480),
  target_audience: z.string().min(3, 'Público-alvo é obrigatório').max(200),
  image: z.string().url('URL da imagem inválida'),
  topics: z.array(z.string().min(3)).min(1, 'Adicione pelo menos um tópico'),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updatePalestraSchema = createPalestraSchema.partial();

export type CreatePalestraInput = z.infer<typeof createPalestraSchema>;
export type UpdatePalestraInput = z.infer<typeof updatePalestraSchema>;
