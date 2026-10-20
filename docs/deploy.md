# Deploy em servidor próprio

O sistema é um único processo Node (Next.js) que serve telas e API. Coloque um proxy reverso
(nginx/IIS) na frente para HTTPS.

## 1. Primeira instalação
```bash
git clone <repo> && cd sisar-2026
cp apps/frontend/example.env apps/frontend/.env.local      # preencha as variáveis (ver README)
npm ci                                                     # instala e gera os clientes Prisma
npm run db:migrate:deploy -w packages/api                  # aplica as migrações no banco
npm run db:seed -w packages/api                            # somente em banco novo
npm run build                                              # build de produção (tipos da API + Next)
npm start                                                  # Next em produção na porta 3001
```
Importante: `NEXT_PUBLIC_API_URL` é **embutida no build**; defina o valor final (ex.:
`https://sisar.exemplo.gov.br/api/`) antes de `npm run build`. `AUTH_URL` deve ser a URL pública do site.

## 2. Manter rodando
Use um gerenciador de processos, por exemplo PM2:
```bash
npm i -g pm2
pm2 start "npm start" --name sisar && pm2 save && pm2 startup
```
Ou um serviço do sistema (systemd/NSSM) executando `npm start` na raiz do projeto.

## 3. Atualizar
```bash
git pull && npm ci
npm run db:migrate:deploy -w packages/api
npm run build && pm2 restart sisar
```

## 4. Verificação
- `GET /api/eu` sem token deve responder **401** (API no ar).
- Login nas telas e acesso a `/permissoes` com o perfil DEV.
- No log de inicialização: `[Agendador] ligado: reconsideracao-admissibilidade, envio-relatorios`.

## 5. Observações
- Relatórios agendados por e-mail exigem `RESEND_API_KEY` e `RESEND_FROM`; sem eles o envio fica
  registrado como falha no histórico.
- Em `ENVIRONMENT=local` o login aceita qualquer usuário cadastrado **sem senha**. Em produção use
  um valor diferente de `local` (login via LDAP).
- Mais de uma instância: o envio de relatórios não duplica; para as tarefas rodarem em uma só,
  use `AGENDADOR=off` nas demais.

## 6. Desenvolvimento

O projeto mantém `apps/frontend` e `packages/api` como npm workspaces, mas a aplicação
fullstack é um único processo Next.js. Na raiz, use:

```bash
npm run dev
```

Esse comando inicia o Next em `http://localhost:3001`, incluindo as rotas `/api/*`.
O comando `npm run dev:turbo` é opcional e inicia também o watch de compilação separado
do pacote `@sisar/api`; por isso sua saída mostra os prefixos `@sisar/api:dev:` e
`@sisar/frontend:dev:`.
