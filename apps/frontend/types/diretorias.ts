/** @format */

export interface IDiretoria {
	id: string;
	nome: string;
	coordenadoria_id: string;
	coordenadoria?: {
		id: string;
		nome: string;
		sigla: string;
	};
}

export interface IPaginadoDiretorias {
	data: IDiretoria[];
	total: number;
	pagina: number;
	limite: number;
}

export interface IRespostaDiretoria {
	ok: boolean;
	error: string | null;
	data: IDiretoria | IPaginadoDiretorias | IDiretoria[] | null;
	status: number;
}
