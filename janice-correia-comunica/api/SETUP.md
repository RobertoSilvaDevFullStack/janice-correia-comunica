# Configuração do Backend

## 1. Instalar Dependências

```bash
cd api
npm install
```

## 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL=postgresql://usuario:senha@host:5432/database

# JWT Secret (mínimo 32 caracteres)
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui_com_32_caracteres_ou_mais

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

## 3. Configurar Banco de Dados

### Opção A: Usar Railway/Render/Heroku
- Crie um banco PostgreSQL na plataforma
- Copie a `DATABASE_URL` e cole no `.env`

### Opção B: PostgreSQL Local
```bash
# Instale o PostgreSQL
# Em seguida, crie um banco:
createdb janicecorreia
```

## 4. Executar Script de Inicialização

Execute o script SQL para criar as tabelas:

```bash
# Se estiver usando psql:
psql -U seu_usuario -d janicecorreia -f scripts/init-db.sql

# Ou conecte ao banco e execute o conteúdo do arquivo init-db.sql
```

## 5. Gerar Hash de Senha (Opcional)

Se quiser mudar a senha padrão, use o script:

```bash
node scripts/generate-password-hash.js
```

Digite a nova senha e copie o hash gerado. Atualize o `init-db.sql` ou execute um UPDATE diretamente no banco.

## 6. Iniciar o Servidor

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

## Credenciais Padrão

**⚠️ IMPORTANTE: Mude estas credenciais em produção!**

- **Email:** admin@janicecorreia.com
- **Senha:** Admin@123

## Testando a API

```bash
# Testar login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@janicecorreia.com","password":"Admin@123"}'
```

## Estrutura do Banco de Dados

O script `init-db.sql` cria as seguintes tabelas:
- `users` - Usuários administradores
- `blog_posts` - Posts do blog
- `leads` - Leads/contatos
- `testimonials` - Depoimentos
- `palestras` - Palestras
- `mentorias` - Mentorias

## Próximos Passos

1. Execute o script `init-db.sql` no seu banco PostgreSQL
2. Configure o `.env` com suas credenciais
3. Inicie o servidor com `npm run dev`
4. Acesse o frontend e faça login com as credenciais padrão
5. **Mude a senha do admin imediatamente após o primeiro acesso!**
