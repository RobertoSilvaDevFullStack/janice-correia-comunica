// api/check-db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  try {
    console.log('🔍 Verificando conexão com o banco de dados...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado ao banco de dados com sucesso!');

    // Verificar tabelas
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\n📊 Tabelas encontradas:');
    console.table(tables.rows);

    // Verificar usuários
    try {
      const users = await pool.query('SELECT id, email, name FROM users');
      console.log('\n👥 Usuários cadastrados:');
      console.table(users.rows);
    } catch (e) {
      console.log('\n❌ Tabela de usuários não encontrada ou vazia');
    }

  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:');
    console.error(error.message);
  } finally {
    await pool.end();
    process.exit();
  }
}

checkDatabase();