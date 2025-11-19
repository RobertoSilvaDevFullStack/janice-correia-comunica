# 🚀 GUIA COMPLETO: DEPLOY NA HOSTINGER VPS

## 📋 **RESUMO DO QUE VOCÊ TEM AGORA**

✅ **Backend configurado** para VPS com PM2  
✅ **Nginx configurado** como reverse proxy  
✅ **Scripts de deploy** automatizados  
✅ **SSL com Let's Encrypt** configurado  
✅ **Documentação completa** para execução

---

## 🎯 **PASSO A PASSO PARA DEPLOY NA HOSTINGER**

### **ETAPA 1: PREPARAR A VPS (EXECUTAR UMA VEZ SÓ)**

```bash
# Conectar na sua VPS Hostinger via SSH
ssh root@SEU_IP_DA_VPS

# Baixar o código do projeto
git clone https://github.com/RobertoSilvaDevFullStack/janice-correia-comunica.git
cd janice-correia-comunica/api

# Tornar scripts executáveis
chmod +x *.sh

# Executar setup inicial (ISSO VAI INSTALAR TUDO!)
sudo ./setup-vps.sh
```

**O que este script faz:**
- ✅ Instala Node.js 18.x
- ✅ Instala PM2 globalmente
- ✅ Instala e configura Nginx
- ✅ Configura firewall (UFW)
- ✅ Prepara diretórios
- ✅ Instala Certbot para SSL

---

### **ETAPA 2: CONFIGURAR DOMÍNIOS NO DNS**

**Configure seus domínios apontando para o IP da sua VPS:**

```
# Exemplo de configuração DNS:
Type: A
Name: @ (ou vazio)
Value: SEU_IP_DA_VPS
TTL: 3600

Type: A  
Name: api
Value: SEU_IP_DA_VPS
TTL: 3600

Type: A
Name: www
Value: SEU_IP_DA_VPS
TTL: 3600
```

**Seus domínios ficarão assim:**
- `https://janicecorreia.com` → Frontend
- `https://api.janicecorreia.com` → Backend

---

### **ETAPA 3: CONFIGURAR VARIÁVEIS DE AMBIENTE**

**Crie arquivo `.env` na pasta `api/`:**

```bash
# Database (configure seu PostgreSQL na VPS ou use externo)
DATABASE_URL=postgresql://usuario:senha@localhost:5432/janice_correia

# JWT Secret (GERE UMA NOVA CHAVE!)
JWT_SECRET=$(openssl rand -base64 32)

# Server
PORT=3001
NODE_ENV=production

# CORS (ATUALIZE COM SEUS DOMÍNIOS!)
FRONTEND_URL=https://janicecorreia.com
```

**Para gerar JWT Secret:**
```bash
openssl rand -base64 32
```

---

### **ETAPA 4: INSTALAR E CONFIGURAR POSTGRESQL (OPCIONAL)**

**Se quiser PostgreSQL local na VPS:**

```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Criar banco e usuário
sudo -u postgres psql

# Dentro do PostgreSQL:
CREATE DATABASE janice_correia;
CREATE USER janice_user WITH PASSWORD 'sua_senha_forte';
GRANT ALL PRIVILEGES ON DATABASE janice_correia TO janice_user;
\q

# Configurar acesso externo (se necessário)
sudo nano /etc/postgresql/*/main/postgresql.conf
# Descomentar: listen_addresses = '*'

sudo nano /etc/postgresql/*/main/pg_hba.conf
# Adicionar: host all all 0.0.0.0/0 md5

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

---

### **ETAPA 5: DEPLOY DO BACKEND**

```bash
# Na pasta api/ da sua VPS
./deploy-backend.sh

# Verificar se está rodando
pm2 status
pm2 logs

# Testar health check
curl http://localhost:3001/health
```

---

### **ETAPA 6: CONFIGURAR NGINX**

```bash
# Copiar configurações Nginx
sudo cp nginx-config.conf /etc/nginx/sites-available/janice-correia-api
sudo cp nginx-frontend.conf /etc/nginx/sites-available/janice-correia-frontend

# Habilitar sites
sudo ln -sf /etc/nginx/sites-available/janice-correia-api /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/janice-correia-frontend /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

### **ETAPA 7: CONFIGURAR SSL (HTTPS)**

```bash
# Execute o script SSL (com seus domínios)
./setup-ssl.sh

# Ou manualmente com Certbot:
sudo certbot --nginx -d janicecorreia.com -d www.janicecorreia.com -d api.janicecorreia.com
```

---

### **ETAPA 8: DEPLOY DO FRONTEND**

```bash
# Deploy do frontend (desde a raiz do projeto)
./deploy-frontend.sh
```

---

## 🔧 **COMANDOS ÚTEIS PARA GERENCIAMENTO**

### **PM2 (Backend)**
```bash
pm2 status              # Ver status
pm2 logs                # Ver logs
pm2 restart all         # Reiniciar tudo
pm2 stop janice-correia-api    # Parar app
pm2 start janice-correia-api   # Iniciar app
pm2 monit               # Monitorar em tempo real
```

### **Nginx**
```bash
sudo nginx -t           # Testar configuração
sudo systemctl status nginx    # Ver status
sudo systemctl restart nginx   # Reiniciar
sudo systemctl reload nginx    # Recarregar config
```

### **Logs**
```bash
# Logs do Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Logs do PM2
pm2 logs

# Logs do sistema
sudo journalctl -u nginx -f
```

---

## 🚨 **SOLUÇÃO DE PROBLEMAS**

### **Backend não inicia**
```bash
# Ver logs
pm2 logs

# Verificar variáveis de ambiente
pm2 env 0

# Testar conexão com banco
node check-db.js
```

### **Nginx erro 502 Bad Gateway**
```bash
# Verificar se backend está rodando
curl http://localhost:3001/health

# Ver logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Testar configuração
sudo nginx -t
```

### **SSL não funciona**
```bash
# Verificar certificados
sudo certbot certificates

# Renovar manualmente
sudo certbot renew --dry-run

# Verificar configuração Nginx
sudo nginx -t
```

---

## 📁 **ESTRUTURA DE ARQUIVOS CRIADOS**

```
api/
├── ecosystem.config.js          # Config PM2
├── nginx-config.conf            # Config Nginx backend
├── nginx-frontend.conf          # Config Nginx frontend
├── deploy-backend.sh            # Script deploy backend
├── deploy-frontend.sh           # Script deploy frontend
├── setup-vps.sh                 # Setup inicial VPS
├── setup-ssl.sh                 # Configuração SSL
└── HOSTINGER_DEPLOY_GUIDE.md    # Este guia
```

---

## 🎯 **VERIFICAÇÃO FINAL**

**Após tudo configurado, teste:**

1. **Health Check Backend:**
   ```bash
   curl https://api.seu-dominio.com/health
   ```

2. **Frontend:**
   ```
   https://seu-dominio.com
   ```

3. **API endpoints:**
   ```
   https://api.seu-dominio.com/api/blog
   https://api.seu-dominio.com/api/auth/login
   ```

---

## 🚀 **PRÓXIMOS PASSOS**

**Após o deploy funcionando:**

1. **Configure backup automático** do banco de dados
2. **Configure monitoramento** (ex: UptimeRobot)
3. **Configure CDN** para imagens (ex: Cloudflare)
4. **Otimize performance** (cache, gzip, etc)

---

**🎉 PARABÉNS! Seu projeto está pronto para rodar na Hostinger VPS!**

**Dúvidas?** Execute os scripts e me diga se encontrar algum problema!