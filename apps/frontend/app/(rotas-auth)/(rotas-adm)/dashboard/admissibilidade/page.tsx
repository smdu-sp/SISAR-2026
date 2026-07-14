/** @format */

import DashboardAdmissibilidade from './_components/dashboard-admissibilidade';
import { PageHeader } from '@/components/page-header';
import { pageContainer } from '@/lib/utils';

export default function DashboardAdmissibilidadePage() {
	return (
		<div className={pageContainer}>
			<PageHeader
				title='Dashboard Admissibilidade'
				subtitle='Indicadores de prazos e registros de admissibilidade'
			/>
			<DashboardAdmissibilidade />
		</div>
	);
}
