const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: (process.env.DB_SSL === 'disable' || /sslmode=disable/i.test(process.env.DATABASE_URL || '')) ? false : { rejectUnauthorized: false },
});

const posts = [
  {
    slug: '5-tecnicas-oratoria-todo-lider-deveria-dominar',
    title: '5 Técnicas de Oratória que Todo Líder Deveria Dominar',
    excerpt: 'Descubra as estratégias essenciais para se comunicar com impacto e inspirar sua equipe em qualquer situação.',
    category: 'Oratória',
    image: '/palestra-1.jpg',
    meta_description: 'Aprenda 5 técnicas essenciais de oratória para se tornar um líder mais inspirador e influente.',
    keywords: ['oratória','liderança','comunicação','público','soft skills'],
    content: '<p>Conteúdo inicial — atualize no painel admin.</p>',
    published_at: new Date('2025-01-15').toISOString(),
    status: 'published',
  },
  {
    slug: 'comunicacao-assertiva-transforma-relacionamentos-corporativos',
    title: 'Como a Comunicação Assertiva Transforma Relacionamentos Corporativos',
    excerpt: 'Aprenda a se expressar de forma clara e respeitosa, reduzindo conflitos e aumentando a produtividade da equipe.',
    category: 'Comunicação',
    image: '/palestra-2.jpg',
    meta_description: 'Como a comunicação assertiva pode melhorar relações profissionais e produtividade.',
    keywords: ['comunicação','assertiva','relacionamentos','produtividade'],
    content: '<p>Conteúdo inicial — atualize no painel admin.</p>',
    published_at: new Date('2025-01-10').toISOString(),
    status: 'published',
  },
];

async function run() {
  const client = await pool.connect();
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@janicecorreia.com';
    const adminRes = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (adminRes.rows.length === 0) {
      throw new Error(`Admin não encontrado: ${adminEmail}`);
    }
    const authorId = adminRes.rows[0].id;

    for (const p of posts) {
      await client.query(
        `INSERT INTO blog_posts (title, slug, content, excerpt, category, image, keywords, meta_description, status, author_id, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (slug) DO UPDATE SET
           title=EXCLUDED.title,
           content=EXCLUDED.content,
           excerpt=EXCLUDED.excerpt,
           category=EXCLUDED.category,
           image=EXCLUDED.image,
           keywords=EXCLUDED.keywords,
           meta_description=EXCLUDED.meta_description,
           status=EXCLUDED.status,
           author_id=EXCLUDED.author_id,
           published_at=EXCLUDED.published_at,
           updated_at=CURRENT_TIMESTAMP`,
        [p.title, p.slug, p.content, p.excerpt, p.category, p.image, p.keywords, p.meta_description, p.status, authorId, p.published_at]
      );
    }
    console.log('✅ Seed de blog_posts aplicado');
  } catch (err) {
    console.error('❌ Erro no seed-blog:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();