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
                        className="group h-16 hover:bg-muted/50 pr-4"
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell 
                                key={cell.id}
                                style={{
                                    width: cell.column.getSize() !== 150
                                        ? `${cell.column.getSize()}px`
                                        : undefined,
                                    minWidth: cell.column.getSize() !== 150
                                        ? `${cell.column.getSize()}px`
                                        : undefined,
                                    maxWidth: cell.column.columnDef.maxSize 
                                        ? `${cell.column.columnDef.maxSize}px` 
                                        : undefined,
                                }}
                                className={cell.column.getSize() !== 150 ? "w-fit" : ""}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className="text-center">
                        No results.
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    );
}