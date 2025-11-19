const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function fixMissingColumns() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Adicionando colunas status faltantes...\n');
    
    // Tabelas que precisam da coluna status
    const tables = [
      {
        table: 'testimonials',
        defaultValue: 'pending',
        type: 'VARCHAR(50)'
      },
      {
        table: 'palestras', 
        defaultValue: 'active',
        type: 'VARCHAR(50)'
      },
      {
        table: 'mentorias',
        defaultValue: 'active', 
        type: 'VARCHAR(50)'
      }
    ];
    
    for (const { table, defaultValue, type } of tables) {
      console.log(`📊 Verificando tabela ${table}...`);
      
      // Verificar se a coluna já existe
      const checkQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1 AND column_name = 'status';
      `;
      
      const existing = await client.query(checkQuery, [table]);
      
      if (existing.rows.length > 0) {
        console.log(`✅ Coluna status já existe em ${table}`);
        continue;
      }
      
      // Adicionar coluna
      const addColumnQuery = `
        ALTER TABLE ${table} 
        ADD COLUMN IF NOT EXISTS status ${type} DEFAULT '${defaultValue}';
      `;
      
      await client.query(addColumnQuery);
      console.log(`✅ Coluna status adicionada em ${table} com default '${defaultValue}'`);
    }
    
    console.log('\n🔐 Configurando permissões...\n');
    
    // Configurar permissões para todas as tabelas
    const allTables = ['testimonials', 'blog_posts', 'leads', 'palestras', 'mentorias'];
    
    for (const table of allTables) {
      console.log(`🔑 Configurando permissões para ${table}...`);
      
      // Remover permissões existentes primeiro (para evitar duplicatas)
      await client.query(`REVOKE ALL ON ${table} FROM anon, authenticated;`);
      
      // Adicionar permissões apropriadas
      if (table === 'testimonials') {
        // testimonials: anon pode ver apenas aprovados
        await client.query(`GRANT SELECT ON ${table} TO anon;`);
        await client.query(`GRANT ALL ON ${table} TO authenticated;`);
      } else if (table === 'blog_posts') {
        // blog_posts: anon pode ver apenas publicados
        await client.query(`GRANT SELECT ON ${table} TO anon;`);
        await client.query(`GRANT ALL ON ${table} TO authenticated;`);
      } else if (table === 'leads') {
        // leads: apenas authenticated pode acessar
        await client.query(`GRANT ALL ON ${table} TO authenticated;`);
      } else {
        // palestras e mentorias: anon pode ver ativos
        await client.query(`GRANT SELECT ON ${table} TO anon;`);
        await client.query(`GRANT ALL ON ${table} TO authenticated;`);
      }
      
      console.log(`✅ Permissões configuradas para ${table}`);
    }
    
    console.log('\n✅ Todas as correções aplicadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao aplicar correções:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

fixMissingColumns();