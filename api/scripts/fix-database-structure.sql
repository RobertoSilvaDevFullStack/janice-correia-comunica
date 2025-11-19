-- Script para corrigir estrutura do banco de dados
-- Executar este script para adicionar colunas faltantes e corrigir permissões

-- Verificar estrutura atual das tabelas
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('testimonials', 'leads', 'blog', 'palestras', 'mentorias')
ORDER BY table_name, ordinal_position;

-- Adicionar coluna status na tabela testimonials se não existir
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Adicionar coluna status na tabela leads se não existir  
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';

-- Adicionar coluna status na tabela blog se não existir
ALTER TABLE blog 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published';

-- Adicionar coluna status na tabela palestras se não existir
ALTER TABLE palestras 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Adicionar coluna status na tabela mentorias se não existir
ALTER TABLE mentorias 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Verificar se as colunas foram adicionadas
SELECT table_name, column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('testimonials', 'leads', 'blog', 'palestras', 'mentorias')
AND column_name = 'status';

-- Corrigir permissões para as tabelas
-- Conceder acesso completo ao role authenticated
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Conceder acesso de leitura ao role anon (visitantes)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Conceder acesso ao role postgres (admin)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Verificar permissões atuais
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name IN ('testimonials', 'leads', 'blog', 'palestras', 'mentorias')
ORDER BY table_name, grantee;

-- Atualizar registros existentes com status padrão
UPDATE testimonials SET status = 'active' WHERE status IS NULL;
UPDATE leads SET status = 'new' WHERE status IS NULL;
UPDATE blog SET status = 'published' WHERE status IS NULL;
UPDATE palestras SET status = 'active' WHERE status IS NULL;
UPDATE mentorias SET status = 'active' WHERE status IS NULL;

-- Verificar total de registros por status
SELECT 'testimonials' as tabela, status, COUNT(*) as total FROM testimonials GROUP BY status
UNION ALL
SELECT 'leads' as tabela, status, COUNT(*) as total FROM leads GROUP BY status
UNION ALL  
SELECT 'blog' as tabela, status, COUNT(*) as total FROM blog GROUP BY status
UNION ALL
SELECT 'palestras' as tabela, status, COUNT(*) as total FROM palestras GROUP BY status
UNION ALL
SELECT 'mentorias' as tabela, status, COUNT(*) as total FROM mentorias GROUP BY status
ORDER BY tabela, status;