/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatarSei, formataProcesso } from '@/lib/utils';
import { IProcesso } from '@/types/processos';
import CardPrazoFase from './card-prazo-fase';

const TIPO_REQUERIMENTO: Record<number, string> = {
	1: 'IPTU',
	2: 'INCRA',
	3: 'Área Pública',
};

export default function AbaDadosIniciais({ processo }: { processo: IProcesso }) {
	return (
		<div className='space-y-4'>
			<CardPrazoFase fase='dados' processo={processo} />
		<Card>
			<CardHeader>
				<CardTitle>Dados iniciais</CardTitle>
			</CardHeader>
			<CardContent className='grid gap-4 sm:grid-cols-2'>
				<Campo label='SEI' valor={formatarSei(processo.sei)} />
				<Campo
					label='Processo físico'
					valor={
						processo.processo_fisico
							? formataProcesso(processo.processo_fisico)
							: '—'
					}
				/>
				<Campo
					label='Tipo de requerimento'
					valor={
						TIPO_REQUERIMENTO[processo.tipo_requerimento] ??
						String(processo.tipo_requerimento)
					}
				/>
				<Campo label='Requerimento' valor={processo.requerimento} />
				<Campo
					label='Tipo de alvará'
					valor={processo.alvara_tipo?.nome ?? '—'}
				/>
				<Campo
					label='Protocolo'
					valor={formatarData(processo.data_protocolo)}
				/>
				<Campo
					label='Data de Recebimento em SMUL/ATEC'
					valor={formatarData(processo.envio_admissibilidade)}
				/>
				<Campo
					label='Tipo de processo'
					valor={
						processo.tipo_processo === 2
							? 'Múltiplas Interfaces'
							: 'Próprio SMUL'
					}
				/>
				{processo.obs && (
					<div className='sm:col-span-2'>
						<Campo label='Observações' valor={processo.obs} />
					</div>
				)}
			</CardContent>
		</Card>
		</div>
	);
}

function Campo({ label, valor }: { label: string; valor: string }) {
	return (
		<div>
			<p className='text-sm text-muted-foreground'>{label}</p>
			<p className='font-medium'>{valor}</p>
		</div>
	);
}

function formatarData(valor?: string | Date | null) {
	if (!valor) return '—';
	const data = new Date(valor);
	if (Number.isNaN(data.getTime())) return '—';
	return data.toLocaleDateString('pt-BR');
}
