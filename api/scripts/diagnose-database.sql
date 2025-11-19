-- Verificar estrutura completa do banco de dados
-- Executar este script para diagnosticar problemas

-- 1. Verificar todas as tabelas existentes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Verificar estrutura de cada tabela
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('testimonials', 'leads', 'blog', 'palestras', 'mentorias', 'users')
ORDER BY table_name, ordinal_position;

-- 3. Verificar chaves primárias
SELECT 
    tc.table_name, 
    kcu.column_name,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 4. Verificar permissões atuais
SELECT 
    grantee,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND grantee IN ('anon', 'authenticated', 'postgres')
ORDER BY table_name, grantee;

-- 5. Verificar roles existentes
SELECT rolname, rolsuper, rolcreaterole, rolcreatedb
FROM pg_roles 
WHERE rolname IN ('anon', 'authenticated', 'postgres')
ORDER BY rolname;

-- 6. Verificar dados em cada tabela
SELECT 'testimonials' as tabela, COUNT(*) as total FROM testimonials
UNION ALL
SELECT 'leads' as tabela, COUNT(*) as total FROM leads
UNION ALL
SELECT 'blog' as tabela, COUNT(*) as total FROM blog
UNION ALL
SELECT 'palestras' as tabela, COUNT(*) as total FROM palestras
UNION ALL
SELECT 'mentorias' as tabela, COUNT(*) as total FROM mentorias
UNION ALL
SELECT 'users' as tabela, COUNT(*) as total FROM users
ORDER BY tabela;

-- 7. Verificar se existe a coluna status nas tabelas
SELECT 
    table_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = t.table_name 
            AND column_name = 'status'
        ) THEN 'SIM'
        ELSE 'NÃO'
    END as tem_status
FROM (
    SELECT 'testimonials' as table_name
    UNION ALL SELECT 'leads'
    UNION ALL SELECT 'blog'
    UNION ALL SELECT 'palestras'
    UNION ALL SELECT 'mentorias'
) t
ORDER BY table_name;

-- 8. Verificar estrutura da tabela testimonials especificamente
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'testimonials'
ORDER BY ordinal_position;

-- 9. Verificar últimos registros inseridos
SELECT 'testimonials' as tabela, MAX(created_at) as ultimo_registro FROM testimonials
UNION ALL
SELECT 'leads' as tabela, MAX(created_at) as ultimo_registro FROM leads
UNION ALL
SELECT 'blog' as tabela, MAX(created_at) as ultimo_registro FROM blog
UNION ALL
SELECT 'palestras' as tabela, MAX(created_at) as ultimo_registro FROM palestras
UNION ALL
SELECT 'mentorias' as tabela, MAX(created_at) as ultimo_registro FROM mentorias
ORDER BY ultimo_registro DESC;