#!/bin/bash

# Script de Deploy Rápido para Hostinger VPS
# Uso: ./deploy-all.sh
# Script completo para deploy do zero na VPS

set -e

echo "🚀 Iniciando deploy completo na Hostinger VPS..."

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
   print_error "Execute: sudo ./deploy-all.sh"
   exit 1
fi

print_header "DEPLOY JANICE CORREIA - HOSTINGER VPS"

# Solicitar informações do usuário
read -p "Digite o domínio principal (ex: janicecorreia.com): " DOMAIN
read -p "Digite o IP da sua VPS Hostinger: " VPS_IP
read -p "Deseja instalar PostgreSQL local? (s/n): " -n 1 -r
INSTALL_POSTGRES=$REPLY
echo

if [ -z "$DOMAIN" ] || [ - -z "$VPS_IP" ]; then
    print_error "Domínio e IP são obrigatórios!"
    exit 1
fi

print_message "Iniciando deploy para: $DOMAIN"
print_message "VPS IP: $VPS_IP"

# Criar diretório do projeto
print_message "Criando estrutura do projeto..."
mkdir -p /var/www/janice-correia
cd /var/www/janice-correia

# Clonar repositório
print_message "Clonando repositório..."
git clone https://github.com/RobertoSilvaDevFullStack/janice-correia-comunica.git .

# Executar setup da VPS
print_message "Executando setup da VPS..."
cd api
chmod +x *.sh
./setup-vps.sh

# Instalar PostgreSQL se solicitado
if [[ $INSTALL_POSTGRES =~ ^[Ss]$ ]]; then
    print_message "Instalando PostgreSQL..."
    apt install -y postgresql postgresql-contrib
    
    # Configurar banco de dados
    sudo -u postgres psql << EOF
CREATE DATABASE janice_correia;
CREATE USER janice_user WITH PASSWORD '$(openssl rand -base64 12)';
GRANT ALL PRIVILEGES ON DATABASE janice_correia TO janice_user;
EOF
    
    # Configurar acesso externo
    sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf
    echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/*/main/pg_hba.conf
    systemctl restart postgresql
fi

# Criar arquivo .env
print_message "Criando arquivo de configuração..."
cat > .env << EOF
# Database
DATABASE_URL=postgresql://janice_user:$(openssl rand -base64 12)@localhost:5432/janice_correia

# JWT
JWT_SECRET=$(openssl rand -base64 32)

# Server
PORT=3001
NODE_ENV=production

# CORS
FRONTEND_URL=https://$DOMAIN
EOF

# Deploy do backend
print_message "Deploy do backend..."
./deploy-backend.sh

# Configurar Nginx
print_message "Configurando Nginx..."
cp nginx-config.conf /etc/nginx/sites-available/janice-correia-api
cp nginx-frontend.conf /etc/nginx/sites-available/janice-correia-frontend

# Atualizar domínios nos arquivos de configuração
sed -i "s/janicecorreia.com/$DOMAIN/g" /etc/nginx/sites-available/janice-correia-api
sed -i "s/janicecorreia.com/$DOMAIN/g" /etc/nginx/sites-available/janice-correia-frontend

# Habilitar sites
ln -sf /etc/nginx/sites-available/janice-correia-api /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/janice-correia-frontend /etc/nginx/sites-enabled/

# Testar e reiniciar Nginx
nginx -t
systemctl reload nginx

# Configurar SSL
print_message "Configurando SSL..."
./setup-ssl.sh

# Deploy do frontend
print_message "Deploy do frontend..."
cd ..
./deploy-frontend.sh

# Criar script de manutenção
print_header "CRIANDO SCRIPTS DE MANUTENÇÃO"

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
./deploy-backend.sh
cd ..
./deploy-frontend.sh
echo "✅ Atualização concluída!"
EOF

chmod +x /usr/local/bin/janice-update

# Criar usuário deploy (opcional)
read -p "Deseja criar usuário 'deploy' para manutenção? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    adduser deploy
    usermod -aG sudo deploy
    chown -R deploy:deploy /var/www/janice-correia
    print_message "Usuário 'deploy' criado com sucesso!"
fi

print_header "DEPLOY CONCLUÍDO! 🎉"
print_message "✅ Backend rodando: https://api.$DOMAIN"
print_message "✅ Frontend rodando: https://$DOMAIN"
print_message "✅ SSL configurado"
print_message "✅ Tudo automatizado!"
echo ""
print_message "Comandos úteis:"
echo "  janice-status    - Ver status completo"
echo "  janice-update    - Atualizar código e fazer deploy"
echo "  pm2 status       - Ver processos Node.js"
echo "  pm2 logs         - Ver logs"
echo ""
print_warning "LEMBRE-SE: Configure seu DNS apontando $DOMAIN para $VPS_IP"
print_message "Aguarde propagação DNS (pode levar até 24h)"