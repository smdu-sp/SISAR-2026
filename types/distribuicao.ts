/** @format */

import { IUsuario } from './usuario';

export interface IDistribuicao {
	inicial_id: number;
	tecnico_responsavel_id?: string | null;
	administrativo_responsavel_id: string;
	processo_relacionado_incomum?: string | null;
	assunto_processo_relacionado_incomum?: string | null;
	baixa_pagamento?: number | null;
	obs?: string | null;
	tecnico_responsavel?: IUsuario | null;
	administrativo_responsavel?: IUsuario | null;
}

export interface IRespostaDistribuicao {
	ok: boolean;
	error: string | null;
	data: IDistribuicao | null;
	status: number;
}
