/** @format */

export interface ICategoria {
	id: string;
	categoria: string;
	descricao: string;
	divisao: string;
	competencia: string;
}

export interface IPaginadoCategorias {
	data: ICategoria[];
	total: number;
	pagina: number;
	limite: number;
}

export interface IRespostaCategoria {
	ok: boolean;
	error: string | null;
	data: ICategoria | IPaginadoCategorias | ICategoria[] | null;
	status: number;
}
