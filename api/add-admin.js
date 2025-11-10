// api/add-admin.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addAdmin() {
  try {
    // Primeiro, verificar a estrutura da tabela
    const { rows: columns } = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    
    const columnNames = columns.map(c => c.column_name);
    console.log('Colunas encontradas:', columnNames);

    // Construir a query dinamicamente com base nas colunas disponíveis
    const hasName = columnNames.includes('name') || columnNames.includes('username');
    const hasRole = columnNames.includes('role') || columnNames.includes('user_role');
    const hasPassword = columnNames.includes('password') || columnNames.includes('password_hash');
    
    const nameColumn = columnNames.includes('name') ? 'name' : 
                      columnNames.includes('username') ? 'username' : null;
    
    const roleColumn = columnNames.includes('role') ? 'role' : 
                      columnNames.includes('user_role') ? 'user_role' : null;

    const passwordColumn = columnNames.includes('password_hash') ? 'password_hash' : 
                         columnNames.includes('password') ? 'password' : null;

    if (!passwordColumn) {
      throw new Error('Nenhuma coluna de senha encontrada na tabela users');
    }

    const query = {
      text: `
        INSERT INTO users (
          email, 
          ${passwordColumn}
          ${nameColumn ? `, ${nameColumn}` : ''}
          ${roleColumn ? `, ${roleColumn}` : ''}
        ) VALUES (
          $1, $2
          ${nameColumn ? ', $3' : ''}
          ${roleColumn ? (nameColumn ? ', $4' : ', $3') : ''}
        )
        ON CONFLICT (email) 
        DO UPDATE SET 
          ${passwordColumn} = EXCLUDED.${passwordColumn}
          ${nameColumn ? `, ${nameColumn} = EXCLUDED.${nameColumn}` : ''}
          ${roleColumn ? `, ${roleColumn} = EXCLUDED.${roleColumn}` : ''}
        RETURNING id, email${nameColumn ? `, ${nameColumn}` : ''}${roleColumn ? `, ${roleColumn}` : ''}
      `,
      values: [
        'admin@janicecorreia.com',
        '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW' // Senha: Admin@123
      ]
    };

    if (nameColumn) {
      query.values.push('Administrador');
    }
    if (roleColumn) {
      query.values.push('admin');
    }

    const result = await pool.query(query);

    console.log('✅ Usuário administrador criado/atualizado com sucesso:');
    console.table(result.rows);
  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

addAdmin();