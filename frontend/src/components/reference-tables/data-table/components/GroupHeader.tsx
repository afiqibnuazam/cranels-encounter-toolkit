import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { capitalizeGroupName } from "../utils/formatters";
import { TableCell, TableRow } from "@/components/ui/table";

interface GroupHeaderProps {
    groupKey: string;
    groupItemsCount: number;
    isExpanded: boolean;
    onToggle: (groupKey: string) => void;
    columnsLength: number;
}

export function GroupHeader({ 
    groupKey, 
    groupItemsCount, 
    isExpanded, 
    onToggle, 
    columnsLength 
}: GroupHeaderProps) {
    return (
        <TableRow
            className="bg-muted/50 hover:bg-muted/70 cursor-pointer"
            onClick={() => onToggle(groupKey)}
            role="button"
            aria-expanded={isExpanded}
            aria-label={`Toggle ${groupKey} group`}
        >
            <TableCell colSpan={columnsLength} className="font-medium">
                <div className="flex items-center gap-2">
                    {isExpanded ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                    <span>{capitalizeGroupName(groupKey)}</span>
                    <span className="text-muted-foreground">({groupItemsCount})</span>
                </div>
            </TableCell>
        </TableRow>
    );
}