/** @format */

import AgendaCalendario from './_components/agenda-calendario';

export default function AgendaPage() {
	return (
		<div className='w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto'>
			<h1 className='text-xl md:text-4xl font-bold mb-6'>Agenda</h1>
			<p className='text-muted-foreground mb-6'>
				Calendário de reuniões, processos e lembretes
			</p>
			<AgendaCalendario />
		</div>
	);
}
