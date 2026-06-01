"use client"

import MiniTabelaARQuantitativo from "./miniTabelaARQuantitativo"
import { useState, useEffect } from "react"
import { gerarRelatorio } from "@/services/relatorios/ar-resumo-quantitativo/query-functions/gerarRelatorio"
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { IRelatorioStatusResumoQuantitativo } from "@/types/relatorios"

interface ITabelaResumoQuantitativo {
    sectionTitle: string
    period: string
    access_token: string
}

export function TabelaARQuantitativo({ sectionTitle, period, access_token }: ITabelaResumoQuantitativo) {
    const [lista, setLista] = useState<IRelatorioStatusResumoQuantitativo>()
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
                        setLista(resultado.data as IRelatorioStatusResumoQuantitativo)
                    } else {
                        setError(resultado.error ? String(resultado.error) : "Erro desconhecido ao buscar relatório.")
                    }
                } catch {
                    setError("Erro ao buscar relatório.")
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchRelatorio()
    }, [period, access_token])

    if (isLoading) {
        return <p className="text-center py-8 text-muted-foreground">Carregando relatório...</p>
    }

    if (error) {
        return <p className="text-center py-8 text-destructive">{error}</p>
    }

    return (
        <div className="w-[90%] mx-auto px-2 sm:px-4">
            <div className="space-y-0">
                <h3 className="text-lg font-semibold mb-6 text-center">{sectionTitle}</h3>
                {lista?.data_gerado && (
                    <p className="text-sm text-muted-foreground text-center mb-4">
                        Gerado em: {lista.data_gerado}
                    </p>
                )}

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
                                    Admissíveis (em análise / deferidos)
                                </TableCell>
                                <TableCell className="py-3 px-3 sm:px-6 font-bold text-neutral-800 dark:text-neutral-200 text-right border-gray-300 text-sm w-full">
                                    {lista?.admissiveis || 0}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {lista?.em_analise && (
                    <div className="border border-gray-300 border-t-0">
                        <div className="bg-primary">
                            <h3 className="text-white py-3 px-3 sm:px-6 text-sm font-semibold tracking-wide">EM ANÁLISE</h3>
                        </div>
                        <MiniTabelaARQuantitativo secao={lista.em_analise} roundednone={true} />
                    </div>
                )}

                {lista?.deferidos && (
                    <div className="border border-gray-300 border-t-0">
                        <div className="bg-primary">
                            <h3 className="text-white py-3 px-3 sm:px-6 text-sm font-semibold tracking-wide">DEFERIDOS</h3>
                        </div>
                        <MiniTabelaARQuantitativo secao={lista.deferidos} roundednone={true} />
                    </div>
                )}

                {lista?.indeferidos && (
                    <div className="border border-gray-300 border-t-0">
                        <div className="bg-primary">
                            <h3 className="text-white py-3 px-3 sm:px-6 text-sm font-semibold tracking-wide">INDEFERIDOS</h3>
                        </div>
                        <MiniTabelaARQuantitativo secao={lista.indeferidos} roundednone={true} />
                    </div>
                )}

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
                                    {lista?.via_ordinaria_dados?.length ?? 0}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
