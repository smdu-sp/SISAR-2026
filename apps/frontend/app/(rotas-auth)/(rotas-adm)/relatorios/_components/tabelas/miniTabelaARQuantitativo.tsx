"use client"

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { IStatusDetalhe } from "@/types/relatorios"

const SETORES: { sigla: string; key: keyof Pick<IStatusDetalhe, 'resid' | 'parhis' | 'servin' | 'comin' | 'caepp'> }[] = [
    { sigla: 'RESID', key: 'resid' },
    { sigla: 'PARHIS', key: 'parhis' },
    { sigla: 'SERVIN', key: 'servin' },
    { sigla: 'COMIN', key: 'comin' },
    { sigla: 'CAEPP', key: 'caepp' },
]

interface MiniTabelaArQuantitativoProps {
    secao: IStatusDetalhe
    roundednone?: boolean
}

function linhasSetores(secao: IStatusDetalhe, stylePrefix: string) {
    return SETORES.map(({ sigla, key }) => {
        const orgao = secao[key]
        const total = orgao?.quantidade ?? 0
        return (
            <TableRow key={`${stylePrefix}-${sigla}`} className="hover:bg-muted/30 border-b border-gray-300">
                <TableCell className="py-3 px-6 font-medium text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-50 dark:bg-muted/30 min-w-[120px]">
                    {sigla}
                </TableCell>
                <TableCell className="py-3 px-6 text-neutral-800 dark:text-neutral-200 text-center border-r border-gray-300 text-sm">
                    0
                </TableCell>
                <TableCell className="py-3 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-center border-gray-300 text-sm">
                    {total}
                </TableCell>
            </TableRow>
        )
    })
}

export default function MiniTabelaArQuantitativo({ secao, roundednone = false }: MiniTabelaArQuantitativoProps) {

    const smulTotal = secao.smul?.quantidade ?? 0
    const grapoemTotal = secao.graproem?.quantidade ?? 0
    const totalParcial =
        secao.total_parcial ??
        smulTotal + grapoemTotal + SETORES.reduce((s, { key }) => s + (secao[key]?.quantidade ?? 0), 0)

    return (
        <div>
            <Table className="bg-background dark:bg-muted/50" roundednone={roundednone.toString()}>
                <TableBody>
                    <TableRow className="hover:bg-muted/30 border-b border-gray-300">
                        <TableCell
                            colSpan={2}
                            className="py-3 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-100 dark:bg-muted/40"
                        >
                            SMUL
                        </TableCell>
                        <TableCell className="py-3 px-6 font-bold text-neutral-800 dark:text-neutral-200 text-center border-gray-300 text-sm bg-gray-50 dark:bg-muted/30">
                            {smulTotal}
                        </TableCell>
                    </TableRow>

                    {linhasSetores(secao, 'smul')}

                    <TableRow className="hover:bg-muted/30 border-b border-gray-300">
                        <TableCell
                            colSpan={2}
                            className="py-3 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-100 dark:bg-muted/40"
                        >
                            GRAPROEM
                        </TableCell>
                        <TableCell className="py-3 px-6 font-bold text-neutral-800 dark:text-neutral-200 text-center border-gray-300 text-sm bg-gray-50 dark:bg-muted/30">
                            {grapoemTotal}
                        </TableCell>
                    </TableRow>

                    {linhasSetores(secao, 'graproem')}

                    <TableRow className="hover:bg-muted/30 border-b border-gray-300">
                        <TableCell
                            colSpan={2}
                            className="py-3 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-100 dark:bg-muted/40"
                        >
                            TOTAL PARCIAL
                        </TableCell>
                        <TableCell className="py-3 px-6 font-bold text-neutral-800 dark:text-neutral-200 text-center border-gray-300 text-sm bg-gray-50 dark:bg-muted/30">
                            {totalParcial}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
