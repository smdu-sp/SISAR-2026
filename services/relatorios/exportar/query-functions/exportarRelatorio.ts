interface ExportarRelatorioParams {
	tipoRelatorio: string;
	formato: 'excel' | 'pdf';
	periodo?: string | null;
	dataInicial?: string | Date | null;
	dataFinal?: string | Date | null;
	anoInicial?: string | Date | null;
	anoFinal?: string | Date | null;
	accessToken?: string;
}

function valorParametro(valor?: string | Date | null) {
	if (!valor) return null;
	return valor instanceof Date ? valor.toISOString() : String(valor);
}

function nomeArquivo(response: Response, tipoRelatorio: string, formato: string) {
	const disposition = response.headers.get('content-disposition');
	const match = disposition?.match(/filename="?([^"]+)"?/i);
	return match?.[1] ?? `${tipoRelatorio}.${formato === 'excel' ? 'xlsx' : 'pdf'}`;
}

export async function exportarRelatorio({
	tipoRelatorio,
	formato,
	periodo,
	dataInicial,
	dataFinal,
	anoInicial,
	anoFinal,
	accessToken,
}: ExportarRelatorioParams) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const params = new URLSearchParams();

	const valores = {
		periodo,
		dataInicial: valorParametro(dataInicial),
		dataFinal: valorParametro(dataFinal),
		anoInicial: valorParametro(anoInicial),
		anoFinal: valorParametro(anoFinal),
	};

	Object.entries(valores).forEach(([key, value]) => {
		if (value) params.set(key, value);
	});

	const response = await fetch(
		`${baseURL}relatorio/exportar/${tipoRelatorio}/${formato}?${params.toString()}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);

	if (!response.ok) {
		throw new Error(`Erro ao exportar relatório: ${response.status}`);
	}

	const blob = await response.blob();
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = nomeArquivo(response, tipoRelatorio, formato);
	document.body.appendChild(link);
	link.click();
	link.remove();
	window.URL.revokeObjectURL(url);
}
