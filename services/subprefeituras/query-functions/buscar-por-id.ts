/**@format */

import { ISubprefeitura, IRespostaSubprefeituras } from "@/types/subprefeituras";

export async function buscarPorId(
    id: string,
    access_token: string,
): Promise<IRespostaSubprefeituras> {
    if (!id || id === '')
        return {
            ok: false,
            error: 'Não foi possível buscar a subprefeitura, ID vazio.',
            data: null,
            status: 400,
        };
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${baseURL}subprefeitura/buscar-por-id/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            },
            next: { tags: ['subprefeitura-por-id'] },
        });
        const data = await response.json();
        if (response.status === 200)
            return {
                ok: true,
                error: null,
                data: data as ISubprefeitura,
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
            error: 'Não foi possível buscar a subprefeitura: ' + error,
            data: null,
            status: 400,
        };
    }
}
