/** @format */

'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatarSei } from '@/lib/utils';
import {
	IComuniqueSe,
	IContextoAnalise,
	IDecisaoProcesso,
	IReuniaoProcesso,
	ParecerDecisao,
	SubstatusAnalise,
} from '@/types/analise';
import { IProcesso } from '@/types/processos';
import Link from 'next/link';

const SUBSTATUS_LABEL: Record<number, string> = {
	[SubstatusAnalise.NORMAL]: 'Em análise',
	[SubstatusAnalise.COMUNIQUE_SE]: 'Aguardando resposta do comunique-se',
	[SubstatusAnalise.AGUARDANDO_RECURSO]: 'Aguardando recurso do munícipe',
	[SubstatusAnalise.PRE_REUNIAO_GRAPROEM]: 'Pré-reunião GRAPROEM pendente',
};

const PARECER_LABEL: Record<number, string> = {
	[ParecerDecisao.PENDENTE]: 'Pendente',
	[ParecerDecisao.DEFERIDO]: 'Deferido',
	[ParecerDecisao.INDEFERIDO]: 'Indeferido',
	[ParecerDecisao.COMUNIQUE_SE]: 'Comunique-se',
};

function formatarDataBr(valor?: string | Date | null) {
	if (!valor) return '—';
	const d = new Date(valor);
	if (Number.isNaN(d.getTime())) return '—';
	return d.toLocaleDateString('pt-BR');
}

function instanciasDoContexto(ctx: IContextoAnalise): number[] {
	const nums = new Set<number>();
	for (const d of ctx.decisoes) {
		if (d.instancia != null) nums.add(d.instancia);
	}
	for (const r of ctx.reunioes) {
		nums.add(r.instancia);
	}
	for (const c of ctx.comunique_ses) {
		if (c.etapa) nums.add(c.etapa);
	}
	if (ctx.etapa_analise) nums.add(ctx.etapa_analise);
	if (nums.size === 0) nums.add(1);
	return [...nums].sort((a, b) => a - b);
}

function decisaoDaInstancia(
	decisoes: IDecisaoProcesso[],
	instancia: number,
) {
	return (
		decisoes.find((d) => d.instancia === instancia) ??
		decisoes.find((d) => d.etapa === instancia)
	);
}

function reuniaoDaInstancia(reunioes: IReuniaoProcesso[], instancia: number) {
	return reunioes.find((r) => r.instancia === instancia);
}

function comuniqueDaInstancia(comuniqueSes: IComuniqueSe[], instancia: number) {
	return comuniqueSes.filter((c) => c.etapa === instancia);
}

export default function HistoricoAnaliseTecnica({
	processo,
	ctx,
	mostrarLinkFinalizacao = false,
}: {
	processo: IProcesso;
	ctx: IContextoAnalise;
	mostrarLinkFinalizacao?: boolean;
}) {
	const instancias = instanciasDoContexto(ctx);
	const trilha = ctx.graproem ? 'GRAPROEM (múltiplas interfaces)' : 'SMUL';

	return (
		<div className='space-y-4'>
			<Card>
				<CardHeader className='flex flex-row flex-wrap items-center justify-between gap-2'>
					<CardTitle>Análise técnica — consulta</CardTitle>
					<div className='flex flex-wrap gap-2'>
						<Badge>{trilha}</Badge>
						<Badge variant='outline'>
							{SUBSTATUS_LABEL[ctx.substatus_analise] ?? '—'}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className='grid gap-3 sm:grid-cols-2 text-sm'>
					<p>
						<span className='text-muted-foreground'>SEI: </span>
						{formatarSei(processo.sei)}
					</p>
					<p>
						<span className='text-muted-foreground'>Instância atual: </span>
						{ctx.etapa_analise}ª
					</p>
					<p>
						<span className='text-muted-foreground'>Técnico: </span>
						{ctx.distribuicao?.tecnico_responsavel?.nome ?? '—'}
					</p>
					<p>
						<span className='text-muted-foreground'>Administrativo: </span>
						{ctx.distribuicao?.administrativo_responsavel?.nome ?? '—'}
					</p>
					<p>
						<span className='text-muted-foreground'>Prazo SMUL: </span>
						{formatarDataBr(ctx.data_limiteSmul)}
					</p>
					<p>
						<span className='text-muted-foreground'>Prazo múltiplas: </span>
						{formatarDataBr(ctx.data_limiteMulti)}
					</p>
				</CardContent>
			</Card>

			{mostrarLinkFinalizacao && (
				<p className='text-sm text-muted-foreground'>
					Processo deferido na análise técnica. Para registrar o alvará, acesse a
					aba{' '}
					<Link
						href={`/processos/${processo.id}?tab=finalizacao`}
						className='text-primary hover:underline'>
						Finalização
					</Link>
					.
				</p>
			)}

			{instancias.map((inst) => (
				<Card key={inst}>
					<CardHeader>
						<CardTitle className='text-base'>{inst}ª instância</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4 text-sm'>
						<SecaoDecisao decisao={decisaoDaInstancia(ctx.decisoes, inst)} />
						{(ctx.graproem || reuniaoDaInstancia(ctx.reunioes, inst)) && (
							<SecaoGraproem reuniao={reuniaoDaInstancia(ctx.reunioes, inst)} />
						)}
						<SecaoComuniqueSe
							itens={comuniqueDaInstancia(ctx.comunique_ses, inst)}
						/>
					</CardContent>
				</Card>
			))}

			{ctx.comunique_ses.length > 0 &&
				ctx.comunique_ses.some(
					(c) => !instancias.includes(c.etapa),
				) && (
					<Card>
						<CardHeader>
							<CardTitle className='text-base'>
								Comunique-se (outras etapas)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className='space-y-2 text-sm'>
								{ctx.comunique_ses
									.filter((c) => !instancias.includes(c.etapa))
									.map((c) => (
										<li key={c.id} className='rounded-md border p-2'>
											Etapa {c.etapa} — publicado em{' '}
											{formatarDataBr(c.data)}
											{c.data_resposta
												? ` — resposta em ${formatarDataBr(c.data_resposta)}`
												: ' — aguardando resposta'}
										</li>
									))}
							</ul>
						</CardContent>
					</Card>
				)}
		</div>
	);
}

