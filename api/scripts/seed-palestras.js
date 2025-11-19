const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: (process.env.DB_SSL === 'disable' || /sslmode=disable/i.test(process.env.DATABASE_URL || '')) ? false : { rejectUnauthorized: false },
});

const palestras = [
  {
    title: 'Comunicação Assertiva no Ambiente Corporativo',
    description: 'Técnicas práticas para clareza, empatia e impacto, reduzindo conflitos e aumentando produtividade.',
    duration: 90,
    target_audience: 'Equipes corporativas',
    image: '/palestra-1.jpg',
    topics: ['Escuta ativa','Comunicação não-violenta','Feedback construtivo'],
    status: 'active',
  },
  {
    title: 'Oratória para Líderes',
    description: 'Presença de palco, confiança e capacidade de inspirar equipes em apresentações memoráveis.',
    duration: 90,
    target_audience: 'Lideranças e executivos',
    image: '/palestra-2.jpg',
    topics: ['Storytelling corporativo','Gestão do nervosismo','Linguagem corporal'],
    status: 'active',
  },
];

async function run() {
  const client = await pool.connect();
  try {
    for (const p of palestras) {
      await client.query(
        `INSERT INTO palestras (title, description, duration, target_audience, image, topics, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT DO NOTHING`,
        [p.title, p.description, p.duration, p.target_audience, p.image, p.topics, p.status]
      );
    }
    console.log('✅ Seed de palestras aplicado');
  } catch (err) {
    console.error('❌ Erro no seed-palestras:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();