## Situação Atual
- Blog público usa dados estáticos (`src/data/blogArticles.ts` e `components/Blog.tsx`), não o banco.
- Palestras, Mentorias e Depoimentos também renderizam listas estáticas nos componentes.
- Admin Dashboard exibe contagens hardcoded (6 posts, 6 depoimentos, views), não do banco.
- API possui endpoints prontos para blog/palestras/mentorias/testimonials e está saudável.

## Objetivo
- Substituir listas estáticas do frontend por dados da API/banco.
- Popular o banco com os conteúdos que hoje aparecem no site (seed inicial), para que admin e site mostrem os mesmos dados.
- Exibir números reais no Dashboard.

## Implementações
### 1) Seed do Banco com Conteúdo Atual
- Criar scripts no `api/scripts/` para inserir conteúdos:
  - `seed-blog.ts`: insere artigos do blog (status `published`, slug, excerpt, content, category, image, meta_description, keywords). Define `author_id` com o id do admin existente.
  - `seed-palestras.ts`: insere as quatro palestras exibidas no site (título, descrição, duração estimada, público-alvo genérico, image, topics, status `active`).
  - `seed-mentorias.ts`: insere programas apresentados (title, description, duration, format, investment opcional, benefits, status `active`).
  - `seed-testimonials.ts`: insere os 6 depoimentos que aparecem no site (name, role, company, content, avatar, rating, status `approved`).
- Scripts idempotentes: `ON CONFLICT` para não duplicar.

### 2) Frontend: Trocar Dados Estáticos por API
- `components/Blog.tsx`: substituir array estático por hook `useBlogPosts('published')` e renderizar a lista real com fallback "Nenhum artigo".
- `pages/BlogPost.tsx`: trocar `blogArticles.find` por hook `useBlogPost(slug)`.
- `components/Palestras.tsx`: trocar a lista hardcoded por `usePalestras()`.
- `components/Mentorias.tsx`: trocar o bloco de programas por `useMentorias()`.
- `components/Testimonials.tsx`: trocar lista hardcoded por `useTestimonials()`.
- Manter placeholders (mensagens vazias) e loaders, sem quebrar layout.

### 3) Dashboard com Dados Reais
- Backend: criar endpoint `/api/admin/stats` (protegido) que retorna:
  - `leadsMonth`: COUNT de leads últimos 30 dias
  - `blogPosts`: COUNT de `blog_posts` com status `published`
  - `testimonials`: COUNT de `testimonials` com status `approved`
  - `recentLeads`: últimos 5 leads (já temos via hook; opcional consolidar aqui)
- Frontend: `pages/admin/Dashboard.tsx` passa a consumir `/admin/stats` e remover números hardcoded.

### 4) Testes e Validação
- Executar seeds e verificar:
  - Admin Blog lista artigos; público exibe mesmos artigos.
  - Palestras/Mentorias/Depoimentos aparecem iguais no site e admin.
- API: validar GET `/api/blog/posts`, `/api/palestras`, `/api/mentorias`, `/api/testimonials` retornando dados.
- Dashboard: exibir contagens reais; sem erros CORS.
- Navegadores: limpar cache, testar em anônimo e mobile.

### 5) Segurança e Rollback
- Scripts de seed não expõem segredos; usam `DATABASE_URL` já configurada.
- Idempotência assegura que rodar seed novamente não duplica registros.
- Caso deseje desfazer seeds, fornecer scripts de delete segmentados.

## Entregáveis
- Scripts de seed no backend.
- Alterações no frontend para consumir hooks/API.
- Endpoint de estatísticas e atualização do Dashboard.
- Verificação end-to-end com dados reais em ambos (site e admin).
