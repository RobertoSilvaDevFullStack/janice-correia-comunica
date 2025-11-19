const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: (process.env.DB_SSL === 'disable' || /sslmode=disable/i.test(process.env.DATABASE_URL || '')) ? false : { rejectUnauthorized: false },
});

const mentorias = [
  {
    title: 'Mentoria Individual em Oratória',
    description: 'Programa personalizado para desenvolver habilidades de apresentação e comunicação em público.',
    duration: '3 meses',
    format: 'individual',
    investment: 'Sob consulta',
    benefits: ['Prática assistida','Feedbacks construtivos','Materiais exclusivos'],
    status: 'active',
  },
  {
    title: 'Treinamento Corporativo em Comunicação',
    description: 'Programa in-company para equipes que desejam melhorar sua comunicação interna e externa.',
    duration: 'Customizável',
    format: 'group',
    investment: 'Sob consulta',
    benefits: ['Conteúdo adaptado','Dinâmicas práticas','Acompanhamento'],
    status: 'active',
  },
];

async function run() {
  const client = await pool.connect();
  try {
    for (const m of mentorias) {
      await client.query(
        `INSERT INTO mentorias (title, description, duration, format, investment, benefits, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT DO NOTHING`,
        [m.title, m.description, m.duration, m.format, m.investment, m.benefits, m.status]
      );
    }
    console.log('✅ Seed de mentorias aplicado');
  } catch (err) {
    console.error('❌ Erro no seed-mentorias:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();