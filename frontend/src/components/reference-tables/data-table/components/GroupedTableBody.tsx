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
                                className="group h-16 hover:bg-muted/50 pr-4"
                            >
                                {row?.getVisibleCells().map((cell) => (
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
                        ))}
                    </React.Fragment>
                );
            })}
        </TableBody>
    );
}