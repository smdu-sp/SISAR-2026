/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { tipos_relatorios } from '@/lib/utils';
import { atualizar, criar } from '@/services/envio-relatorios';
import {
	FrequenciaEnvio,
	IEnvioAgendado,
	IEnvioAgendadoPayload,
	PeriodoRelatorio,
} from '@/types/envio-relatorios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const DIAS_SEMANA = [
	'Domingo',
	'Segunda-feira',
	'Terça-feira',
	'Quarta-feira',
	'Quinta-feira',
	'Sexta-feira',
	'Sábado',
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function paraHorario(hora: number, minuto: number) {
	return `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
}

export default function FormEnvio({
	aberto,
	onAbertoChange,
	envio,
}: {
	aberto: boolean;
	onAbertoChange: (aberto: boolean) => void;
	envio: IEnvioAgendado | null;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const [nome, setNome] = useState(envio?.nome ?? '');
	const [tipo, setTipo] = useState(envio?.tipo_relatorio ?? tipos_relatorios[0].value);
	const [pdf, setPdf] = useState(envio?.formato_pdf ?? true);
	const [excel, setExcel] = useState(envio?.formato_excel ?? true);
	const [destinatarios, setDestinatarios] = useState(envio?.destinatarios.join('\n') ?? '');
	const [assunto, setAssunto] = useState(envio?.assunto ?? '');
	const [mensagem, setMensagem] = useState(envio?.mensagem ?? '');
	const [frequencia, setFrequencia] = useState<FrequenciaEnvio>(envio?.frequencia ?? 'MENSAL');
	const [diaDoMes, setDiaDoMes] = useState(String(envio?.dia_do_mes ?? 5));
	const [diaDaSemana, setDiaDaSemana] = useState(String(envio?.dia_da_semana ?? 1));
	const [horario, setHorario] = useState(
		envio ? paraHorario(envio.hora, envio.minuto) : '08:00',
	);
	const [periodo, setPeriodo] = useState<PeriodoRelatorio>(envio?.periodo ?? 'MES_ANTERIOR');
	const [ativo, setAtivo] = useState(envio?.ativo ?? true);

	function salvar() {
		const emails = [...new Set(destinatarios.split(/[\s,;]+/).filter(Boolean))];
		const invalidos = emails.filter((e) => !EMAIL.test(e));
		if (!nome.trim()) return toast.error('Informe um nome para o envio.');
		if (!pdf && !excel) return toast.error('Selecione ao menos um formato (PDF ou Excel).');
		if (emails.length === 0) return toast.error('Informe ao menos um destinatário.');
		if (invalidos.length > 0) return toast.error(`E-mail inválido: ${invalidos.join(', ')}`);
		if (frequencia === 'MENSAL' && !(+diaDoMes >= 1 && +diaDoMes <= 31)) {
			return toast.error('O dia do mês deve estar entre 1 e 31.');
		}
		const [hora, minuto] = horario.split(':').map(Number);
		if (Number.isNaN(hora) || Number.isNaN(minuto)) return toast.error('Informe o horário.');

		const payload: IEnvioAgendadoPayload = {
			nome: nome.trim(),
			tipo_relatorio: tipo,
			formato_pdf: pdf,
			formato_excel: excel,
			destinatarios: emails,
			assunto: assunto.trim() || undefined,
			mensagem: mensagem.trim() || undefined,
			frequencia,
			dia_do_mes: frequencia === 'MENSAL' ? +diaDoMes : undefined,
			dia_da_semana: frequencia === 'SEMANAL' ? +diaDaSemana : undefined,
			hora,
			minuto,
			periodo,
			ativo,
		};

		startTransition(async () => {
			const resposta = envio ? await atualizar(envio.id, payload) : await criar(payload);
			if (!resposta.ok) {
				toast.error(resposta.error ?? 'Erro ao salvar o envio.');
				return;
			}
			toast.success(envio ? 'Envio atualizado.' : 'Envio criado.');
			onAbertoChange(false);
			router.refresh();
		});
	}

	return (
		<Dialog
			open={aberto}
			onOpenChange={onAbertoChange}>
			<DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>{envio ? 'Editar envio' : 'Novo envio automático'}</DialogTitle>
					<DialogDescription>
						Os horários seguem o fuso de Brasília. Exemplo: todo dia 5 às 08:00, relatório do mês
						anterior em PDF e Excel.
					</DialogDescription>
				</DialogHeader>

				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<Label htmlFor='envio-nome'>Nome</Label>
						<Input
							id='envio-nome'
							value={nome}
							onChange={(e) => setNome(e.target.value)}
							placeholder='Ex.: Quantitativo mensal — Gabinete'
						/>
					</div>

					<div className='grid gap-2'>
						<Label>Relatório</Label>
						<Select
							value={tipo}
							onValueChange={setTipo}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{tipos_relatorios.map((t) => (
									<SelectItem
										key={t.value}
										value={t.value}>
										{t.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='grid gap-2'>
						<Label>Formatos do anexo</Label>
						<div className='flex gap-6'>
							<label className='flex items-center gap-2 text-sm'>
								<Checkbox
									checked={pdf}
									onCheckedChange={(v) => setPdf(v === true)}
								/>
								PDF
							</label>
							<label className='flex items-center gap-2 text-sm'>
								<Checkbox
									checked={excel}
									onCheckedChange={(v) => setExcel(v === true)}
								/>
								Excel
							</label>
						</div>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='envio-destinatarios'>Destinatários</Label>
						<Textarea
							id='envio-destinatarios'
							value={destinatarios}
							onChange={(e) => setDestinatarios(e.target.value)}
							placeholder={'um e-mail por linha, ou separados por vírgula'}
							rows={3}
						/>
					</div>

					<div className='grid gap-4 sm:grid-cols-3'>
						<div className='grid gap-2'>
							<Label>Frequência</Label>
							<Select
								value={frequencia}
								onValueChange={(v) => setFrequencia(v as FrequenciaEnvio)}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='DIARIA'>Diária</SelectItem>
									<SelectItem value='SEMANAL'>Semanal</SelectItem>
									<SelectItem value='MENSAL'>Mensal</SelectItem>
								</SelectContent>
							</Select>
						</div>
						{frequencia === 'MENSAL' && (
							<div className='grid gap-2'>
								<Label htmlFor='envio-dia-mes'>Dia do mês</Label>
								<Input
									id='envio-dia-mes'
									type='number'
									min={1}
									max={31}
									value={diaDoMes}
									onChange={(e) => setDiaDoMes(e.target.value)}
								/>
							</div>
						)}
						{frequencia === 'SEMANAL' && (
							<div className='grid gap-2'>
								<Label>Dia da semana</Label>
								<Select
									value={diaDaSemana}
									onValueChange={setDiaDaSemana}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{DIAS_SEMANA.map((dia, i) => (
											<SelectItem
												key={dia}
												value={String(i)}>
												{dia}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
						<div className='grid gap-2'>
							<Label htmlFor='envio-horario'>Horário</Label>
							<Input
								id='envio-horario'
								type='time'
								value={horario}
								onChange={(e) => setHorario(e.target.value)}
							/>
						</div>
					</div>
					{frequencia === 'MENSAL' && +diaDoMes > 28 && (
						<p className='-mt-2 text-xs text-muted-foreground'>
							Em meses com menos dias, o envio acontece no último dia do mês.
						</p>
					)}

					<div className='grid gap-2'>
						<Label>Período coberto pelo relatório</Label>
						<Select
							value={periodo}
							onValueChange={(v) => setPeriodo(v as PeriodoRelatorio)}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='MES_ANTERIOR'>Mês anterior (inteiro)</SelectItem>
								<SelectItem value='MES_ATUAL'>Mês atual (até o momento do envio)</SelectItem>
								<SelectItem value='ANO_ATUAL'>Ano atual (até o momento do envio)</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='envio-assunto'>Assunto (opcional)</Label>
						<Input
							id='envio-assunto'
							value={assunto}
							onChange={(e) => setAssunto(e.target.value)}
							placeholder='Se vazio, usa um assunto padrão'
						/>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='envio-mensagem'>Mensagem (opcional)</Label>
						<Textarea
							id='envio-mensagem'
							value={mensagem}
							onChange={(e) => setMensagem(e.target.value)}
							rows={3}
						/>
					</div>

					<label className='flex items-center gap-3 text-sm'>
						<Switch
							checked={ativo}
							onCheckedChange={setAtivo}
						/>
						Envio ativo
					</label>
				</div>

				<DialogFooter>
					<Button
						variant='outline'
						disabled={isPending}
						onClick={() => onAbertoChange(false)}>
						Cancelar
					</Button>
					<Button
						disabled={isPending}
						onClick={salvar}>
						{isPending && <Loader2 className='animate-spin' />}
						Salvar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
