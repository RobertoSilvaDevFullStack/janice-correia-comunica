// api/check-users-structure.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkUsersStructure() {
  try {
    // Verificar colunas da tabela users
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('Estrutura da tabela users:');
    console.table(columns.rows);

    // Verificar se há algum usuário
    const users = await pool.query('SELECT * FROM users LIMIT 5');
    console.log('\nPrimeiros usuários:');
    console.table(users.rows);

  } catch (error) {
    console.error('Erro ao verificar estrutura da tabela:');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

checkUsersStructure();