import { useMemo } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { GroupState } from "../types";
import { formatChallengeRating, getCRValue, getLevelValue } from "../utils/formatters";

export const useDataGrouping = <TData>(
    data: TData[],
    groupState: GroupState,
    columnFilters: ColumnFiltersState
) => {
    return useMemo(() => {
        try {
            if (groupState === "none") {
                return null;
            }

            // Get search filter from columnFilters state
            const searchFilter = columnFilters.find(filter => filter.id === "name")?.value as string;
            const groups: Record<string, TData[]> = {};

            data.forEach((item) => {
                const itemData = item as Record<string, unknown>;

                // Apply search filter first
                if (searchFilter) {
                    const itemName = (itemData.name as string) || "";
                    if (!itemName.toLowerCase().includes(searchFilter.toLowerCase())) {
                        return; // Skip this item if it doesn't match search
                    }
                }

                let groupKey: string;

                switch (groupState) {
                    case "type":
                        groupKey = (itemData.type as string) || "Unknown Type";
                        break;
                    case "challenge_rating":
                        groupKey = formatChallengeRating(itemData.challenge_rating as number);
                        break;
                    case "level":
                        const level = itemData.level as number;
                        groupKey = level === 0 ? "Cantrips" : `Level ${level}`;
                        break;
                    case "school":
                        groupKey = (itemData.school as string) || "Unknown School";
                        break;
                    case "tags":
                        const tags = itemData.tags as string[];
                        if (tags && tags.length > 0) {
                            groupKey = tags[0];
                        } else {
                            groupKey = "No Tags";
                        }
                        break;
                    case "source":
                        groupKey = (itemData.source as string) || "Unknown Source";
                        break;
                    default:
                        groupKey = "Unknown";
                }

                if (!groups[groupKey]) {
                    groups[groupKey] = [];
                }
                groups[groupKey].push(item);
            });

            // Special handling for tags grouping - create entries for all tags
            if (groupState === "tags") {
                const newGroups: Record<string, TData[]> = {};

                data.forEach((item) => {
                    const itemData = item as Record<string, unknown>;

                    // Apply search filter first
                    if (searchFilter) {
                        const itemName = (itemData.name as string) || "";
                        if (!itemName.toLowerCase().includes(searchFilter.toLowerCase())) {
                            return;
                        }
                    }

                    const tags = itemData.tags as string[];
                    if (tags && tags.length > 0) {
                        tags.forEach(tag => {
                            if (!newGroups[tag]) {
                                newGroups[tag] = [];
                            }
                            newGroups[tag].push(item);
                        });
                    } else {
                        if (!newGroups["No Tags"]) {
                            newGroups["No Tags"] = [];
                        }
                        newGroups["No Tags"].push(item);
                    }
                });

                // Replace groups with the new multi-tag groups
                Object.keys(groups).forEach(key => delete groups[key]);
                Object.assign(groups, newGroups);
            }

            // Sort groups by key and sort items within each group
            const sortedGroups = Object.keys(groups).sort((a, b) => {
                // Special sorting for challenge rating groups
                if (groupState === "challenge_rating") {
                    return getCRValue(a) - getCRValue(b);
                }

                // Special sorting for spell levels
                if (groupState === "level") {
                    return getLevelValue(a) - getLevelValue(b);
                }

                // Default alphabetical sorting for other group types
                return a.localeCompare(b);
            }).reduce((acc, key) => {
                acc[key] = groups[key].sort((a, b) => {
                    const aData = a as Record<string, unknown>;
                    const bData = b as Record<string, unknown>;
                    return ((aData.name as string) || "").localeCompare((bData.name as string) || "");
                });
                return acc;
            }, {} as Record<string, TData[]>);

            return sortedGroups;
        } catch (error) {
            console.error('Grouping error:', error);
            return null;
        }
    }, [data, groupState, columnFilters]);
};