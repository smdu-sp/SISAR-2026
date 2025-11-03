/**@format */

import { IUnidades, IRespostaUnidades } from "@/types/unidades";

export async function buscarPorId(
    id: string,
    access_token: string,
): Promise<IRespostaUnidades> {
    if (!id || id === '')
        return {
            ok: false,
            error: 'Não foi possível buscar a unidade, ID vazio.',
            data: null,
            status: 400,
        };
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    try {
        const unidades = await fetch(`${baseURL}unidades/buscar-por-id/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            },
            next: { tags: ['unidade-por-id'] },
        });
        const data = await unidades.json();
        if (unidades.status === 200)
            return {
                ok: true,
                error: null,
                data: data as IUnidades,
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
            error: 'Não foi possível buscar a unidade:' + error,
            data: null,
            status: 400,
        };
    }
}
