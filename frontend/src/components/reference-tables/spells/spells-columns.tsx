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
                <div className="font-medium pl-2">
                    { spellName as string}
                </div>
            );
        },
    },
    {
        id: "edit",
        size: 40,
        enableResizing: false,
        cell: ({ row }) => (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                <EditSpellButton spell={row.original} />
            </div>
        ),
    },
    {
        id: "info",
        size: 48,
        enableResizing: false,
        cell: ({ row }) => {
            const spell = row.original;
            return (
                <div className="flex justify-center pr-2">
                    <SpellHoverCard spell={spell} />
                </div>
            )
        }
    },
]
