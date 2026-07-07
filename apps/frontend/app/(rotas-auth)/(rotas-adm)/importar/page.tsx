/** @format */

import React from 'react';
import { FormImportacao } from './_components/formImportacao';
import { PageHeader } from '@/components/page-header';
import { pageContainer } from '@/lib/utils';

export default function ImportarPage() {
	return (
		<div className={pageContainer}>
			<PageHeader
				title='Importar'
				subtitle='Importe processos em massa a partir de uma planilha .xlsx'
			/>
			<FormImportacao />
		</div>
	)
}
