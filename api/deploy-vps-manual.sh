#!/bin/bash

# Script de Deploy para VPS Hostinger 72.61.52.78
# Deploy completo do Janice Correia Portfolio
# Execute este script no VPS como root

set -e

echo "🚀 Iniciando deploy completo do Janice Correia Portfolio..."
echo "📍 VPS: 72.61.52.78"
echo ""

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

# Configurações
DOMAIN="${DOMAIN:-janicecorreia.com}"
BACKEND_PORT="3001"
FRONTEND_PORT="3000"
PROJECT_DIR="/var/www/janice-correia"
BACKEND_DIR="$PROJECT_DIR/api"
FRONTEND_DIR="$PROJECT_DIR/frontend"

print_header "ETAPA 1: PREPARAÇÃO DO SISTEMA"

# Atualizar sistema
print_message "Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências essenciais
print_message "Instalando dependências essenciais..."
apt install -y curl wget git nginx software-properties-common

# Instalar Node.js 18.x
print_message "Instalando Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PM2 globalmente
print_message "Instalando PM2..."
npm install -g pm2

# Instalar PostgreSQL (se solicitado)
if [ "$INSTALL_POSTGRES" = "s" ] || [ "$INSTALL_POSTGRES" = "S" ]; then
    print_header "ETAPA 2: INSTALAÇÃO DO POSTGRESQL"
    print_message "Instalando PostgreSQL..."
    apt install -y postgresql postgresql-contrib
    
    # Iniciar PostgreSQL
    systemctl start postgresql
    systemctl enable postgresql
    
    print_message "PostgreSQL instalado e iniciado"
fi

print_header "ETAPA 3: PREPARAÇÃO DO PROJETO"

# Criar diretórios
print_message "Criando estrutura de diretórios..."
mkdir -p $PROJECT_DIR
mkdir -p $BACKEND_DIR
mkdir -p $FRONTEND_DIR
mkdir -p /var/log/janice-correia

# Clonar repositório (ou copiar arquivos)
print_message "Preparando arquivos do projeto..."
cd $PROJECT_DIR

# Se você já tem os arquivos localmente, copie-os para cá
# Caso contrário, descomente a linha abaixo para clonar do GitHub
# git clone https://github.com/RobertoSilvaDevFullStack/janice-correia-comunica.git .

print_warning "⚠️  Certifique-se de que os arquivos do projeto estejam em: $PROJECT_DIR"

print_header "ETAPA 4: CONFIGURAÇÃO DO BACKEND"

cd $BACKEND_DIR

# Instalar dependências do backend
print_message "Instalando dependências do backend..."
npm install

# Compilar TypeScript
print_message "Compilando TypeScript..."
npm run build

# Criar arquivo .env para produção
print_message "Criando arquivo de configuração..."
cat > .env.production << EOF
NODE_ENV=production
PORT=$BACKEND_PORT
DATABASE_URL=postgresql://postgres:sua_senha_aqui@localhost:5432/janice_correia
JWT_SECRET=sua_chave_secreta_super_segura_aqui
FRONTEND_URL=https://$DOMAIN
EOF

print_warning "⚠️  Atualize o DATABASE_URL e JWT_SECRET no arquivo .env.production"

# Configurar PM2 para o backend
print_message "Configurando PM2 para o backend..."
pm2 delete janice-correia-api 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd -u root --hp /root

print_header "ETAPA 5: CONFIGURAÇÃO DO FRONTEND"

cd $FRONTEND_DIR

# Instalar dependências do frontend
print_message "Instalando dependências do frontend..."
npm install

# Build do frontend
print_message "Construindo frontend..."
npm run build

print_header "ETAPA 6: CONFIGURAÇÃO DO NGINX"

# Criar configuração do Nginx
print_message "Configurando Nginx..."
cat > /etc/nginx/sites-available/janice-correia << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root $FRONTEND_DIR/dist;
    index index.html;

    # Frontend
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # Logs
    access_log /var/log/janice-correia/access.log;
    error_log /var/log/janice-correia/error.log;
}
EOF

# Habilitar site
ln -sf /etc/nginx/sites-available/janice-correia /etc/nginx/sites-enabled/

# Testar configuração do Nginx
nginx -t

print_header "ETAPA 7: CONFIGURAÇÃO DO SSL COM LET'S ENCRYPT"

# Instalar Certbot
print_message "Instalando Certbot..."
apt install -y certbot python3-certbot-nginx

# Obter certificado SSL (descomente após configurar o DNS)
print_message "Obtendo certificado SSL..."
print_warning "⚠️  Certifique-se de que o DNS esteja configurado para apontar para 72.61.52.78"
print_warning "⚠️  Descomente a linha abaixo após configurar o DNS"
# certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

print_header "ETAPA 8: BANCO DE DADOS"

# Criar banco de dados e usuário (se PostgreSQL foi instalado)
if [ "$INSTALL_POSTGRES" = "s" ] || [ "$INSTALL_POSTGRES" = "S" ]; then
    print_message "Configurando banco de dados..."
    
    # Criar banco de dados
    sudo -u postgres psql -c "CREATE DATABASE janice_correia;"
    
    # Criar usuário (opcional)
    # sudo -u postgres psql -c "CREATE USER janice_user WITH PASSWORD 'sua_senha';"
    # sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE janice_correia TO janice_user;"
    
    print_warning "⚠️  Execute as migrations do banco de dados manualmente"
fi

print_header "ETAPA 9: SERVIÇOS E MONITORAMENTO"

# Reiniciar Nginx
print_message "Reiniciando Nginx..."
systemctl restart nginx
systemctl enable nginx

# Configurar firewall (se UFW estiver disponível)
if command -v ufw &> /dev/null; then
    print_message "Configurando firewall..."
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
fi

# Criar script de backup
print_message "Criando script de backup..."
cat > /usr/local/bin/backup-janice.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/janice-correia"
mkdir -p $BACKUP_DIR

# Backup do banco de dados
sudo -u postgres pg_dump janice_correia > $BACKUP_DIR/db_backup_$DATE.sql

# Backup dos arquivos do projeto
tar -czf $BACKUP_DIR/project_backup_$DATE.tar.gz -C /var/www janice-correia

# Remover backups antigos (manter últimos 7 dias)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup concluído: $DATE"
EOF

chmod +x /usr/local/bin/backup-janice.sh

# Adicionar ao crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-janice.sh") | crontab -

print_header "DEPLOY CONCLUÍDO! 🎉"

echo ""
echo "✅ Deploy do Janice Correia Portfolio concluído com sucesso!"
echo "📍 VPS: 72.61.52.78"
echo "🌐 Domínio: $DOMAIN"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o DNS para apontar para 72.61.52.78"
echo "2. Atualize o DATABASE_URL em $BACKEND_DIR/.env.production"
echo "3. Atualize o JWT_SECRET no arquivo .env.production"
echo "4. Execute: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "5. Execute as migrations do banco de dados"
echo "6. Reinicie os serviços: pm2 restart all && systemctl restart nginx"
echo ""
echo "📊 Comandos úteis:"
echo "- Ver logs: pm2 logs janice-correia-api"
echo "- Status: pm2 status"
echo "- Reiniciar: pm2 restart janice-correia-api"
echo "- Backup manual: /usr/local/bin/backup-janice.sh"
echo ""
echo "🔧 Arquivos de configuração:"
echo "- Backend: $BACKEND_DIR/.env.production"
echo "- Nginx: /etc/nginx/sites-available/janice-correia"
echo "- Logs: /var/log/janice-correia/"
echo ""
print_message "Deploy concluído! 🚀"