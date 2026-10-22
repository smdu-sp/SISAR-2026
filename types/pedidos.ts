/** @format */

export interface IPedido {
	id: string;
	descricao: string;
}

export interface IPaginadoPedidos {
	data: IPedido[];
	total: number;
	pagina: number;
	limite: number;
}

export interface IRespostaPedido {
	ok: boolean;
	error: string | null;
	data: IPedido | IPaginadoPedidos | IPedido[] | null;
	status: number;
}
