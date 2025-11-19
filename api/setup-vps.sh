#!/bin/bash

# Script de Setup Inicial da VPS Hostinger
# Uso: ./setup-vps.sh

set -e

echo "🚀 Iniciando setup inicial da VPS Hostinger..."

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

# Verificar se é root
if [[ $EUID -ne 0 ]]; then
   print_error "Este script deve ser executado como root!"
   exit 1
fi

print_header "ATUALIZANDO SISTEMA"
apt update && apt upgrade -y

print_header "INSTALANDO DEPENDÊNCIAS BÁSICAS"
apt install -y curl wget git vim htop nginx

print_header "INSTALANDO NODE.JS 18.x"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

print_header "INSTALANDO PM2 GLOBALMENTE"
npm install -g pm2

print_header "CONFIGURANDO FIREWALL (UFW)"
apt install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

print_header "CONFIGURANDO DIRETÓRIOS"
mkdir -p /var/www/janice-correia-frontend
mkdir -p /var/log/pm2
chown -R www-data:www-data /var/www

print_header "CONFIGURANDO NGINX"
# Remover configuração padrão
rm -f /etc/nginx/sites-enabled/default

# Criar diretórios para configs customizadas
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# Testar configuração do Nginx
nginx -t

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx

print_header "INSTALANDO CERTBOT (PARA SSL)"
apt install -y certbot python3-certbot-nginx

print_header "CONFIGURANDO PM2 STARTUP"
pm2 startup systemd -u root --hp /root

print_header "CRIANDO USUÁRIO DEPLOY (OPCIONAL)"
read -p "Deseja criar um usuário específico para deploy? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    read -p "Nome do usuário: " username
    adduser $username
    usermod -aG sudo $username
    print_message "Usuário $username criado com sucesso!"
fi

print_header "SETUP CONCLUÍDO! ✅"
print_message "Próximos passos:"
echo "1. Configure seus domínios DNS apontando para este servidor"
echo "2. Copie os arquivos de configuração Nginx"
echo "3. Execute o script de deploy do backend"
echo "4. Configure SSL com Certbot"
echo ""
echo "Comandos úteis:"
echo "  pm2 status          - Ver status dos processos"
echo "  pm2 logs            - Ver logs"
echo "  nginx -t            - Testar config Nginx"
echo "  systemctl status nginx - Status do Nginx"
echo ""
print_warning "LEMBRE-SE: Configure seu DNS antes de prosseguir!"