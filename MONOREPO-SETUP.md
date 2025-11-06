# 🎯 Monorepo - Janice Correia Portfolio

Este projeto usa estrutura **monorepo** com frontend e backend no mesmo repositório.

## 📁 Estrutura do Projeto

```
janice-correia-portfolio/
├── src/                    # Frontend (React + Vite)
│   ├── components/
│   ├── pages/
│   ├── hooks/             # React Query hooks
│   ├── lib/               # Utilitários (api.ts)
│   └── ...
├── api/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/        # Configuração do DB
│   │   ├── controllers/   # Lógica de negócio
│   │   ├── middleware/    # Auth, validação
│   │   ├── models/        # Schemas Zod
│   │   ├── routes/        # Rotas da API
│   │   └── index.ts       # Entry point
│   ├── scripts/           # Scripts SQL
│   └── package.json
├── public/                # Assets estáticos
└── package.json           # Frontend dependencies
```

## 🚀 Setup Inicial

### 1. Frontend (já configurado)
```bash
npm install
npm run dev
```

### 2. Backend (API)
```bash
cd api
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Inicializar banco de dados
# Execute o SQL em scripts/init-db.sql no Railway PostgreSQL

# Rodar API
npm run dev
```

### 3. Variáveis de Ambiente

**Frontend (`.env` na raiz):**
```
VITE_API_URL=http://localhost:3001/api
VITE_WHATSAPP_NUMBER=5511999999999
```

**Backend (`api/.env`):**
```
DATABASE_URL=postgresql://postgres:DRuPZFnOPNrVryMMlkMmqiOBxjdkZyXv@postgres.railway.internal:5432/railway
JWT_SECRET=seu_jwt_secret_aqui
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🗄️ Banco de Dados

### Inicializar Schema
Execute o conteúdo de `api/scripts/init-db.sql` no seu PostgreSQL Railway:

```bash
# Opção 1: Via Railway CLI
railway run psql $DATABASE_URL < api/scripts/init-db.sql

# Opção 2: Copiar e colar no Railway PostgreSQL console
```

### Tabelas Criadas:
- `users` - Administradores
- `blog_posts` - Posts do blog
- `leads` - Contatos/formulários
- `testimonials` - Depoimentos

## 🔐 Primeiro Acesso Admin

Após executar o script SQL, você terá um usuário admin padrão:
- **Email:** admin@janicecorreia.com
- **Senha:** Admin@123

⚠️ **IMPORTANTE:** Mude esta senha imediatamente em produção!

Para gerar um novo hash de senha:
```javascript
const bcrypt = require('bcrypt');
bcrypt.hash('SuaNovaSenha', 10, (err, hash) => console.log(hash));
```

## 🛠️ Desenvolvimento

### Rodar ambos (frontend + backend) simultaneamente

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd api
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:3001

## 📦 Deploy

### Frontend (Lovable/Vercel)
- O frontend será deployado automaticamente pelo Lovable
- Configure as variáveis de ambiente no Lovable:
  - `VITE_API_URL`: URL da API em produção (Railway)
  - `VITE_WHATSAPP_NUMBER`: Seu número de WhatsApp

### Backend (Railway)

1. **Criar novo serviço no Railway:**
   - New Project → Deploy from GitHub repo
   - Selecionar este repositório
   - Railway detecta Node.js automaticamente

2. **Configurar Root Directory:**
   - Em Settings → Root Directory: `/api`

3. **Configurar variáveis de ambiente:**
   ```
   DATABASE_URL=<copiar do PostgreSQL Railway>
   JWT_SECRET=<gerar string aleatória segura>
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=<URL do frontend em produção>
   ```

4. **Deploy:**
   - Railway fará build e deploy automaticamente
   - Copie a URL gerada (ex: `https://seu-app.railway.app`)

5. **Atualizar frontend:**
   - No Lovable, configure `VITE_API_URL` com a URL da API Railway

## 🔗 Integração Frontend ↔ Backend

### Fazer requisição da API:
```typescript
import api from '@/lib/api';

// GET
const { data } = await api.get('/blog/posts');

// POST (público)
const { data } = await api.post('/leads', { name, email, ... });

// POST (admin - token automático via interceptor)
const { data } = await api.post('/blog/posts', postData);
```

### React Query Hooks:
```typescript
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useCreateLead } from '@/hooks/useLeads';

// Buscar posts
const { data: posts, isLoading } = useBlogPosts();

// Criar lead
const createLead = useCreateLead();
createLead.mutate({ name, email, ... });
```

## 📚 Documentação da API

Ver detalhes completos em: `api/README.md`

### Rotas Principais:
- `POST /api/auth/login` - Login
- `GET /api/blog/posts` - Listar posts
- `POST /api/leads` - Criar lead (formulário)
- `GET /api/testimonials` - Listar depoimentos

## 🐛 Troubleshooting

**Erro de conexão do frontend com API:**
- Verificar se a API está rodando (terminal 2)
- Verificar `VITE_API_URL` no `.env`
- Verificar CORS na API (`api/src/index.ts`)

**Erro de autenticação:**
- Verificar `JWT_SECRET` no `api/.env`
- Limpar localStorage do navegador
- Fazer login novamente

**Erro de conexão com banco:**
- Verificar `DATABASE_URL` no `api/.env`
- Verificar se PostgreSQL Railway está ativo
- Verificar se executou o `init-db.sql`

## ✅ Próximos Passos

1. ✅ Implementar Modal de Contato Global
2. ✅ Criar WhatsApp Button Flutuante
3. ✅ Adicionar avatares aos depoimentos
4. ✅ Implementar SEO completo
5. ✅ Criar conteúdo completo do blog
6. ✅ Desenvolver Painel Admin
