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

### 2025-11-20
- API e Uploads
  - Adicionado endpoint `POST /api/media/upload` (multipart/form-data) com `multer`, validação de tipo e tamanho, retorno de URL pública.
  - Exposição estática de arquivos em `/uploads` via Express.
  - Leads: inserção resiliente ao esquema via detecção dinâmica de colunas (suporta `company`, `source`, `interest`, `message`, `status`).
  - Testimonials: `GET /api/testimonials` agora aceita `?status=approved|pending|rejected|all` (default `approved`).

- Admin (Frontend)
  - Formulário de depoimento passou a carregar por ID (`useTestimonial(id)`) e enviar `status` na atualização; criação permanece com `pending` por padrão.
  - Campo `avatar` tornou-se opcional (fallback visual com iniciais quando ausente).
  - Uploader de imagem atualizado para enviar `multipart/form-data` ao novo endpoint e usar URL pública retornada.
  - Lista de depoimentos ajustada para `useTestimonials('all')` com ações rápidas “Aprovar” e “Rejeitar”.

- Site (Frontend)
  - InstagramFeed: substituição completa de API por imagens locais de `src/assets`, com hover, indicação de clique, abertura segura do Instagram e tratamentos de erro.
  - Navbar: criação de submenu “Treinamento para empresas” em Palestras e “Mentoria Individual” em Mentoria; comportamento de dropdown estabilizado (sem flicker) e remoção dos itens “Blog” e “Contato”.
  - Páginas novas:
    - `/treinamento-empresas`: página de “Treinamento Corporativo” com hero responsivo e conteúdo textual completo. Sidebar de navegação foi removida conforme orientação.
    - `/mentoria`: página dedicada com cabeçalho, blocos de conteúdo, inscrição, seção “Mentoria Individual” e FAQ; remoção das seções “Buscar mentor” e “Calendário” conforme solicitado.
  - Hero: botões do topo passam a navegar para `#mentorias` (curso de oratória) e `#palestras` (treinamentos) com scroll suave.
  - Depoimentos: remoção do card “Resultados Comprovados” e CTA associado.
  - Blog: ocultado da navegação e componentes relacionados desativados.

- Correções adicionais
  - Servir uploads e ajustar CORS para evitar erros de rede em imagens.
  - Ajustes de layout e containers (`max-w-7xl`, flex/grid) para evitar compressão de conteúdo.

### Observações e comandos úteis
- Aprovar depoimento diretamente no banco (PostgreSQL):
  - `UPDATE testimonials SET status='approved', updated_at=CURRENT_TIMESTAMP WHERE id='SEU_UUID';`
  - `UPDATE testimonials SET status='approved', updated_at=CURRENT_TIMESTAMP WHERE status='pending';`

- Uso do upload no Admin:
  - Enviar um arquivo via `multipart/form-data` para `POST /api/media/upload` (requer autenticação e perfil admin). A resposta contém `{ url: "/uploads/<arquivo>" }` para uso em `avatar`.

## Próximos Passos
- Configurar domínio e SSL
- Popular conteúdo via painel admin
- Otimizar imagens (compressão/formatos modernos) e considerar upgrade do `multer` para 2.x

## Licença
ISC

## Tecnologias

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Como editar o projeto

Instale Node.js e npm, clone o repositório e rode:

```
npm i
npm run dev
```

## Deploy

Use EasyPanel/Hostinger conforme seção de Deploy acima ou sua infraestrutura preferida.
