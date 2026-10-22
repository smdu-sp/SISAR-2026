/** @format */

export type StatusLinhaImportacao = 'criado' | 'duplicado' | 'erro';

export interface IDetalheImportacao {
	linha: number;
	sei: string;
	status: StatusLinhaImportacao;
	mensagem?: string;
}

export interface IResultadoImportacao {
	total: number;
	criados: number;
	duplicados: number;
	erros: number;
	detalhes: IDetalheImportacao[];
}

export interface IRespostaImportacao {
	ok: boolean;
	error: string | null;
	data: IResultadoImportacao | null;
	status: number;
}
