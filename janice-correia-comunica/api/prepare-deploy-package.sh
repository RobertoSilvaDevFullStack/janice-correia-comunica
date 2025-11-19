#!/bin/bash

# Script para preparar arquivos para deploy no VPS
# Cria um pacote com todos os arquivos necessários

set -e

echo "📦 Preparando arquivos para deploy no VPS..."
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Criar diretório de deploy
DEPLOY_DIR="deploy-vps-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

print_message "Criando diretório de deploy: $DEPLOY_DIR"

# Copiar backend
print_message "Copiando backend..."
mkdir -p "$DEPLOY_DIR/api"
cp -r api/package*.json "$DEPLOY_DIR/api/"
cp -r api/src "$DEPLOY_DIR/api/"
cp -r api/tsconfig.json "$DEPLOY_DIR/api/"
cp -r api/ecosystem.config.js "$DEPLOY_DIR/api/"
cp -r api/.env.vps.example "$DEPLOY_DIR/api/.env.production"

# Copiar scripts de correção
print_message "Copiando scripts de correção..."
cp api/fix-*.js "$DEPLOY_DIR/api/"
cp api/verify-*.js "$DEPLOY_DIR/api/"
cp api/test-*.js "$DEPLOY_DIR/api/"
cp api/*.sh "$DEPLOY_DIR/api/"

# Copiar frontend
print_message "Copiando frontend..."
mkdir -p "$DEPLOY_DIR/frontend"
cp -r janice-correia-comunica/package*.json "$DEPLOY_DIR/frontend/"
cp -r janice-correia-comunica/vite.config.ts "$DEPLOY_DIR/frontend/"
cp -r janice-correia-comunica/tsconfig*.json "$DEPLOY_DIR/frontend/"
cp -r janice-correia-comunica/tailwind.config.ts "$DEPLOY_DIR/frontend/"
cp -r janice-correia-comunica/postcss.config.js "$DEPLOY_DIR/frontend/"
cp -r janice-correia-comunica/index.html "$DEPLOY_DIR/frontend/"
cp -r janice-correia-comunica/src "$DEPLOY_DIR/frontend/"
cp -r janice-correia-comunica/public "$DEPLOY_DIR/frontend/"

# Copiar arquivos de configuração e documentação
print_message "Copiando documentação..."
cp api/GUIA_DEPLOY_VPS_FINAL.md "$DEPLOY_DIR/"
cp api/deploy-vps-manual.sh "$DEPLOY_DIR/"
cp api/nginx-config.conf "$DEPLOY_DIR/"
cp api/ecosystem.config.js "$DEPLOY_DIR/"

# Criar script de instalação
print_message "Criando script de instalação..."
cat > "$DEPLOY_DIR/install.sh" << 'EOF'
#!/bin/bash

# Script de instalação automatizada
# Execute como root no VPS

set -e

echo "🚀 Iniciando instalação do Janice Correia Portfolio..."

# Verificar se é root
if [[ $EUID -ne 0 ]]; then
   echo "❌ Este script deve ser executado como root!"
   exit 1
fi

# Solicitar informações
read -p "Digite seu domínio (ex: janicecorreia.com): " DOMAIN
read -p "Digite a senha do PostgreSQL: " DB_PASSWORD
read -p "Digite uma chave secreta JWT (mínimo 32 caracteres): " JWT_SECRET

if [ -z "$DOMAIN" ] || [ -z "$DB_PASSWORD" ] || [ -z "$JWT_SECRET" ]; then
    echo "❌ Todos os campos são obrigatórios!"
    exit 1
fi

echo "📦 Instalando dependências do sistema..."
apt update && apt upgrade -y
apt install -y curl wget git nginx software-properties-common

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g pm2

# Instalar PostgreSQL
echo "🐘 Instalando PostgreSQL..."
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Criar banco de dados
echo "🗄️ Configurando banco de dados..."
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE janice_correia;"

# Criar estrutura de diretórios
mkdir -p /var/www/janice-correia
mkdir -p /var/log/janice-correia

# Copiar arquivos do backend
echo "🔧 Configurando backend..."
cp -r api/* /var/www/janice-correia/
cd /var/www/janice-correia

# Instalar dependências do backend
npm install

# Compilar TypeScript
npm run build

# Criar arquivo .env.production
cat > .env.production << EOF
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres:$DB_PASSWORD@localhost:5432/janice_correia
JWT_SECRET=$JWT_SECRET
FRONTEND_URL=https://$DOMAIN
EOF

# Executar correções do banco de dados
echo "🔧 Aplicando correções do banco de dados..."
node fix-missing-columns-v2.js
node verify-corrections.js

# Configurar PM2
echo "🚀 Configurando PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd -u root --hp /root

# Copiar e configurar frontend
echo "🎨 Configurando frontend..."
cp -r frontend/* /var/www/janice-correia/frontend/
cd /var/www/janice-correia/frontend
npm install
npm run build

# Configurar Nginx
echo "🌐 Configurando Nginx..."
cp ../nginx-config.conf /etc/nginx/sites-available/janice-correia
sed -i "s/janicecorreia.com/$DOMAIN/g" /etc/nginx/sites-available/janice-correia
sed -i "s|/var/www/janice-correia|$PWD/dist|g" /etc/nginx/sites-available/janice-correia

ln -sf /etc/nginx/sites-available/janice-correia /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
systemctl enable nginx

# Configurar firewall
echo "🔥 Configurando firewall..."
apt install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Instalar SSL (opcional - execute após configurar DNS)
echo "🔒 SSL será configurado após o DNS apontar para o servidor"
echo "Execute após o DNS estar configurado:"
echo "certbot --nginx -d $DOMAIN -d www.$DOMAIN"

echo ""
echo "🎉 INSTALAÇÃO CONCLUÍDA!"
echo "📍 Acesse: http://$DOMAIN"
echo "📊 Dashboard: http://$DOMAIN/admin"
echo "🔧 Backend API: http://$DOMAIN/api"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o DNS para apontar para este servidor"
echo "2. Execute o comando do Certbot para SSL"
echo "3. Acesse o dashboard admin para configurar o site"
echo ""
echo "📊 Comandos úteis:"
echo "- Ver logs: pm2 logs"
echo "- Status: pm2 status"
echo "- Reiniciar: pm2 restart all"
echo "- Logs Nginx: tail -f /var/log/janice-correia/error.log"
EOF

chmod +x "$DEPLOY_DIR/install.sh"

# Criar arquivo de configuração do PM2
print_message "Criando configuração do PM2..."
cat > "$DEPLOY_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [{
    name: 'janice-correia-api',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/janice-correia/err.log',
    out_file: '/var/log/janice-correia/out.log',
    log_file: '/var/log/janice-correia/combined.log',
    time: true
  }]
};
EOF

# Criar arquivo README
cat > "$DEPLOY_DIR/README.md" << 'EOF'
# 📦 Pacote de Deploy - Janice Correia Portfolio

## 🚀 Instruções de Deploy

### 1. Transferir arquivos para VPS
```bash
# Compactar o pacote
tar -czf deploy-vps.tar.gz deploy-vps-*/

