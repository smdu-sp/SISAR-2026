/** @format */

import { IAdmissibilidade } from './admissibilidade';
import {
	IComuniqueSe,
	IDecisaoProcesso,
	IReconsideracaoAdmissibilidade,
	IReuniaoProcesso,
} from './analise';
import { IAlvaras } from './alvaras';
import { IConclusao } from './finalizacao';
import { IDistribuicao } from './distribuicao';

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
	etapa_analise?: number | null;
	substatus_analise?: number | null;
	obs?: string | null;
	status?: number | null;
	pagamento?: number | null;
	requalifica_rapido?: boolean | null;
	associado_reforma?: boolean | null;
	data_limiteSmul?: string | Date | null;
	data_limiteMulti?: string | Date | null;
	admissibilidade?: IAdmissibilidade | null;
	distribuicao?: IDistribuicao | null;
	conclusao?: IConclusao | null;
	comunique_ses?: IComuniqueSe[];
	decisoes?: IDecisaoProcesso[];
	reunioes?: IReuniaoProcesso[];
	reconsideracao_admissibilidade?: IReconsideracaoAdmissibilidade | null;
	criado_em?: string | Date;
	alterado_em?: string | Date;
}

export interface ICreateProcesso {
	sei: string;
	tipo_requerimento: number;
	requerimento: string;
	alvara_tipo_id: string;
	data_protocolo: string;
	envio_admissibilidade?: string;
	aprova_digital?: string;
	processo_fisico?: string;
	tipo_processo?: number;
	etapa_analise?: number;
	substatus_analise?: number;
	obs?: string;
	decreto?: boolean;
	requalifica_rapido?: boolean;
	associado_reforma?: boolean;
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
