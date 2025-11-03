/**
 * @format
 */

interface IGerarRelatorio {
    dataInicial: null | string | Date;
    dataFinal: null | string | Date;
    access_token?: string;
}

export async function gerarRelatorio({ dataInicial, dataFinal, access_token }: IGerarRelatorio) {

    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    let URLFetch = `${baseURL}relatorio/rr/prazo-analise-admissibilidade/${dataInicial}/${dataFinal}`;
    try {
        const response = await fetch(URLFetch, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(" Erro na resposta da API:", response.status, errorText);
            throw new Error(`Erro ao gerar relatório: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return {
            ok: true,
            data,
        };
    } catch (error) {
        console.error(" Erro na função gerarRelatorio:", error);
        return {
            ok: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar relatório',
        };
    }
}