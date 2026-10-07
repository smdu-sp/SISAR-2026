/** @format */

import AgendaCalendario from './_components/agenda-calendario';
import { PageHeader } from '@/components/page-header';
import { pageContainer } from '@/lib/utils';

export default function AgendaPage() {
	return (
		<div className={pageContainer}>
			<PageHeader subtitle='Calendário de reuniões, processos e lembretes' />
			<AgendaCalendario />
		</div>
	);
}
