"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DiamondPlus, ImageOff, Search, SquarePen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../ui/hover-card";
import { ScrollArea } from "../../ui/scroll-area";
import { useEncounterDispatch } from "@/context/EncounterContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Monster {
    index: string;
    name: string;
}

// Separate component for Add button so it can use hooks
const AddMonsterButton = ({ monster }: { monster: Monster }) => {
    const dispatch = useEncounterDispatch();

    const handleAddMonster = () => {
        if (!monster || !monster.index) return;

        fetch(`${API_URL}/monsters/${monster.index}`)
            .then(res => res.json())
            .then(data => {
                dispatch({
                    type: 'ADD_COMBATANT',
                    payload: data,
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

export const columns: ColumnDef<Monster>[] = [
    {
        id: "image",
        header: "Avatar",
        cell: ({ row }) => (
            <Avatar className="size-8">
                <AvatarImage src={`${API_URL}/images/monsters/${row.original.index}.png`} />
                <AvatarFallback><ImageOff size={12} /></AvatarFallback>
            </Avatar>
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const monsterName = row.getValue("name");
            return (
                <div className="font-medium">{monsterName as string}</div>
            );
        },
    },
    {
        id: "edit",
        header: "Edit",
        cell: () => <SquarePen size={18} />,
    },
    {
        id: "info",
        header: "Details",
        cell: ({ row }) => {
            const monsterName = row.getValue("name");

            return (
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Search size={18} />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[365px]">
                        <ScrollArea className="h-[300px]">
                            <div>
                                <h1 className="text-lg font-bold">{monsterName as string}</h1>
                            </div>
                        </ScrollArea>
                    </HoverCardContent>
                </HoverCard>
            )
        }
    },
    {
        id: "add",
        header: "Add",
        cell: ({ row }) => <AddMonsterButton monster={row.original} />,
    },
];
