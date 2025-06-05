import { useState, useCallback, useMemo } from "react";

export const useGroupExpansion = <TData>(groupedData: Record<string, TData[]> | null) => {
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    const toggleGroup = useCallback((groupKey: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupKey)) {
            newExpanded.delete(groupKey);
        } else {
            newExpanded.add(groupKey);
        }
        setExpandedGroups(newExpanded);
    }, [expandedGroups]);

    // Reset expanded groups when grouping changes (default to collapsed)
    useMemo(() => {
        if (groupedData) {
            setExpandedGroups(new Set()); // Start with all groups collapsed
        }
    }, [groupedData]);

    return {
        expandedGroups,
        toggleGroup,
    };
};