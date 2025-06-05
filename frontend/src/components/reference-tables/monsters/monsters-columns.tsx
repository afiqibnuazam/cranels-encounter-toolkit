"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DiamondPlus, ImageOff, SquarePen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useEncounterDispatch } from "@/context/EncounterContext";
import { MonsterSummary, formatArmorClass, getChallengeRatingString } from "@/types/monster";
import MonsterHoverCard from "../../hover-cards/MonsterHoverCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Separate component for Add button so it can use hooks
const AddMonsterButton = ({ monster }: { monster: MonsterSummary }) => {
    const dispatch = useEncounterDispatch();

    // TODO: need to fix this to use the correct API endpoint
    const handleAddMonster = () => {
        if (!monster || !monster.index) return;

        fetch(`${API_URL}/srd-monsters/${monster.index}`)
            .then(res => res.json())
            .then(data => {
                dispatch({
                    type: 'ADD_COMBATANT',
                    payload: {
                        id: crypto.randomUUID(), // Use index as ID
                        index: data.index,
                        initiative: 0,
                        name: data.name,
                        current_hit_points: data.hit_points,
                        max_hit_points: data.hit_points,
                        temporary_hit_points: 0,
                        armor_class: data.armor_class[0].value,
                        unit_type: 'monster',
                        source_type: 'srd',
                        source_id: data.id, // Assuming this is the DB ID
                    },
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

export const columns: ColumnDef<MonsterSummary>[] = [
    {
        id: "image",
        header: "Avatar",
        cell: ({ row }) => (
            <Avatar className="size-8">
                {/* <AvatarImage src={`${row.original.image_url}`} /> */}
                <AvatarFallback><ImageOff size={12} /></AvatarFallback>
            </Avatar>
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        size: 200,
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
        cell: () => <SquarePen size={18} />,
    },
    {
        id: "info",
        size: 35,
        cell: ({ row }) => (
            <MonsterHoverCard monster={row.original} />
        )
    },
    {
        id: "add",
        size: 35,
        cell: ({ row }) => <AddMonsterButton monster={row.original} />,
    },
];
