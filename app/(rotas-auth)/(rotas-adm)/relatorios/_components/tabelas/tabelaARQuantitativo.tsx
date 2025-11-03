"use client"

import MiniTabelaARQuantitativo from "./miniTabelaARQuantitativo"
import { useState, useEffect } from "react"
import { gerarRelatorio } from "@/services/relatorios/ar-resumo-quantitativo/query-functions/gerarRelatorio"
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { buscarTudo } from "@/services/unidades"
import type { IUnidades } from "@/types/unidades"



interface IInicial {
    alterado_em: string | Date
    criado_em: string | Date
    alvara_tipo_id: string
    aprova_digital: string | null
    associado_reforma: boolean
    data_limiteMulti: string | Date | null
    data_limiteSmul: string | Date | null
    data_protocolo: string | Date
    decreto: boolean
    envio_admissibilidade: string | Date
    id: number
    obs: string | null
    pagamento: number
    processo_fisico: string | null
    requalifica_rapido: boolean
    requerimento: string
    sei: string | null
    status: number
    tipo_processo: number
    tipo_requerimento: number
}

interface IAdmissibilidadesDados {
    alterado_em: string | Date
    criado_em: string | Date
    categoria_id: string
    data_decisao_interlocutoria: string | Date
    data_envio: string | Date
    inicial_id: number
    motivo: string | null
    parecer_admissibilidade_id: string
    reconsiderado: boolean
    status: number
    subprefeitura_id: string
    unidade_id: string
    inicial: IInicial
}

interface IUnidadeData {
    sigla: string
    quantidade: number
}

interface ISmulGrapoemResumo {
    quantidade: number
    data: IUnidadeData[]
}

interface IDeferidoOrIndeferidoOrAnalise {
    graproem: ISmulGrapoemResumo
    smul: ISmulGrapoemResumo
}

interface IDataRRQuantitativo {
    total: number
    admissiveis_dados: IAdmissibilidadesDados[]
    analise: number
    data_gerado: string | Date
    deferidos: IDeferidoOrIndeferidoOrAnalise
    em_analise: IDeferidoOrIndeferidoOrAnalise
    em_analise_dados: IAdmissibilidadesDados[]
    inadmissiveis: number
    inadmissiveis_dados: IAdmissibilidadesDados[]
    indeferidos: IDeferidoOrIndeferidoOrAnalise
}

interface ITabelaResumoQuantitativo {
    sectionTitle: string
    period: string
    access_token: string
}

interface IResumoTableRow {
    unidade: string
    total: number
}


