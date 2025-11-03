"use client"

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface IResumoTableRow {
    unidade: string
    total: number
}

interface ITabelaData {
    smul: IResumoTableRow[]
    graproem: IResumoTableRow[]
}

interface MiniTabelaArQuantitativoProps {
    data: ITabelaData
    roundednone?: boolean
}

export default function MiniTabelaArQuantitativo({ data, roundednone = false }: MiniTabelaArQuantitativoProps) {

    const smulTotal = data.smul.reduce((sum, item) => sum + item.total, 0)
    const grapoemTotal = data.graproem.reduce((sum, item) => sum + item.total, 0)
    const totalParcial = smulTotal + grapoemTotal

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

                    {data.smul.map((row, index) => (
                        <TableRow key={`smul-${index}`} className="hover:bg-muted/30 border-b border-gray-300">
                            <TableCell className="py-3 px-6 font-medium text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-50 dark:bg-muted/30 min-w-[120px]">
                                {row.unidade}
                            </TableCell>
                            <TableCell className="py-3 px-6 text-neutral-800 dark:text-neutral-200 text-center border-r border-gray-300 text-sm">
                                0
                            </TableCell>
                            <TableCell className="py-3 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-center border-gray-300 text-sm">
                                {row.total}
                            </TableCell>
                        </TableRow>
                    ))}

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

                    {data.graproem.map((row, index) => (
                        <TableRow key={`graproem-${index}`} className="hover:bg-muted/30 border-b border-gray-300">
                            <TableCell className="py-3 px-6 font-medium text-neutral-800 dark:text-neutral-200 text-left border-r border-gray-300 text-sm bg-gray-50 dark:bg-muted/30 min-w-[120px]">
                                {row.unidade}
                            </TableCell>
                            <TableCell className="py-3 px-6 text-neutral-800 dark:text-neutral-200 text-center border-r border-gray-300 text-sm">
                                0
                            </TableCell>
                            <TableCell className="py-3 px-6 font-semibold text-neutral-800 dark:text-neutral-200 text-center border-gray-300 text-sm">
                                {row.total}
                            </TableCell>
                        </TableRow>
                    ))}

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
