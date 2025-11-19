#!/bin/bash

# Script de Deploy Automatizado para Hostinger VPS
# Uso: ./deploy-backend.sh

set -e

echo "🚀 Iniciando deploy do backend..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para printar mensagens
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado! Execute este script na pasta api/"
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado!"
    exit 1
fi

# Verificar PM2
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 não encontrado. Instalando..."
    npm install -g pm2
fi

# Criar diretórios de log se não existirem
print_message "Criando diretórios de log..."
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# Parar aplicação existente
print_message "Parando aplicação existente..."
pm2 stop janice-correia-api || true
pm2 delete janice-correia-api || true

# Instalar dependências
print_message "Instalando dependências..."
npm ci --production=false

# Build da aplicação
print_message "Buildando aplicação..."
npm run build

# Verificar se o build foi bem sucedido
if [ ! -d "dist" ]; then
    print_error "Build falhou! Diretório dist não encontrado."
    exit 1
fi

# Iniciar aplicação com PM2
print_message "Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js --env production

# Salvar configuração do PM2
pm2 save

# Configurar startup do PM2
print_message "Configurando startup do PM2..."
pm2 startup systemd -u $USER --hp $HOME

# Mostrar status
print_message "Status da aplicação:"
pm2 status

# Mostrar logs
print_message "Logs recentes:"
pm2 logs janice-correia-api --lines 20

print_message "✅ Deploy concluído com sucesso!"
print_message "Aplicação rodando em: http://localhost:3001"
print_message "Health check: http://localhost:3001/health"