// Script para verificar estrutura de qualquer tabela
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkTable(tableName) {
  try {
    console.log(`Estrutura da tabela ${tableName}:`);
    
    // Verificar estrutura da tabela especificada
    const result = await pool.query(`
      SELECT 
        column_name, 
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);
    
    if (result.rows.length === 0) {
      console.log(`❌ Tabela '${tableName}' não encontrada!`);
      return;
    }
    
    console.table(result.rows);
    
    // Verificar constraints
    const constraints = await pool.query(`
      SELECT 
        tc.constraint_name, 
        tc.constraint_type, 
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = $1
      ORDER BY tc.constraint_type
    `, [tableName]);
    
    if (constraints.rows.length > 0) {
      console.log(`\nConstraints da tabela ${tableName}:`);
      console.table(constraints.rows);
    }
    
    // Verificar índices
    const indexes = await pool.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = $1
      ORDER BY indexname
    `, [tableName]);
    
    if (indexes.rows.length > 0) {
      console.log(`\nÍndices da tabela ${tableName}:`);
      indexes.rows.forEach(index => {
        console.log(`  ${index.indexname}: ${index.indexdef}`);
      });
    }
    
    // Contar registros
    const count = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
    console.log(`\nTotal de registros: ${count.rows[0].total}`);
    
    // Mostrar amostra de dados (primeiros 3 registros)
    if (count.rows[0].total > 0) {
      console.log(`\nAmostra de dados (3 primeiros registros):`);
      const sample = await pool.query(`SELECT * FROM ${tableName} LIMIT 3`);
      console.table(sample.rows);
    }
    
  } catch (error) {
    console.error(`Erro ao verificar a tabela ${tableName}:`, error.message);
  }
}

// Pegar nome da tabela dos argumentos
const tableName = process.argv[2] || 'testimonials';
checkTable(tableName).then(() => {
  pool.end();
});