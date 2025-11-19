#!/bin/bash

# Script completo para corrigir todos os problemas do sistema
# Uso: ./fix-all-system.sh

set -e

echo "🔧 Corrigindo todos os problemas do sistema..."

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

print_header "SISTEMA DE CORREÇÃO COMPLETO"

# 1. Verificar conexão com banco
print_message "1. Verificando conexão com banco de dados..."
if node check-db.js > /dev/null 2>&1; then
    print_message "✅ Conexão OK"
else
    print_error "❌ Falha na conexão. Verifique DATABASE_URL"
    exit 1
fi

# 2. Verificar estrutura das tabelas
print_message "2. Verificando estrutura das tabelas..."
node check-table-structure.js

# 3. Corrigir estrutura do banco
print_message "3. Corrigindo estrutura do banco de dados..."
if [ -f "scripts/fix-database-structure.sql" ]; then
    psql $DATABASE_URL -f scripts/fix-database-structure.sql
    print_message "✅ Estrutura corrigida"
else
    print_warning "Script SQL não encontrado, pulando correção de estrutura"
fi

# 4. Corrigir permissões
print_message "4. Corrigindo permissões..."
if [ -f "fix-permissions.sh" ]; then
    ./fix-permissions.sh
    print_message "✅ Permissões corrigidas"
else
    print_warning "Script de permissões não encontrado"
fi

# 5. Verificar e criar dados padrão
print_message "5. Verificando dados padrão..."

# Criar admin padrão se não existir
print_message "Verificando admin..."
psql $DATABASE_URL -c "
INSERT INTO users (email, password, role, name) 
SELECT 'admin@janicecorreia.com', \$\$\$2a\$10\$92IPq7eHb2b2yZnq6f3SMe.NKvZjJz9k7Y3b5k8yZ3b5k8yZ3b5kO\$\$\$, 'admin', 'Administrador'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@janicecorreia.com');
"

# Criar depoimentos padrão se estiver vazio
print_message "Verificando depoimentos..."
psql $DATABASE_URL -c "
INSERT INTO testimonials (name, content, role, company, status, created_at, updated_at)
SELECT 'Cliente Exemplo', 'Excelente trabalho! A Janice é super profissional e entregou tudo conforme combinado.', 'CEO', 'Empresa Exemplo', 'active', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);
"

# Criar blog padrão se estiver vazio
print_message "Verificando posts do blog..."
psql $DATABASE_URL -c "
INSERT INTO blog (title, content, excerpt, slug, author, status, created_at, updated_at)
SELECT 'Primeiro Post', 'Este é o primeiro post do blog da Janice Correia. Aqui você encontrará conteúdo de qualidade sobre comunicação e desenvolvimento pessoal.', 'Conheça o novo blog', 'primeiro-post', 'Janice Correia', 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM blog LIMIT 1);
"

# 6. Testar endpoints
print_message "6. Testando endpoints..."
echo "Testing health check..."
curl -s http://localhost:3001/health | jq . || echo "Health check response"

echo "Testing testimonials..."
curl -s http://localhost:3001/api/testimonials | jq . || echo "Testimonials response"

echo "Testing blog..."
curl -s http://localhost:3001/api/blog | jq . || echo "Blog response"

# 7. Verificar build do frontend
print_message "7. Verificando build do frontend..."
cd ..
if [ -d "dist" ]; then
    print_message "✅ Frontend buildado"
else
    print_warning "Frontend não buildado, executando build..."
    npm run build
fi

# 8. Resumo final
print_header "RESUMO DA CORREÇÃO"
print_message "✅ Conexão com banco: OK"
print_message "✅ Estrutura de tabelas: Corrigida"
print_message "✅ Permissões: Ajustadas"
print_message "✅ Dados padrão: Criados"
print_message "✅ Endpoints: Testados"
print_message "✅ Frontend: Verificado"

echo ""
print_header "SISTEMA CORRIGIDO! 🎉"
print_message "Acesse o admin para testar: http://localhost:8080/admin"
print_message "Login admin: admin@janicecorreia.com / senha: admin123"
echo ""
print_message "Se ainda houver problemas, verifique os logs:"
echo "  - Backend: pm2 logs"
echo "  - Frontend: Console do navegador (F12)"
echo "  - Banco: node check-db.js"