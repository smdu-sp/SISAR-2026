/** @format */

export interface IRecursoPermissao {
	chave: string;
	rotulo: string;
	grupo: string;
	descricao: string;
}

export interface IMatrizPermissoes {
	recursos: IRecursoPermissao[];
	perfis: string[];
	/** Recurso que só o DEV tem e que não pode ser alterado. */
	travado: string;
	matriz: Record<string, string[]>;
}
