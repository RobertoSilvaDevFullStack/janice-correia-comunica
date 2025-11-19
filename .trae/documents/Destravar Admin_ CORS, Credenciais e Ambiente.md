## Diagnóstico Rápido
- API ok: `GET https://api.janicecorreia.com.br/health` responde.
- Login bloqueado por CORS/credenciais: console mostra preflight sem `Access-Control-Allow-Origin` e 401.
- Variáveis no Easypanel não batem com o código:
  - Esperado: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES`, `CORS_ADDITIONAL_ORIGINS`.
  - Visto: `BASE_URL`, `SECRETS`, `EXPIRES`, `ADDITIONAL_ORIGINS`.
- Origem permitida errada: `CORS_ADDITIONAL_ORIGINS` contém `https://api.janicecorreia.com.br`, mas deveria conter o frontend `https://www.janicecorreia.com.br`.
- Admin no banco: `admin@janicecorreia.com` (sem `.br`). Se login usa `.com.br`, retorna 401.

## Plano de Correção (semântica e configuração)
### 1) Ajustar variáveis de ambiente no Easypanel (API)
- Renomear/definir exatamente:
  - `DATABASE_URL=postgres://postgres:<SENHA>@janiceportfolio_janicedb:5432/janiceportfolio?sslmode=disable`
  - `JWT_SECRET=<chave forte>`
  - `JWT_EXPIRES=24h`
  - `PORT=3001`
  - `NODE_ENV=production`
  - `FRONTEND_URL=https://janicecorreia.com.br`
  - `DB_SSL=disable`
  - `CORS_ADDITIONAL_ORIGINS=https://www.janicecorreia.com.br`
- Salvar e reimplantar a API.

### 2) Tornar CORS robusto a `www` (código)
- Atualizar `api/src/index.ts` para normalizar hostnames e aceitar com/sem `www`:
```
const allowedOrigins = ["http://localhost:5173","http://localhost:8080","http://localhost:8081",process.env.FRONTEND_URL,...additionalOrigins].filter(Boolean);
const allowedHosts = allowedOrigins
  .map(o => { try { return new URL(o).hostname.replace(/^www\./,''); } catch { return null; } })
  .filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null,true);
    try {
      const host = new URL(origin).hostname.replace(/^www\./,'');
      if (allowedHosts.includes(host)) return cb(null,true);
    } catch {}
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type','Authorization'],
  exposedHeaders: ['Authorization'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
}));
```
- Commit e reimplantar a API.

### 3) Alinhar credenciais do admin
- Padronizar e-mail para `.com.br` (opcional) e garantir senha válida:
```
UPDATE users SET email='admin@janicecorreia.com.br' WHERE email='admin@janicecorreia.com';
```
- Gerar hash seguro:
  - `node api/scripts/generate-password-hash.js` → cole o hash:
```
UPDATE users SET password_hash='<HASH>', is_active=true, updated_at=NOW() WHERE email='admin@janicecorreia.com.br';
```

### 4) Validação ponta-a-ponta
- Incognito: `https://www.janicecorreia.com.br/admin/login` → fazer login.
- Console do navegador: confirmar ausência de erros CORS; status 200 do `POST /api/auth/login`.
- API: visualizar logs de deploy no Easypanel (service api → Deployments → View) e checar erros.

### 5) Documentar erros
- Registrar tipos: CORS (preflight sem allow-origin), 401 (credenciais), sequência temporal.
- Salvar evidências (prints/logs) no repositório ou issue.

### 6) Rollback
- Caso ocorra regressão, reverter somente o trecho CORS do `index.ts` e manter os ajustes de ambiente.

## Entregáveis
- API aceita `janicecorreia.com.br` e `www.janicecorreia.com.br`.
- Login do admin funcional com credenciais atualizadas.
- Console sem erros CORS; backend sem 401 indevidos.
