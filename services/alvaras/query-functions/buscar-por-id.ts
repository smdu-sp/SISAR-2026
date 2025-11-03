import { IRespostaAlvaras, IAlvaras, IAlvarasTipos } from "@/types/alvaras";

export async function buscarPorId(
    id: string,
    access_token: string,
): Promise<IRespostaAlvaras> {
    if (!id || id === '')
        return {
            ok: false,
            error: 'Não foi possível buscar o alvará, ID vazio.',
            data: null,
            status: 400,
        };

    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${baseURL}alvara-tipo/buscar-por-id/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            },
            next: { tags: ['alvara-por-id'] },
        });

        const data = await response.json();

        if (response.status === 200) {
            const alvarasTipos: IAlvarasTipos = {
                nome: data.nome,
                analise1: data.prazo_admissibilidade_smul,
                analise2: data.reconsideracao_smul,
                analiseMult1: data.prazo_admissibilidade_multi,
                analiseMult2: data.reconsideracao_mult,
            };

            return {
                ok: true,
                error: null,
                data: alvarasTipos,
                status: 200,
            };
        }

        return {
            ok: false,
            error: data.message,
            data: null,
            status: data.statusCode,
        };
    } catch (error) {
        return {
            ok: false,
            error: 'Não foi possível buscar o alvará: ' + error,
            data: null,
            status: 400,
        };
    }
}