#!/bin/bash

# Script de Deploy Personalizado para VPS 72.61.52.78
# Deploy completo do Janice Correia na Hostinger VPS

set -e

echo "🚀 Iniciando deploy completo na VPS 72.61.52.78..."

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
   print_error "Execute: sudo ./deploy-vps-72.61.52.78.sh"
   exit 1
fi

print_header "DEPLOY JANICE CORREIA - VPS 72.61.52.78"

# Solicitar informações
read -p "Digite seu domínio principal (ex: janicecorreia.com): " DOMAIN
read -p "Deseja instalar PostgreSQL local? (s/n): " -n 1 -r
INSTALL_POSTGRES=$REPLY
echo

if [ -z "$DOMAIN" ]; then
    print_error "Domínio é obrigatório!"
    exit 1
fi

print_message "Iniciando deploy para: $DOMAIN"
print_message "VPS IP: 72.61.52.78"

# Criar diretório do projeto
print_message "Criando estrutura do projeto..."
mkdir -p /var/www/janice-correia
cd /var/www/janice-correia

# Clonar repositório
print_message "Clonando repositório..."
git clone https://github.com/RobertoSilvaDevFullStack/janice-correia-comunica.git .

# Atualizar sistema e instalar dependências
print_message "Atualizando sistema..."
apt update && apt upgrade -y

print_message "Instalando dependências..."
apt install -y curl wget git vim htop nginx postgresql postgresql-contrib certbot python3-certbot-nginx

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PM2 globalmente
npm install -g pm2

# Configurar PostgreSQL se solicitado
if [[ $INSTALL_POSTGRES =~ ^[Ss]$ ]]; then
    print_message "Configurando PostgreSQL..."
    
    # Criar banco e usuário
    DB_PASSWORD=$(openssl rand -base64 12)
    sudo -u postgres psql << EOF