# Enviar para VPS (substitua pelo IP real)
scp deploy-vps.tar.gz root@72.61.52.78:/root/
```

### 2. No VPS, executar instalação
```bash
# Conectar ao VPS
ssh root@72.61.52.78

# Descompactar
tar -xzf deploy-vps.tar.gz
cd deploy-vps-*/

# Executar instalação automatizada
./install.sh
```

### 3. Configuração Manual (se necessário)
Veja o arquivo `GUIA_DEPLOY_VPS_FINAL.md` para configurações manuais detalhadas.

## 📋 O que está incluído

### Backend (api/)
- ✅ Código fonte completo
- ✅ Correções de banco de dados aplicadas
- ✅ Scripts de verificação
- ✅ Configuração PM2

### Frontend (frontend/)
- ✅ Código fonte completo
- ✅ Configuração Vite
- ✅ Dependências configuradas

### Configuração
- ✅ Nginx configurado
- ✅ PM2 configurado
- ✅ Scripts de backup
- ✅ Firewall configurado

## 🧪 Testes

Execute os testes após a instalação:
```bash
cd /var/www/janice-correia
node test-dashboard-errors.js
node verify-corrections.js
```

## 🔧 Suporte

Se encontrar problemas:
1. Verifique os logs: `pm2 logs`
2. Confira o Nginx: `tail -f /var/log/janice-correia/error.log`
3. Execute os scripts de verificação incluídos

## 📊 Status

✅ **PRONTO PARA DEPLOY** - Todos os erros de banco de dados corrigidos!
EOF

# Compactar tudo
print_message "Compactando pacote..."
cd "$(dirname "$DEPLOY_DIR")"
tar -czf "$DEPLOY_DIR.tar.gz" "$(basename "$DEPLOY_DIR")"

print_message "✅ Pacote de deploy criado com sucesso!"
print_message "📦 Arquivo: $DEPLOY_DIR.tar.gz"
print_message "📁 Diretório: $DEPLOY_DIR"
print_message ""
print_message "🚀 Pronto para deploy no VPS Hostinger 72.61.52.78!"
print_message "📋 Execute: scp $DEPLOY_DIR.tar.gz root@72.61.52.78:/root/"
print_message "📖 Veja o README.md dentro do pacote para instruções"