import type { Usuario } from '@prisma/client';

export type Metodo = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface Contexto {
	req: Request;
	/** Parâmetros de rota (`:id`). */
	params: Record<string, string | undefined>;
	/** Primeiro valor do parâmetro de query (ou undefined). */
	query: (nome: string) => string | undefined;
	/** Usuário autenticado (rotas públicas não têm). */
	usuario?: Usuario;
	/** Corpo JSON; objeto vazio quando não há corpo (como o body-parser do Express). */
	corpo: <T = any>() => Promise<T>; // eslint-disable-line @typescript-eslint/no-explicit-any
	formData: () => Promise<FormData>;
}

export interface Rota {
	metodo: Metodo;
	caminho: string;
	handler: (ctx: Contexto) => unknown | Promise<unknown>;
	/** Sem autenticação (equivale a @IsPublic). */
	publica?: boolean;
	/** Recursos aceitos (qualquer um). Sem isto exige o recurso padrão ("processos"). */
	recursos?: string[];
	/** Status de sucesso; padrão 201 para POST e 200 nos demais. */
	status?: number;
	/** 'refresh' autentica pelo refresh_token do corpo (rota /refresh). */
	autenticacao?: 'jwt' | 'refresh';
	/** Passo extra antes do handler (ex.: validação do login). */
	antes?: (ctx: Contexto) => unknown | Promise<unknown>;
}

export type RotaCompilada = Rota & { regex: RegExp; nomes: string[] };
