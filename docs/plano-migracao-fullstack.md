# Migração fullstack concluída

O SISAR foi consolidado em um único app Next.js. As telas e a API são executadas
no mesmo processo, domínio e porta, sem CORS e sem um servidor NestJS separado.

## Arquitetura atual

```text
app/
  app/api/[...path]/route.ts  # entrada única da API
  middleware.ts               # autenticação e proteção das telas
  instrumentation.ts          # inicialização do agendador
packages/api/
  src/                        # regras de negócio e rotas migradas
  prisma/                     # banco SISAR, migrações e seed
  sgu/                        # cliente somente leitura do banco SGU
```

O pacote `@sisar/api` continua separado para organização e typecheck, mas é
compilado pelo Next através de `transpilePackages`. Não existe proxy de transição
para o NestJS: as 141 rotas são registradas em `packages/api/src/rotas.ts` e
atendidas diretamente por `/api/[...path]`.

## Garantias da migração

- 18 suítes de teste da API, com 125 testes.
- Teste de cobertura que compara as rotas migradas com o inventário do backend
  anterior.
- Build de produção do pacote da API e do frontend.
- Autenticação JWT, refresh token, LDAP, SGU e permissões.
- Relatórios PDF/Excel, envio de e-mail e tarefas agendadas.

## Desenvolvimento

O pacote interno `packages/api` usa npm workspaces para compartilhar o código
de negócio, mas o produto é um único app Next.js na raiz:

```bash
npm run dev
```

## Manutenção

Ao adicionar uma funcionalidade:

1. Crie ou altere o service no módulo correspondente de `packages/api/src`.
2. Registre as rotas no arquivo do módulo e em `packages/api/src/rotas.ts`.
3. Registre dependências novas no container.
4. Atualize os testes de serviço e de rota.
5. Execute `npm test`, `npm run lint` e `npm run build`.
