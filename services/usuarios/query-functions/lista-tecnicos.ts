/** @format */

import { IRespostaUsuario, ITecnicoFuncionario, IUsuario } from '@/types/usuario';
import { buscarFuncionarios, IFuncionarios } from './buscar-funcionarios';

export async function listaTecnicos(
	access_token: string,
): Promise<IRespostaUsuario> {
	const resp = await buscarFuncionarios(access_token);
	if (!resp.ok || !resp.data || Array.isArray(resp.data)) {
		return resp;
	}

	const { tecnicos } = resp.data as IFuncionarios;
	return {
		ok: true,
		error: null,
		data: tecnicos.map((t: IUsuario) => ({
			value: t.id,
			label: t.nome,
		})) as ITecnicoFuncionario[],
		status: 200,
	};
}
