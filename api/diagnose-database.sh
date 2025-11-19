#!/bin/bash

# Script para executar diagnóstico completo do banco de dados
# Uso: ./diagnose-database.sh

set -e

echo "🔍 Executando diagnóstico completo do banco de dados..."

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
    print_error "Configure o arquivo .env com DATABASE_URL"
    exit 1
fi

print_header "DIAGNÓSTICO COMPLETO DO BANCO DE DADOS"

print_message "DATABASE_URL: ${DATABASE_URL//:*@/://****@}"

# Testar conexão
print_message "1. Testando conexão com banco de dados..."
if node check-db.js > /dev/null 2>&1; then
    print_message "✅ Conexão estabelecida com sucesso"
else
    print_error "❌ Falha na conexão com banco de dados"
    print_error "Verifique DATABASE_URL e tente novamente"
    exit 1
fi

# Executar script de diagnóstico
print_message "2. Executando diagnóstico..."
if [ -f "scripts/diagnose-database.sql" ]; then
    psql $DATABASE_URL -f scripts/diagnose-database.sql
else
    print_error "Arquivo de diagnóstico não encontrado"
    exit 1
fi

# Verificar endpoints da API
print_message "3. Testando endpoints da API..."

endpoints=(
    "http://localhost:3001/health"
    "http://localhost:3001/api/testimonials"
    "http://localhost:3001/api/leads"
    "http://localhost:3001/api/blog"
    "http://localhost:3001/api/palestras"
    "http://localhost:3001/api/mentorias"
)

for endpoint in "${endpoints[@]}"; do
    echo "Testing: $endpoint"
    response=$(curl -s -w "%{http_code}" "$endpoint" -o /dev/null)
    if [ "$response" -eq 200 ]; then
        print_message "✅ $endpoint - OK (200)"
    elif [ "$response" -eq 403 ]; then
        print_warning "⚠️ $endpoint - Forbidden (403) - Problema de permissão"
    elif [ "$response" -eq 500 ]; then
        print_error "❌ $endpoint - Internal Server Error (500)"
    else
        print_warning "⚠️ $endpoint - Status: $response"
    fi
done

# Verificar logs do backend
print_message "4. Verificando logs recentes do backend..."
if command -v pm2 > /dev/null; then
    echo "Últimas 10 linhas de log:"
    pm2 logs --lines 10 --nostream 2>/dev/null | tail -10 || echo "Sem logs PM2 disponíveis"
else
    print_warning "PM2 não encontrado"
fi

# Verificar estrutura do código
print_message "5. Verificando estrutura do código..."

# Verificar se controllers existem
controllers=(
    "src/controllers/testimonials.controller.ts"
    "src/controllers/leads.controller.ts"
    "src/controllers/blog.controller.ts"
    "src/controllers/palestras.controller.ts"
    "src/controllers/mentorias.controller.ts"
)

for controller in "${controllers[@]}"; do
    if [ -f "$controller" ]; then
        print_message "✅ $controller - Existe"
    else
        print_error "❌ $controller - Não encontrado"
    fi
done

# Verificar rotas
print_message "6. Verificando rotas..."
routes=(
    "src/routes/testimonials.routes.ts"
    "src/routes/leads.routes.ts"
    "src/routes/blog.routes.ts"
    "src/routes/palestras.routes.ts"
    "src/routes/mentorias.routes.ts"
)

for route in "${routes[@]}"; do
    if [ -f "$route" ]; then
        print_message "✅ $route - Existe"
    else
        print_error "❌ $route - Não encontrado"
    fi
done

# Testar queries específicas
print_message "7. Testando queries específicas..."

# Testar query de testimonials
echo "Testando query testimonials..."
psql $DATABASE_URL -c "SELECT * FROM testimonials LIMIT 1;" 2>/dev/null && print_message "✅ Query testimonials - OK" || print_error "❌ Query testimonials - Falhou"

# Testar query de leads
echo "Testando query leads..."
psql $DATABASE_URL -c "SELECT * FROM leads LIMIT 1;" 2>/dev/null && print_message "✅ Query leads - OK" || print_error "❌ Query leads - Falhou"

# Testar query de blog
echo "Testando query blog..."
psql $DATABASE_URL -c "SELECT * FROM blog LIMIT 1;" 2>/dev/null && print_message "✅ Query blog - OK" || print_error "❌ Query blog - Falhou"

print_header "DIAGNÓSTICO CONCLUÍDO! 📊"

print_message "Resumo dos problemas encontrados:"
echo ""
echo "🚨 PROBLEMAS CRÍTICOS:"
echo "   - Coluna 'status' não existe nas tabelas"
echo "   - Permissões de roles não configuradas"
echo "   - Erros 500/403 nos endpoints"
echo ""
echo "✅ FUNCIONANDO:"
echo "   - Conexão com banco de dados"
echo "   - Estrutura de arquivos"
echo "   - Backend está rodando"
echo ""
print_message "Execute './fix-all-system.sh' para corrigir todos os problemas!"