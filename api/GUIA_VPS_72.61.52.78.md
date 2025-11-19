# 🚀 GUIA DE DEPLOY - VPS 72.61.52.78

## 📌 **INFORMAÇÕES DA SUA VPS**
- **IP:** 72.61.52.78
- **Repositório:** https://github.com/RobertoSilvaDevFullStack/janice-correia-comunica
- **Script Principal:** `deploy-vps-72.61.52.78.sh`

---

## ⚡ **DEPLOY ULTRA RÁPIDO - 3 COMANDOS**

### **1. Conectar na VPS:**
```bash
ssh root@72.61.52.78
```

### **2. Executar script completo:**
```bash
# Baixar e executar script personalizado
wget https://raw.githubusercontent.com/RobertoSilvaDevFullStack/janice-correia-comunica/main/api/deploy-vps-72.61.52.78.sh
chmod +x deploy-vps-72.61.52.78.sh
sudo ./deploy-vps-72.61.52.78.sh
```

**O script vai perguntar:**
- Seu domínio (ex: `janicecorreia.com`)
- Se quer PostgreSQL local ou manter o Railway

### **3. Aguardar deploy completar ✅**

---

## 🎯 **MODO DETALHADO - PASSO A PASSO**

### **ETAPA 1: Conectar na VPS**
```bash
ssh root@72.61.52.78
```

### **ETAPA 2: Preparar ambiente**
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
sudo apt install -y git curl wget vim htop nginx

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2
```

### **ETAPA 3: Clonar repositório**
```bash
# Criar diretório do projeto
mkdir -p /var/www/janice-correia
cd /var/www/janice-correia

# Clonar seu repositório
git clone https://github.com/RobertoSilvaDevFullStack/janice-correia-comunica.git .
cd api
```

### **ETAPA 4: Configurar backend**
```bash
# Copiar env de exemplo
cp .env.vps.example .env

# EDITAR .env com seus dados
nano .env

# Tornar scripts executáveis
chmod +x *.sh

# Instalar dependências
npm ci

# Build
npm run build

# Iniciar com PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd -u root --hp /root
```

### **ETAPA 5: Configurar Nginx**
```bash
# Copiar configurações
sudo cp nginx-config.conf /etc/nginx/sites-available/janice-correia-api
sudo cp nginx-frontend.conf /etc/nginx/sites-available/janice-correia-frontend

# Atualizar com seu domínio
sudo sed -i 's/janicecorreia.com/SEU_DOMINIO/g' /etc/nginx/sites-available/*

# Habilitar sites
sudo ln -sf /etc/nginx/sites-available/janice-correia-api /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/janice-correia-frontend /etc/nginx/sites-enabled/

# Testar e reiniciar
sudo nginx -t
sudo systemctl restart nginx
```

### **ETAPA 6: SSL (HTTPS)**
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificados
sudo certbot --nginx -d SEU_DOMINIO -d www.SEU_DOMINIO -d api.SEU_DOMINIO
```

### **ETAPA 7: Frontend**
```bash
# Voltar para raiz do projeto
cd /var/www/janice-correia

# Instalar dependências
npm ci

# Build
npm run build

# Copiar para Nginx
sudo rm -rf /var/www/janice-correia-frontend/*
sudo cp -r dist/* /var/www/janice-correia-frontend/
sudo chown -R www-data:www-data /var/www/janice-correia-frontend
```

---

## 🔧 **CONFIGURAÇÃO DNS**

**Configure seus domínios apontando para 72.61.52.78:**

```
Type: A
Name: @
Value: 72.61.52.78

Type: A  
Name: api
Value: 72.61.52.78

Type: A
Name: www
Value: 72.61.52.78
```

---

## 🎛️ **COMANDOS ÚTEIS PARA VPS 72.61.52.78**

### **Status do Sistema:**
```bash
# Ver tudo
janice-status

# Backend
pm2 status
pm2 logs

# Nginx
sudo systemctl status nginx
sudo nginx -t

# SSL
sudo certbot certificates
```

### **Atualizar código:**
```bash
janice-update
```

### **Logs:**
```bash
# Backend
pm2 logs

# Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🚨 **SOLUÇÃO DE PROBLEMAS - VPS 72.61.52.78**

### **Backend não inicia:**
```bash
cd /var/www/janice-correia/api
pm2 logs
node check-db.js
```

### **Nginx erro 502:**
```bash
# Verificar se backend está rodando
curl http://localhost:3001/health

# Ver logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Testar config
sudo nginx -t
```

### **SSL não funciona:**
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

---

## 📋 **VERIFICAÇÃO FINAL**

Após deploy, teste:

```bash
# Health check do backend
curl http://localhost:3001/health

# Testar dominios (após DNS propagar)
curl https://api.seu-dominio.com/health
curl https://seu-dominio.com
```

---

## 🎉 **PRONTO!**

**Seu projeto está configurado para rodar na VPS 72.61.52.78!**

**Execute o script completo ou siga o passo a passo e seu site estará no ar! 🚀**