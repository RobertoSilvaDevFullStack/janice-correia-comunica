# Guia de Deploy - Correção de Leads

## Problema

O código foi corrigido **localmente** mas ainda não foi enviado para **produção**. Por isso o erro 500 persiste.

## Passos para Deploy

### 1. Commit e Push das Alterações

Abra o terminal no diretório da API e execute:

```bash
cd G:\PROJETOS\janice-correia-comunica\api

# Adicionar o arquivo modificado
git add src/controllers/leads.controller.ts

# Fazer commit
git commit -m "fix: map interest field to company column in leads table"

# Enviar para o repositório
git push origin main
```

> **Nota:** Se sua branch principal for `master` ao invés de `main`, use `git push origin master`

### 2. Deploy no EasyPanel

#### Opção A: Deploy Automático (se configurado)

- O EasyPanel pode fazer deploy automático quando detecta mudanças no repositório
- Aguarde alguns minutos e verifique se o deploy foi iniciado

#### Opção B: Deploy Manual

1. Acesse o painel do EasyPanel
2. Vá até o serviço da API (`janiceportfolio`)
3. Clique em **"Deploy"** ou **"Rebuild"**
4. Aguarde o build e deploy completarem

### 3. Verificar o Deploy

Após o deploy:

1. Acesse https://api.janicecorreia.com.br/health
2. Verifique se o servidor está respondendo
3. Teste o formulário de contato novamente

## Verificação Rápida

Se você não tem Git configurado ou prefere testar localmente primeiro:

```bash
# Testar localmente
cd G:\PROJETOS\janice-correia-comunica\api
npm run dev
```

Depois teste o formulário apontando para `http://localhost:3001` para confirmar que funciona.

## Troubleshooting

**Se o erro persistir após o deploy:**

- Verifique os logs do EasyPanel para confirmar que o deploy foi bem-sucedido
- Confirme que o código correto está no repositório Git
- Limpe o cache do navegador (Ctrl+Shift+Delete)
