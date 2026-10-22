/** @format */

import { chamarApi } from '@/lib/api-fetch';
import { IMatrizPermissoes } from '@/types/permissoes';

export function buscarMatriz(token?: string) {
	return chamarApi<IMatrizPermissoes>('permissoes', token);
}
