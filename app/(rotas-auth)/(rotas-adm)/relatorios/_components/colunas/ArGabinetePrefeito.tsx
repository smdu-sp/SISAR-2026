"use client"

import { gerarRelatorio } from "@/services/relatorios/ar-gabinete-prefeito/query-functions/getRelatorio"
import type {
    IRelatorioGabinetePrefeito,
    IRelatorioGabinetePrefeitoAno,
    IProcessoGabinetePrefeito,
} from "@/types/relatorios"
import { useState, useEffect } from "react"

interface ITabelaArGabinetePrefeitoProps {
    sectionTitle?: string
    access_token?: string | undefined
}

export function TabelaArGabinetePrefeito({ sectionTitle, access_token }: ITabelaArGabinetePrefeitoProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [dadosBrutosApi, setDadosBrutosApi] = useState<IRelatorioGabinetePrefeito | null>(null)
    const [error, setError] = useState<string | null>(null)

    const mesesOrdem = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."]
    const mesesNomes: Record<string, string> = {
        "jan.": "JANEIRO",
        "fev.": "FEVEREIRO",
        "mar.": "MARÇO",
        "abr.": "ABRIL",
        "mai.": "MAIO",
        "jun.": "JUNHO",
        "jul.": "JULHO",
        "ago.": "AGOSTO",
        "set.": "SETEMBRO",
        "out.": "OUTUBRO",
        "nov.": "NOVEMBRO",
        "dez.": "DEZEMBRO",
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await gerarRelatorio({ access_token })

                if (!response.ok) {
                    setError(response.error || "Erro ao carregar dados")
                    setDadosBrutosApi(null)
                } else {
                    setError(null)
                    const dadosRecebidos = response.data
                    setDadosBrutosApi(dadosRecebidos)
                }
            } catch (err) {
                setError("Erro inesperado ao carregar dados")
                setDadosBrutosApi(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [access_token])

    if (error) {
        return <h2 className="text-red-500 text-center p-4">{error}</h2>
    }

    if (isLoading) {
        return <div className="flex items-center justify-center p-8">Carregando...</div>
    }

    return (
        <div className="w-full space-y-8">
            {sectionTitle && <h3 className="text-xl font-semibold mb-4">{sectionTitle}</h3>}

            {dadosBrutosApi &&
                dadosBrutosApi.map((anoData: IRelatorioGabinetePrefeitoAno) => (
                    <div key={anoData.ano} className="space-y-2">
                        {/* Título do Ano */}
                        <div className="bg-primary text-white p-3 rounded-t font-bold text-center">
                            <h4 className="text-lg">APROVA RÁPIDO - RELAÇÃO DE PROCESSOS PROTOCOLADOS | PROCESSOS DEFERIDOS</h4>
                            <p className="text-sm">MÊS/{anoData.ano}</p>
                        </div>

                        {/* Tabela */}
                        <div className="overflow-x-auto border rounded-b">
                            <table className="w-full border-collapse bg-background">
                                <thead>
                                    <tr className="bg-primary text-white">
                                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[100px]">
                                            MÊS/{anoData.ano}
                                        </th>
                                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[120px]">
                                            PROCESSOS PROTOCOLADOS APROVA RÁPIDO
                                        </th>
                                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[80px]">
                                            PROCESSOS APROVADOS
                                        </th>
                                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[120px]">
                                            Nº PROCESSO
                                        </th>
                                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[100px]">
                                            TEMPO DE ANÁLISE PEDIDO INICIAL (dias)
                                        </th>
                                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[100px]">
                                            TEMPO DE ANÁLISE RECURSO (dias)
                                        </th>
                                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[150px]">
                                            CATEGORIA DE USO
                                        </th>
                                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[150px]">
                                            RESPONSÁVEL PELO PROJETO
                                        </th>
                                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[150px]">
                                            EMPRESA
                                        </th>
                                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[200px]">
                                            CARACTERÍSTICAS PROJETO
                                        </th>
                                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-center min-w-[100px]">
                                            REGIÃO DA CIDADE
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mesesOrdem.map((mes) => {
                                        const processosMes = anoData[
                                            mes as keyof IRelatorioGabinetePrefeitoAno
                                        ] as IProcessoGabinetePrefeito[]

                                        // Se não há processos no mês, não renderiza nada
                                        if (!processosMes || processosMes.length === 0) {
                                            return null
                                        }

                                        const totalProtocolados = processosMes.length
                                        const totalAprovados = processosMes.filter((p) => p.status === 3).length

                                        return processosMes.map((processo, index) => (
                                            <tr key={`${anoData.ano}-${mes}-${processo.id}`} className="hover:bg-muted/50">
                                                {/* Mês - apenas na primeira linha */}
                                                {index === 0 && (
                                                    <td
                                                        rowSpan={processosMes.length}
                                                        className="border border-gray-300 px-2 py-2 text-xs text-center font-semibold bg-muted/30 align-top"
                                                    >
                                                        {mesesNomes[mes]}
                                                    </td>
                                                )}

                                                {/* Processos Protocolados - apenas na primeira linha */}
                                                {index === 0 && (
                                                    <td
                                                        rowSpan={processosMes.length}
                                                        className="border border-gray-300 px-2 py-2 text-xs text-center font-semibold align-top"
                                                    >
                                                        {totalProtocolados}
                                                    </td>
                                                )}

                                                {/* Processos Aprovados - apenas na primeira linha */}
                                                {index === 0 && (
                                                    <td
                                                        rowSpan={processosMes.length}
                                                        className="border border-gray-300 px-2 py-2 text-xs text-center font-semibold align-top"
                                                    >
                                                        {totalAprovados}
                                                    </td>
                                                )}

                                                {/* Dados do processo */}
                                                <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                                                    {processo.numero_do_processo || processo.sei || processo.aprova_digital || "-"}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                                                    {processo.tempo_de_analise_pedido_inicial || "-"}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                                                    {processo.tempo_de_analise_recurso || "-"}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-2 text-xs">{processo.requerimento || "-"}</td>
                                                <td className="border border-gray-300 px-2 py-2 text-xs">
                                                    {processo.responsavel_tecnico_id || "-"}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-2 text-xs">{processo.proprietario_id || "-"}</td>
                                                <td className="border border-gray-300 px-2 py-2 text-xs">
                                                    {processo.resumo_projeto || processo.obs || "-"}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-2 text-xs text-center">{processo.zona || "-"}</td>
                                            </tr>
                                        ))
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Resumo do Ano */}
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                            <p className="font-semibold">
                                Total do Ano {anoData.ano}: {anoData.processos_protocolados} processos protocolados |{" "}
                                {anoData.processos_aprovados} processos aprovados
                            </p>
                        </div>
                    </div>
                ))}
        </div>
    )
}