CREATE DATABASE janice_correia;
CREATE USER janice_user WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE janice_correia TO janice_user;
EOF
    
    # Configurar acesso externo
    sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf
    echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/*/main/pg_hba.conf
    systemctl restart postgresql
    
    DATABASE_URL="postgresql://janice_user:$DB_PASSWORD@localhost:5432/janice_correia"
else
    # Usar Railway (mantém seu banco existente)
    DATABASE_URL="postgresql://postgres:DRuPZFnOPNrVryMMlkMmqiOBxjdkZyXv@centerbeam.proxy.rlwy.net:27766/railway"
fi

# Criar diretórios
mkdir -p /var/log/pm2
mkdir -p /var/www/janice-correia-frontend

# Configurar backend
cd api

# Criar arquivo .env
cat > .env << EOF
# Database
DATABASE_URL=$DATABASE_URL

# JWT
JWT_SECRET=$(openssl rand -base64 32)

# Server
PORT=3001
NODE_ENV=production

# CORS
FRONTEND_URL=https://$DOMAIN
EOF

print_message "Instalando dependências do backend..."
npm ci --production=false

print_message "Build do backend..."
npm run build

# Iniciar com PM2
print_message "Iniciando backend com PM2..."
pm2 start ecosystem.config.js --env production
pm2 save

# Configurar startup do PM2
pm2 startup systemd -u root --hp /root

# Configurar Nginx
print_message "Configurando Nginx..."
cp nginx-config.conf /etc/nginx/sites-available/janice-correia-api
cp nginx-frontend.conf /etc/nginx/sites-available/janice-correia-frontend

# Atualizar domínios
sed -i "s/janicecorreia.com/$DOMAIN/g" /etc/nginx/sites-available/janice-correia-api
sed -i "s/janicecorreia.com/$DOMAIN/g" /etc/nginx/sites-available/janice-correia-frontend

# Remover default e habilitar sites
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/janice-correia-api /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/janice-correia-frontend /etc/nginx/sites-enabled/

# Testar e reiniciar Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

# Configurar firewall
print_message "Configurando firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Configurar SSL
print_message "Configurando SSL com Let's Encrypt..."
systemctl stop nginx
certbot certonly --standalone \
    --email admin@$DOMAIN \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN \
    -d api.$DOMAIN

# Atualizar Nginx para SSL
cp nginx-config.conf /etc/nginx/sites-available/janice-correia-api-ssl
cp nginx-frontend.conf /etc/nginx/sites-available/janice-correia-frontend-ssl

# Configurar SSL nos arquivos
sed -i "s/janicecorreia.com/$DOMAIN/g" /etc/nginx/sites-available/janice-correia-api-ssl
sed -i "s/janicecorreia.com/$DOMAIN/g" /etc/nginx/sites-available/janice-correia-frontend-ssl

# Habilitar SSL e remover HTTP
rm -f /etc/nginx/sites-enabled/janice-correia-api
rm -f /etc/nginx/sites-enabled/janice-correia-frontend
ln -sf /etc/nginx/sites-available/janice-correia-api-ssl /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/janice-correia-frontend-ssl /etc/nginx/sites-enabled/

# Reiniciar Nginx com SSL
nginx -t
systemctl restart nginx

# Configurar renovação automática SSL
echo "0 12 * * * root certbot renew --quiet --nginx" >> /etc/crontab

# Deploy do frontend
print_message "Deploy do frontend..."
cd ..

print_message "Instalando dependências do frontend..."
npm ci

print_message "Build do frontend..."
npm run build

print_message "Copiando arquivos do frontend..."
rm -rf /var/www/janice-correia-frontend/*
cp -r dist/* /var/www/janice-correia-frontend/
chown -R www-data:www-data /var/www/janice-correia-frontend
chmod -R 755 /var/www/janice-correia-frontend

# Criar comandos úteis
cat > /usr/local/bin/janice-status << 'EOF'
#!/bin/bash
echo "=== STATUS JANICE CORREIA ==="
echo "Backend (PM2):"
pm2 status
echo ""
echo "Nginx:"
systemctl status nginx --no-pager -l
echo ""
echo "SSL Certificates:"
certbot certificates 2>/dev/null || echo "Certbot não configurado"
echo ""
echo "Health Check:"
curl -s http://localhost:3001/health || echo "Backend não respondendo"
EOF

chmod +x /usr/local/bin/janice-status

cat > /usr/local/bin/janice-update << 'EOF'
#!/bin/bash
cd /var/www/janice-correia
git pull origin main
cd api
npm ci
npm run build
pm2 restart all
cd ..
npm ci
npm run build
rm -rf /var/www/janice-correia-frontend/*
cp -r dist/* /var/www/janice-correia-frontend/
echo "✅ Atualização concluída!"
EOF

chmod +x /usr/local/bin/janice-update

print_header "DEPLOY CONCLUÍDO! 🎉"
print_message "✅ Backend rodando: https://api.$DOMAIN"
print_message "✅ Frontend rodando: https://$DOMAIN"
print_message "✅ SSL configurado e ativo"
print_message "✅ Firewall configurado"
print_message "✅ Tudo automatizado!"
echo ""
print_message "🛠️ Comandos úteis criados:"
echo "  janice-status    - Ver status completo do sistema"
echo "  janice-update    - Atualizar código e fazer deploy"
echo "  pm2 status       - Ver processos Node.js"
echo "  pm2 logs         - Ver logs do backend"
echo ""
print_warning "⚠️  IMPORTANTE: Configure seu DNS!"
echo "    Aponte $DOMAIN e api.$DOMAIN para 72.61.52.78"
echo "    Aguarde propagação DNS (pode levar até 24h)"
echo ""
print_message "🧪 Teste seus sites:"
echo "    Frontend: https://$DOMAIN"
echo "    Backend: https://api.$DOMAIN"
echo "    Health: https://api.$DOMAIN/health"
echo ""
print_message "📧 Dúvidas? Execute 'janice-status' para verificar tudo!"