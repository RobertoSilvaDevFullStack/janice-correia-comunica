<<<<<<< HEAD
# Frontend – Janice Correia
=======
# Janice Correia – Site e API

Plataforma completa (frontend + backend) para o portfólio da Janice Correia, com painel administrativo, blog, captação de leads, palestras e mentorias. Este repositório contém:
- Frontend em React + TypeScript + Vite (Shadcn/UI, Tailwind, React Router, TanStack Query)
- Backend em Node.js + Express + TypeScript
- Banco de dados PostgreSQL

## Arquitetura
- `api/`: backend Express (TypeScript), endpoints REST e integração com PostgreSQL
- `janice-correia-comunica/`: frontend React/Vite (painel admin e site público)
- Scripts auxiliares para diagnóstico de banco, correções e deploy

## Estado Atual
- API funcional localmente em `http://localhost:3001`
- Healthcheck: `GET /health`
- Banco consistente: colunas `status` adicionadas e verificadas em `testimonials`, `palestras`, `mentorias`; `blog_posts` e `leads` já tinham `status`
- Endpoints verificados:
  - `GET /api/testimonials` → []
  - `GET /api/blog/posts` → []
  - `GET /api/palestras` → 4 registros
  - `GET /api/mentorias` → 3 registros
  - `GET /api/leads` → 401 (protegido)

## Variáveis de Ambiente
Backend (`api/.env` ou `.env.production`):
- `NODE_ENV=production`
- `PORT=3001`
- `DATABASE_URL=postgresql://<usuario>:<senha>@<host>:5432/janice_correia`
- `JWT_SECRET=<chave segura>`
- `FRONTEND_URL=https://seu-dominio`

Frontend (`janice-correia-comunica/.env`):
- `VITE_API_URL=https://seu-dominio/api` (padrão local: `http://localhost:3001/api`)

## Desenvolvimento Local
Backend:
```
cd api
npm ci
npm run dev
```
Frontend:
```
cd janice-correia-comunica
npm ci
npm run dev
```

## Endpoints Principais
- Health: `GET /health`
- Auth: `POST /api/auth/login`
- Blog:
  - `GET /api/blog/posts`
  - `GET /api/blog/posts/:slug`
- Testimonials: `GET /api/testimonials`
- Palestras: `GET /api/palestras`
- Mentorias: `GET /api/mentorias`
- Leads (admin): `GET /api/leads`

## Scripts Úteis (api/)
- `verify-corrections.js`: verifica colunas `status` e permissões
- `fix-missing-columns-v2.js`: adiciona colunas `status` faltantes (testimonials, palestras, mentorias) e ajusta permissões em ambiente local
- `test-dashboard-errors.js`: simula requisições do dashboard para validar erro 500/403
- `diagnose-database.sh`: diagnóstico de banco (Linux)
- `deploy-vps-72.61.52.78.sh`: deploy assistido (Linux, root)
- `deploy-vps-manual.sh`: roteiro completo de deploy manual (Linux, root)
- `prepare-deploy-package.sh`: empacota backend+frontend+config para envio ao VPS

## Deploy (Hostinger VPS + EasyPanel)
Recomendado usar EasyPanel para dois serviços:
- API (Aplicativo): build `npm ci && npm run build`, start `node dist/index.js`, porta `3001`
- Frontend (Aplicativo): build `npm ci && npm run build`, servir `dist` (ex.: `npx serve -s dist -l 3000`)

Variáveis:
- API: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `PORT=3001`
- Frontend: `VITE_API_URL=https://seu-dominio/api`

Banco:
- Se API e Postgres estiverem no mesmo projeto EasyPanel, use host `janice_db`
- Caso contrário, use o IP da VPS e porta `5432`

SSL e Domínio:
- Configurar domínio no EasyPanel e ativar SSL (ou Certbot)

### Passo a passo no EasyPanel
- Criar projeto (ou usar existente) para o banco: garantir serviço Postgres `janice_db` ativo
- Criar serviço “Aplicativo” para API:
  - Contexto: diretório `api/`
  - Build: `npm ci && npm run build`
  - Start: `node dist/index.js`
  - Porta interna: `3001`
  - Variáveis: `PORT=3001`, `JWT_SECRET`, `FRONTEND_URL`, `DATABASE_URL=postgresql://postgres:<SENHA>@janice_db:5432/janice_correia`
  - Healthcheck: `GET /health`
- Criar serviço “Aplicativo” para o frontend:
  - Contexto: diretório `janice-correia-comunica/`
  - Build: `npm ci && npm run build`
  - Start: `npx serve -s dist -l 3000`
  - Porta interna: `3000`
  - Variáveis: `VITE_API_URL=https://seu-dominio/api`
- Domínios: apontar o domínio para o serviço do frontend e ativar SSL

## Segurança
- JWT em headers para rotas protegidas
- Helmet, Rate Limiting, CORS restrito
- Sem `multer` instalado por padrão (removido devido a vulnerabilidades). Adicionar apenas quando necessário com validação estrita

## Mudanças Realizadas (Changelog)
1. Banco de Dados
   - Adição das colunas `status` em `testimonials`, `palestras`, `mentorias`
   - Verificação de colunas e permissões com `verify-corrections.js`
   - Scripts de correção automatizados e testes de endpoints
2. API
   - Healthcheck em `/health`
   - Testes de endpoints públicos e protegidos
3. Frontend
   - Ajuste de `VITE_API_URL` via `.env`
   - Validação de rotas e integração
4. Segurança de Dependências
   - Remoção de `multer` e `@types/multer` devido a avisos de severidade HIGH
5. Deploy
   - Criação de `deploy-vps-manual.sh`, `prepare-deploy-package.sh` e guia final (`HOSTINGER_DEPLOY_GUIDE.md` já existente + instruções no README)

## Próximos Passos
- Configurar domínio e SSL
- Popular conteúdo via painel admin
- Adicionar uploads com validação (se necessário), revisando dependências de upload com segurança

## Licença
ISC
>>>>>>> fca127f0d9a531d29b8bd8112796bfabe3a55c64

Aplicação React/Vite responsável pelo site público e painel administrativo.

## Scripts

```
npm run dev        # Desenvolvimento
npm run build      # Build de produção
npm run preview    # Servir build localmente
```

## Variáveis de ambiente

- `VITE_API_URL` → URL da API (ex.: `https://api.janicecorreia.com.br/api`)

## Tecnologias

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
