# Guia: Conectar ao Banco de Dados da VPS Hostinger (EasyPanel)

## 📋 Credenciais (do EasyPanel)

- **User:** postgres
- **Password:** Lone2970Sw1
- **Database Name:** janiceportfolio
- **Internal Host:** janiceportfolio_janicedb (só funciona dentro do Docker)
- **Port:** 5432

## 🎯 Objetivo

Conectar ao banco de produção do seu ambiente local para testes.

## ⚠️ Problema

O hostname `janiceportfolio_janicedb` é **interno do Docker** e não é acessível de fora do servidor.

## ✅ Solução: Túnel SSH (RECOMENDADO)

### Por que usar túnel SSH?

- ✅ Mais seguro (não expõe o PostgreSQL publicamente)
- ✅ Funciona mesmo se a porta 5432 não estiver aberta
- ✅ Usa a conexão SSH que você já tem configurada

### Passo a Passo:

#### 1. Encontre o IP da sua VPS

Você pode encontrar no painel da Hostinger ou executar:

```bash
ping janicecorreia.com.br
```

#### 2. Crie o túnel SSH

No terminal (PowerShell ou CMD), execute:

```bash
ssh -L 5432:janiceportfolio_janicedb:5432 usuario@SEU_IP_VPS
```

**Substitua:**

- `usuario` pelo seu usuário SSH da VPS
- `SEU_IP_VPS` pelo IP da sua VPS Hostinger

**Exemplo:**

```bash
ssh -L 5432:janiceportfolio_janicedb:5432 root@123.45.67.89
```

#### 3. Mantenha o terminal aberto

Deixe esse terminal aberto enquanto estiver desenvolvendo. O túnel estará ativo.

#### 4. Atualize o `.env`

No arquivo `G:\PROJETOS\janice-correia-comunica\api\.env`, use:

```env
DATABASE_URL=postgresql://postgres:Lone2970Sw1@localhost:5432/janiceportfolio?sslmode=disable
```

#### 5. Teste a conexão

```bash
node debug-db.js
```

---

## 🔧 Alternativa: Conexão Direta (se a porta estiver exposta)

Se você já configurou o EasyPanel para expor a porta 5432 publicamente:

```env
DATABASE_URL=postgresql://postgres:Lone2970Sw1@SEU_IP_VPS:5432/janiceportfolio?sslmode=disable
```

⚠️ **Atenção:** Isso é menos seguro. Prefira o túnel SSH.

---

## 📝 Próximos Passos

1. Me informe qual é o **IP da sua VPS** ou o **domínio** (janicecorreia.com.br)
2. Me diga qual é o **usuário SSH** que você usa para acessar a VPS
3. Vou te ajudar a configurar o túnel SSH corretamente
