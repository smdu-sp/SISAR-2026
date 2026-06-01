/** @format */

import { redirect } from 'next/navigation';

/** Fila unificada em Processos (filtro por status Em Análise). */
export default function AnalisePage() {
	redirect('/processos?status=2');
}
