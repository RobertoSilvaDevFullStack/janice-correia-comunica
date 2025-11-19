import { describe, it, expect } from 'vitest'
import { createPostSchema } from '../src/models/blog.schema'

describe('blog schema', () => {
  it('accepts valid payload', () => {
    const payload = {
      title: 'Título válido',
      slug: 'titulo-valido',
      content: 'x'.repeat(120),
      excerpt: 'Resumo curto',
      category: 'Comunicação',
      image: 'https://exemplo.com/img.jpg',
      meta_description: 'Descrição meta',
      status: 'draft' as const,
    }
    const result = createPostSchema.safeParse(payload)
    expect(result.success).toBe(true)
  })

  it('rejects slug inválido', () => {
    const payload = {
      title: 'Título',
      slug: 'INVÁLIDO',
      content: 'x'.repeat(120),
      excerpt: 'Resumo',
      category: 'Cat',
      image: 'https://exemplo.com/img.jpg',
      meta_description: 'Meta',
    }
    const result = createPostSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })
})