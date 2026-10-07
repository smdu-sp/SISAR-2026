/** @format */

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, SquarePen } from 'lucide-react';
import FormPublicacao from './form-publicacao';
import { IPublicacao } from '@/types/publicacao';
import * as unidades from '@/services/unidades';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { IUnidades } from '@/types/unidades';
import { OptionType } from '@/components/form-combobox';
import { ITecnicoFuncionario } from '@/types/usuario';
import { listaTecnicos } from '@/services/usuarios';

export default async function ModalUpdateAndCreate({
	isUpdating,
	publicacao,
}: {
	isUpdating: boolean;
	publicacao?: Partial<IPublicacao>;
}) {
	const unidadesSelect: OptionType[] = [];
	const tecnicosSelect: ITecnicoFuncionario[] = [];
	const session = await auth();
	if (!session) redirect('/login');
	const unidadesResposta = await unidades.listaCompleta(
		session.access_token,
		'COORDENADORIA',
	);
	if (unidadesResposta.ok && Array.isArray(unidadesResposta.data))
		unidadesSelect.push(
			...(unidadesResposta.data as IUnidades[]).map((u) => ({
				value: u.id,
				label: u.sigla ? `${u.sigla} - ${u.nome}` : u.nome,
			})),
		);
	const tecnicosResposta = await listaTecnicos(session.access_token);
	if (tecnicosResposta.ok && Array.isArray(tecnicosResposta.data)) {
		tecnicosSelect.push(...(tecnicosResposta.data as ITecnicoFuncionario[]));
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size={'icon'}
					variant={'outline'}
					className={`${
						isUpdating
							? 'bg-card hover:bg-primary '
							: 'bg-primary hover:bg-primary hover:opacity-70 h-10 w-10 rounded-full shadow-sm'
					} group transition-all ease-linear duration-200`}>
					{isUpdating ? (
						<SquarePen
							size={28}
							className='text-primary group-hover:text-white group'
						/>
					) : (
						<Plus className='text-white group' />
					)}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isUpdating ? 'Editar ' : 'Criar '}Publicação
					</DialogTitle>
					<DialogDescription>
						{isUpdating
							? 'Gerencie as informações da publicação selecionada'
							: 'Insira os dados da nova publicação'}
					</DialogDescription>
				</DialogHeader>
				<FormPublicacao
					unidades={unidadesSelect}
					tecnicos={tecnicosSelect}
					publicacao={publicacao}
					isUpdating={isUpdating}
				/>
			</DialogContent>
		</Dialog>
	);
}
