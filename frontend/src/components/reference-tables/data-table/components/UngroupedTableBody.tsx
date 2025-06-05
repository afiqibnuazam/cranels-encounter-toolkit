import React from "react";
import { Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";

interface UngroupedTableBodyProps<TData> {
    table: TanstackTable<TData>;
}

export function UngroupedTableBody<TData>({ table }: UngroupedTableBodyProps<TData>) {
    return (
        <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="h-16"
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            ) : (
                <TableRow className="">
                    <TableCell colSpan={table.getAllColumns().length} className="text-center">
                        No results.
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    );
}