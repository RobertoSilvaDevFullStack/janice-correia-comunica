#!/bin/bash

# Script para verificar e corrigir permissões do banco de dados
# Uso: ./fix-permissions.sh

set -e

echo "🔒 Corrigindo permissões do banco de dados..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado! Execute este script na pasta api/"
    exit 1
fi

# Carregar variáveis de ambiente
if [ -f ".env" ]; then
    export $(cat .env | xargs)
    print_message "Variáveis de ambiente carregadas"
else
    print_warning "Arquivo .env não encontrado"
fi

# Verificar DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL não configurada!"
    exit 1
fi

print_header "CORREÇÃO DE PERMISSÕES"

print_message "DATABASE_URL: ${DATABASE_URL//:*@/://****@}"

# Verificar conexão
print_message "Testando conexão..."
if node check-db.js > /dev/null 2>&1; then
    print_message "✅ Conexão estabelecida"
else
    print_error "❌ Falha na conexão"
    exit 1
fi

# Verificar permissões atuais
print_message "Verificando permissões atuais..."
psql $DATABASE_URL -c "
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name IN ('testimonials', 'leads', 'blog', 'palestras', 'mentorias', 'users')
ORDER BY table_name, grantee;
"

# Corrigir permissões
print_message "Corrigindo permissões..."

# Criar roles se não existirem
psql $DATABASE_URL -c "
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated;
    END IF;
END
\$\$;
"

# Conceder permissões completas
psql $DATABASE_URL -c "
-- Permissões para anon (visitantes)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT INSERT ON leads TO anon;

-- Permissões para authenticated (usuários logados)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Permissões para postgres (admin)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
"

# Verificar se as permissões foram aplicadas
print_message "Verificando permissões após correção..."
psql $DATABASE_URL -c "
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name IN ('testimonials', 'leads', 'blog', 'palestras', 'mentorias', 'users')
ORDER BY table_name, grantee;
"

# Testar acesso com queries simples
print_message "Testando acesso às tabelas..."

for table in testimonials leads blog palestras mentorias users; do
    echo "Testing $table..."
    if psql $DATABASE_URL -c "SELECT COUNT(*) FROM $table" > /dev/null 2>&1; then
        print_message "✅ $table - acesso OK"
    else
        print_error "❌ $table - erro de acesso"
    fi
done

print_header "PERMISSÕES CORRIGIDAS! ✅"
print_message "As permissões foram atualizadas com sucesso"
print_message "O sistema deve funcionar sem erros 403 agora"

echo ""
print_message "🧪 Teste o admin novamente: http://localhost:8080/admin/testimonials"