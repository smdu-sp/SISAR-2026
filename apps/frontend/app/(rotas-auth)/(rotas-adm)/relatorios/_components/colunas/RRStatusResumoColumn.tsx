'use client';

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from '@/components/ui/table';

interface IResumoTableRow {
    orgao: string;
    nao_incide: number;
    area_envoltoria: number;
    bem_tombado: number;
    total: number;
}

interface CustomDataTableProps {
    data: IResumoTableRow[];
    roundednone?: boolean;
}

export default function CustomDataTable({
    data,
    roundednone = false
}: CustomDataTableProps) {
    // Definir colunas diretamente aqui para ter controle total
    const columns: ColumnDef<IResumoTableRow>[] = [
        {
            accessorKey: "orgao",
            header: "Unidade",
        },
        {
            accessorKey: "nao_incide",
            header: "não incide",
            cell: ({ row }) => row.original.nao_incide,
        },
        {
            accessorKey: "area_envoltoria",
            header: "área envoltória",
            cell: ({ row }) => row.original.area_envoltoria,
        },
        {
            accessorKey: "bem_tombado",
            header: "bem tombado",
            cell: ({ row }) => row.original.bem_tombado,
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => row.original.total,
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <Table className={`bg-background dark:bg-muted/50 border`} roundednone={roundednone.toString()}>
                <TableHeader className='bg-primary hover:bg-primary'>
                    {/* Primeira linha do header - cabeçalho personalizado */}
                    <TableRow className='hover:bg-primary'>
                        <TableHead
                            className='text-white text-xs text-nowrap border border-gray-300'
                            rowSpan={2}
                        >
                            Unidade
                        </TableHead>
                        <TableHead
                            className='text-white text-xs text-center border border-gray-300'
                            colSpan={3}
                        >
                            Legislação de Patrimônio Cultural
                        </TableHead>
                        <TableHead
                            className='text-white text-xs text-nowrap border border-gray-300'
                            rowSpan={2}
                        >
                            Total
                        </TableHead>
                    </TableRow>
                    {/* Segunda linha do header - subcabeçalhos */}
                    <TableRow className='hover:bg-primary'>
                        {/* Unidade - omitido pois está com rowSpan=2 */}
                        <TableHead className='text-white text-xs text-center border border-gray-300'>
                            não incide
                        </TableHead>
                        <TableHead className='text-white text-xs text-center border border-gray-300'>
                            área envoltória
                        </TableHead>
                        <TableHead className='text-white text-xs text-center border border-gray-300'>
                            bem tombado
                        </TableHead>
                        {/* Total - omitido pois está com rowSpan=2 */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                className='px-4'
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className='text-xs xl:text-sm px-4 text-nowrap font-light border border-gray-300'>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className='h-24 text-center'>
                                Sem resultados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
