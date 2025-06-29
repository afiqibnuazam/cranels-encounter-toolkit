"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DiamondPlus, SquarePen } from "lucide-react";
import { useEncounter } from "@/context/EncounterContext";
import { MonsterSummary } from "@/types/monster";
import MonsterHoverCard from "../../hover-cards/MonsterHoverCard";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Separate component for Add button so it can use hooks
const AddMonsterButton = ({ monster }: { monster: MonsterSummary }) => {
    const { addCombatant } = useEncounter();

    const handleAddMonster = () => {
        if (!monster || !monster.index) return;

        fetch(`${API_URL}/srd-monsters/${monster.index}`)
            .then(res => res.json())
            .then(data => {
                addCombatant({
                    initiative: 0,
                    name: data.name,
                    current_hit_points: data.hit_points,
                    max_hit_points: data.hit_points,
                    temporary_hit_points: 0,
                    armor_class: data.armor_class[0].value,
                    unit_type: 'monster',
                    source_type: 'srd',
                    source_id: data.id,
                    dexterity: data.dexterity, // Include dexterity for initiative calculations
                    effects: [], // Initialize empty effects array
                });
            })
            .catch(err => console.error('Error fetching monster details:', err));
    };

    return (
        <DiamondPlus
            size={18}
            className="cursor-pointer hover:text-primary"
            onClick={handleAddMonster}
        />
    );
};

// Separate component for Edit/Clone button
const EditMonsterButton = ({ monster }: { monster: MonsterSummary }) => {
    // For SRD monsters, create clone; for custom monsters, direct edit
    const href = monster.data_source === 'custom' 
        ? `/monsters/${monster.id}/edit`
        : `/monsters/new?clone=${monster.index}`;

    const title = monster.data_source === 'custom' 
        ? 'Edit Monster' 
        : 'Clone Monster';

    return (
        <Link href={href} title={title}>
            <SquarePen 
                size={18} 
                className="cursor-pointer hover:text-primary" 
            />
        </Link>
    );
};

export const columns: ColumnDef<MonsterSummary>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const monsterName = row.getValue("name");
            return (
                <div className="font-medium pl-2">
                    {monsterName as string}
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
                <EditMonsterButton monster={row.original} />
            </div>
        ),
    },
    {
        id: "info",
        size: 40,
        enableResizing: false,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <MonsterHoverCard monster={row.original} />
            </div>
        )
    },
    {
        id: "add",
        size: 48,
        enableResizing: false,
        cell: ({ row }) => (
            <div className="flex justify-center pr-2">
                <AddMonsterButton monster={row.original} />
            </div>
        )
    },
];
