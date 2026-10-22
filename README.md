# SISAR — Sistema de Controle Aprova Rápido

Aplicação **fullstack em um único app Next.js**: as telas e a API (`/api/*`) rodam no mesmo processo,
no mesmo domínio e porta (sem CORS). O antigo backend NestJS foi incorporado ao pacote `@sisar/api`.

```
app/                    App Next.js (telas + rota /api/[...path])
components/             Componentes visuais compartilhados
services/               Acesso à API e funções do servidor
packages/api/           @sisar/api: regras de negócio, rotas, autenticação, agendador, Prisma
  src/<modulo>/           <modulo>.service.ts + <modulo>.routes.ts (+ tests)
  src/container.ts        instâncias dos services (substitui a injeção do Nest)
  src/rotas.ts            registro de todas as rotas
  prisma/                 schema, migrações, seed e scripts de dados (banco SISAR)
  sgu/                    schema do banco SGU (somente leitura)
docs/                   Plano e histórico da migração do NestJS para o Next
```

## Requisitos
- Node 20+ (testado com 24), npm 11
- MySQL 8 (banco `sisar`) e acesso de leitura ao SGU

## Configuração
Crie `.env.local` na raiz (não versionado). É a **única** fonte de variáveis: o app e os
scripts de banco leem este arquivo. Veja `example.env` para a lista completa.

| Variável | Uso |
|---|---|
| `DATABASE_URL`, `SGU_DATABASE_URL` | bancos SISAR e SGU |
| `JWT_SECRET`, `RT_SECRET` | assinatura dos tokens de acesso (15 min) e refresh (7 dias) |
| `AUTH_SECRET`, `AUTH_URL` | next-auth (sessão das telas) |
| `NEXT_PUBLIC_API_URL` | URL pública da API, **com barra final** (ex.: `http://localhost:3001/api/`); é embutida no build |
| `ENVIRONMENT` | `local` aceita o login de qualquer usuário já cadastrado, sem LDAP |
| `LDAP_SERVER`, `LDAP_DOMAIN`, `LDAP_BASE`, `USER_LDAP`, `PASS_LDAP` | login por LDAP (não local) |
| `API_FERIADOS_URL` | consulta de feriados para cálculo de dias úteis |
| `RESEND_API_KEY`, `RESEND_FROM` | envio dos relatórios agendados por e-mail |
| `AGENDADOR` | `off` desliga as tarefas agendadas nesta instância |

## Desenvolvimento
```bash
npm install            # instala e gera os clientes Prisma (postinstall)
npm run dev            # app fullstack Next (telas + API) em http://localhost:3001
npm test               # testes da API (Jest)
npm run lint
```

O repositório usa npm workspaces apenas para o pacote interno `packages/api`.
O produto executado em desenvolvimento e produção é um único processo Next.js na raiz.
Banco (a partir de `packages/api`, usando o `.env.local` do app):
```bash
npm run db:migrate:dev                      # cria/aplica migração em desenvolvimento
npm run db:migrate:deploy                   # aplica migrações existentes
npm run db:seed                             # dados iniciais
npm run prisma:generate                     # regenera clientes (com os servidores parados)
```

## Produção (servidor próprio)
Veja [docs/deploy.md](docs/deploy.md).

## Tarefas agendadas
Iniciadas pelo `instrumentation.ts` quando o servidor sobe: reconsideração de admissibilidade
(todo dia 06:00) e envio de relatórios agendados (a cada minuto). Com mais de uma instância,
o envio de relatórios não duplica (reivindicação atômica no banco); desligue as demais com `AGENDADOR=off`
se preferir uma só executando.

## Adicionando uma funcionalidade na API
1. `packages/api/src/<modulo>/<modulo>.service.ts` (recebe `PrismaService` etc. no construtor).
2. `<modulo>.routes.ts` com `controller('<prefixo>', [rota.get(...), ...])`; use `recursos: [...]`
   para a permissão exigida (sem isso exige o recurso `processos`; `['*']` = qualquer logado; `publica: true` = sem login).
3. Instancie o service em `container.ts`, registre em `dependencias.ts` e as rotas em `rotas.ts`.
   O teste `tests/container.spec.ts` avisa se algo ficar fora de sincronia.
