const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateAdminPassword() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const newPasswordHash = '$2b$10$gNJ8RkaQAAOixZA8TVMVi.Vosm0.NI4hTmqQSrnePFOQKvGfIr8Sq';
    
    const result = await client.query(
      `UPDATE users 
       SET password_hash = $1,
           updated_at = NOW()
       WHERE email = $2
       RETURNING id, email, full_name`,
      [newPasswordHash, 'admin@janicecorreia.com']
    );

    if (result.rowCount === 0) {
      console.log('❌ Usuário admin não encontrado');
    } else {
      console.log('✅ Senha do administrador atualizada com sucesso:');
      console.table(result.rows);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao atualizar senha do administrador:');
    console.error(error);
  } finally {
    client.release();
    await pool.end();
  }
}

updateAdminPassword();
