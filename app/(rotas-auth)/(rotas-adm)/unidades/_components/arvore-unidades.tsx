/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IUnidadeArvore, IUnidades, NIVEL_LABEL, NivelUnidade } from '@/types/unidades';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import ModalUnidade, { nivelFilho } from './modal-unidade';

const BADGE_VARIANT: Record<NivelUnidade, 'default' | 'secondary' | 'outline'> = {
	COORDENADORIA: 'default',
	DIRETORIA: 'secondary',
	UNIDADE: 'outline',
};

function No({
	no,
	todas,
	nivelProfundidade,
}: {
	no: IUnidadeArvore;
	todas: IUnidades[];
	nivelProfundidade: number;
}) {
	const [aberto, setAberto] = useState(true);
	const temFilhas = no.filhas && no.filhas.length > 0;
	const filho = nivelFilho(no.nivel);

	return (
		<div>
			<div
				className={cn(
					'flex items-center gap-2 rounded-md border bg-card px-3 py-2 shadow-xs',
					no.status === 0 && 'opacity-50',
				)}
				style={{ marginLeft: nivelProfundidade * 20 }}>
				<button
					type='button'
					onClick={() => setAberto((v) => !v)}
					className={cn(
						'shrink-0 text-muted-foreground',
						!temFilhas && 'invisible',
					)}
					aria-label={aberto ? 'Recolher' : 'Expandir'}>
					{aberto ? (
						<ChevronDown className='h-4 w-4' />
					) : (
						<ChevronRight className='h-4 w-4' />
					)}
				</button>
				<Badge variant={BADGE_VARIANT[no.nivel]} className='shrink-0'>
					{NIVEL_LABEL[no.nivel]}
				</Badge>
				<div className='min-w-0 flex-1'>
					<p className='truncate text-sm font-medium'>
						{no.sigla ? `${no.sigla} — ${no.nome}` : no.nome}
					</p>
					{no.codigo && (
						<p className='truncate text-xs text-muted-foreground'>
							Código: {no.codigo}
						</p>
					)}
				</div>
				<div className='flex shrink-0 items-center gap-1'>
					{filho && (
						<ModalUnidade
							todas={todas}
							pai={no}
							trigger={
								<Button
									size='sm'
									variant='ghost'
									className='h-8 gap-1 px-2 text-xs'
									title={`Adicionar ${NIVEL_LABEL[filho].toLowerCase()}`}>
									<Plus className='h-3.5 w-3.5' />
									{NIVEL_LABEL[filho]}
								</Button>
							}
						/>
					)}
					<ModalUnidade item={no} isUpdating todas={todas} />
				</div>
			</div>
			{aberto && temFilhas && (
				<div className='mt-1 space-y-1'>
					{no.filhas.map((f) => (
						<No
							key={f.id}
							no={f}
							todas={todas}
							nivelProfundidade={nivelProfundidade + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default function ArvoreUnidades({
	arvore,
	todas,
}: {
	arvore: IUnidadeArvore[];
	todas: IUnidades[];
}) {
	if (arvore.length === 0)
		return (
			<div className='rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground'>
				Nenhuma unidade encontrada.
			</div>
		);

	return (
		<div className='space-y-1'>
			{arvore.map((no) => (
				<No key={no.id} no={no} todas={todas} nivelProfundidade={0} />
			))}
		</div>
	);
}
