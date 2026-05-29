/** @format */

import { auth } from '@/lib/auth/auth';
import * as usuario from '@/services/usuarios';
import * as unidades from '@/services/unidades';
import { IUsuario } from '@/types/usuario';
import { redirect } from 'next/navigation';
import UsuarioDetalhe from './_components/usuario-detalhe';

export default async function UsuarioDetalhePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const resp = await usuario.buscarPorId(id, session.access_token);
	if (!resp.ok || !resp.data) redirect('/usuarios');

	const usuarioData = resp.data as IUsuario & {
		ferias?: { id: string; inicio: string; final: string }[];
		substitutos?: {
			id: string;
			substituto?: { nome: string };
		}[];
	};

	let listaUnidades: { id: string; nome: string }[] = [];
	const respUnidades = await unidades.buscarTudo(
		session.access_token,
		1,
		200,
		'',
	);
	if (respUnidades.ok && respUnidades.data) {
		const pag = respUnidades.data as { data: { id: string; nome: string }[] };
		listaUnidades = pag.data ?? [];
	}

	let administrativos: IUsuario[] = [];
	const respAdm = await usuario.buscarAdministrativos(session.access_token);
	if (respAdm.ok && respAdm.data) {
		administrativos = respAdm.data as IUsuario[];
	}

	return (
		<div className='w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto'>
			<UsuarioDetalhe
				usuario={usuarioData}
				unidades={listaUnidades}
				administrativos={administrativos}
			/>
		</div>
	);
}
