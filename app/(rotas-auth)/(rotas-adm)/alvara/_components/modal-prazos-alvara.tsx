/** @format */

'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import { calcularPrazoTotalAnalise, PRAZOS_PADRAO_FORM } from '@/lib/prazos-alvara';
import * as alvaras from '@/services/alvaras';
import { IAlvaraTipoForm, IAlvaras } from '@/types/alvaras';
import { Plus, SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

function toForm(item?: IAlvaras): IAlvaraTipoForm {
	if (!item) {
		return { nome: '', ...PRAZOS_PADRAO_FORM };
	}
	const { id: _id, criado_em: _c, alterado_em: _a, ...rest } = item;
	return rest;
}

function CampoNumero({
	label,
	value,
	onChange,
}: {
	label: string;
	value: number;
	onChange: (v: number) => void;
}) {
	return (
		<div>
			<Label className='text-xs'>{label}</Label>
			<Input
				type='number'
				min={0}
				className='h-9'
				value={value}
				onChange={(e) => onChange(Number(e.target.value) || 0)}
			/>
		</div>
	);
}

export default function ModalPrazosAlvara({
	item,
	isUpdating = false,
}: {
	item?: IAlvaras;
	isUpdating?: boolean;
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState<IAlvaraTipoForm>(() => toForm(item));
	const [isPending, startTransition] = useTransition();

	const totalAnalise = useMemo(() => calcularPrazoTotalAnalise(form), [form]);

	function patch(partial: Partial<IAlvaraTipoForm>) {
		setForm((prev) => ({ ...prev, ...partial }));
	}

	function handleSalvar() {
		if (!form.nome.trim()) {
			toast.error('Informe o nome do tipo de alvará');
			return;
		}
		startTransition(async () => {
			const response =
				isUpdating && item
					? await alvaras.atualizar(item.id, form)
					: await alvaras.criar(form);
			if (response.ok) {
				toast.success(
					isUpdating ? 'Prazos atualizados' : 'Tipo de alvará cadastrado',
				);
				setOpen(false);
				router.refresh();
				return;
			}
			toast.error(response.error ?? 'Erro ao salvar');
		});
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (v) setForm(toForm(item));
			}}>
			<DialogTrigger asChild>
				<Button
					size='icon'
					variant={isUpdating ? 'outline' : 'default'}
					className={
						isUpdating
							? ''
							: 'bg-primary hover:bg-primary hover:opacity-70 h-12 w-12 rounded-full shadow-lg'
					}>
					{isUpdating ? <SquarePen /> : <Plus className='text-white' />}
				</Button>
			</DialogTrigger>
			<DialogContent className='max-h-[90vh] overflow-y-auto max-w-2xl'>
				<DialogHeader>
					<DialogTitle>
						{isUpdating ? 'Editar prazos' : 'Cadastrar tipo de alvará'}
					</DialogTitle>
					<DialogDescription>
						Prazos em dias úteis por etapa de análise, conforme matriz
						institucional.
					</DialogDescription>
				</DialogHeader>

				<div className='grid gap-4'>
					<div className='grid gap-2 sm:grid-cols-[1fr_120px]'>
						<div>
							<Label>Tipo de alvará</Label>
							<Input
								value={form.nome}
								onChange={(e) => patch({ nome: e.target.value })}
								placeholder='Ex.: Alvará de Aprovação de Reforma'
							/>
						</div>
						<div>
							<Label>Status</Label>
							<Select
								value={String(form.status)}
								onValueChange={(v) => patch({ status: Number(v) })}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='1'>Ativo</SelectItem>
									<SelectItem value='0'>Inativo</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div>
						<h3 className='text-sm font-semibold mb-2'>
							Etapas de análise (planilha)
						</h3>
						<div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
							<CampoNumero
								label='1ª Análise Próprio SMUL'
								value={form.prazo_analise_smul1}
								onChange={(v) => patch({ prazo_analise_smul1: v })}
							/>
							<CampoNumero
								label='2ª Análise Próprio SMUL'
								value={form.prazo_analise_smul2}
								onChange={(v) => patch({ prazo_analise_smul2: v })}
							/>
							<CampoNumero
								label='1ª Análise Múltiplas'
								value={form.prazo_analise_multi1}
								onChange={(v) => patch({ prazo_analise_multi1: v })}
							/>
							<CampoNumero
								label='2ª Análise Múltiplas'
								value={form.prazo_analise_multi2}
								onChange={(v) => patch({ prazo_analise_multi2: v })}
							/>
							<CampoNumero
								label='Análise adm. + outros prazos'
								value={form.prazo_admissibilidade_smul}
								onChange={(v) =>
									patch({
										prazo_admissibilidade_smul: v,
										prazo_admissibilidade_multi: v,
									})
								}
							/>
							<div className='flex flex-col justify-end'>
								<Label className='text-xs'>Prazo total de análise</Label>
								<p className='text-lg font-bold h-9 flex items-center'>
									{totalAnalise} dias
								</p>
							</div>
						</div>
					</div>

					<div>
						<h3 className='text-sm font-semibold mb-2'>
							Admissibilidade e reconsideração
						</h3>
						<div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
							<CampoNumero
								label='Admissibilidade (múltiplas)'
								value={form.prazo_admissibilidade_multi}
								onChange={(v) => patch({ prazo_admissibilidade_multi: v })}
							/>
							<CampoNumero
								label='Reconsideração SMUL'
								value={form.reconsideracao_smul}
								onChange={(v) => patch({ reconsideracao_smul: v })}
							/>
							<CampoNumero
								label='Reconsideração múltiplas'
								value={form.reconsideracao_multi}
								onChange={(v) => patch({ reconsideracao_multi: v })}
							/>
							<CampoNumero
								label='Análise reconsideração SMUL'
								value={form.analise_reconsideracao_smul}
								onChange={(v) => patch({ analise_reconsideracao_smul: v })}
							/>
							<CampoNumero
								label='Análise reconsideração múltiplas'
								value={form.analise_reconsideracao_multi}
								onChange={(v) => patch({ analise_reconsideracao_multi: v })}
							/>
						</div>
					</div>

					<div>
						<h3 className='text-sm font-semibold mb-2'>
							Comunique-se e emissão
						</h3>
						<div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
							<CampoNumero
								label='Envio 1º comunique-se'
								value={form.prazo_comunique_se}
								onChange={(v) => patch({ prazo_comunique_se: v })}
							/>
							<CampoNumero
								label='Envio 2º comunique-se'
								value={form.prazo_encaminhar_coord}
								onChange={(v) => patch({ prazo_encaminhar_coord: v })}
							/>
							<CampoNumero
								label='Emissão do alvará (SMUL)'
								value={form.prazo_emissao_alvara_smul}
								onChange={(v) =>
									patch({
										prazo_emissao_alvara_smul: v,
										prazo_emissao_alvara_multi: v,
									})
								}
							/>
						</div>
						<p className='text-xs text-muted-foreground mt-2'>
							Valores padrão da planilha: próprio SMUL 0/0/10 dias;
							múltiplas interfaces 5/5/10 dias.
						</p>
					</div>
				</div>

				<Button onClick={handleSalvar} disabled={isPending} className='w-full'>
					Salvar prazos
				</Button>
			</DialogContent>
		</Dialog>
	);
}
