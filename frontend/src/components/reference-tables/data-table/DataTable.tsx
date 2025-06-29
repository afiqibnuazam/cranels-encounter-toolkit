"use client"

import React, { useRef } from "react"
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    ColumnSizingState,
} from "@tanstack/react-table"
import {
    Table,
} from "@/components/ui/table"
import { useState } from "react"
import { ScrollArea } from "../../ui/scroll-area"
import { DataTableProps } from "./types"
import { useGroupingButton } from "./hooks/useGroupingButton"
import { useDataGrouping } from "./hooks/useDataGrouping"
import { useGroupExpansion } from "./hooks/useGroupExpansion"
import { TableControls } from "./components/TableControls"
import { ErrorState, LoadingState } from "./components/LoadingErrorStates"
import { GroupedTableBody } from "./components/GroupedTableBody"
import { UngroupedTableBody } from "./components/UngroupedTableBody"
import { VirtualizedTableBody } from "./components/VirtualizedTableBody"


export function ReferencePaneDataTable<TData, TValue>({
    columns,
    data,
    loading = false,
    error = null,
    tab,
    activeTab,
    // New infinite scroll props
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    enableVirtualization = false,
}: DataTableProps<TData, TValue>) {
    // State management
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})

    // Ref for scroll container (needed for virtualization)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    // Custom hooks
    const { groupState, cycleGroupState, buttonProps } = useGroupingButton(tab)
    const groupedData = useDataGrouping(data, groupState, columnFilters)
    const { expandedGroups, toggleGroup } = useGroupExpansion(groupedData)

    // Determine if we should use virtualization
    const shouldUseVirtualization = enableVirtualization && data.length >= 50;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnSizingChange: setColumnSizing,
        enableColumnResizing: true, // Enable resizing to allow table layout flexibility
        columnResizeMode: 'onEnd', // Change from 'onChange' to 'onEnd'
        state: {
            sorting,
            columnFilters,
            columnSizing,
        },
    })

    return (
        <div>
            <TableControls
                table={table}
                tab={tab}
                buttonProps={buttonProps}
                onCycleGroup={cycleGroupState}
            />
            <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-264px)]">
                <div className="border">
                    <Table>
                        {loading ? (
                            <LoadingState columns={columns} />
                        ) : error ? (
                            <ErrorState columns={columns} error={error} />
                        ) : shouldUseVirtualization && !groupedData ? (
                            // Use virtualized table body for large datasets without grouping
                            <VirtualizedTableBody
                                key={`${tab}-${activeTab}`}
                                visibleKey={activeTab}
                                table={table}
                                hasNextPage={hasNextPage}
                                fetchNextPage={fetchNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                                parentRef={scrollAreaRef}
                            />
                        ) : groupedData ? (
                            <GroupedTableBody
                                table={table}
                                groupedData={groupedData}
                                expandedGroups={expandedGroups}
                                columns={columns}
                                toggleGroup={toggleGroup}
                            />
                        ) : (
                            <UngroupedTableBody table={table} />
                        )}
                    </Table>
                </div>
            </ScrollArea>
        </div>
    )
}
