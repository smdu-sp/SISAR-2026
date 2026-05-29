/** @format */

export interface IMotivoInadmissao {
	id: string;
	descricao: string;
}

export interface IPaginadoMotivosInadmissao {
	data: IMotivoInadmissao[];
	total: number;
	pagina: number;
	limite: number;
}

export interface IRespostaMotivoInadmissao {
	ok: boolean;
	error: string | null;
	data: IMotivoInadmissao | IPaginadoMotivosInadmissao | IMotivoInadmissao[] | null;
	status: number;
}
