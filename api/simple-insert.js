// api/simple-insert.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function insertUser() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Primeiro, verificar se o usuário já existe
    const check = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@janicecorreia.com']
    );
    
    if (check.rows.length > 0) {
      console.log('Usuário já existe, atualizando...');
      const update = await client.query(`
        UPDATE users 
        SET password_hash = $1, 
            full_name = $2, 
            is_active = true,
            updated_at = NOW()
        WHERE email = $3
        RETURNING id, email, full_name
      `, [
        '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
        'Administrador',
        'admin@janicecorreia.com'
      ]);
      console.log('Usuário atualizado:', update.rows[0]);
    } else {
      console.log('Criando novo usuário...');
      const insert = await client.query(`
        INSERT INTO users (
          email, 
          password_hash, 
          full_name, 
          is_active,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, true, NOW(), NOW())
        RETURNING id, email, full_name
      `, [
        'admin@janicecorreia.com',
        '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
        'Administrador'
      ]);
      console.log('Novo usuário criado:', insert.rows[0]);
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao processar usuário:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

insertUser();