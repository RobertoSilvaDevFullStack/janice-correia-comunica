# Guia de Deploy do Backend no Railway

## Pré-requisitos
- Conta no Railway (https://railway.app)
- Repositório Git configurado (GitHub, GitLab, etc.)

## Passo 1: Preparar o Código

✅ **Já configurado:**
- `api/package.json` com scripts de build e start
- `api/railway.json` com configurações de deploy
- `api/tsconfig.json` para compilação TypeScript

## Passo 2: Criar Projeto no Railway

1. Acesse https://railway.app
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Conecte seu repositório
5. Selecione a pasta `api/` como **Root Directory**

## Passo 3: Configurar Variáveis de Ambiente

No Railway Dashboard do seu projeto, vá em **Variables** e adicione:

### Obrigatórias:

```
DATABASE_URL=postgresql://postgres:DRuPZFnOPNrVryMMlkMmqiOBxjdkZyXv@centerbeam.proxy.rlwy.net:27766/railway

JWT_SECRET=gere_uma_chave_super_segura_com_pelo_menos_32_caracteres_use_gerador_online

PORT=3001

NODE_ENV=production

FRONTEND_URL=https://seu-dominio-frontend
```

### ⚠️ IMPORTANTE - Gerar JWT_SECRET Seguro

Use um gerador online ou execute no terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Passo 4: Configurar Build Settings

No Railway, verifique:
- **Root Directory**: `api`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

## Passo 5: Deploy

1. O Railway vai iniciar o deploy automaticamente
2. Aguarde a build completar (~2-5 minutos)
3. Após o deploy, copie a **URL pública** gerada

Exemplo: `https://seu-backend.up.railway.app`

## Passo 6: Testar o Backend

```bash
# Testar health check
curl https://seu-backend.up.railway.app/health

# Testar login
curl -X POST https://seu-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@janicecorreia.com","password":"Admin@123"}'
```

## Passo 7: Atualizar Frontend

Após ter a URL pública do backend, atualize no seu frontend:

1. Crie/edite o arquivo `.env`:
```
VITE_API_URL=https://seu-backend.up.railway.app/api
```

2. Publique as mudanças na sua plataforma de hospedagem

## Passo 8: Atualizar CORS no Backend

Volte nas **Variables** do Railway e atualize:
```
FRONTEND_URL=https://seu-dominio-frontend
```

Railway vai fazer redeploy automaticamente.

## Verificação Final

1. ✅ Backend acessível pela URL pública
2. ✅ Health check retorna `{"status":"ok"}`
3. ✅ Login funciona e retorna token JWT
4. ✅ Frontend consegue fazer requisições ao backend
5. ✅ CORS configurado corretamente

## Troubleshooting

### Erro: "Not allowed by CORS"
- Verifique `FRONTEND_URL` no Railway
- Certifique-se que a URL do frontend está correta

### Erro: "Database connection failed"
- Verifique `DATABASE_URL` no Railway
- Teste conexão com o PostgreSQL

### Erro 500 Internal Server Error
- Verifique logs no Railway Dashboard
- Certifique-se que `JWT_SECRET` está definido

### Build falha
- Verifique se todas as dependências estão em `package.json`
- Certifique-se que o `Root Directory` está como `api`

## Monitoramento

No Railway Dashboard você pode:
- Ver logs em tempo real
- Monitorar uso de recursos
- Ver métricas de requisições
- Configurar alertas

## Custos

Railway oferece:
- **$5 de crédito grátis por mês** (suficiente para testes)
- Cobrança por uso depois dos créditos

Para projetos pequenos/médios, o custo é bem baixo (~$5-10/mês).

## Próximos Passos

Após o deploy bem-sucedido:
1. ✅ Testar todas as rotas da API
2. ✅ Configurar domínio customizado (opcional)
3. ✅ Implementar sistema de backup do banco
4. ✅ Configurar monitoramento de erros (Sentry)
5. ✅ Implementar CI/CD para deploys automáticos
