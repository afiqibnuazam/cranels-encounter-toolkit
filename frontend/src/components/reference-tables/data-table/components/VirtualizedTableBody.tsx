"use client"

import React, { useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Table as ReactTable, flexRender } from '@tanstack/react-table';

interface VirtualizedTableBodyProps<TData> {
    table: ReactTable<TData>;
    hasNextPage?: boolean;
    fetchNextPage?: () => void;
    isFetchingNextPage?: boolean;
    parentRef: React.RefObject<HTMLDivElement | null>; // Pass the scroll container ref from parent
    visibleKey?: string; // Add this prop to trigger re-measurement
}

export const VirtualizedTableBody = React.memo(<TData,>({
    table,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    parentRef,
    visibleKey,
}: VirtualizedTableBodyProps<TData>) => {
    const { rows } = table.getRowModel();

    const isFiltering = rows.length < table.getCoreRowModel().rows.length * 0.95;

    // Create virtualizer
    const rowVirtualizer = useVirtualizer({
        count: !isFiltering && hasNextPage ? rows.length + 1 : rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 64, // Match the h-16 class (64px)
        overscan: 5, // Reduce from 10 to 5 for better performance
        scrollMargin: 0,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    // Force virtualizer to recalculate when filtered rows change
    useEffect(() => {
        rowVirtualizer.measure();
    }, [rows.length, rowVirtualizer]);

    // Force virtualizer to recalculate when column filters change
    useEffect(() => {
        rowVirtualizer.measure();
    }, [table.getState().columnFilters, rowVirtualizer]);

    // Effect to trigger infinite loading
    useEffect(() => {
        const [lastItem] = [...virtualItems].reverse();

        if (!lastItem) {
            return;
        }

        if (
            lastItem.index >= rows.length - 1 &&
            hasNextPage &&
            !isFetchingNextPage &&
            !isFiltering
        ) {
            fetchNextPage?.();
        }
    }, [
        hasNextPage,
        fetchNextPage,
        rows.length,
        isFetchingNextPage,
        virtualItems,
        table,
        isFiltering,
    ]);

    useEffect(() => {
        if (parentRef.current) {
            parentRef.current.scrollTop = 0;
        }
        rowVirtualizer.scrollToIndex(0);
    }, [visibleKey]);

    // Force virtualizer to re-measure when tab becomes visible
    useEffect(() => {
        if (visibleKey && parentRef.current) {
            // Small delay to ensure the container is fully visible
            const timer = setTimeout(() => {
                if (parentRef.current) {
                    parentRef.current.scrollTop = 0;
                }
                rowVirtualizer.scrollToIndex(0);
                // Force re-measurement
                rowVirtualizer.measure();
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [visibleKey, rowVirtualizer]);

    // Reset scroll position when filtering changes significantly
    useEffect(() => {
        const coreRowsLength = table.getCoreRowModel().rows.length;
        const filteredRowsLength = rows.length;
        
        // If filtering changed significantly (more than 50% difference), reset scroll
        if (Math.abs(coreRowsLength - filteredRowsLength) > coreRowsLength * 0.5) {
            if (parentRef.current) {
                parentRef.current.scrollTop = 0;
            }
            rowVirtualizer.scrollToIndex(0);
        }
    }, [rows.length, table, rowVirtualizer, parentRef]);

    // Use intersection observer to detect when table becomes visible
    useEffect(() => {
        if (!parentRef.current || !visibleKey) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Table is now visible, force re-measurement
                        setTimeout(() => {
                            if (parentRef.current) {
                                parentRef.current.scrollTop = 0;
                            }
                            rowVirtualizer.scrollToIndex(0);
                            rowVirtualizer.measure();
                        }, 50);
                    }
                });
            },
            { threshold: 0.1 } // Trigger when 10% of the element is visible
        );

        observer.observe(parentRef.current);

        return () => {
            observer.disconnect();
        };
    }, [visibleKey]);

    return (
        <TableBody 
            style={{ 
                position: 'relative', 
                height: `${rowVirtualizer.getTotalSize()}px`,
                willChange: 'transform' // Optimize for scroll performance
            }}
        >
            {virtualItems.map((virtualRow) => {
                // Show loader row if not filtering and hasNextPage and this is the loader row
                const isLoaderRow = !isFiltering && hasNextPage && virtualRow.index === rows.length;
                const row = rows[virtualRow.index];

                return (
                    <TableRow
                        key={row?.id ?? virtualRow.index}
                        data-index={virtualRow.index}
                        ref={rowVirtualizer.measureElement}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualRow.start}px)`,
                            willChange: 'transform', // Optimize for scroll performance
                        }}
                        className="h-16 flex items-center justify-between px-2"
                    >
                        {isLoaderRow ? (
                            <TableCell
                                colSpan={table.getAllColumns().length}
                                className="text-center p-4 text-muted-foreground"
                            >
                                {isFetchingNextPage
                                    ? 'Loading more...'
                                    : hasNextPage
                                        ? 'Load more'
                                        : 'Nothing more to load'
                                }
                            </TableCell>
                        ) : row ? (
                            row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    style={{
                                        width: cell.column.getSize(),
                                    }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))
                        ) : null}
                    </TableRow>
                );
            })}
        </TableBody>
    );
});

VirtualizedTableBody.displayName = 'VirtualizedTableBody';