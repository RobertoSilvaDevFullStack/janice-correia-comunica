#!/bin/bash

# Script de migração do Railway PostgreSQL para VPS PostgreSQL
# Uso: ./migrate-railway-to-vps.sh

set -e

echo "🔄 Migrando banco de dados do Railway para VPS..."

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

print_header "MIGRAÇÃO RAILWAY → VPS POSTGRESQL"

# Solicitar URLs de conexão
read -p "URL do Railway PostgreSQL (antigo): " RAILWAY_URL
read -p "URL do VPS PostgreSQL (novo): " VPS_URL

if [ -z "$RAILWAY_URL" ] || [ -z "$VPS_URL" ]; then
    print_error "URLs de conexão são obrigatórias!"
    exit 1
fi

print_message "Conexão Railway: ${RAILWAY_URL//:*@/://****@}"
print_message "Conexão VPS: ${VPS_URL//:*@/://****@}"

# Testar conexões
print_message "Testando conexões..."

if psql $RAILWAY_URL -c "SELECT 1;" > /dev/null 2>&1; then
    print_message "✅ Conexão Railway OK"
else
    print_error "❌ Falha na conexão Railway"
    exit 1
fi

if psql $VPS_URL -c "SELECT 1;" > /dev/null 2>&1; then
    print_message "✅ Conexão VPS OK"
else
    print_error "❌ Falha na conexão VPS"
    exit 1
fi

# Criar diretório de backup
BACKUP_DIR="/tmp/migration-$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

print_message "Backup será salvo em: $BACKUP_DIR"

# Fazer backup completo do Railway
print_message "Fazendo backup do Railway..."
pg_dump $RAILWAY_URL > $BACKUP_DIR/railway-full-backup.sql

if [ $? -eq 0 ]; then
    print_message "✅ Backup completo realizado"
else
    print_error "❌ Falha no backup completo"
    exit 1
fi

# Backup individual por tabela
print_message "Fazendo backup por tabela..."
tables=("testimonials" "leads" "blog" "palestras" "mentorias" "users")

for table in "${tables[@]}"; do
    print_message "Backup da tabela: $table"
    pg_dump $RAILWAY_URL -t $table > $BACKUP_DIR/railway-$table.sql
    
    # Verificar se a tabela tem dados
    count=$(psql $RAILWAY_URL -t -c "SELECT COUNT(*) FROM $table;" | xargs)
    print_message "  $table: $count registros"
done

# Criar banco no VPS se não existir
print_message "Preparando banco no VPS..."
DB_NAME=$(echo $VPS_URL | sed 's/.*\/\([^?]*\).*/\1/')
DB_USER=$(echo $VPS_URL | sed 's/\/\/\([^:]*\):.*/\1/')

psql $VPS_URL -c "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null || true

# Restaurar dados no VPS
print_message "Restaurando dados no VPS..."
psql $VPS_URL < $BACKUP_DIR/railway-full-backup.sql

if [ $? -eq 0 ]; then
    print_message "✅ Dados restaurados com sucesso"
else
    print_error "❌ Falha ao restaurar dados"
    exit 1
fi

# Verificar migração
print_message "Verificando migração..."
for table in "${tables[@]}"; do
    railway_count=$(psql $RAILWAY_URL -t -c "SELECT COUNT(*) FROM $table;" | xargs)
    vps_count=$(psql $VPS_URL -t -c "SELECT COUNT(*) FROM $table;" | xargs)
    
    if [ "$railway_count" -eq "$vps_count" ]; then
        print_message "✅ $table: $railway_count → $vps_count registros (OK)"
    else
        print_warning "⚠️ $table: $railway_count → $vps_count registros (Diferença)"
    fi
done

# Atualizar .env
print_message "Atualizando arquivo .env..."
if [ -f ".env" ]; then
    cp .env .env.backup
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=$VPS_URL|" .env
    print_message "✅ Arquivo .env atualizado"
else
    print_warning "Arquivo .env não encontrado, criando novo..."
    cat > .env << EOF
# Database
DATABASE_URL=$VPS_URL

# JWT (IMPORTANTE: Use um secret forte)
JWT_SECRET=$(openssl rand -base64 32)

# Server
PORT=3001
NODE_ENV=production

# CORS
FRONTEND_URL=http://localhost:5173
EOF
fi

# Testar nova conexão
print_message "Testando nova conexão..."
if node check-db.js > /dev/null 2>&1; then
    print_message "✅ Nova conexão funcionando"
else
    print_error "❌ Problema com nova conexão"
    exit 1
fi

# Limpar (opcional)
read -p "Deseja apagar os arquivos de backup? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    rm -rf $BACKUP_DIR
    print_message "Backup removido"
else
    print_message "Backup mantido em: $BACKUP_DIR"
fi

print_header "MIGRAÇÃO CONCLUÍDA! 🎉"
print_message "✅ Dados migrados do Railway para VPS"
print_message "✅ Conexão configurada"
print_message "✅ Sistema pronto para uso"

echo ""
print_message "Próximos passos:"
echo "1. Reinicie o backend: pm2 restart all"
echo "2. Teste o sistema: node check-db.js"
echo "3. Acesse o admin para verificar dados"
echo ""
print_message "🔗 Nova URL do banco: ${VPS_URL//:*@/://****@}"