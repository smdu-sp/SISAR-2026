/** @format */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatarSei } from '@/lib/utils';
import { IProcesso } from '@/types/processos';

const STATUS_PROCESSO: Record<number, string> = {
	0: 'Admissibilidade',
	1: 'Via Ordinária',
	2: 'Em Análise',
	3: 'Deferido',
	4: 'Indeferido',
};

export default function AbaAnalise({ processo }: { processo: IProcesso }) {
	const status = processo.status ?? 0;
	const emAnalise = status === 2;
	const alvara = processo.alvara_tipo;
	const multiplasInterfaces = processo.tipo_processo === 2;

	const prazosAnalise = multiplasInterfaces
		? [
				{
					label: '1ª análise (múltiplas interfaces)',
					dias: alvara?.prazo_analise_mult1,
				},
				{
					label: '2ª análise (múltiplas interfaces)',
					dias: alvara?.prazo_analise_multi2,
				},
			]
		: [
				{
					label: '1ª análise (SMUL)',
					dias: alvara?.prazo_analise_smul1,
				},
				{
					label: '2ª análise (SMUL)',
					dias: alvara?.prazo_analise_smul2,
				},
			];

	return (
		<div className='space-y-4'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between gap-4'>
					<CardTitle>Análise do processo</CardTitle>
					<Badge variant={emAnalise ? 'default' : 'secondary'}>
						{STATUS_PROCESSO[status] ?? '—'}
					</Badge>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<Campo label='SEI' valor={formatarSei(processo.sei)} />
						<Campo label='Requerimento' valor={processo.requerimento} />
						<Campo
							label='Tipo de alvará'
							valor={alvara?.nome ?? '—'}
						/>
						<Campo
							label='Data limite SMUL'
							valor={formatarData(processo.data_limiteSmul)}
						/>
						{multiplasInterfaces && (
							<Campo
								label='Data limite múltiplas interfaces'
								valor={formatarData(processo.data_limiteMulti)}
							/>
						)}
					</div>

					{!emAnalise && (
						<p className='text-sm text-muted-foreground rounded-md border border-dashed p-4'>
							Este processo não está com status &quot;Em Análise&quot;. A aba
							exibe os prazos e referências de análise vinculados ao tipo de
							alvará.
						</p>
					)}
				</CardContent>
			</Card>

			{alvara && (
				<Card>
					<CardHeader>
						<CardTitle className='text-base'>
							Prazos de análise (tipo de alvará)
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className='grid gap-2 sm:grid-cols-2'>
							{prazosAnalise.map((item) => (
								<li
									key={item.label}
									className='flex justify-between gap-2 rounded-md border px-3 py-2 text-sm'>
									<span className='text-muted-foreground'>{item.label}</span>
									<span className='font-medium'>
										{item.dias != null ? `${item.dias} dias` : '—'}
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}
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
