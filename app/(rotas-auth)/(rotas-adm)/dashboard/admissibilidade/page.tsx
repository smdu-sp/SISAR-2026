/** @format */

import DashboardAdmissibilidade from './_components/dashboard-admissibilidade';

export default function DashboardAdmissibilidadePage() {
	return (
		<div className='w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto'>
			<h1 className='text-xl md:text-4xl font-bold mb-6'>
				Dashboard — Admissibilidade
			</h1>
			<DashboardAdmissibilidade />
		</div>
	);
}
