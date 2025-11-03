/** @format */

import { IPaginadoSubprefeituras, IRespostaSubprefeituras } from "@/types/subprefeituras";

export async function buscarTudo(
    access_token: string,
    pagina: number = 1,
    limite: number = 10,
    busca: string = '',
): Promise<IRespostaSubprefeituras> {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    try {
        const subprefeituras = await fetch(
            `${baseURL}subprefeitura?pagina=${pagina}&limite=${limite}&busca=${busca}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                next: { tags: ['subprefeituras'], revalidate: 120 },
            },
        );
        const data = await subprefeituras.json();
        if (subprefeituras.status === 200)
            return {
                ok: true,
                error: null,
                data: data as IPaginadoSubprefeituras,
                status: 200,
            };
        return {
            ok: false,
            error: data.message,
            data: null,
            status: data.statusCode,
        };
    } catch (error) {
        return {
            ok: false,
            error: 'Não foi possível buscar a lista de subprefeituras:' + error,
            data: null,
            status: 400,
        };
    }
}
