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

export interface IInterfacesAdmissibilidade {
	interface_sehab?: boolean;
	interface_siurb?: boolean;
	interface_smc?: boolean;
	interface_smt?: boolean;
	interface_svma?: boolean;
	num_sehab?: string | null;
	num_siurb?: string | null;
	num_smc?: string | null;
	num_smt?: string | null;
	num_svma?: string | null;
}

export interface IUpdateAdmissibilidade {
	status?: number;
	parecer_admissibilidade_id?: string;
	data_decisao_interlocutoria?: Date | string;
	reconsiderado?: boolean;
	motivo?: number;
	unidade_id?: string;
	subprefeitura_id?: string;
	tipo_processo?: number;
	inicial_id?: number;
	interfaces?: IInterfacesAdmissibilidade;
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

/** Data de envio pode estar em admissibilidade.data_envio ou em inicial.envio_admissibilidade. */
export function dataEnvioAdmissibilidade(
	adm?: Pick<IAdmissibilidade, 'data_envio' | 'inicial'> | null,
	processo?: Pick<IProcesso, 'envio_admissibilidade'> | null,
): string | Date | null | undefined {
	return (
		adm?.data_envio ??
		adm?.inicial?.envio_admissibilidade ??
		processo?.envio_admissibilidade ??
		null
	);
}

