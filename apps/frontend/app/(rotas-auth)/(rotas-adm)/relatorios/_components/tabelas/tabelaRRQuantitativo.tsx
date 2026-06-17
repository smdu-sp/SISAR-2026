"use client"

import CustomDataTable from "../colunas/RRStatusResumoColumn"
import { useState, useEffect } from "react"
import gerarRelatorio from "@/services/relatorios/rr-resumo-quantitativo/query-functions/gerarRelatorio"
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { buscarTudo } from "@/services/unidades"
import type { IUnidades } from "@/types/unidades"

// ... existing interfaces ...

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

interface IDataResumo {
    CAEPP: number
    COMIN: number
    PARHIS: number
    RESID: number
    SERVIN: number
}

interface ISmulGrapoemResumo {
    quantidade: 2
    data: IDataResumo
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
    orgao: string
    nao_incide: number
    area_envoltoria: number
    bem_tombado: number
    total: number
}

export function TabelaRRQuantitativo({ sectionTitle, period, access_token }: ITabelaResumoQuantitativo) {
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

    // ... existing transformation function ...
    const transformarDadosParaTabela = (dados: IAdmissibilidadesDados[]): IResumoTableRow[] => {
        const resultado: IResumoTableRow[] = unidades.map((unidade) => ({
            orgao: unidade.sigla,
            nao_incide: 0,
            area_envoltoria: 0,
            bem_tombado: 0,
            total: 0,
        }))

        if (dados && dados.length > 0) {
            dados.forEach((item) => {
                const unidadeEncontrada = unidades.find((u) => u.codigo === item.unidade_id)
                if (unidadeEncontrada) {
                    const index = resultado.findIndex((r) => r.orgao === unidadeEncontrada.sigla)
                    if (index !== -1) {
                        resultado[index].total += 1
                    }
                }
            })
        }

        return resultado
    }

    const dadosEmAnalise = transformarDadosParaTabela(lista?.em_analise_dados || [])
    const dadosAdmissiveis = transformarDadosParaTabela(lista?.admissiveis_dados || [])
    const dadosInadmissiveis = transformarDadosParaTabela(lista?.inadmissiveis_dados || [])

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <div className=" w-[90%] space-y-0">
                <h3 className="text-lg font-semibold mb-6 text-center">{sectionTitle}</h3>

                <div className=" w-full mb-0">
                    <Table className="w-full bg-background dark:bg-muted/50 border border-gray-300 shadow-sm" roundednone="true">
                        <TableBody>
                            <TableRow className="hover:bg-muted/30">
                                <TableCell className="py-3 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-50 dark:bg-muted/30">
                                    Total de processos
                                </TableCell>
                                <TableCell className="py-3 px-6 font-bold text-neutral-800 dark:text-neutral-200 text-center border-gray-300 text-sm min-w-[120px]">
                                    {lista?.total || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-muted/30">
                                <TableCell className="py-3 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-50 dark:bg-muted/30">
                                    Análise de admissibilidade
                                </TableCell>
                                <TableCell className="py-3 px-6 font-bold text-neutral-800 dark:text-neutral-200 text-center border-gray-300 text-sm min-w-[120px]">
                                    {lista?.analise || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-muted/30">
                                <TableCell className="py-3 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-50 dark:bg-muted/30">
                                    Inadmissíveis
                                </TableCell>
                                <TableCell className="py-3 px-6 font-bold text-neutral-800 dark:text-neutral-200 text-center border-gray-300 text-sm min-w-[120px]">
                                    {lista?.inadmissiveis || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-muted/30">
                                <TableCell className="py-3 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-50 dark:bg-muted/30">
                                    Admissíveis
                                </TableCell>
                                <TableCell className="py-3 px-6 font-bold text-neutral-800 dark:text-neutral-200 text-center border-gray-300 text-sm min-w-[120px]">
                                    {lista?.admissiveis_dados?.length || 0}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div className="border border-gray-300 border-t-0">
                    <div className="bg-primary">
                        <h3 className="text-white py-3 px-6 text-sm font-semibold tracking-wide">EM ANÁLISE</h3>
                    </div>
                    <CustomDataTable data={dadosEmAnalise} roundednone={true} />
                </div>

                <div className="border border-gray-300 border-t-0">
                    <div className="bg-primary">
                        <h3 className="text-white py-3 px-6 text-sm font-semibold tracking-wide">DEFERIDOS</h3>
                    </div>
                    <CustomDataTable data={dadosAdmissiveis} roundednone={true} />
                </div>

                <div className="border border-gray-300 border-t-0">
                    <div className="bg-primary">
                        <h3 className="text-white py-3 px-6 text-sm font-semibold tracking-wide">INDEFERIDOS</h3>
                    </div>
                    <CustomDataTable data={dadosInadmissiveis} roundednone={true} />
                </div>

                <div className="border border-gray-300 border-t-0 shadow-sm">
                    <Table className="w-full bg-background dark:bg-muted/50" roundednone="true">
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    rowSpan={3}
                                    className="py-4 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left align-top border-r border-gray-300 bg-gray-50 dark:bg-muted/30 min-w-[280px]"
                                >
                                    <div className="text-sm leading-relaxed">
                                        <span className="block font-bold">4. VIA ORDINÁRIA A PEDIDO DO INTERESSADO</span>
                                        <span className="block text-xs font-normal text-muted-foreground mt-1">
                                            (ADMISSÍVEL, EXCLUÍDO DO PROCEDIMENTO)
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell
                                    colSpan={3}
                                    className="py-3 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-center border-r border-b border-gray-300 text-sm bg-primary/10"
                                >
                                    LEGISLAÇÃO DE PATRIMÔNIO CULTURAL
                                </TableCell>
                                <TableCell className="py-3 px-6 border-b border-gray-300 bg-gray-50 dark:bg-muted/30 min-w-[80px]" />
                            </TableRow>

                            <TableRow>
                                <TableCell className="py-3 px-4 font-semibold text-neutral-800 dark:text-neutral-200 text-center border-r border-b border-gray-300 text-sm bg-primary/5">
                                    NÃO INCIDE
                                </TableCell>
                                <TableCell className="py-3 px-4 font-semibold text-neutral-800 dark:text-neutral-200 text-center border-r border-b border-gray-300 text-sm bg-primary/5">
                                    ÁREA ENVOLTÓRIA
                                </TableCell>
                                <TableCell className="py-3 px-4 font-semibold text-neutral-800 dark:text-neutral-200 text-center border-r border-b border-gray-300 text-sm bg-primary/5">
                                    BEM TOMBADO
                                </TableCell>
                                <TableCell className="py-3 px-6 border-b border-gray-300 bg-gray-50 dark:bg-muted/30" />
                            </TableRow>

                            <TableRow className="hover:bg-muted/30">
                                <TableCell className="py-3 px-4 text-neutral-800 dark:text-neutral-200 text-center border-r border-gray-300 text-sm font-medium">
                                    0
                                </TableCell>
                                <TableCell className="py-3 px-4 text-neutral-800 dark:text-neutral-200 text-center border-r border-gray-300 text-sm font-medium">
                                    0
                                </TableCell>
                                <TableCell className="py-3 px-4 text-neutral-800 dark:text-neutral-200 text-center border-r border-gray-300 text-sm font-medium">
                                    0
                                </TableCell>
                                <TableCell className="py-3 px-6 border-gray-300 bg-gray-50 dark:bg-muted/30" />
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
