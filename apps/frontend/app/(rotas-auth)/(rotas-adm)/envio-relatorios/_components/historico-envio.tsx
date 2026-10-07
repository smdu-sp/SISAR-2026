/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { historico } from '@/services/envio-relatorios';
import { IEnvioAgendado, IHistoricoEnvio } from '@/types/envio-relatorios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HistoricoEnvio({
	envio,
	onFechar,
}: {
	envio: IEnvioAgendado | null;
	onFechar: () => void;
}) {
	const [itens, setItens] = useState<IHistoricoEnvio[] | null>(null);
	const [erro, setErro] = useState<string | null>(null);

	useEffect(() => {
		if (!envio) return;
		let ativo = true;
		setItens(null);
		setErro(null);
		historico(envio.id).then((resposta) => {
			if (!ativo) return;
			if (resposta.ok && resposta.data) setItens(resposta.data);
			else setErro(resposta.error ?? 'Não foi possível carregar o histórico.');
		});
		return () => {
			ativo = false;
		};
	}, [envio]);

	return (
		<Dialog
			open={!!envio}
			onOpenChange={(aberto) => !aberto && onFechar()}>
			<DialogContent className='sm:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Histórico de envios</DialogTitle>
					<DialogDescription>{envio?.nome} — últimas 20 execuções</DialogDescription>
				</DialogHeader>
				<div className='max-h-[60vh] overflow-y-auto'>
					{erro && <p className='py-6 text-center text-sm text-muted-foreground'>{erro}</p>}
					{!erro && itens === null && (
						<div className='flex justify-center py-10'>
							<Loader2 className='animate-spin text-primary' />
						</div>
					)}
					{itens && itens.length === 0 && (
						<p className='py-6 text-center text-sm text-muted-foreground'>
							Este envio ainda não foi executado.
						</p>
					)}
					{itens && itens.length > 0 && (
						<ul className='divide-y'>
							{itens.map((item) => (
								<li
									key={item.id}
									className='py-3 space-y-1'>
									<div className='flex flex-wrap items-center gap-2'>
										<Badge variant={item.sucesso ? 'secondary' : 'destructive'}>
											{item.sucesso ? 'Enviado' : 'Falhou'}
										</Badge>
										<Badge variant='outline'>
											{item.origem === 'MANUAL' ? 'Manual' : 'Agendado'}
										</Badge>
										<span className='text-sm'>
											{new Date(item.executado_em).toLocaleString('pt-BR', {
												timeZone: 'America/Sao_Paulo',
												dateStyle: 'short',
												timeStyle: 'short',
											})}
										</span>
									</div>
									<p className='text-xs text-muted-foreground'>
										Para: {item.destinatarios.join(', ')}
									</p>
									{item.arquivos && item.arquivos.length > 0 && (
										<p className='text-xs text-muted-foreground'>
											Arquivos: {item.arquivos.join(', ')}
										</p>
									)}
									{item.erro && <p className='text-xs text-destructive'>{item.erro}</p>}
								</li>
							))}
						</ul>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
