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

## Arquitetura alvo (`apps/frontend`)
```
app/api/[...path]/route.ts   # catch-all: roteia para os controllers; sem match -> proxy ao Nest
server/http/                 # erros (formato Nest), roteador, JWT/guards, validação, proxy
server/<modulo>/             # <modulo>.service.ts + <modulo>.routes.ts (+ tests)
server/container.ts          # instâncias (Prisma, services) – substitui a injeção do Nest
instrumentation.ts           # agendadores (envio de relatórios, reconsideração 06:00)
```
- `/api/auth/*` continua sendo do next-auth (o catch-all é menos específico).
- Autenticação: JWT HS256 (`JWT_SECRET`/`RT_SECRET`, 15 min / 7 dias), usuário recarregado do banco
  a cada requisição, como hoje. Guard de recursos idêntico ao atual (`processos` por padrão).
- Sem CORS (mesma origem). Sem Swagger (pode ser gerado depois).

## Fases
| # | Fase | Resultado verificável |
|---|------|------------------------|
| 0 | Fundação: dependências, `server/http`, container, Jest, harness de paridade | Testes do núcleo passam; app sobe |
| 1 | Proxy puro: Next recebe `/api/*` e repassa tudo ao Nest | Telas funcionam com `NEXT_PUBLIC_API_URL=/api/` |
| 2 | CRUDs simples: categorias, pedidos, motivos, subprefeitura, parecer, alvara-tipo, avisos, publicacoes, unidades | Paridade OK por módulo |
| 3 | Auth + usuarios + permissoes (JWT, LDAP, SGU) | Login/refresh/eu e matriz idênticos |
| 4 | Núcleo de processos: inicial, admissibilidade, analise, distribuicao, finalizacao, reconsideracao, reunioes | Paridade OK por módulo |
| 5 | Relatórios: quantitativos, exportação PDF/Excel, e-mail, agendamento + scheduler | Arquivos gerados e paridade dos JSON |
| 6 | Corte: sem proxy, remover `apps/backend`, mover `prisma/`, scripts/turbo/docs, build de produção | Cobertura 100% das rotas; build limpo |

## Riscos e mitigação
- **Strict TypeScript:** o backend usa `strictNullChecks:false`; o frontend usa `strict`. Para não
  reescrever 12 mil linhas, `strictNullChecks`/`noImplicitAny` serão desligados no app (apertar depois).
- **Pacotes nativos/grandes** (`ldapjs`, `exceljs`, `pdfmake`, `@prisma/client`): `serverExternalPackages`.
- **Agendadores** precisam de processo único (servidor próprio): ok; a reivindicação atômica já existente
  evita envio duplicado com mais de uma instância.
- **Upload de planilha** (`multipart`): `request.formData()`.
- **Dois bancos** (SISAR e SGU): os dois clientes Prisma são gerados no `postinstall`.
