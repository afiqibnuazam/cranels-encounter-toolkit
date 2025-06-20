import React from "react";
import { ColumnDef, Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { GroupHeader } from "./GroupHeader";

interface GroupedTableBodyProps<TData, TValue> {
    table: TanstackTable<TData>;
    groupedData: Record<string, TData[]>;
    expandedGroups: Set<string>;
    columns: ColumnDef<TData, TValue>[];
    toggleGroup: (groupKey: string) => void;
}

export function GroupedTableBody<TData, TValue>({
    table,
    groupedData,
    expandedGroups,
    columns,
    toggleGroup,
}: GroupedTableBodyProps<TData, TValue>) {
    return (
        <TableBody>
            {Object.entries(groupedData).map(([groupKey, groupItems]) => {
                const isExpanded = expandedGroups.has(groupKey);
                const groupRows = groupItems.map(item =>
                    table.getRowModel().rows.find(row => row.original === item)
                ).filter(Boolean);

                return (
                    <React.Fragment key={groupKey}>
                        <GroupHeader
                            groupKey={groupKey}
                            groupItemsCount={groupItems.length}
                            isExpanded={isExpanded}
                            onToggle={toggleGroup}
                            columnsLength={columns.length}
                        />
                        {isExpanded && groupRows.map((row) => (
                            <TableRow
                                key={row?.id}
                                data-state={row?.getIsSelected() && "selected"}
                                className="h-16"
                            >
                                {row?.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </React.Fragment>
                );
            })}
        </TableBody>
    );
}