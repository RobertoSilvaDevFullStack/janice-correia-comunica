## Correção dos Ícones
- Substituir todos os arquivos de ícones no `public/` pelo novo conjunto (favicon.ico, favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png).
- Atualizar `site.webmanifest` com os novos ícones, incluindo `maskable` e tamanhos 192/512.
- Garantir links no `index.html`:
  - `<link rel="icon" href="/favicon.ico">`
  - `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">`
  - `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`
  - `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`
  - `<link rel="manifest" href="/site.webmanifest">`
  - `<meta name="theme-color" content="#111827">`
- Cache-busting: renomear ícones com hash (ex.: `favicon-32x32.<hash>.png`) e atualizar referências para evitar exibição do ícone antigo em clientes com cache.
- Limpar referências antigas (coração) em qualquer manifesto ou HTML remanescente.

## Otimização de Imagens
- Converter imagens grandes (hero/palestras/mentorias) para formatos modernos (WebP/AVIF) com fallback PNG/JPG.
- Integrar `vite-plugin-imagemin` ou `vite-imagetools` para compressão lossless/lossy leve na build.
- Atualizar componentes para usar `srcset` e `sizes` com múltiplas resoluções.

## Lazy Loading
- Adicionar `loading="lazy"` e `decoding="async"` para imagens abaixo da dobra.
- Manter imagens acima da dobra (hero/avatar) sem lazy para evitar atraso de LCP.
- Incluir `width` e `height` em `<img>` para reduzir CLS.

## Minificação e Code Split
- Confirmar minificação padrão do Vite (JS/CSS) e habilitar `build.cssMinify`.
- Adicionar `build.rollupOptions.output.manualChunks` para separar vendors (react, radix-ui, tiptap, axios), reduzindo o bundle inicial e TBT.
- Remover sourcemaps em produção para reduzir payload (se necessário).

## Eliminar Recursos Bloqueantes
- `font-display: swap` nas fontes do Google; manter `<link rel="preconnect">` para `fonts.googleapis.com` e `fonts.gstatic.com`.
- Pré-carregar fonte principal via `<link rel="preload" as="font">` (se aplicável).
- Usar `vite-plugin-critters` (ou similar) para inline de CSS crítico e adiamento do restante (quando viável).

## Cache de Recursos Estáticos
- Garantir hashing de assets (`/assets/*`) do Vite para cache longo (30 dias).
- Configurar cabeçalhos de cache via domínio do EasyPanel:
  - Assets e ícones: `Cache-Control: public, max-age=2592000, immutable`.
  - HTML e manifest: `no-cache` ou `max-age=0` para permitir atualização.

## Correções específicas Lighthouse/PageSpeed
- Reduzir JS não usado (avaliar componentes/admin carregados; lazy-load rotas do painel administrativo).
- Evitar tarefas longas no thread principal (dividir dependências pesadas: tiptap, charts).
- Revisar árvore de dependências e remover libs não utilizadas.

## Validação e Testes
- Testar localmente e em staging com Lighthouse (mobile/desktop) e múltiplos navegadores.
- Verificar ícones em iOS (apple-touch) e Android (PWA), incluindo instalação do atalho.
- Confirmar que o ícone antigo não aparece (cache-busting funcionando).
- Implantar no EasyPanel após validações.

## Rollback
- Manter backup dos ícones/manifesto anteriores; caso surja regressão, reverter links do `index.html` e `site.webmanifest` imediatamente.
