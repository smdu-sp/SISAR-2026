/** @format */

import { IProcesso } from './processos';

export interface IAdmissibilidade {
	inicial_id: number;
	unidade_id?: string | null;
	data_envio?: string | Date | null;
	data_decisao_interlocutoria?: string | Date | null;
	parecer_admissibilidade_id?: string | null;
	subprefeitura_id?: string | null;
	categoria_id?: string | null;
	status: number;
	reconsiderado: boolean;
	motivo?: number | null;
	criado_em?: string | Date | null;
	alterado_em?: string | Date | null;
	inicial?: IProcesso & { data_limiteSmul?: string | Date | null };
}

export interface IUpdateAdmissibilidade {
	status?: number;
	parecer_admissibilidade_id?: string;
	data_decisao_interlocutoria?: Date | string;
	reconsiderado?: boolean;
	motivo?: number;
}

export interface IPaginadoAdmissibilidade {
	data: IAdmissibilidade[];
	total: number;
	pagina: number;
	limite: number;
}

export interface IRespostaAdmissibilidade {
	ok: boolean;
	error: string | null;
	data: IAdmissibilidade | IPaginadoAdmissibilidade | null;
	status: number;
}
