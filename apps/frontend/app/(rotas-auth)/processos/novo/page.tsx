/** @format */

import { auth } from '@/lib/auth/auth';
import * as alvaras from '@/services/alvaras';
import { IAlvaras } from '@/types/alvaras';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import FormNovoProcesso from './_components/form-novo-processo';
import { PageHeader } from '@/components/page-header';
import { pageContainer } from '@/lib/utils';

export default async function NovoProcessoPage({
	searchParams,
}: {
	searchParams: Promise<{ sei?: string }>;
}) {
	const { sei = '' } = await searchParams;
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const alvarasResp = await alvaras.listaCompleta(session.access_token);
	const tiposAlvara = (
		alvarasResp.ok && Array.isArray(alvarasResp.data)
			? alvarasResp.data
			: []
	) as IAlvaras[];

	return (
		<div className={pageContainer}>
			<Link href='/processos' className='text-sm text-primary hover:underline'>
				← Voltar para processos
			</Link>
			<PageHeader title='Novo processo' />
			<FormNovoProcesso seiInicial={sei} tiposAlvara={tiposAlvara} />
		</div>
	);
}
