import { IAlvaras, IAlvarasTipos, IRespostaAlvaras } from "@/types/alvaras";

export async function buscarTudo(
    access_token: string,
    pagina: number = 1,
    limite: number = 10,
    busca: string = '',
): Promise<IRespostaAlvaras> {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(
            `${baseURL}alvara-tipo?pagina=${pagina}&limite=${limite}&busca=${busca}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                next: { tags: ['alvaras'], revalidate: 120 },
            },
        );
        const data = await response.json();
        if (response.status === 200) {
            const alvarasTipos: IAlvarasTipos[] = data.items.map((alvara: IAlvaras) => ({
                nome: alvara.nome,
                analise1: alvara.prazo_analise_smul1,
                analise2: alvara.prazo_analise_smul2,
                analiseMult1: alvara.prazo_analise_mult1,
                analiseMult2: alvara.prazo_analise_multi2,
            }));
            return {
                ok: true,
                error: null,
                data: {
                    total: data.total,
                    pagina: data.pagina,
                    limite: data.limite,
                },
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
            error: 'Não foi possível buscar a lista de alvarás: ' + error,
            data: null,
            status: 400,
        };
    }
}
