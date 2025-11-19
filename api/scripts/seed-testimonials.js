const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: (process.env.DB_SSL === 'disable' || /sslmode=disable/i.test(process.env.DATABASE_URL || '')) ? false : { rejectUnauthorized: false },
});

const testimonials = [
  { name:'Carlos Eduardo Silva', position:'CEO, Engelux', company:'Engelux', content:'A palestra da Janice transformou nossa comunicação. Resultados imediatos: mais clareza, menos conflitos, maior produtividade.', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', rating:5, status:'approved' },
  { name:'Ana Paula Mendes', position:'Diretora de RH, Plano e Plano', company:'Plano e Plano', content:'Treinamento in-company superou expectativas. Didática excepcional e engajamento de todos.', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', rating:5, status:'approved' },
  { name:'Dr. Ricardo Almeida', position:'Sócio-fundador, Elilon Advocacia', company:'Elilon Advocacia', content:'Mentoria aprimorou nossas habilidades de oratória e apresentações.', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo', rating:5, status:'approved' },
  { name:'Mariana Costa', position:'Gerente de Marketing', company:'Tech Solutions', content:'Mentoria individual foi um divisor de águas. Posicionamento seguro em reuniões e apresentações.', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana', rating:5, status:'approved' },
];

async function run() {
  const client = await pool.connect();
  try {
    let order = 0;
    for (const t of testimonials) {
      await client.query(
        `INSERT INTO testimonials (name, position, company, content, avatar, rating, display_order, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT DO NOTHING`,
        [t.name, t.position, t.company, t.content, t.avatar, t.rating, order++, t.status]
      );
    }
    console.log('✅ Seed de testimonials aplicado');
  } catch (err) {
    console.error('❌ Erro no seed-testimonials:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();