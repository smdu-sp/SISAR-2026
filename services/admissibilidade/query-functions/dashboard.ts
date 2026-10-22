/** @format */

export interface IRegistroAdmissibilidade {
	dataDecisaoInterlocutoria: string;
	sei: string;
	envioAdmissibilidade: string;
	dias: number;
	status: string;
}

async function fetchDashboard<T>(
	path: string,
	access_token: string,
): Promise<T | null> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${baseURL}admissibilidade/${path}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			cache: 'no-store',
		});
		if (!response.ok) return null;
		return (await response.json()) as T;
	} catch {
		return null;
	}
}

export function contarForaPrazo(access_token: string) {
	return fetchDashboard<number>('contar-fora-prazo', access_token);
}

export function contarDentroPrazo(access_token: string) {
	return fetchDashboard<number>('contar-dentro-prazo', access_token);
}

export function admissibilidadeFinalizada(access_token: string) {
	return fetchDashboard<number>('admissibilidade-finalizada', access_token);
}

export function medianaAdmissibilidade(access_token: string) {
	return fetchDashboard<number>('mediana-admissibilidade', access_token);
}

export function registrosAdmissibilidade(access_token: string) {
	return fetchDashboard<IRegistroAdmissibilidade[]>(
		'registros-admissibilidade',
		access_token,
	);
}
