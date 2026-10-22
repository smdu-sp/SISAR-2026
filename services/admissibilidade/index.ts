/** @format */

export { buscarTudo, buscarPorId } from './query-functions';
export {
	contarForaPrazo,
	contarDentroPrazo,
	admissibilidadeFinalizada,
	medianaAdmissibilidade,
	registrosAdmissibilidade,
} from './query-functions/dashboard';
export type { IRegistroAdmissibilidade } from './query-functions/dashboard';
export { atualizar, admitir, inadmitir } from './server-functions';
export type { IAdmitirPayload, IInadmitirPayload } from './server-functions';
