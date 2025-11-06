import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido').max(20).optional(),
  interest: z.enum(['palestras', 'mentorias', 'treinamentos', 'newsletter', 'outros']),
  message: z.string().max(1000, 'Mensagem deve ter no máximo 1000 caracteres').optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
