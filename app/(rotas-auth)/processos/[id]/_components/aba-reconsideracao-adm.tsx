/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as reconsideracao from '@/services/reconsideracao';
import { IAdmissibilidade } from '@/types/admissibilidade';
import { IReconsideracaoAdmissibilidade } from '@/types/analise';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function AbaReconsideracaoAdm({
	inicialId,
	admissibilidade,
	reconsideracao: rec,
}: {
	inicialId: number;
	admissibilidade: IAdmissibilidade;
	reconsideracao?: IReconsideracaoAdmissibilidade | null;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const hoje = new Date().toISOString().split('T')[0];
	const [pedido, setPedido] = useState(
		rec?.pedido_reconsideracao
			? new Date(rec.pedido_reconsideracao).toISOString().split('T')[0]
			: hoje,
	);
	const [envio, setEnvio] = useState(
		rec?.envio ? new Date(rec.envio).toISOString().split('T')[0] : '',
	);
	const [publicacao, setPublicacao] = useState(
		rec?.publicacao
			? new Date(rec.publicacao).toISOString().split('T')[0]
			: '',
	);

	if (admissibilidade.status !== 3) return null;

	function salvarPedido() {
		startTransition(async () => {
			const res = await reconsideracao.registrarPedido(inicialId, {
				pedido_reconsideracao: pedido,
				envio: envio || undefined,
				publicacao: publicacao || undefined,
			});
			if (res.ok) {
				toast.success('Pedido de reconsideração registrado');
				router.refresh();
			} else {
				toast.error(res.error ?? 'Erro ao registrar pedido');
			}
		});
	}

	function aceitar() {
		startTransition(async () => {
			const res = await reconsideracao.aceitar(inicialId);
			if (res.ok) {
				toast.success('Reconsideração aceita — processo em análise técnica');
				router.push(`/processos/${inicialId}?tab=analise`);
				router.refresh();
			} else {
				toast.error(res.error ?? 'Erro ao aceitar');
			}
		});
	}

	function rejeitar() {
		startTransition(async () => {
			const res = await reconsideracao.rejeitar(inicialId);
			if (res.ok) {
				toast.success('Reconsideração rejeitada — via ordinária');
				router.refresh();
			} else {
				toast.error(res.error ?? 'Erro ao rejeitar');
			}
		});
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base'>Reconsideração de admissibilidade</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<p className='text-sm text-muted-foreground'>
					Processo inadmitido. Registre o pedido do munícipe e decida se o processo
					segue para análise técnica ou é encerrado por via ordinária.
				</p>
				<div className='grid gap-4 sm:grid-cols-3'>
					<div className='space-y-2'>
						<Label>Data do pedido</Label>
						<Input
							type='date'
							value={pedido}
							onChange={(e) => setPedido(e.target.value)}
						/>
					</div>
					<div className='space-y-2'>
						<Label>Envio (opcional)</Label>
						<Input
							type='date'
							value={envio}
							onChange={(e) => setEnvio(e.target.value)}
						/>
					</div>
					<div className='space-y-2'>
						<Label>Publicação (opcional)</Label>
						<Input
							type='date'
							value={publicacao}
							onChange={(e) => setPublicacao(e.target.value)}
						/>
					</div>
				</div>
				<div className='flex flex-wrap gap-2'>
					<Button variant='outline' onClick={salvarPedido} disabled={isPending}>
						{isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Registrar pedido
					</Button>
					<Button onClick={aceitar} disabled={isPending}>
						Aceitar e admitir
					</Button>
					<Button variant='destructive' onClick={rejeitar} disabled={isPending}>
						Rejeitar (via ordinária)
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
