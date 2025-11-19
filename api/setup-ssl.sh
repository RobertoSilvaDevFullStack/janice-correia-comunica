#!/bin/bash

# Script de Configuração SSL com Let's Encrypt
# Uso: ./setup-ssl.sh

set -e

echo "🔒 Configurando SSL com Let's Encrypt..."

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

# Verificar se o Certbot está instalado
if ! command -v certbot &> /dev/null; then
    print_error "Certbot não está instalado! Execute setup-vps.sh primeiro."
    exit 1
fi

print_header "CONFIGURAÇÃO SSL"

# Solicitar domínios
read -p "Digite o domínio do frontend (ex: janicecorreia.com): " FRONTEND_DOMAIN
read -p "Digite o domínio do backend (ex: api.janicecorreia.com): " BACKEND_DOMAIN

if [ -z "$FRONTEND_DOMAIN" ] || [ -z "$BACKEND_DOMAIN" ]; then
    print_error "Domínios não podem estar vazios!"
    exit 1
fi

print_message "Configurando SSL para frontend: $FRONTEND_DOMAIN"
print_message "Configurando SSL para backend: $BACKEND_DOMAIN"

# Parar Nginx temporariamente
print_message "Parando Nginx temporariamente..."
systemctl stop nginx

# Obter certificados SSL
print_message "Obtendo certificados SSL..."
certbot certonly --standalone \
    --email admin@$FRONTEND_DOMAIN \
    --agree-tos \
    --no-eff-email \
    -d $FRONTEND_DOMAIN \
    -d www.$FRONTEND_DOMAIN \
    -d $BACKEND_DOMAIN \
    -d www.$BACKEND_DOMAIN

# Verificar se os certificados foram obtidos com sucesso
if [ ! -f "/etc/letsencrypt/live/$FRONTEND_DOMAIN/fullchain.pem" ]; then
    print_error "Falha ao obter certificados SSL!"
    exit 1
fi

print_message "Certificados SSL obtidos com sucesso!"

# Atualizar configuração do Nginx para SSL
print_message "Atualizando configuração do Nginx para SSL..."

# Configuração SSL para Frontend
cat > /etc/nginx/sites-available/janice-correia-frontend-ssl << EOF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name $FRONTEND_DOMAIN www.$FRONTEND_DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$FRONTEND_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$FRONTEND_DOMAIN/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Root directory
    root /var/www/janice-correia-frontend/dist;
    index index.html index.htm;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # Handle React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
        
        location ~* \.html$ {
            expires 5m;
            add_header Cache-Control "public, no-cache";
        }
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
    
    # Block access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~* \.(env|git|gitignore|htaccess|htpasswd)$ {
        deny all;
    }
    
    # Logging
    access_log /var/log/nginx/janice-correia-frontend-access.log;
    error_log /var/log/nginx/janice-correia-frontend-error.log;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $FRONTEND_DOMAIN www.$FRONTEND_DOMAIN;
    return 301 https://\$server_name\$request_uri;
}
EOF

# Configuração SSL para Backend
cat > /etc/nginx/sites-available/janice-correia-api-ssl << EOF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name $BACKEND_DOMAIN www.$BACKEND_DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$FRONTEND_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$FRONTEND_DOMAIN/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;
    
    # Request size limit
    client_max_body_size 10M;
    
    # Proxy headers
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;
    
    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:3001;
        access_log off;
    }
    
    # API routes
    location / {
        proxy_pass http://127.0.0.1:3001;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
    
    # Block direct access to common attack vectors
    location ~ /\. {
        deny all;
    }
    
    location ~* \.(env|git|gitignore|htaccess|htpasswd)$ {
        deny all;
    }
    
    # Logging
    access_log /var/log/nginx/janice-correia-api-access.log;
    error_log /var/log/nginx/janice-correia-api-error.log;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $BACKEND_DOMAIN www.$BACKEND_DOMAIN;
    return 301 https://\$server_name\$request_uri;
}
EOF

# Habilitar sites
ln -sf /etc/nginx/sites-available/janice-correia-frontend-ssl /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/janice-correia-api-ssl /etc/nginx/sites-enabled/

# Remover configurações HTTP antigas
rm -f /etc/nginx/sites-enabled/janice-correia-frontend
rm -f /etc/nginx/sites-enabled/janice-correia-api

# Testar configuração
print_message "Testando configuração do Nginx..."
nginx -t

# Iniciar Nginx
print_message "Iniciando Nginx..."
systemctl start nginx
systemctl reload nginx

# Configurar renovação automática
print_message "Configurando renovação automática do SSL..."
echo "0 12 * * * root certbot renew --quiet --nginx" >> /etc/crontab

print_header "CONFIGURAÇÃO SSL CONCLUÍDA! ✅"
print_message "Seus sites agora estão seguros com SSL:"
echo "  🔒 Frontend: https://$FRONTEND_DOMAIN"
echo "  🔒 Backend: https://$BACKEND_DOMAIN"
echo ""
print_message "Certificados renovam automaticamente!"
print_message "Teste seus sites nos navegadores."