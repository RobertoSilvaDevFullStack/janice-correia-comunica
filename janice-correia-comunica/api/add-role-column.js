// Script para adicionar a coluna 'role' à tabela users e atualizar o usuário admin
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addRoleColumn() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Adicionar a coluna 'role' se ela não existir
    console.log('Adicionando coluna "role" à tabela users...');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';
    `);

    // 2. Atualizar o usuário admin para ter a role 'admin'
    console.log('Atualizando usuário admin...');
    const result = await client.query(
      `UPDATE users 
       SET role = 'admin' 
       WHERE email = $1 
       RETURNING id, email, full_name, role`,
      ['admin@janicecorreia.com']
    );

    if (result.rowCount === 0) {
      console.log('❌ Usuário admin não encontrado');
    } else {
      console.log('✅ Usuário admin atualizado com sucesso:');
      console.table(result.rows);
    }

    await client.query('COMMIT');
    console.log('✅ Todas as alterações foram aplicadas com sucesso!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao executar as alterações:');
    console.error(error);
  } finally {
    client.release();
    await pool.end();
  }
}

addRoleColumn();
