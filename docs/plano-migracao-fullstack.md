# Plano: backend (NestJS) dentro do Next.js

Objetivo: um único app (Next.js) que serve telas **e** API, hospedado em servidor próprio,
sem o NestJS. A migração é feita pelo padrão *strangler*: o Next vira a porta de entrada da API
e só responde o que já foi migrado; o resto é repassado ao Nest. Em cada passo o sistema funciona.

## Princípios (para não quebrar nada)
1. **Mesmos caminhos, métodos, status e formato de resposta/erro.** A API continua em
   `/<modulo>/...`, agora sob `/api/<modulo>/...`. O frontend só troca `NEXT_PUBLIC_API_URL`.
2. **Port mecânico dos services** (mesma lógica, sem decorators do Nest). Regras de negócio não mudam.
3. **Rede de segurança em 3 camadas:** (a) testes unitários portados; (b) *script de paridade* que
   compara Nest × Next para os mesmos pedidos (status + JSON); (c) checagem de cobertura: toda rota
   do Nest precisa existir no Next antes do corte.
4. **Reversível até o último passo:** o Nest só é apagado na fase final; antes disso basta apontar
   `API_PROXY_TARGET`/`NEXT_PUBLIC_API_URL` de volta.
5. **Branch próprio** (`fullstack-next`), um commit por fase.

## Arquitetura alvo
```
apps/frontend/app/api/[...path]/route.ts  # único ponto de entrada da API (runtime Node)
packages/api/ (@sisar/api)                # antigo backend, sem NestJS
  src/http/        # erros no formato Nest, roteador, JWT/guards, validação, proxy de transição
  src/<modulo>/    # <modulo>.service.ts (port mecânico) + <modulo>.routes.ts (antigo controller) + tests
  src/container.ts # instâncias (Prisma, services) – substitui a injeção do Nest
```
- O pacote tem tsconfig próprio (mesmas regras do backend antigo: sem `strictNullChecks`), assim o
  frontend continua em modo estrito. O Next compila o pacote (`transpilePackages`) e usa só os
  tipos gerados em `dist/` (`npm run build -w packages/api`; no dev o turbo roda o watch).
- Deploy continua sendo **um único app Next.js**.
- `/api/auth/*` continua sendo do next-auth (o catch-all é menos específico).
- Autenticação: JWT HS256 (`JWT_SECRET`/`RT_SECRET`, 15 min / 7 dias), usuário recarregado do banco
  a cada requisição, como hoje. Guard de recursos idêntico ao atual (`processos` por padrão).
- Cabeçalho `x-sisar-api: next | nest-proxy` mostra quem atendeu (diagnóstico da transição).
- Sem CORS (mesma origem). Sem Swagger (pode ser gerado depois).
- Paridade: `node scripts/migracao/paridade.mjs <modulos>` compara Nest × Next (status, corpo e origem).

## Fases
| # | Fase | Resultado verificável |
|---|------|------------------------|
| 0 | Fundação: dependências, `server/http`, container, Jest, harness de paridade | Testes do núcleo passam; app sobe |
| 1 | Proxy puro: Next recebe `/api/*` e repassa tudo ao Nest | Telas funcionam com `NEXT_PUBLIC_API_URL=/api/` |
| 2 | Auth + usuarios + permissoes (JWT, LDAP, SGU) — base dos guards de todas as rotas | Login/refresh/eu e matriz idênticos |
| 3 | CRUDs simples: categorias, pedidos, motivos, subprefeitura, parecer, alvara-tipo, avisos, publicacoes, unidades | Paridade OK por módulo |
| 4 | Núcleo de processos: inicial, admissibilidade, analise, distribuicao, finalizacao, reconsideracao, reunioes | Paridade OK por módulo |
| 5 | Relatórios: quantitativos, exportação PDF/Excel, e-mail, agendamento + scheduler | Arquivos gerados e paridade dos JSON |
| 6 | Corte: sem proxy, remover `apps/backend`, mover `prisma/`, scripts/turbo/docs, build de produção | Cobertura 100% das rotas; build limpo |

## Riscos e mitigação
- **Strict TypeScript:** o backend usa `strictNullChecks:false`; o frontend usa `strict`. Resolvido com o
  pacote separado `@sisar/api` (tsconfig próprio), sem afrouxar o frontend.
- **Pacotes nativos/grandes** (`ldapjs`, `exceljs`, `pdfmake`, `@prisma/client`): `serverExternalPackages`.
- **Agendadores** precisam de processo único (servidor próprio): ok; a reivindicação atômica já existente
  evita envio duplicado com mais de uma instância.
- **Upload de planilha** (`multipart`): `request.formData()`.
- **Dois bancos** (SISAR e SGU): os dois clientes Prisma são gerados no `postinstall`.
