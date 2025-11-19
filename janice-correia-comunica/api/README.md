# Janice Correia - API Backend

API REST para gerenciamento do portfólio de Janice Correia.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **PostgreSQL** - Banco de dados (Railway)
- **JWT** - Autenticação
- **Zod** - Validação de schemas
- **Bcrypt** - Hash de senhas

## 📦 Instalação

```bash
cd api
npm install
```

## ⚙️ Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no `.env`:
```
DATABASE_URL=postgresql://postgres:DRuPZFnOPNrVryMMlkMmqiOBxjdkZyXv@postgres.railway.internal:5432/railway
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. Inicialize o banco de dados:
```bash
psql $DATABASE_URL < scripts/init-db.sql
```

## 🏃 Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📚 Rotas da API

### Autenticação
- `POST /api/auth/login` - Login (público)
- `POST /api/auth/register` - Registrar admin (requer admin)

### Blog
- `GET /api/blog/posts` - Listar posts (público)
- `GET /api/blog/posts/:slug` - Ver post por slug (público)
- `POST /api/blog/posts` - Criar post (admin)
- `PUT /api/blog/posts/:id` - Atualizar post (admin)
- `DELETE /api/blog/posts/:id` - Deletar post (admin)

### Leads/Contatos
- `POST /api/leads` - Criar lead (público)
- `GET /api/leads` - Listar leads (admin)
- `PATCH /api/leads/:id/status` - Atualizar status (admin)

### Depoimentos
- `GET /api/testimonials` - Listar depoimentos aprovados (público)
- `POST /api/testimonials` - Criar depoimento (admin)
- `PUT /api/testimonials/:id` - Atualizar depoimento (admin)
- `DELETE /api/testimonials/:id` - Deletar depoimento (admin)

## 🔐 Autenticação

Para rotas protegidas, envie o token JWT no header:
```
Authorization: Bearer seu_token_jwt
```

## 📊 Deploy no Railway

1. Conecte seu repositório no Railway
2. Configure as variáveis de ambiente
3. Railway detectará automaticamente o Node.js e fará o build
4. Execute o script de inicialização do banco:
   - Acesse o PostgreSQL no Railway
   - Execute o conteúdo de `scripts/init-db.sql`

## 🛡️ Segurança

- ✅ Helmet.js para security headers
- ✅ Rate limiting (100 req/15min por IP)
- ✅ CORS configurado
- ✅ Validação de inputs com Zod
- ✅ Senhas hasheadas com bcrypt
- ✅ JWT com expiração de 24h

## 📝 Próximos Passos

- [ ] Implementar refresh tokens
- [ ] Adicionar testes automatizados
- [ ] Configurar CI/CD
- [ ] Adicionar logger estruturado (Winston)
- [ ] Implementar upload de imagens
