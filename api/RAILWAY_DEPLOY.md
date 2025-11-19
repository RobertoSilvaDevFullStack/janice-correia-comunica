# Environment Variables para Deploy no Railway

## Configuração Obrigatória no Railway Dashboard:

### Database (PostgreSQL já existente)
```
DATABASE_URL=postgresql://postgres:DRuPZFnOPNrVryMMlkMmqiOBxjdkZyXv@centerbeam.proxy.rlwy.net:27766/railway
```

### JWT Secret (GERAR NOVA CHAVE SEGURA)
```
# Gerar com: openssl rand -base64 32
# OU use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=sua_chave_jwt_super_segura_aqui_minimo_32_caracteres
```

### Server Configuration
```
PORT=3001
NODE_ENV=production
```

### CORS Configuration
```
# URL do frontend (atualize com a URL do seu deploy)
FRONTEND_URL=https://seu-dominio-frontend
```

## Comandos para Gerar JWT Secret:

### Opção 1 - OpenSSL (Recomendado)
```bash
openssl rand -base64 32
```

### Opção 2 - Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Opção 3 - PowerShell (Windows)
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

## Health Check
A API tem endpoint de health check em: `/health`

## Build e Start Commands
- Build: `npm run build`
- Start: `npm start`

## Estrutura do Deploy
- Root Directory: `api` (IMPORTANTE!)
- Build Output: `dist/`
- Main File: `dist/index.js`