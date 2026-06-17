/** @format */

export interface IFerias {
	id: string;
	inicio: Date;
	final: Date;
}

export interface ISubstituto {
	id: string;
	substituto_id: string;
	substituto?: IUsuario;
}

export interface IUnidadeRef {
	id: string;
	nome: string;
	sigla?: string;
}

export interface IUsuario {
	id: string;
	nome: string;
	login: string;
	email: string;
	permissao: IPermissao;
	cargo?: string;
	unidade_id?: string;
	unidade?: IUnidadeRef;
	ferias?: IFerias[];
	substitutos?: ISubstituto[];
	avatar?: string;
	status: boolean;
	ultimoLogin: Date;
	criadoEm: Date;
	atualizadoEm: Date;
	nomeSocial?: string;
}

export enum IPermissao {
	DEV,
	TEC,
	ADM,
	USR,
}

export interface ICreateUsuario {
	nome: string;
	email: string;
	login: string;
	avatar?: string;
	permissao?: IPermissao;
	cargo?: string;
	unidade_id?: string;
	status?: boolean;
	nomeSocial?: string;
}

export interface IUpdateUsuario {
	id?: string;
	status?: boolean;
	nomeSocial?: string;
	avatar?: string;
	permissao?: IPermissao;
	cargo?: string;
	unidade_id?: string;
}

export interface IPaginadoUsuario {
	data: IUsuario[];
	total: number;
	pagina: number;
	limite: number;
}

export interface INovoUsuario {
	login: string;
	nome: string;
	email: string;
}

export interface IUsuarioTecnico {
	id: string;
	nome: string;
}

export interface ITecnicoFuncionario {
	value: string;
	label: string;
}

export interface IFuncionarios {
	administrativos: IUsuario[];
	tecnicos: IUsuario[];
}

export interface IRespostaUsuario {
	ok: boolean;
	error: string | null;
	data:
		| INovoUsuario
		| IUsuario
		| IUsuario[]
		| IUsuarioTecnico[]
		| IPaginadoUsuario
		| ITecnicoFuncionario[]
		| IFuncionarios
		| { autorizado: boolean }
		| { desativado: boolean }
		| null;
	status: number;
}

export interface IUsuarioSession {
	sub: string;
	nome: string;
	login: string;
	email: string;
	nomeSocial?: string;
	permissao: IPermissao;
	status: number;
	avatar?: string;
	iat: number;
	exp: number;
}
