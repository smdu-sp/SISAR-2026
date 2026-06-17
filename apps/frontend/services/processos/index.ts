export { buscarTudo, buscarPorId } from './query-functions';
export { verificaSei } from './server-functions/verifica-sei';
export { atualizar } from './server-functions/atualizar';
export type { IUpdateProcesso } from './server-functions/atualizar';
export {
	buscarPorDataProcesso,
	buscarPorMesAnoProcesso,
	buscaProcessosParaAvisos,
} from './query-functions/buscar-por-data';
export { criar } from './server-functions/criar';
