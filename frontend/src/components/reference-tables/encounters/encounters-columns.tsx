"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SquarePen } from "lucide-react";
import { EncounterSummary } from "@/types/encounter";
import EncounterHoverCard from "@/components/hover-cards/EncounterHoverCard";
import { Badge } from "@/components/ui/badge";

// Use EncounterSummary for table display (lighter interface)
export type Encounter = EncounterSummary;

export const columns: ColumnDef<Encounter>[] = [
    {
        accessorKey: "name",
        cell: ({ row }) => {
            const encounterName = row.getValue("name");
            return (
                <div className="font-medium pl-2">
                    {encounterName as string}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        size: 60,
        enableResizing: false,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <div className="text-sm uppercase text-center">
                    <Badge variant="secondary">
                        {status || "Draft"}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: "edit",
        size: 40,
        enableResizing: false,
        cell: () => (
            <div className="flex justify-center">
                <SquarePen size={18} />
            </div>
        )
    },
    {
        id: "info",
        size: 48,
        enableResizing: false,
        cell: ({ row }) => (
            <div className="flex justify-center pr-2">
                <EncounterHoverCard encounter={row.original} />
            </div>
        )
    },
];