#!/bin/bash

# Script de instalação PostgreSQL para VPS Hostinger
# Uso: ./install-postgresql-vps.sh

set -e

echo "🐘 Instalando PostgreSQL na VPS..."

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
   print_error "Execute: sudo ./install-postgresql-vps.sh"
   exit 1
fi

print_header "INSTALAÇÃO POSTGRESQL - VPS HOSTINGER"

# Atualizar sistema
print_message "Atualizando sistema..."
apt update && apt upgrade -y

# Instalar PostgreSQL
print_message "Instalando PostgreSQL..."
apt install -y postgresql postgresql-contrib postgresql-client

# Iniciar e habilitar serviço
print_message "Iniciando PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

# Verificar status
if systemctl is-active --quiet postgresql; then
    print_message "✅ PostgreSQL iniciado com sucesso"
else
    print_error "❌ Falha ao iniciar PostgreSQL"
    exit 1
fi

# Criar banco de dados e usuário
read -p "Digite o nome do banco de dados (padrão: janice_correia): " DB_NAME
DB_NAME=${DB_NAME:-janice_correia}

read -p "Digite o nome do usuário (padrão: janice_user): " DB_USER
DB_USER=${DB_USER:-janice_user}

read -p "Digite a senha do usuário (será gerada automaticamente se deixar vazio): " DB_PASS
if [ -z "$DB_PASS" ]; then
    DB_PASS=$(openssl rand -base64 12)
    print_message "Senha gerada: $DB_PASS"
fi

print_message "Criando banco de dados e usuário..."
sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

# Configurar acesso externo
print_message "Configurando acesso externo..."
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf

echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/*/main/pg_hba.conf

# Reiniciar PostgreSQL
print_message "Reiniciando PostgreSQL..."
systemctl restart postgresql

# Configurar firewall
print_message "Configurando firewall..."
ufw allow 5432/tcp || print_warning "Firewall não configurado ou já permite PostgreSQL"

# Criar arquivo de backup automático
print_message "Configurando backup automático..."
cat > /usr/local/bin/backup-postgresql.sh << 'EOF'
#!/bin/bash
# Backup automático do PostgreSQL
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/postgresql"
mkdir -p $BACKUP_DIR

# Backup de todos os bancos
sudo -u postgres pg_dumpall > $BACKUP_DIR/all-databases-$DATE.sql

# Remover backups antigos (manter últimos 7 dias)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup concluído: $BACKUP_DIR/all-databases-$DATE.sql"
EOF

chmod +x /usr/local/bin/backup-postgresql.sh

# Adicionar ao crontab (backup diário às 3h)
echo "0 3 * * * root /usr/local/bin/backup-postgresql.sh" >> /etc/crontab

# Configurar monitoramento
print_message "Configurando monitoramento..."
cat > /usr/local/bin/check-postgresql.sh << 'EOF'
#!/bin/bash
# Verificar status do PostgreSQL

if systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL está rodando"
    
    # Verificar conexão
    if sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ Conexão OK"
    else
        echo "❌ Falha na conexão"
        exit 1
    fi
else
    echo "❌ PostgreSQL não está rodando"
    exit 1
fi
EOF

chmod +x /usr/local/bin/check-postgresql.sh

# Criar arquivo .env com configurações
print_message "Criando arquivo de configuração..."
cat > postgresql-config.env << EOF
# Configurações PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=$DB_NAME
POSTGRES_USER=$DB_USER
POSTGRES_PASSWORD=$DB_PASS
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
EOF

print_header "POSTGRESQL INSTALADO COM SUCESSO! 🎉"
print_message "✅ Serviço instalado e configurado"
print_message "✅ Banco de dados criado: $DB_NAME"
print_message "✅ Usuário criado: $DB_USER"
print_message "✅ Acesso externo configurado"
print_message "✅ Backup automático configurado"
print_message "✅ Monitoramento configurado"

echo ""
echo "📋 INFORMAÇÕES IMPORTANTES:"
echo "   Banco de dados: $DB_NAME"
echo "   Usuário: $DB_USER" 
echo "   Senha: $DB_PASS"
echo "   Host: localhost:5432"
echo ""
echo "🔗 URL de conexão:"
echo "   postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
echo ""
echo "🛠️ Comandos úteis:"
echo "   check-postgresql.sh    - Verificar status"
echo "   backup-postgresql.sh   - Fazer backup manual"
echo "   psql -U $DB_USER -d $DB_NAME  - Conectar ao banco"
echo ""
echo "📁 Config salva em: postgresql-config.env"