/** Rotas migradas. GERADO por scripts/migracao/gerar-container.mjs. */
import type { RotaCompilada } from './http/tipos';
import { rotasAdmissibilidade } from './admissibilidade/admissibilidade.routes';
import { rotasAlvaraTipo } from './alvara-tipo/alvara-tipo.routes';
import { rotasAnalise } from './analise/analise.routes';
import { rotasAuth } from './auth/auth.routes';
import { rotasAvisos } from './avisos/avisos.routes';
import { rotasCategoria } from './categoria/categoria.routes';
import { rotasDistribuicao } from './distribuicao/distribuicao.routes';
import { rotasFinalizacao } from './finalizacao/finalizacao.routes';
import { rotasInicial } from './inicial/inicial.routes';
import { rotasMotivoInadmissao } from './motivo-inadmissao/motivo-inadmissao.routes';
import { rotasParecerAdmissibilidade } from './parecer_admissibilidade/parecer_admissibilidade.routes';
import { rotasPedido } from './pedido/pedido.routes';
import { rotasPermissoes } from './permissoes/permissoes.routes';
import { rotasPublicacoes } from './publicacoes/publicacoes.routes';
import { rotasReconsideracao } from './reconsideracao/reconsideracao.routes';
import { rotasRelatorioAgendamento } from './relatorio/agendamento/relatorio-agendamento.routes';
import { rotasRelatorio } from './relatorio/relatorio.routes';
import { rotasReunioes } from './reunioes/reunioes.routes';
import { rotasSubprefeitura } from './subprefeitura/subprefeitura.routes';
import { rotasUnidades } from './unidades/unidades.routes';
import { rotasUsuarios } from './usuarios/usuarios.routes';

export const rotasMigradas: RotaCompilada[] = [
	...rotasAdmissibilidade,
	...rotasAlvaraTipo,
	...rotasAnalise,
	...rotasAuth,
	...rotasAvisos,
	...rotasCategoria,
	...rotasDistribuicao,
	...rotasFinalizacao,
	...rotasInicial,
	...rotasMotivoInadmissao,
	...rotasParecerAdmissibilidade,
	...rotasPedido,
	...rotasPermissoes,
	...rotasPublicacoes,
	...rotasReconsideracao,
	...rotasRelatorioAgendamento,
	...rotasRelatorio,
	...rotasReunioes,
	...rotasSubprefeitura,
	...rotasUnidades,
	...rotasUsuarios,
];
