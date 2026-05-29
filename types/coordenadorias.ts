/** @format */

export interface ICoordenadoria {
	id: string;
	nome: string;
	sigla: string;
	diretorias?: { id: string; nome: string }[];
}

export interface ICoordenadoriaSelect {
	value: string;
	label: string;
}

export interface IPaginadoCoordenadorias {
	data: ICoordenadoria[];
	total: number;
	pagina: number;
	limite: number;
}

export interface IRespostaCoordenadoria {
	ok: boolean;
	error: string | null;
	data:
		| ICoordenadoria
		| ICoordenadoria[]
		| IPaginadoCoordenadorias
		| ICoordenadoriaSelect[]
		| null;
	status: number;
}
