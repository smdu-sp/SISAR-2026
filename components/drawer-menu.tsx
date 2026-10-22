/** @format */

'use client';

import {
	CalendarSearch,
	ChartSpline,
	ChevronRight,
	ChevronsUp,
	House,
	LayoutDashboard,
	Mail,
	LucideProps,
	Newspaper,
	ShieldCheck,
	Users,
	X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import Link from './link';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from './ui/collapsible';
import { ScrollArea } from './ui/scroll-area';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export function DrawerMenu({ recursos }: { recursos: string[] }) {
	interface IMenu {
		icone: ForwardRefExoticComponent<
			Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
		>;
		titulo: string;
		url?: string;
		permissao?: string;
		recurso: string;
		subItens?: ISubMenu[];
	}

	interface ISubMenu {
		titulo: string;
		url: string;
	}

	const menuUsuario: IMenu[] = [
		{
			icone: House,
			titulo: 'Página Inicial',
			recurso: 'painel_inicial',
			url: '/',
		},

		{
			icone: CalendarSearch,
			titulo: 'Agendamentos',
			recurso: 'processos',
			url: '/agendamentos',
		},
		{
			icone: Newspaper,
			titulo: 'Publicações',
			recurso: 'processos',
			url: '/publicacoes',
		},
	];

	const menuAdmin: IMenu[] = [
		{
			icone: Users,
			titulo: 'Usuários',
			recurso: 'usuarios',
			url: '/usuarios',
			permissao: 'usuario_buscar_tudo',
		},
		{ icone: ChartSpline, titulo: 'Relatórios', recurso: 'relatorios', url: '/relatorios' },
		{
			icone: LayoutDashboard,
			titulo: 'Dashboard Admissibilidade',
			recurso: 'dashboard_admissibilidade',
			url: '/dashboard/admissibilidade',
		},
		{ icone: Mail, titulo: 'Envio de relatórios', recurso: 'envio_relatorios', url: '/envio-relatorios' },
		{ icone: ShieldCheck, titulo: 'Permissões', recurso: 'permissoes', url: '/permissoes' },
	];

	// Só mostra o que o perfil do usuário pode acessar (tela de permissões).
	const itensUsuario = menuUsuario.filter((i) => recursos.includes(i.recurso));
	const itensAdmin = menuAdmin.filter((i) => recursos.includes(i.recurso));

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					variant='ghost'
					className='flex sm:hidden fixed bottom-0 w-full bg-sidebar border-t'>
					<ChevronsUp className='scale-150' />
				</Button>
			</DrawerTrigger>
			<DrawerContent className='h-5/6 bg-sidebar border-2'>
				<DrawerHeader>
					<DrawerTitle className='flex w-full justify-end items-center'>
						<DrawerClose asChild>
							<Button
								size='icon'
								variant='ghost'>
								<X />
							</Button>
						</DrawerClose>
					</DrawerTitle>
					<DrawerDescription className='hidden'>
						Menu Inferior
					</DrawerDescription>
				</DrawerHeader>
				<ScrollArea className='h-full pb-32'>
					<div className='mx-auto w-full px-4'>
						<div className='p-4 pb-0'>
							<ul className='flex w-full min-w-0 flex-col gap-1'>
								{itensUsuario.map((item) =>
									item.subItens && item.subItens.length > 0 ? (
										<Collapsible
											asChild
											className='group/collapsible'
											key={item.titulo}>
											<li className='group/menu-item relative w-full'>
												<CollapsibleTrigger
													className='w-full'
													asChild>
													<Button
														variant='ghost'
														className='w-full border-0'>
														<item.icone />
														<span>{item.titulo}</span>
														<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
													</Button>
												</CollapsibleTrigger>
												{item.subItens && item.subItens.length > 0 && (
													<CollapsibleContent>
														<ul className='border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 pr-6 py-0.5 group-data-[collapsible=icon]:hidden w-full'>
															{item.subItens.map((subitem) => (
																<li
																	className='group/menu-sub-item w-full'
																	key={subitem.titulo}>
																	<Link href={subitem.url}>
																		<span className='mr-auto'>
																			{subitem.titulo}
																		</span>
																	</Link>
																</li>
															))}
														</ul>
													</CollapsibleContent>
												)}
											</li>
										</Collapsible>
									) : (
										<li
											className='group/menu-item relative w-full'
											key={item.titulo}>
											<Link
												href={item.url || '/'}
												className='w-full'>
												<item.icone />
												<span className='mr-auto'>{item.titulo}</span>
											</Link>
										</li>
									),
								)}
								{itensAdmin.map((item) =>
									item.subItens && item.subItens.length > 0 ? (
										<Collapsible
											asChild
											className='group/collapsible'
											key={item.titulo}>
											<li className='group/menu-item relative w-full'>
												<CollapsibleTrigger
													className='w-full'
													asChild>
													<Button
														variant='ghost'
														className='w-full border-0'>
														<item.icone />
														<span>{item.titulo}</span>
														<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
													</Button>
												</CollapsibleTrigger>
												{item.subItens && item.subItens.length > 0 && (
													<CollapsibleContent>
														<ul className='border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 pr-6 py-0.5 group-data-[collapsible=icon]:hidden w-full'>
															{item.subItens.map((subitem) => (
																<li
																	className='group/menu-sub-item w-full'
																	key={subitem.titulo}>
																	<Link href={subitem.url}>
																		<span className='mr-auto'>
																			{subitem.titulo}
																		</span>
																	</Link>
																</li>
															))}
														</ul>
													</CollapsibleContent>
												)}
											</li>
										</Collapsible>
									) : (
										<li
											className='group/menu-item relative w-full'
											key={item.titulo}>
											<Link
												href={item.url || '/'}
												className='w-full'>
												<item.icone />
												<span className='mr-auto'>{item.titulo}</span>
											</Link>
										</li>
									),
								)}
							</ul>
						</div>
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
}
