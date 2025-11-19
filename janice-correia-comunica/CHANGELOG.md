## Changelog

### 2025-11-13

- Banco de dados
  - Adicionadas colunas `status` em `testimonials`, `palestras`, `mentorias`
  - Verificações e diagnósticos com `verify-corrections.js` e `test-dashboard-errors.js`

- API
  - Healthcheck em `/health`
  - Testes dos endpoints públicos e protegidos

- Frontend
  - Configuração de `VITE_API_URL` documentada

- Segurança de dependências
  - Removidos `multer` e `@types/multer` da API devido a vulnerabilidades

- Deploy
  - Adicionados `deploy-vps-manual.sh` e `prepare-deploy-package.sh`
  - Documentação de deploy (`HOSTINGER_DEPLOY_GUIDE.md` e seção expandida no README)

- Documentação
  - README atualizado com arquitetura, estado, variáveis, scripts e passos de deploy