function SecaoDecisao({ decisao }: { decisao?: IDecisaoProcesso }) {
	if (!decisao) {
		return (
			<div>
				<p className='font-medium mb-1'>Decisão técnica</p>
				<p className='text-muted-foreground'>Nenhum registro nesta instância.</p>
			</div>
		);
	}

	return (
		<div className='rounded-md border p-3 space-y-2'>
			<p className='font-medium'>Decisão técnica</p>
			<p>
				<span className='text-muted-foreground'>Parecer: </span>
				{PARECER_LABEL[decisao.parecer] ?? `Código ${decisao.parecer}`}
			</p>
			<p>
				<span className='text-muted-foreground'>Publicação do parecer: </span>
				{formatarDataBr(decisao.publicacao_parecer)}
			</p>
			{decisao.obs?.trim() && (
				<p>
					<span className='text-muted-foreground'>Observações: </span>
					{decisao.obs}
				</p>
			)}
		</div>
	);
}

function SecaoGraproem({ reuniao }: { reuniao?: IReuniaoProcesso }) {
	if (!reuniao) {
		return (
			<div>
				<p className='font-medium mb-1'>Reunião GRAPROEM</p>
				<p className='text-muted-foreground'>Sem dados de reunião nesta instância.</p>
			</div>
		);
	}

	return (
		<div className='rounded-md border p-3 space-y-2'>
			<p className='font-medium'>Reunião GRAPROEM</p>
			<p>
				<span className='text-muted-foreground'>Data da reunião: </span>
				{formatarDataBr(reuniao.data_reuniao)}
				{reuniao.nova_data_reuniao && (
					<>
						{' '}
						(remarcada para {formatarDataBr(reuniao.nova_data_reuniao)})
					</>
				)}
			</p>
			<p>
				<span className='text-muted-foreground'>Data do processo: </span>
				{formatarDataBr(reuniao.data_processo)}
			</p>
			<p>
				<span className='text-muted-foreground'>Nº da reunião: </span>
				{reuniao.numero_reuniao?.trim() || '—'}
			</p>
			{reuniao.parecer_grupo?.trim() && (
				<div>
					<p className='text-muted-foreground'>Parecer do grupo:</p>
					<p className='whitespace-pre-wrap mt-1'>{reuniao.parecer_grupo}</p>
				</div>
			)}
			{reuniao.justificativa_remarcacao?.trim() && (
				<p>
					<span className='text-muted-foreground'>Justificativa remarcação: </span>
					{reuniao.justificativa_remarcacao}
				</p>
			)}
		</div>
	);
}

function SecaoComuniqueSe({ itens }: { itens: IComuniqueSe[] }) {
	if (itens.length === 0) {
		return (
			<div>
				<p className='font-medium mb-1'>Comunique-se</p>
				<p className='text-muted-foreground'>Nenhum comunique-se nesta instância.</p>
			</div>
		);
	}

	return (
		<div className='rounded-md border p-3 space-y-2'>
			<p className='font-medium'>Comunique-se</p>
			<ul className='space-y-2'>
				{itens.map((c) => (
					<li key={c.id} className='border-l-2 pl-2'>
						Publicado em {formatarDataBr(c.data)}
						{c.complementar ? ' (complementar)' : ''}
						{c.data_resposta
							? ` — resposta em ${formatarDataBr(c.data_resposta)}`
							: ' — aguardando resposta'}
					</li>
				))}
			</ul>
		</div>
	);
}
