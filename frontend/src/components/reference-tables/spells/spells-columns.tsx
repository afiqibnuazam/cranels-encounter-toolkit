"use client"

import SpellHoverCard from "@/components/hover-cards/SpellHoverCard"
import { ColumnDef } from "@tanstack/react-table"
import { SquarePen } from "lucide-react"
import { SpellSummary } from "@/types/spell"
import Link from "next/link"

// Use SpellSummary for table display (lighter interface)
export type Spell = SpellSummary;

// Separate component for Edit/Clone button
const EditSpellButton = ({ spell }: { spell: SpellSummary }) => {
    // For SRD spells, create clone; for custom spells, direct edit
    const href = spell.data_source === 'custom' 
        ? `/spells/${spell.id}/edit`
        : `/spells/${spell.id}`;

    const title = spell.data_source === 'custom' 
        ? 'Edit Spell' 
        : 'Clone Spell';

    return (
        <Link href={href} title={title}>
            <SquarePen 
                size={18} 
                className="cursor-pointer hover:text-primary" 
            />
        </Link>
    );
};

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
        cell: ({ row }) => <EditSpellButton spell={row.original} />,
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
