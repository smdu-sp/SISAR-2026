/** @format */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatarSei } from '@/lib/utils';
import Link from 'next/link';

export default async function NovoProcessoPage({
	searchParams,
}: {
	searchParams: Promise<{ sei?: string }>;
}) {
	const { sei = '' } = await searchParams;

	return (
		<div className='px-0 md:px-8 container mx-auto space-y-6'>
			<Link href='/processos' className='text-sm text-primary hover:underline'>
				← Voltar para processos
			</Link>
			<h1 className='text-xl md:text-3xl font-bold'>Novo processo</h1>
			<Card>
				<CardHeader>
					<CardTitle>Cadastro</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					{sei ? (
						<p>
							SEI informado:{' '}
							<span className='font-medium'>{formatarSei(sei)}</span>
						</p>
					) : (
						<p className='text-muted-foreground'>
							Nenhum SEI informado. Utilize o botão + na listagem de processos.
						</p>
					)}
					<p className='text-sm text-muted-foreground'>
						O formulário completo de cadastro será disponibilizado em breve.
					</p>
					<Button asChild variant='outline'>
						<Link href='/processos'>Retornar à listagem</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
