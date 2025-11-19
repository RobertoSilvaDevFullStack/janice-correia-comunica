#!/bin/bash

# Script para corrigir estrutura do banco de dados
# Uso: ./fix-database.sh

set -e

echo "🔧 Corrigindo estrutura do banco de dados..."

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

# Verificar se o arquivo SQL existe
if [ ! -f "scripts/fix-database-structure.sql" ]; then
    print_error "Arquivo SQL não encontrado: scripts/fix-database-structure.sql"
    exit 1
fi

# Carregar variáveis de ambiente
if [ -f ".env" ]; then
    export $(cat .env | xargs)
    print_message "Variáveis de ambiente carregadas"
else
    print_warning "Arquivo .env não encontrado, usando DATABASE_URL padrão"
fi

# Verificar DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL não configurada!"
    print_error "Configure o arquivo .env com DATABASE_URL"
    exit 1
fi

print_header "CORREÇÃO DE BANCO DE DADOS"

print_message "DATABASE_URL: ${DATABASE_URL//:*@/://****@}"

# Testar conexão
print_message "Testando conexão com banco de dados..."
if node check-db.js > /dev/null 2>&1; then
    print_message "✅ Conexão estabelecida com sucesso"
else
    print_error "❌ Falha na conexão com banco de dados"
    print_error "Verifique DATABASE_URL e tente novamente"
    exit 1
fi

# Executar script SQL
print_message "Executando script de correção..."
psql $DATABASE_URL -f scripts/fix-database-structure.sql

if [ $? -eq 0 ]; then
    print_message "✅ Script executado com sucesso"
else
    print_error "❌ Erro ao executar script SQL"
    exit 1
fi

# Verificar se as correções funcionaram
print_message "Verificando correções..."
psql $DATABASE_URL -c "
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('testimonials', 'leads', 'blog', 'palestras', 'mentorias')
AND column_name = 'status';
"

print_header "CORREÇÃO CONCLUÍDA! ✅"
print_message "As colunas 'status' foram adicionadas às tabelas"
print_message "As permissões foram corrigidas"
print_message "O sistema deve funcionar corretamente agora"

echo ""
print_message "🧪 Teste o sistema acessando: http://localhost:8080/admin/testimonials"
print_message "Se ainda houver erros, execute: node check-table-structure.js"