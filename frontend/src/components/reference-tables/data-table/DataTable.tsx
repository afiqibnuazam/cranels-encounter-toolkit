"use client"

import React from "react"
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
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


export function ReferencePaneDataTable<TData, TValue>({
    columns,
    data,
    loading = false,
    error = null,
    tab,
}: DataTableProps<TData, TValue>) {
    // State management
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    // Custom hooks
    const { groupState, cycleGroupState, buttonProps } = useGroupingButton(tab)
    const groupedData = useDataGrouping(data, groupState, columnFilters)
    const { expandedGroups, toggleGroup } = useGroupExpansion(groupedData)


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
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
            <ScrollArea className="h-[calc(100vh-264px)]"> {/* TODO: make the height dynamic to screen size */}
                <div className="border">
                    <Table>
                        {loading ? (
                            <LoadingState columns={columns} />
                        ) : error ? (
                            <ErrorState columns={columns} error={error} />
                        ) : groupedData ? (
                            <GroupedTableBody
                                groupedData={groupedData}
                                expandedGroups={expandedGroups}
                                toggleGroup={toggleGroup}
                                table={table}
                                columns={columns}
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
