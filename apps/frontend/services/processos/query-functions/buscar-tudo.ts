/** @format */

import { IPaginadoProcessos, IRespostaProcessos } from "@/types/processos";

export async function buscarTudo(
  access_token: string,
  pagina: number = 1,
  limite: number = 10,
  busca: string = "",
  status: string = "-1",
): Promise<IRespostaProcessos> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const buscaLimpa = busca.replace(/[-./]/g, "");

  try {
    const response = await fetch(
      `${baseURL}inicial/buscar-tudo?pagina=${pagina}&limite=${limite}&busca=${encodeURIComponent(buscaLimpa)}&status=${status}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        next: { tags: ["processos"], revalidate: 120 },
      },
    );
    console.log("[processos.buscarTudo] status:", response.status);
    const data = await response.json();
    console.log("[processos.buscarTudo] keys:", Object.keys(data || {}));
    console.log(
      "[processos.buscarTudo] data length:",
      Array.isArray(data?.data) ? data.data.length : "n/a",
    );

    if (response.status === 200) {
      return {
        ok: true,
        error: null,
        data: data as IPaginadoProcessos,
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
      error: "Não foi possível buscar a lista de processos: " + error,
      data: null,
      status: 400,
    };
  }
}