export function TabelaARQuantitativo({ sectionTitle, period, access_token }: ITabelaResumoQuantitativo) {
    const [lista, setLista] = useState<IDataRRQuantitativo>()
    const [unidades, setUnidades] = useState<IUnidades[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRelatorio = async () => {
            if (period && access_token) {
                setIsLoading(true)
                setError(null)
                try {
                    const resultado = await gerarRelatorio({ period, access_token })
                    if (resultado.ok && resultado.data) {
                        setLista(resultado.data as unknown as IDataRRQuantitativo)
                        // console.log("lista de estados aqui", lista)
                    } else {
                        setError(resultado.error ? String(resultado.error) : "Erro desconhecido ao buscar relatório.")
                    }
                } catch (err) {
                    setError("Erro ao buscar relatório.")
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchRelatorio()
    }, [period, access_token])

    // console.log("lista completa ---", lista, "-----")
    useEffect(() => {
        const fetchUnidades = async () => {
            if (access_token) {
                try {
                    const response = await buscarTudo(access_token, 1, 1000)
                    if (response.ok && response.data) {
                        const paginado = response.data as any
                        if (paginado.data) {
                            setUnidades(paginado.data)
                        }
                    }
                } catch (err) {
                    console.error("Erro ao buscar unidades:", err)
                }
            }
        }
        fetchUnidades()
    }, [access_token])


    const transformarDadosParaTabela = (dadosSecao: IDeferidoOrIndeferidoOrAnalise): { smul: IResumoTableRow[], graproem: IResumoTableRow[] } => {
        const smulData: IResumoTableRow[] = unidades.map((unidade) => {
            const unidadeEncontrada = dadosSecao.smul.data.find(item => item.sigla === unidade.sigla)
            return {
                unidade: unidade.sigla,
                total: unidadeEncontrada ? unidadeEncontrada.quantidade : 0,
            }
        })

        const grapoemData: IResumoTableRow[] = unidades.map((unidade) => {
            const unidadeEncontrada = dadosSecao.graproem.data.find(item => item.sigla === unidade.sigla)
            return {
                unidade: unidade.sigla,
                total: unidadeEncontrada ? unidadeEncontrada.quantidade : 0,
            }
        })

        return {
            smul: smulData,
            graproem: grapoemData
        }
    }

    // Transformar dados para cada seção
    const dadosEmAnalise = lista?.em_analise ? transformarDadosParaTabela(lista.em_analise) : { smul: [], graproem: [] }
    const dadosAdmissiveis = lista?.deferidos ? transformarDadosParaTabela(lista.deferidos) : { smul: [], graproem: [] }
    const dadosInadmissiveis = lista?.indeferidos ? transformarDadosParaTabela(lista.indeferidos) : { smul: [], graproem: [] }

    return (
        <div className="w-[90%] mx-auto px-2 sm:px-4">
            <div className="space-y-0">
                <h3 className="text-lg font-semibold mb-6 text-center">{sectionTitle}</h3>

                <div className="mb-0">
                    <Table
                        className="w-full min-w-0 bg-background dark:bg-muted/50 border border-gray-300 shadow-sm"
                        roundednone="true"
                    >
                        <TableBody>
                            <TableRow className="hover:bg-muted/30">
                                <TableCell className="py-3 px-3 sm:px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-50 dark:bg-muted/30 min-w-[140px] sm:min-w-[200px]">
                                    Total de processos
                                </TableCell>
                                <TableCell className="py-3 px-3 sm:px-6 font-bold text-neutral-800 dark:text-neutral-200 text-right border-gray-300 text-sm w-full">
                                    {lista?.total || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-muted/30">
                                <TableCell className="py-3 px-3 sm:px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-50 dark:bg-muted/30 min-w-[140px] sm:min-w-[200px]">
                                    Análise de admissibilidade
                                </TableCell>
                                <TableCell className="py-3 px-3 sm:px-6 font-bold text-neutral-800 dark:text-neutral-200 text-right border-gray-300 text-sm w-full">
                                    {lista?.analise || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-muted/30">
                                <TableCell className="py-3 px-3 sm:px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-50 dark:bg-muted/30 min-w-[140px] sm:min-w-[200px]">
                                    Inadmissíveis
                                </TableCell>
                                <TableCell className="py-3 px-3 sm:px-6 font-bold text-neutral-800 dark:text-neutral-200 text-right border-gray-300 text-sm w-full">
                                    {lista?.inadmissiveis || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-muted/30">
                                <TableCell className="py-3 px-3 sm:px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-50 dark:bg-muted/30 min-w-[140px] sm:min-w-[200px]">
                                    Admissíveis
                                </TableCell>
                                <TableCell className="py-3 px-3 sm:px-6 font-bold text-neutral-800 dark:text-neutral-200 text-right border-gray-300 text-sm w-full">
                                    {lista?.admissiveis_dados?.length || 0}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div className="border border-gray-300 border-t-0">
                    <div className="bg-primary">
                        <h3 className="text-white py-3 px-3 sm:px-6 text-sm font-semibold tracking-wide">EM ANÁLISE</h3>
                    </div>
                    <MiniTabelaARQuantitativo data={dadosEmAnalise} roundednone={true} />
                </div>

                <div className="border border-gray-300 border-t-0">
                    <div className="bg-primary">
                        <h3 className="text-white py-3 px-3 sm:px-6 text-sm font-semibold tracking-wide">DEFERIDOS</h3>
                    </div>
                    <MiniTabelaARQuantitativo data={dadosAdmissiveis} roundednone={true} />
                </div>

                <div className="border border-gray-300 border-t-0">
                    <div className="bg-primary">
                        <h3 className="text-white py-3 px-3 sm:px-6 text-sm font-semibold tracking-wide">INDEFERIDOS</h3>
                    </div>
                    <MiniTabelaARQuantitativo data={dadosInadmissiveis} roundednone={true} />
                </div>

                <div className="border border-gray-300 border-t-0 shadow-sm">
                    <Table className="w-full min-w-0 bg-background dark:bg-muted/50" roundednone="true">
                        <TableBody>
                            <TableRow className="hover:bg-muted/30">
                                <TableCell
                                    colSpan={3}
                                    className="py-4 px-3 sm:px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 bg-gray-50 dark:bg-muted/30 text-sm"
                                >
                                    Via ordinária a pedido do interessado
                                </TableCell>
                                <TableCell
                                    className="py-4 px-3 sm:px-6 font-bold text-neutral-800 dark:text-neutral-200 text-center border-gray-300 text-sm bg-gray-50 dark:bg-muted/30"
                                    colSpan={2}
                                >
                                    0
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
