"use client"

import SpellHoverCard from "@/components/hover-cards/SpellHoverCard"
import { ColumnDef } from "@tanstack/react-table"
import { SquarePen } from "lucide-react"
import { SpellSummary } from "@/types/spell"

// Use SpellSummary for table display (lighter interface)
export type Spell = SpellSummary;

export const columns: ColumnDef<Spell>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const spellName = row.getValue("name")
            
            return (
                <div className="ml-2 font-medium">{ spellName as string}</div>
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
            const spell = row.original;
            return (
                <SpellHoverCard spell={spell} />
            )
        }
    },
]
