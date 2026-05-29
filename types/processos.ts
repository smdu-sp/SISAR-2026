/** @format */

import { IAlvaras } from './alvaras';

export interface IProcesso {
	id: number;
	decreto: boolean;
	sei: string;
	tipo_requerimento: number;
	requerimento: string;
	aprova_digital?: string | null;
	processo_fisico?: string | null;
	data_protocolo: string | Date;
	envio_admissibilidade?: string | Date | null;
	alvara_tipo_id: string;
	alvara_tipo?: IAlvaras;
	tipo_processo?: number | null;
	obs?: string | null;
	status?: number | null;
	pagamento?: number | null;
	requalifica_rapido?: boolean | null;
	associado_reforma?: boolean | null;
	data_limiteSmul?: string | Date | null;
	data_limiteMulti?: string | Date | null;
	criado_em?: string | Date;
	alterado_em?: string | Date;
}

export interface IPaginadoProcessos {
	total: number;
	pagina: number;
	limite: number;
	data: IProcesso[];
}

export interface IRespostaProcessos {
	ok: boolean;
	error: string | null;
	data: IProcesso | IPaginadoProcessos | null;
	status: number;
}
