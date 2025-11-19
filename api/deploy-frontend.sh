#!/bin/bash

# Script de Deploy do Frontend para Hostinger VPS
# Uso: ./deploy-frontend.sh

set -e

echo "🚀 Iniciando deploy do frontend..."

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

# Voltar para o diretório raiz do projeto
cd ..

# Verificar se está no diretório correto
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    print_error "Diretório raiz do projeto não encontrado!"
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado!"
    exit 1
fi

# Verificar se o build do backend está rodando
print_message "Verificando se o backend está rodando..."
if ! curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_warning "Backend não está respondendo em localhost:3001"
    print_warning "Certifique-se de que o backend está rodando antes de continuar"
fi

# Instalar dependências
print_message "Instalando dependências do frontend..."
npm ci

# Build da aplicação
print_message "Buildando aplicação frontend..."
npm run build

# Verificar se o build foi bem sucedido
if [ ! -d "dist" ]; then
    print_error "Build falhou! Diretório dist não encontrado."
    exit 1
fi

# Criar diretório de destino se não existir
print_message "Copiando arquivos para o diretório do Nginx..."
sudo mkdir -p /var/www/janice-correia-frontend

# Copiar arquivos do build
sudo rm -rf /var/www/janice-correia-frontend/*
sudo cp -r dist/* /var/www/janice-correia-frontend/

# Definir permissões
sudo chown -R www-data:www-data /var/www/janice-correia-frontend
sudo chmod -R 755 /var/www/janice-correia-frontend

# Testar configuração do Nginx
print_message "Testando configuração do Nginx..."
sudo nginx -t

# Recarregar Nginx
print_message "Recarregando Nginx..."
sudo systemctl reload nginx

print_message "✅ Deploy do frontend concluído com sucesso!"
print_message "Frontend disponível em: http://seu-dominio.com"