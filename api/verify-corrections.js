const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function verifyCorrections() {
  try {
    console.log('🔍 Verificando correções do banco de dados...\n');
    
    // Tabelas que tiveram problemas de coluna "status"
    const tables = ['testimonials', 'blog_posts', 'leads', 'palestras', 'mentorias'];
    
    for (const table of tables) {
      console.log(`📊 Verificando tabela: ${table}`);
      
      // Verificar estrutura da tabela
      const structureQuery = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `;
      
      const result = await pool.query(structureQuery, [table]);
      
      if (result.rows.length === 0) {
        console.log(`❌ Tabela ${table} não encontrada`);
        continue;
      }
      
      console.log(`✅ Tabela ${table} encontrada`);
      
      // Verificar se tem coluna status
      const hasStatusColumn = result.rows.some(row => row.column_name === 'status');
      
      if (hasStatusColumn) {
        console.log(`✅ Coluna 'status' encontrada em ${table}`);
        
        // Mostrar estrutura da coluna status
        const statusColumn = result.rows.find(row => row.column_name === 'status');
        console.log(`   - Tipo: ${statusColumn.data_type}`);
        console.log(`   - Nullable: ${statusColumn.is_nullable}`);
        console.log(`   - Default: ${statusColumn.column_default || 'Nenhum'}`);
      } else {
        console.log(`❌ Coluna 'status' NÃO encontrada em ${table}`);
      }
      
      // Mostrar todas as colunas
      console.log(`📋 Colunas de ${table}:`);
      result.rows.forEach(row => {
        console.log(`   - ${row.column_name}: ${row.data_type}`);
      });
      
      // Verificar permissões
      console.log(`🔐 Verificando permissões de ${table}:`);
      
      const permissionsQuery = `
        SELECT grantee, privilege_type 
        FROM information_schema.role_table_grants 
        WHERE table_schema = 'public' AND table_name = $1 
        AND grantee IN ('anon', 'authenticated')
        ORDER BY grantee, privilege_type;
      `;
      
      const permissions = await pool.query(permissionsQuery, [table]);
      
      if (permissions.rows.length > 0) {
        permissions.rows.forEach(perm => {
          console.log(`   - ${perm.grantee}: ${perm.privilege_type}`);
        });
      } else {
        console.log(`   ❌ Nenhuma permissão encontrada para anon/authenticated`);
      }
      
      console.log('');
    }
    
    console.log('✅ Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro ao verificar correções:', error.message);
  } finally {
    await pool.end();
  }
}

verifyCorrections();