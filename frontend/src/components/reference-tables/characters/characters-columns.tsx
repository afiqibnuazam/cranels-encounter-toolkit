"use client"

import { useEncounterDispatch } from "@/context/EncounterContext";
import { ColumnDef } from "@tanstack/react-table"
import { DiamondPlus, SquarePen, Search } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Character = {
    id: number;
    index: string;
    name: string;
    unit_type: "player_character" | "player_character" | "enemy_npc";
    // image
}

const AddCharacterButton = ({ character }: { character: Character }) => {
    const dispatch = useEncounterDispatch();

    const handleAddCharacter = () => {
        if (!character || !character.index) return;

        fetch(`${API_URL}/characters/${character.index}`)
            .then(res => res.json())
            .then(data => {
                dispatch({
                    type: 'ADD_COMBATANT',
                    payload: data,
                });
            })
            .catch(err => console.error('Error fetching character details:', err));
    };

    return (
        <DiamondPlus
            size={18}
            className="cursor-pointer hover:text-primary"
            onClick={handleAddCharacter}
        />
    );
};

export const columns: ColumnDef<Character>[] = [
    {
        id: "image",
        header: "Avatar",
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const characterName = row.getValue("name");
            return (
                <div className="font-medium">{characterName as string}</div>
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
        cell: ({ row }) => <AddCharacterButton character={row.original} />,
    },
];
