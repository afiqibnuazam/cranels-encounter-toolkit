"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DiamondPlus, ImageOff, SquarePen } from "lucide-react";
import { Avatar, AvatarFallback } from "../../ui/avatar";
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
                    index: data.index,
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
    // {
    //     id: "image",
    //     header: "Avatar",
    //     cell: ({ row }) => (
    //         <Avatar className="size-8">
    //             {/* <AvatarImage src={`${row.original.image_url}`} /> */}
    //             <AvatarFallback><ImageOff size={12} /></AvatarFallback>
    //         </Avatar>
    //     ),
    // },
    {
        accessorKey: "name",
        header: "Name",
        size: 250,
        enableResizing: false,
        cell: ({ row }) => {
            const monsterName = row.getValue("name");
            return (
                <div className="font-medium">{monsterName as string}</div>
            );
        },
    },
    {
        id: "edit",
        size: 35,
        enableResizing: false,
        cell: ({ row }) => <EditMonsterButton monster={row.original} />,
    },
    {
        id: "info",
        size: 35,
        enableResizing: false,
        cell: ({ row }) => <MonsterHoverCard monster={row.original} />
    },
    {
        id: "add",
        size: 35,
        enableResizing: false,
        cell: ({ row }) => <AddMonsterButton monster={row.original} />,
    },
];
