/** @format */

export interface IConclusao {
	inicial_id: number;
	data_apostilamento?: string | Date | null;
	data_conclusao?: string | Date | null;
	data_emissao?: string | Date | null;
	data_outorga?: string | Date | null;
	data_resposta?: string | Date | null;
	data_termo?: string | Date | null;
	num_alvara: string;
	obs: string;
	outorga: boolean;
}

export interface ICreateFinalizacao {
	inicial_id: number;
	data_apostilamento: string;
	data_conclusao: string;
	data_emissao: string;
	data_outorga: string;
	data_resposta: string;
	data_termo: string;
	num_alvara: string;
	obs: string;
	outorga: boolean;
}

export interface IRespostaFinalizacao {
	ok: boolean;
	error: string | null;
	data: IConclusao | null;
	status: number;
}
