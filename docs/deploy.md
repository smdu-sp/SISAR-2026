# Deploy em servidor próprio

O sistema é um único processo Node (Next.js) que serve telas e API. Coloque um proxy reverso
(nginx/IIS) na frente para HTTPS.

## 1. Primeira instalação
```bash
git clone <repo> && cd sisar-2026
cp example.env .env.local                                 # preencha as variáveis (ver README)
npm ci                                                     # instala e gera os clientes Prisma
npm run db:migrate:deploy                                  # aplica as migrações no banco
npm run db:seed                                             # somente em banco novo
npm run build                                              # build de produção (tipos da API + Next)
npm start                                                  # Next em produção na porta 3098
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
npm run db:migrate:deploy
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

O projeto mantém `packages/api` como workspace interno, enquanto a aplicação
fullstack Next.js está na raiz. Na raiz, use:

```bash
npm run dev
```

Esse comando inicia o Next em `http://localhost:3001`, incluindo as rotas `/api/*`.
