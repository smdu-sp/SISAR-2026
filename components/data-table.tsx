/** @format */

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
} from './ui/table';
import { Skeleton } from './ui/skeleton';
import { boolean } from 'zod';

interface ISticker {
	active: boolean;
	columnNumber: number;
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	roundednone?: boolean;
	stickers?: ISticker;
}

export default function DataTable<TData, TValue>({
	columns,
	data,
	roundednone = false,
	stickers
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<div>
			<Table className={`bg-background dark:bg-muted/50 border`} roundednone={roundednone.toString()}>
				<TableHeader className='bg-primary hover:bg-primary'>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow
							className='hover:bg-primary'
							key={headerGroup.id}>
							{headerGroup.headers.map((header, index) => {
								const isSticky = stickers?.active === true && index < stickers.columnNumber;

								return (
									<TableHead
										className={isSticky ? "text-white text-xs text-nowrap sticky left-0 bg-primary z-10" : "text-white text-xs text-nowrap"}
										key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								className='px-4'
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}>
								{row.getVisibleCells().map((cell, index) => {
									const isSticky = stickers?.active === true && index < (stickers.columnNumber ?? 0);
									return (
										<TableCell
											key={cell.id}
											className={`text-xs xl:text-sm px-4 text-nowrap font-light ${isSticky ? "sticky left-0 z-10 bg-card" : ""
												}`}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									);
								})}

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
		</ div>
	);
}

export function TableSkeleton() {
	return <Skeleton className='h-240 w-full' />;
}
