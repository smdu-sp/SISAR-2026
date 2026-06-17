/**
 * @format
 */

interface IGerarRelatorio {
    anoInit: string;
    anoFinal: string;
    access_token?: string;
}

export async function gerarRelatorio({ anoInit, anoFinal, access_token }: IGerarRelatorio) {

    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    const URLFetch = `${baseURL}relatorio/ar/progressao-mensal/${anoInit}/${anoFinal}`

    try {
        const response = await fetch(URLFetch, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao gerar relatório: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            ok: true,
            data,
        };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar relatório',
        };
    }

}