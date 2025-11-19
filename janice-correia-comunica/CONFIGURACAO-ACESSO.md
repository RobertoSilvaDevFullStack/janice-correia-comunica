# 🔐 Guia de Configuração - Acesso ao Dashboard

## ✅ Arquivos Configurados

Os seguintes arquivos foram configurados automaticamente:
- ✅ `.env` (raiz) - Variáveis do frontend
- ✅ `api/.env` - Variáveis do backend
- ✅ `api/scripts/init-db.sql` - Script com hash de senha correto

## 📋 Checklist de Configuração

### 1. ✅ Configuração do Backend

O arquivo `api/.env` já foi criado com as configurações corretas:

```env
DATABASE_URL=postgresql://postgres:DRuPZFnOPNrVryMMlkMmqiOBxjdkZyXv@postgres.railway.internal:5432/railway
JWT_SECRET=s9f50b2758b92ea1c177f09aa318a7244
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### 2. ✅ Configuração do Frontend

O arquivo `.env` na raiz já foi atualizado:

```env
VITE_API_URL=http://localhost:3001/api
```

### 3. 🔄 Executar Script do Banco de Dados

**IMPORTANTE:** Você precisa executar o script SQL no seu banco PostgreSQL Railway.

**Opção A - Via Railway Console (Recomendado):**

1. Acesse o Railway Dashboard
2. Clique no serviço **PostgreSQL**
3. Vá na aba **Data**
4. Abra o arquivo `api/scripts/init-db.sql` deste projeto
5. **Copie TODO o conteúdo** do arquivo
6. **Cole** no console SQL do Railway
7. Clique em **Execute** ou **Run**

**Opção B - Via Railway CLI:**

```bash
# Se você tem o Railway CLI instalado
railway connect postgres

# Depois cole o conteúdo do init-db.sql ou execute:
\i api/scripts/init-db.sql
```

### 4. 📦 Instalar Dependências

```bash
# Dependências do Frontend (na raiz)
npm install

# Dependências do Backend
cd api
npm install
cd ..
```

### 5. 🚀 Iniciar os Servidores

**Terminal 1 - Backend:**
```bash
cd api
npm run dev
```

Você deve ver:
```
🚀 Servidor rodando na porta 3001
📍 Ambiente: development
✅ Connected to PostgreSQL database
```

**Terminal 2 - Frontend (em outra janela/aba):**
```bash
npm run dev
```

Você deve ver:
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:8080/
```

### 6. 🔓 Fazer Login

1. Acesse: **http://localhost:8080/admin/login**
2. Use as credenciais:
   - **Email:** `admin@janicecorreia.com`
   - **Senha:** `Admin@123`
3. Clique em **Entrar**
4. Você será redirecionado para: **http://localhost:8080/admin/dashboard**

## 🔍 Verificação de Problemas

### ❌ Problema: Backend não conecta ao banco

**Sintomas:**
- Erro no console: "❌ Unexpected error on idle client"
- Não consegue iniciar o servidor

**Solução:**
1. Verifique se a `DATABASE_URL` no `api/.env` está correta
2. Teste a conexão acessando o Railway e verificando o status do PostgreSQL
3. Certifique-se de que está usando a URL interna do Railway: `postgres.railway.internal`

### ❌ Problema: "Token inválido ou expirado"

**Sintomas:**
- Login não funciona
- Erro 403 ao tentar acessar o dashboard

**Solução:**
1. Verifique se o `JWT_SECRET` no `api/.env` tem pelo menos 32 caracteres
2. Limpe o localStorage do navegador:
   ```javascript
   // Cole no console do navegador (F12)
   localStorage.clear();
   ```
3. Tente fazer login novamente

### ❌ Problema: "Credenciais inválidas"

**Sintomas:**
- Email e senha corretos mas não consegue logar

**Solução:**
1. **Execute o script `init-db.sql` no Railway** (passo 3 acima)
2. O hash da senha no banco deve ser exatamente:
   ```
   $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW
   ```
3. Este hash corresponde à senha: `Admin@123`

### ❌ Problema: CORS Error

**Sintomas:**
- Erro no console: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solução:**
1. Verifique se `FRONTEND_URL` no `api/.env` é: `http://localhost:8080`
2. Reinicie o servidor backend após alterar o `.env`
3. Limpe o cache do navegador

### ❌ Problema: Frontend não conecta à API

**Sintomas:**
- Erro de rede ao tentar fazer login
- Requisições para `http://localhost:3001` falham

**Solução:**
1. Verifique se o backend está rodando (Terminal 1)
2. Acesse `http://localhost:3001/health` no navegador
   - Deve retornar: `{"status":"ok","timestamp":"..."}`
3. Verifique se `VITE_API_URL` no `.env` da raiz é: `http://localhost:3001/api`
4. **Reinicie o frontend** após alterar variáveis de ambiente

## 📞 Suporte

Se ainda tiver problemas:

1. **Verifique os logs do backend** no Terminal 1
2. **Verifique o console do navegador** (F12 → Console)
3. **Verifique a aba Network** (F12 → Network) para ver as requisições

### Comandos Úteis para Debug:

```bash
# Verificar se o backend está rodando
curl http://localhost:3001/health

# Testar login manualmente
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@janicecorreia.com","password":"Admin@123"}'

# Deve retornar um token JWT se estiver funcionando
```

## ⚠️ Segurança

**IMPORTANTE para produção:**

1. **Mude a senha padrão** imediatamente após o primeiro acesso
2. Gere um novo `JWT_SECRET` forte e seguro (32+ caracteres)
3. Use um hash de senha único e forte
4. Não commite o arquivo `api/.env` no git (já está no .gitignore)

### Para gerar um novo hash de senha:

```bash
cd api
node scripts/generate-password-hash.js
# Digite sua nova senha
# Copie o hash gerado
# Atualize no banco de dados
```
