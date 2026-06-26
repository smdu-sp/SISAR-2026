/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	CalendarIcon,
	Check,
	ChevronsUpDown,
	RefreshCw,
	X,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn, verificaData } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from './ui/command';

interface CampoFiltravel {
	nome: string;
	tag: string;
	tipo: TiposFiltros;
	default?: string;
	valores?: CampoSelect[] | CampoDataRange;
	placeholder?: string;
}

export enum TiposFiltros {
	TEXTO,
	DATA,
	SELECT,
	AUTOCOMPLETE,
}

interface CampoSelect {
	value: string | number;
	label: string;
}

interface CampoDataRange {
	modo: 'unico' | 'intervalo';
}

interface FiltrosProps {
	camposFiltraveis?: CampoFiltravel[];
}

export function Filtros({ camposFiltraveis }: FiltrosProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const [isPending, startTransition] = useTransition();
	const [filtros, setFiltros] = useState<{ [key: string]: string }>(
		camposFiltraveis
			? camposFiltraveis.reduce(
				(acc, item) => ({ ...acc, [item.tag]: item.default || '' }),
				{},
			)
			: {},
	);

	useEffect(() => {
		atualizaFiltros();
	}, []);

	useEffect(() => {
		for (const [key, value] of searchParams) {
			setFiltros((prev) => ({
				...prev,
				[key]: value,
			}));
		}
	}, [searchParams]);

	function atualizaFiltros() {
		let urlParams = '';
		for (const [key, value] of Object.entries(filtros)) {
			urlParams += `${key}=${value}&`;
		}
		router.push(`${pathname}?${urlParams}`);
	}

	function limpaFiltros() {
		setFiltros(
			camposFiltraveis
				? camposFiltraveis.reduce(
					(acc, item) => ({ ...acc, [item.tag]: '' }),
					{},
				)
				: {},
		);
		router.push(pathname);
	}

	function renderFiltros() {
		const filtros = [];
		if (camposFiltraveis) {
			for (const campo of camposFiltraveis) {
				switch (campo.tipo) {
					case TiposFiltros.TEXTO:
						filtros.push(RenderTexto(campo));
						break;
					case TiposFiltros.DATA:
						filtros.push(RenderDataInputs(campo));
						break;
					case TiposFiltros.SELECT:
						filtros.push(RenderSelect(campo));
						break;
					case TiposFiltros.AUTOCOMPLETE:
						filtros.push(RenderAutocomplete(campo));
						break;
				}
			}
		}
		return filtros;
	}

	function RenderTexto(campo: CampoFiltravel) {
		return (
			<div
				className='flex flex-col w-full md:w-60 text-sm xl:text-base'
				key={campo.tag}>
				<p>{campo.nome}</p>
				<Input
					value={filtros[campo.tag]}
					onChange={(e) =>
						setFiltros((prev) => ({ ...prev, [campo.tag]: e.target.value }))
					}
					className='bg-background text-xs'
					placeholder={campo.placeholder}
				/>
			</div>
		);
	}

	function RenderSelect(campo: CampoFiltravel) {
		const valores = (campo.valores as CampoSelect[]) || [];
		const temOpcaoTodos = valores.some((item) => {
			const label = item.label.toLowerCase();
			return item.value.toString() === 'all' || label === 'todos' || label === 'todas';
		});

		return (
			<div
				className='flex flex-col w-full md:w-60 text-sm xl:text-base'
				key={campo.tag}>
				<p>{campo.nome}</p>
				<Select
					onValueChange={(value) =>
						setFiltros((prev) => ({ ...prev, [campo.tag]: value }))
					}
					value={filtros[campo.tag]}>
					<SelectTrigger className='w-full text-nowrap bg-background'>
						<SelectValue placeholder={campo.placeholder} />
					</SelectTrigger>
					<SelectContent>
						{!temOpcaoTodos && (
							<SelectItem
								value='all'
								className='text-nowrap'>
								Todos
							</SelectItem>
						)}
						{valores.map((item) => {
							return (
								<SelectItem
									key={item.value}
									value={item.value.toString()}>
									{item.label}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</div>
		);
	}

	function RenderAutocomplete(campo: CampoFiltravel) {
		const [open, setOpen] = useState(false);
		const [value, setValue] = useState(campo.default || '');
		const valores = (campo.valores as CampoSelect[]) || [];
		return (
			<div
				className='flex flex-col text-sm xl:text-base w-full md:w-60'
				key={campo.tag}>
				<p>{campo.nome}</p>
				<Popover
					open={open}
					onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant='outline'
							role='combobox'
							aria-expanded={open}
							className='w-[200px] justify-between'>
							{value
								? valores.find((opcao) => opcao.label === value)?.label
								: campo.placeholder}
							<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-[200px] p-0'>
						<Command>
							<CommandInput placeholder='Buscar opção' />
							<CommandList>
								<CommandEmpty>Opção não encontrada</CommandEmpty>
								<CommandGroup>
									{valores.map((opcao) => (
										<CommandItem
											key={opcao.value}
											value={opcao.value.toString()}
											onSelect={(currentValue) => {
												setValue(currentValue === value ? '' : currentValue);
												setFiltros((prev) => ({ ...prev, [campo.tag]: value }));
												setOpen(false);
											}}>
											<Check
												className={cn(
													'mr-2 h-4 w-4',
													value === opcao.value ? 'opacity-100' : 'opacity-0',
												)}
											/>
											{opcao.label}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
		);
	}

	function RenderDataInputs(campo: CampoFiltravel) {
		const param = searchParams.get(campo.tag);
		const datas = param ? param.split(',') : ['', ''];
		const [from, to] =
			datas[0] !== '' && datas[1] !== ''
				? verificaData(datas[0], datas[1])
				: [undefined, undefined];
		const [dataInicial, setDataInicial] = useState(
			from ? dataParaInput(from) : '',
		);
		const [dataFinal, setDataFinal] = useState(to ? dataParaInput(to) : '');

		function dataParaInput(data: Date) {
			return data.toISOString().split('T')[0];
		}

		function dataParaFiltro(data: string) {
			const [ano, mes, dia] = data.split('-');
			return `${dia}-${mes}-${ano}`;
		}

		function atualizaPeriodo(inicio: string, fim: string) {
			const periodo =
				inicio !== '' && fim !== ''
					? `${dataParaFiltro(inicio)},${dataParaFiltro(fim)}`
					: '';

			setFiltros((prev) => ({ ...prev, [campo.tag]: periodo }));
		}

		useEffect(() => {
			const paramUpdate = searchParams.get(campo.tag);
			const datas =
				paramUpdate && paramUpdate !== '' ? paramUpdate.split(',') : ['', ''];

			if (datas[0] !== '' && datas[1] !== '') {
				const [from, to] = verificaData(datas[0], datas[1]);
				setDataInicial(dataParaInput(from));
				setDataFinal(dataParaInput(to));
				return;
			}

			setDataInicial('');
			setDataFinal('');
		}, [searchParams]);

		return (
			<div
				className='grid gap-2 text-sm xl:text-base w-full md:w-[360px]'
				key={campo.tag}>
				<p>{campo.nome}</p>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
					<Input
						type='date'
						value={dataInicial}
						aria-label='Data inicial'
						onChange={(e) => {
							const value = e.target.value;
							setDataInicial(value);
							atualizaPeriodo(value, dataFinal);
						}}
					/>
					<Input
						type='date'
						value={dataFinal}
						aria-label='Data final'
						onChange={(e) => {
							const value = e.target.value;
							setDataFinal(value);
							atualizaPeriodo(dataInicial, value);
						}}
					/>
				</div>
			</div>
		);
	}

	function RenderDataRange(campo: CampoFiltravel) {
		const param = searchParams.get(campo.tag);
		const datas = param ? param.split(',') : ['', ''];

		const [from, to] = verificaData(datas[0], datas[1]);
		const [date, setDate] = useState<DateRange | undefined>(
			datas[0] !== '' && datas[1] !== '' ? { from, to } : undefined,
		);

		function handleSelecionaData(date: DateRange | undefined) {
			setDate(date);
			const from = date?.from ? format(date.from, 'dd-MM-yyyy') : '';
			const to = date?.to ? format(date.to, 'dd-MM-yyyy') : '';
			const periodo = from !== '' && to !== '' ? `${from},${to}` : '';
			if (periodo === '')
				toast.error('Selecione um período para filtrar por data');
			setFiltros((prev) => ({ ...prev, [campo.tag]: periodo }));
		}

		useEffect(() => {
			const paramUpdate = searchParams.get(campo.tag);
			const datas =
				paramUpdate && paramUpdate !== '' ? paramUpdate.split(',') : ['', ''];
			const [from, to] = verificaData(datas[0], datas[1]);
			setDate(datas[0] !== '' && datas[1] !== '' ? { from, to } : undefined);
		}, [searchParams]);

		return (
			<div
				className={'flex flex-col grid gap-2 text-sm xl:text-base'}
				key={campo.tag}>
				<p>{campo.nome}</p>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							id='date'
							variant={'outline'}
							className={cn(
								'w-full md:w-[300px] justify-start text-left font-normal',
								!date && 'text-muted-foreground',
							)}>
							{date && date.from ? (
								date.to ? (
									<>
										{format(date.from, 'LLL dd, y', {
											locale: ptBR,
										})}{' '}
										-{' '}
										{format(date.to, 'LLL dd, y', {
											locale: ptBR,
										})}
									</>
								) : (
									format(date.from, 'LLL dd, y', {
										locale: ptBR,
									})
								)
							) : (
								<span>Escolha uma data</span>
							)}
							<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className='w-auto p-0'
						align='start'>
						<Calendar
							initialFocus
							mode='range'
							defaultMonth={date && date.from}
							selected={date}
							onSelect={handleSelecionaData}
							numberOfMonths={2}
						/>
					</PopoverContent>
				</Popover>
			</div>
		);
	}

	return (
		<div className='flex flex-wrap items-end gap-4 w-full'>
			{renderFiltros()}
			<div className='isolate flex -space-x-px basis-full w-full xl:basis-auto xl:w-auto shrink-0'>
				<Button
					className='rounded-r-none flex-1 xl:flex-none'
					disabled={isPending}
					onClick={() => startTransition(() => atualizaFiltros())}
					title='Aplicar filtros'>
					<RefreshCw className={isPending ? 'animate-spin' : ''} />
				</Button>
				<Button
					variant={'destructive'}
					disabled={isPending}
					className='rounded-l-none flex-1 xl:flex-none'
					onClick={() => startTransition(() => limpaFiltros())}
					title='Limpar filtros'>
					<X />
				</Button>
			</div>
		</div>
	);
}
