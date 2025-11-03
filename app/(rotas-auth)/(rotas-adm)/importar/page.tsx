/** @format */

import React from 'react';
import { FormImportacao } from './_components/formImportacao';

export default function ImportarPage() {
	return (
		<div className='  px-0 md:px-8 relative pb-20 md:pb-14 h-full container mx-auto '>
			<h2 className='text-xl md:text-4xl font-bold'>Importar</h2>
			<FormImportacao />
		</div>
	)
}
