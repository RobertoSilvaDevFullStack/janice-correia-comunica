// api/check-table.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkTable() {
  try {
    // Verificar estrutura da tabela
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    console.log('Estrutura da tabela users:');
    console.table(result.rows);
    
    // Verificar constraints
    const constraints = await pool.query(`
      SELECT tc.constraint_name, tc.constraint_type, kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'users'
    `);
    console.log('\nConstraints da tabela users:');
    console.table(constraints.rows);
    
  } catch (error) {
    console.error('Erro ao verificar a tabela:', error.message);
  } finally {
    await pool.end();
  }
}

checkTable();