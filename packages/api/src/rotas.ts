/** Rotas migradas. GERADO por scripts/migracao/gerar-container.mjs. */
import type { RotaCompilada } from './http/tipos';
import { rotasAlvaraTipo } from './alvara-tipo/alvara-tipo.routes';
import { rotasAuth } from './auth/auth.routes';
import { rotasAvisos } from './avisos/avisos.routes';
import { rotasCategoria } from './categoria/categoria.routes';
import { rotasMotivoInadmissao } from './motivo-inadmissao/motivo-inadmissao.routes';
import { rotasParecerAdmissibilidade } from './parecer_admissibilidade/parecer_admissibilidade.routes';
import { rotasPedido } from './pedido/pedido.routes';
import { rotasPermissoes } from './permissoes/permissoes.routes';
import { rotasPublicacoes } from './publicacoes/publicacoes.routes';
import { rotasSubprefeitura } from './subprefeitura/subprefeitura.routes';
import { rotasUnidades } from './unidades/unidades.routes';
import { rotasUsuarios } from './usuarios/usuarios.routes';

export const rotasMigradas: RotaCompilada[] = [
	...rotasAlvaraTipo,
	...rotasAuth,
	...rotasAvisos,
	...rotasCategoria,
	...rotasMotivoInadmissao,
	...rotasParecerAdmissibilidade,
	...rotasPedido,
	...rotasPermissoes,
	...rotasPublicacoes,
	...rotasSubprefeitura,
	...rotasUnidades,
	...rotasUsuarios,
];
