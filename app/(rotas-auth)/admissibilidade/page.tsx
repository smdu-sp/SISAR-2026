/** @format */

import { redirect } from 'next/navigation';

/** Fila unificada em Processos (filtro por status Admissibilidade). */
export default function AdmissibilidadePage() {
	redirect('/processos?status=0');
}
