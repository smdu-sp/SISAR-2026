/** @format */

'use client';

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	IRegistroAdmissibilidade,
	admissibilidadeFinalizada,
	contarDentroPrazo,
	contarForaPrazo,
	medianaAdmissibilidade,
	registrosAdmissibilidade,
} from '@/services/admissibilidade';
import { format } from 'date-fns';
import {
	CheckCircle2,
	Clock,
	Hourglass,
	Loader2,
	TrendingUp,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from 'recharts';

const CORES_PIZZA = ['hsl(var(--primary))', 'hsl(var(--destructive))'];

function CardMetrica({
	titulo,
	valor,
	icone: Icone,
	cor,
}: {
	titulo: string;
	valor: React.ReactNode;
	icone: React.ElementType;
	cor: string;
}) {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<CardTitle className='text-sm font-medium text-muted-foreground'>
					{titulo}
				</CardTitle>
				<div
					className='rounded-full p-2'
					style={{ backgroundColor: `${cor}22` }}>
					<Icone
						className='size-5'
						style={{ color: cor }}
					/>
				</div>
			</CardHeader>
			<CardContent>
				<div className='text-3xl font-bold'>{valor}</div>
			</CardContent>
		</Card>
	);
}

export default function DashboardAdmissibilidade() {
	const { data: session } = useSession();
	const token = session?.access_token;

	const [carregando, setCarregando] = useState(true);
	const [foraPrazo, setForaPrazo] = useState<number | null>(null);
	const [dentroPrazo, setDentroPrazo] = useState<number | null>(null);
	const [finalizadas, setFinalizadas] = useState<number | null>(null);
	const [mediana, setMediana] = useState<number | null>(null);
	const [registros, setRegistros] = useState<IRegistroAdmissibilidade[]>([]);
	const [pagina, setPagina] = useState(1);
	const porPagina = 5;

	useEffect(() => {
		if (!token) return;
		setCarregando(true);
		Promise.all([
			contarForaPrazo(token),
			contarDentroPrazo(token),
			admissibilidadeFinalizada(token),
			medianaAdmissibilidade(token),
			registrosAdmissibilidade(token),
		]).then(([fora, dentro, fin, med, regs]) => {
			setForaPrazo(fora);
			setDentroPrazo(dentro);
			setFinalizadas(fin);
			setMediana(med);
			setRegistros(regs ?? []);
			setCarregando(false);
		});
	}, [token]);

	const total = (dentroPrazo ?? 0) + (foraPrazo ?? 0);
	const dadosPizza =
		total > 0
			? [
					{ name: 'Dentro do Prazo', value: dentroPrazo ?? 0 },
					{ name: 'Fora do Prazo', value: foraPrazo ?? 0 },
				]
			: [];

	const inicio = (pagina - 1) * porPagina;
	const registrosPagina = registros.slice(inicio, inicio + porPagina);
	const totalPaginas = Math.ceil(registros.length / porPagina) || 1;

	if (carregando) {
		return (
			<div className='flex justify-center py-20'>
				<Loader2 className='size-8 animate-spin text-primary' />
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<CardMetrica
					titulo='Admissibilidade Finalizada'
					valor={finalizadas ?? '—'}
					icone={CheckCircle2}
					cor='#22c55e'
				/>
				<CardMetrica
					titulo='Dentro do prazo'
					valor={dentroPrazo ?? '—'}
					icone={Hourglass}
					cor='#0a3299'
				/>
				<CardMetrica
					titulo='Fora do prazo'
					valor={foraPrazo ?? '—'}
					icone={Clock}
					cor='#f94668'
				/>
				<CardMetrica
					titulo='Mediana tempo de análise'
					valor={mediana ?? '—'}
					icone={TrendingUp}
					cor='#8800e0'
				/>
			</div>

			<div className='grid gap-6 lg:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>Admissibilidade</CardTitle>
					</CardHeader>
					<CardContent>
						{dadosPizza.length > 0 ? (
							<ResponsiveContainer
								width='100%'
								height={280}>
								<PieChart>
									<Pie
										data={dadosPizza}
										dataKey='value'
										nameKey='name'
										cx='50%'
										cy='50%'
										innerRadius={60}
										outerRadius={100}
										label={({ name, percent }) =>
											`${name}: ${(percent * 100).toFixed(0)}%`
										}>
										{dadosPizza.map((_, i) => (
											<Cell
												key={i}
												fill={CORES_PIZZA[i % CORES_PIZZA.length]}
											/>
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						) : (
							<p className='text-muted-foreground text-center py-12'>
								Sem dados para exibir
							</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Registros de admissibilidade</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='overflow-x-auto'>
							<Table roundednone='false'>
								<TableHeader>
									<TableRow>
										<TableHead>Processo</TableHead>
										<TableHead>Início</TableHead>
										<TableHead>Final</TableHead>
										<TableHead>Dias</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{registrosPagina.length > 0 ? (
										registrosPagina.map((row) => (
											<TableRow key={row.sei}>
												<TableCell>{row.sei}</TableCell>
												<TableCell>
													{format(
														new Date(row.envioAdmissibilidade),
														'dd/MM/yyyy',
													)}
												</TableCell>
												<TableCell>
													{format(
														new Date(row.dataDecisaoInterlocutoria),
														'dd/MM/yyyy',
													)}
												</TableCell>
												<TableCell>{row.dias}</TableCell>
												<TableCell>{row.status}</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={5}
												className='text-center text-muted-foreground'>
												Nenhum registro encontrado
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
						{totalPaginas > 1 && (
							<div className='flex justify-center gap-2 mt-4'>
								<button
									type='button'
									disabled={pagina <= 1}
									onClick={() => setPagina((p) => p - 1)}
									className='text-sm text-primary disabled:opacity-40'>
									Anterior
								</button>
								<span className='text-sm text-muted-foreground'>
									{pagina} / {totalPaginas}
								</span>
								<button
									type='button'
									disabled={pagina >= totalPaginas}
									onClick={() => setPagina((p) => p + 1)}
									className='text-sm text-primary disabled:opacity-40'>
									Próxima
								</button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
