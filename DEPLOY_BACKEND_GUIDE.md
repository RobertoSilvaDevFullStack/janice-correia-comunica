# 🚀 GUIA COMPLETO: DEPLOY DO BACKEND NO RAILWAY

## ✅ PASSO A PASSO DETALHADO

### 1. ACESSO AO RAILWAY
1. Vá para [https://railway.app](https://railway.app)
2. Faça login com sua conta
3. Selecione seu projeto existente (onde já está o PostgreSQL)

### 2. CRIAR NOVO SERVIÇO PARA O BACKEND
1. Clique em **"New Service"** (ou "+ Add a Service")
2. Selecione **"GitHub Repo"**
3. Escolha o repositório do seu projeto
4. **IMPORTANTE CRÍTICO**: Configure o **"Root Directory"** como `api`
5. Clique em **"Deploy"**

### 3. CONFIGURAR VARIÁVEIS DE AMBIENTE
No dashboard do Railway, clique no novo serviço criado e vá em **"Variables"**:

```bash
# Database (PostgreSQL existente)
DATABASE_URL=postgresql://postgres:DRuPZFnOPNrVryMMlkMmqiOBxjdkZyXv@centerbeam.proxy.rlwy.net:27766/railway

# JWT Secret (GERAR NOVA CHAVE!)
JWT_SECRET=COLE_AQUI_SUA_CHAVE_SEGURA_DE_32_CARACTERES_MINIMO

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://seu-dominio-frontend
```

### 4. GERAR JWT SECURE KEY
Execute um destes comandos para gerar uma chave segura:

**Windows (PowerShell):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. VERIFICAR DEPLOY
1. Aguarde o deploy completar (2-3 minutos)
2. Clique em **"Deploy Logs"** para verificar se não há erros
3. Quando aparecer "🚀 Servidor rodando na porta 3001", está pronto!

### 6. OBTER URL PÚBLICA
1. Vá para a aba **"Settings"** do serviço
2. Copie a **"Service URL"** (ex: `https://api-production-xxxx.up.railway.app`)
3. **SALVE ESTA URL!** Você vai precisar dela para configurar o frontend

### 7. TESTAR A API
Teste os endpoints:
- Health Check: `https://sua-url.railway.app/health`
- Deve retornar: `{"status":"ok","timestamp":"2024-..."}`

---

## 🔧 CONFIGURAÇÃO DO FRONTEND

Após o backend estar no ar, você precisa atualizar a URL da API no frontend:

### Arquivo: `src/lib/api.ts`
```typescript
// Substitua esta linha:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Por:
const API_URL = 'https://sua-url.railway.app/api';
```

### Ou configure na sua plataforma de hospedagem:
```bash
VITE_API_URL=https://sua-url.railway.app/api
```

---

## 🚨 SOLUÇÃO DE PROBLEMAS

### Erro: "Build failed"
1. Verifique se `railway.toml` está na pasta `api/`
2. Confirme que o build local funciona: `cd api && npm run build`

### Erro: "Cannot connect to database"
1. Verifique se `DATABASE_URL` está correto
2. Teste a conexão localmente primeiro

### Erro: "JWT Secret inválido"
1. Garanta que tem pelo menos 32 caracteres
2. Use apenas caracteres alfanuméricos e símbolos seguros

### Erro: "CORS blocked"
1. Verifique se `FRONTEND_URL` está correta
2. Inclua `https://` no início

---

## ✅ VERIFICAÇÃO FINAL

Após tudo configurado, teste:

1. **Health Check**: `https://sua-url.railway.app/health`
2. **Login Admin**: `https://sua-url.railway.app/api/auth/login`
3. **Blog Posts**: `https://sua-url.railway.app/api/blog`

Se todos retornarem dados corretos, **PARABÉNS!** 🎉

---

## 📋 ARQUIVOS CRIADOS/MODIFICADOS
- ✅ `api/railway.toml` - Configuração do deploy
- ✅ `api/.railwayignore` - Arquivos ignorados no deploy
- ✅ `api/RAILWAY_DEPLOY.md` - Documentação detalhada

**Seu backend está pronto para deploy! 🚀**