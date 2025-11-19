import { describe, it, expect } from 'vitest'
import { createTestimonialSchema } from '../src/models/testimonial.schema'

describe('testimonial schema', () => {
  it('accepts valid payload', () => {
    const payload = {
      name: 'Cliente Teste',
      position: 'Diretor',
      company: 'Empresa X',
      content: 'Depoimento com texto suficiente',
      avatar: 'https://exemplo.com/avatar.png',
      rating: 5,
      status: 'approved' as const,
    }
    const result = createTestimonialSchema.safeParse(payload)
    expect(result.success).toBe(true)
  })

  it('rejects conteúdo curto', () => {
    const payload = {
      name: 'C',
      position: 'D',
      company: 'E',
      content: 'curto',
      avatar: 'nota-url',
      rating: 6,
    }
    const result = createTestimonialSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })
})