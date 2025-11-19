// api/update-admin-password.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateAdminPassword() {
  try {
    // Atualizar a senha para 'Admin@123' (já em bcrypt)
    const result = await pool.query(`
      UPDATE users 
      SET 
        password_hash = '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
        updated_at = NOW()
      WHERE email = 'admin@janicecorreia.com'
      RETURNING id, email, full_name, is_active
    `);

    if (result.rowCount === 0) {
      console.log('❌ Usuário admin não encontrado');
    } else {
      console.log('✅ Senha do administrador atualizada com sucesso:');
      console.table(result.rows);
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar senha do administrador:');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

updateAdminPassword();