/**
 * @format
 */

interface IGerarRelatorio {
    period?: string;
    access_token?: string;
}

interface ICustomErrorInterface extends Error {
    code?: number;
    details?: string;
}

interface IResponseRelatorio {
    ok: boolean,
    data: any[],
    error?: string | ICustomErrorInterface,
}

export async function gerarRelatorio({ period, access_token }: IGerarRelatorio): Promise<IResponseRelatorio> {

    const twoDates = period?.split(',')
    const lastDate = twoDates ? twoDates[1] : new Date().toDateString()
    const periodList = lastDate?.split(/[-,]/);
    let URLFetch: string;
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    if (period && periodList) {
        const mes = periodList[1].toString()
        const ano = periodList[2].toString()
        URLFetch = `${baseURL}relatorio/ar/quantitativo/${mes}/${ano}`
    } else {
        URLFetch = `${baseURL}relatorio/ar/quantitativo/`
    }

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
            data: [],
            error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar relatório',
        };
    }
}