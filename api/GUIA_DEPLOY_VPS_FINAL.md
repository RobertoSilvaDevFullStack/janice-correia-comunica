# 🚀 GUIA DE DEPLOY PARA VPS HOSTINGER - 72.61.52.78

## 📋 RESUMO DAS CORREÇÕES APLICADAS

✅ **TODOS OS ERROS DE BANCO DE DADOS FORAM RESOLVIDOS:**
- Colunas 'status' adicionadas em testimonials, palestras e mentorias
- Permissões configuradas corretamente
- API endpoints funcionando sem erros 500/403

## 🔧 PASSO A PASSO PARA DEPLOY

### 1. ACESSO AO VPS
```bash
# Conectar ao VPS Hostinger
ssh root@72.61.52.78
```

### 2. PREPARAÇÃO DO SISTEMA
```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar dependências essenciais
apt install -y curl wget git nginx software-properties-common

# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PM2 globalmente
npm install -g pm2

# Instalar PostgreSQL
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

### 3. CONFIGURAÇÃO DO PROJETO
```bash
# Criar estrutura de diretórios
mkdir -p /var/www/janice-correia
mkdir -p /var/log/janice-correia

# Navegar para diretório do projeto
cd /var/www/janice-correia

# COPIAR ARQUIVOS DO PROJETO
# ⚠️ Você precisa copiar os arquivos do projeto para o VPS
# Use SCP, FTP ou qualquer método de transferência de arquivos
```

### 4. BACKEND - CONFIGURAÇÃO
```bash
# Entrar no diretório do backend
cd /var/www/janice-correia/api

# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Criar arquivo .env.production
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/janice_correia
JWT_SECRET=SUACHAVESECRETA256BITSAQUI
FRONTEND_URL=https://janicecorreia.com
EOF

# Configurar banco de dados
sudo -u postgres psql -c "CREATE DATABASE janice_correia;"

# Executar correções do banco de dados
node fix-missing-columns-v2.js
node fix-all-system.sh

# Configurar PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd -u root --hp /root
```

### 5. FRONTEND - CONFIGURAÇÃO
```bash
# Entrar no diretório do frontend
cd /var/www/janice-correia/janice-correia-comunica

# Instalar dependências
npm install

# Build do frontend
npm run build
```

### 6. NGINX - CONFIGURAÇÃO
```bash
# Criar configuração do Nginx
cat > /etc/nginx/sites-available/janice-correia << 'EOF'
server {
    listen 80;
    server_name janicecorreia.com www.janicecorreia.com;
    root /var/www/janice-correia/janice-correia-comunica/dist;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
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

# Testar configuração
nginx -t

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx
```

### 7. SSL - CONFIGURAÇÃO
```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obter certificado SSL (execute após configurar DNS)
certbot --nginx -d janicecorreia.com -d www.janicecorreia.com --non-interactive --agree-tos -m admin@janicecorreia.com
```

### 8. FIREWALL - CONFIGURAÇÃO
```bash
# Configurar firewall
apt install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

### 9. MONITORAMENTO E BACKUP
```bash
# Criar script de backup
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

# Agendar backup diário
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-janice.sh") | crontab -
```

## 🧪 TESTES FINAIS

### Testar Backend
```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/testimonials
curl http://localhost:3001/api/palestras
```

### Testar Frontend
Abrir no navegador: `http://72.61.52.78`

### Testar Admin Dashboard
Abrir no navegador: `http://72.61.52.78/admin/login`

## 📊 COMANDOS ÚTEIS

```bash
# Ver logs do backend
pm2 logs janice-correia-api

# Status do PM2
pm2 status

# Reiniciar serviços
pm2 restart janice-correia-api
systemctl restart nginx

# Backup manual
/usr/local/bin/backup-janice.sh

# Ver logs do Nginx
tail -f /var/log/janice-correia/error.log
tail -f /var/log/janice-correia/access.log
```

## ⚠️ IMPORTANTE - ARQUIVOS A COPIAR PARA O VPS

Certifique-se de copiar todos estes arquivos para o VPS:

### Backend (api/):
- `package.json`, `package-lock.json`
- `tsconfig.json`, `ecosystem.config.js`
- `src/` (todo o código fonte)
- Arquivos de correção: `fix-*.js`, `*.sh`

### Frontend (janice-correia-comunica/):
- `package.json`, `package-lock.json`
- `vite.config.ts`, `tsconfig.json`
- `src/` (todo o código fonte)
- `public/` (arquivos estáticos)

## 🎯 STATUS DO DEPLOY

✅ **BANCO DE DADOS**: Correções aplicadas e funcionando
✅ **BACKEND**: API funcionando sem erros
✅ **FRONTEND**: Build funcionando
✅ **CORREÇÕES**: Todas as colunas 'status' adicionadas

**O projeto está pronto para deploy no VPS Hostinger 72.61.52.78!** 🚀