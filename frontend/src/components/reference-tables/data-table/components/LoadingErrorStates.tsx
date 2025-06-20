import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";

interface LoadingStateProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
}

export function LoadingState<TData, TValue>({ columns }: LoadingStateProps<TData, TValue>) {
    return (
        <TableBody>
            <TableRow>
                <TableCell colSpan={columns.length} className="h-[calc(100vh-264px)] text-center">
                    Loading... {/* TODO: add loader */}
                </TableCell>
            </TableRow>
        </TableBody>
    );
}

interface ErrorStateProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    error: string;
}

export function ErrorState<TData, TValue>({ columns, error }: ErrorStateProps<TData, TValue>) {
    return (
        <TableBody>
            <TableRow>
                <TableCell colSpan={columns.length} className="h-[calc(100vh-264px)] text-center text-red-500">
                    {error}
                </TableCell>
            </TableRow>
        </TableBody>
    );
}