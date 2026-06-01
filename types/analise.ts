/** @format */

export const SubstatusAnalise = {
	NORMAL: 0,
	COMUNIQUE_SE: 1,
	AGUARDANDO_RECURSO: 2,
	PRE_REUNIAO_GRAPROEM: 3,
} as const;

export const ParecerDecisao = {
	PENDENTE: 0,
	DEFERIDO: 1,
	INDEFERIDO: 2,
	COMUNIQUE_SE: 3,
} as const;

export interface IReuniaoProcesso {
	id: string;
	inicial_id: number;
	instancia: number;
	data_reuniao: string | Date;
	data_processo: string | Date;
	nova_data_reuniao?: string | Date | null;
	justificativa_remarcacao?: string | null;
	numero_reuniao?: string | null;
	parecer_grupo?: string | null;
}

export interface IComuniqueSe {
	id: string;
	inicial_id: number;
	data: string | Date;
	complementar: boolean;
	etapa: number;
	graproem?: number | null;
	data_resposta?: string | Date | null;
}

export interface IDecisaoProcesso {
	id: string;
	inicial_id: number;
	parecer: number;
	instancia?: number | null;
	etapa?: number | null;
	graproem?: number | null;
	publicacao_parecer?: string | Date | null;
	obs?: string | null;
}

export interface IContextoAnalise {
	inicial_id: number;
	status: number;
	tipo_processo: number | null;
	etapa_analise: number;
	substatus_analise: number;
	graproem: boolean;
	data_limiteSmul?: string | Date | null;
	data_limiteMulti?: string | Date | null;
	distribuicao?: {
		tecnico_responsavel?: { id: string; nome: string } | null;
		administrativo_responsavel?: { id: string; nome: string } | null;
	} | null;
	reuniao_atual: IReuniaoProcesso | null;
	pre_reuniao_completa: boolean;
	comunique_aberto: IComuniqueSe | null;
	decisoes: IDecisaoProcesso[];
	comunique_ses: IComuniqueSe[];
	reunioes: IReuniaoProcesso[];
	pode_registrar_pre_reuniao: boolean;
	pode_decidir: boolean;
	pode_comunique_se: boolean;
	pode_registrar_resposta_comunique: boolean;
	pode_registrar_recurso: boolean;
	indeferimento_definitivo: boolean;
	max_instancia: number;
}

export interface IRespostaAnalise {
	ok: boolean;
	error: string | null;
	data: unknown;
	status: number;
}

export interface IReconsideracaoAdmissibilidade {
	inicial_id: number;
	envio?: string | Date | null;
	publicacao?: string | Date | null;
	pedido_reconsideracao?: string | Date | null;
	parecer: boolean;
}
