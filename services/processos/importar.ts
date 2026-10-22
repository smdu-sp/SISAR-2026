/** @format */

import { IResultadoImportacao, IRespostaImportacao } from '@/types/importacao';

export async function importarPlanilha(
	arquivo: File,
	access_token: string,
): Promise<IRespostaImportacao> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const formData = new FormData();
	formData.append('arquivo', arquivo);

	try {
		const response = await fetch(`${baseURL}inicial/importar`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
			body: formData,
		});
		const data = await response.json();
		if (response.status === 200) {
			return {
				ok: true,
				error: null,
				data: data as IResultadoImportacao,
				status: 200,
			};
		}
		return {
			ok: false,
			error: data.message || 'Erro ao importar planilha.',
			data: null,
			status: data.statusCode || response.status,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível importar a planilha: ' + error,
			data: null,
			status: 400,
		};
	}
}
