"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SquarePen, Search } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EncounterSummary } from "@/types/encounter";

// Use EncounterSummary for table display (lighter interface)
export type Encounter = EncounterSummary;

export const columns: ColumnDef<Encounter>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const encounterName = row.getValue("name");
            return (
                <div className="font-medium">{encounterName as string}</div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <div className="text-sm capitalize">
                    {status || "Draft"}
                </div>
            );
        },
    },
    {
        id: "edit",
        cell: () => <SquarePen size={18} />,
    },
    {
        id: "info",
        cell: ({ row }) => {
            const encounter = row.original;

            return (
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Search size={18} />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[365px]">
                        <ScrollArea className="h-[300px]">
                            <div>
                                <h1 className="text-lg font-bold">{encounter.name}</h1>
                                {encounter.description && (
                                    <p className="text-sm mt-2">{encounter.description}</p>
                                )}
                                <div className="mt-4 space-y-1">
                                    <p className="text-sm"><strong>Difficulty:</strong> {encounter.difficulty || "Unknown"}</p>
                                    <p className="text-sm"><strong>Status:</strong> {encounter.status || "Draft"}</p>
                                </div>
                            </div>
                        </ScrollArea>
                    </HoverCardContent>
                </HoverCard>
            )
        }
    },
];