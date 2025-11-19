# 🚀 GUIA RÁPIDO - DEPLOY NA HOSTINGER VPS

## 📌 **RESUMÃO RÁPIDO**

**Repositório:** `https://github.com/RobertoSilvaDevFullStack/janice-correia-comunica`

**Script completo:** `./deploy-all.sh` (faz TUDO automaticamente!)

---

## ⚡ **MODO ULTRA RÁPIDO - 5 MINUTOS**

### **1. Conectar na VPS:**
```bash
ssh root@SEU_IP_DA_VPS
```

### **2. Executar script completo (FAZ TUDO!):**
```bash
# Baixar e executar deploy completo
cd /tmp
wget https://raw.githubusercontent.com/RobertoSilvaDevFullStack/janice-correia-comunica/main/api/deploy-all.sh
chmod +x deploy-all.sh
sudo ./deploy-all.sh
```

**O script vai perguntar:**
- Seu domínio (ex: janicecorreia.com)
- IP da VPS
- Se quer PostgreSQL local

### **3. Aguardar e pronto! 🎉**

---

## 🎯 **MODO DETALHADO - PASSO A PASSO**

### **ETAPA 1: Preparar VPS**
```bash
# Conectar
ssh root@SEU_IP_DA_VPS

# Instalar dependências básicas
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget vim nginx

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2
```

### **ETAPA 2: Clonar código**
```bash
# Criar diretório
mkdir -p /var/www/janice-correia
cd /var/www/janice-correia

# Clonar repositório
git clone https://github.com/RobertoSilvaDevFullStack/janice-correia-comunica.git .
cd api
```

### **ETAPA 3: Configurar Backend**
```bash
# Copiar env de exemplo
cp .env.vps.example .env

# EDITAR .env com seus dados reais
nano .env

# Tornar scripts executáveis
chmod +x *.sh

# Deploy backend
./deploy-backend.sh
```

### **ETAPA 4: Configurar Nginx**
```bash
# Copiar configs
sudo cp nginx-config.conf /etc/nginx/sites-available/janice-correia-api
sudo cp nginx-frontend.conf /etc/nginx/sites-available/janice-correia-frontend

# Atualizar domínio
sudo sed -i 's/janicecorreia.com/SEU_DOMINIO/g' /etc/nginx/sites-available/*

# Habilitar sites
sudo ln -sf /etc/nginx/sites-available/janice-correia-api /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/janice-correia-frontend /etc/nginx/sites-enabled/

# Testar e reiniciar
sudo nginx -t
sudo systemctl restart nginx
```

### **ETAPA 5: SSL (HTTPS)**
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificados
sudo certbot --nginx -d SEU_DOMINIO -d www.SEU_DOMINIO -d api.SEU_DOMINIO
```

### **ETAPA 6: Frontend**
```bash
# Voltar para raiz do projeto
cd /var/www/janice-correia

# Deploy frontend
./api/deploy-frontend.sh
```

---

## 🔧 **CONFIGURAÇÃO DNS**

**No seu provedor de domínio, configure:**

```
Type: A
Name: @
Value: SEU_IP_DA_VPS

Type: A  
Name: api
Value: SEU_IP_DA_VPS

Type: A
Name: www
Value: SEU_IP_DA_VPS
```

---

## 📋 **ARQUIVOS IMPORTANTES**

| Arquivo | Descrição |
|---------|-----------|
| `deploy-all.sh` | 🚀 **Script COMPLETO** - faz tudo! |
| `setup-vps.sh` | Setup inicial da VPS |
| `deploy-backend.sh` | Deploy do backend |
| `deploy-frontend.sh` | Deploy do frontend |
| `setup-ssl.sh` | Configuração SSL |
| `ecosystem.config.js` | Config PM2 |
| `nginx-*.conf` | Configs Nginx |

---

## ⚠️ **LEMBRETES IMPORTANTES**

1. **Configure DNS primeiro** (aponte domínio para VPS)
2. **Aguarde propagação DNS** (pode levar até 24h)
3. **Edite .env** com dados reais antes de deploy
4. **Teste health check:** `curl http://localhost:3001/health`

---

## 🎉 **APÓS DEPLOY**

- **Frontend:** https://seu-dominio.com
- **Backend:** https://api.seu-dominio.com
- **Health Check:** https://api.seu-dominio.com/health

**Comandos úteis:**
```bash
janice-status    # Ver tudo
janice-update    # Atualizar código
pm2 status       # Ver backend
pm2 logs         # Ver logs
```

---

**🚀 PRONTO! Seu projeto vai estar no ar em minutos!**