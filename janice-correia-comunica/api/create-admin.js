// api/create-admin.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createAdmin() {
  try {
    // Inserir novo usuário admin
    const result = await pool.query(`
      INSERT INTO users (
        email, 
        password_hash, 
        full_name, 
        is_active,
        created_at,
        updated_at
      ) VALUES (
        'admin@janicecorreia.com',
        '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // Senha: Admin123
        'Administrador',
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (email) 
      DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        full_name = EXCLUDED.full_name,
        is_active = EXCLUDED.is_active,
        updated_at = NOW()
      RETURNING id, email, full_name, is_active
    `);

    console.log('✅ Usuário administrador criado/atualizado com sucesso:');
    console.table(result.rows);
  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();