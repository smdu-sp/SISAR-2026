/** @format */

export interface IParecerAdmissibilidade {
	id: string;
	parecer: string;
	status: number;
}

export interface ICriarParecerAdmissibilidade {
	parecer: string;
	status?: number;
}

export interface IAtualizarParecerAdmissibilidade {
	parecer?: string;
	status?: number;
}

export interface IPaginadoParecerAdmissibilidade {
	data: IParecerAdmissibilidade[];
	total: number;
	pagina: number;
	limite: number;
}

export interface IRespostaParecerAdmissibilidade {
	ok: boolean;
	error: string | null;
	data: IParecerAdmissibilidade | IPaginadoParecerAdmissibilidade | null;
	status: number;
}
