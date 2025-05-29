import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { DiamondPlus, Search, SquarePen } from 'lucide-react';
import Image from 'next/image'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface Monster {
    index: string;
    name: string;
    infoUrl: string;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const LibraryReference = () => {
    // const response = await fetch(`${API_URL}/monsters`);
    // const data = await response.json();
    // const monsters: Monster[] = data.results;

    const [monsters, setMonsters] = useState<Monster[] | null>(null);
    const [loading, setLoading] = useState(true);

    const iconSize = 18;

    useEffect(() => {
        const fetchMonsters = async () => {
            try {
                const response = await fetch(`${API_URL}/monsters`);
                const data = await response.json();
                setMonsters(data.results || []);
            } catch (error) {
                console.error('Failed to fetch monsters:', error);
                setMonsters([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMonsters();
    }, []);

    return (
        <Table>
            <TableBody>
                {loading && (
                    <TableRow className="h-[600px]">
                        <TableCell colSpan={4} className="m-auto text-center">
                            {/* TODO: make this a loading spinner */}
                            <div className="flex items-center justify-center h-full">
                                Loading monsters...
                            </div>
                        </TableCell>
                    </TableRow>
                )}
                {monsters?.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="m-auto text-center">
                            <div className="flex items-center justify-center h-full">
                                No monsters available or failed to load.
                            </div>
                        </TableCell>
                    </TableRow>
                )}
                {monsters?.map((monster) => (
                    <TableRow key={monster.index} className="h-16">
                        {/* IMAGE */}
                        <TableCell>
                            <div className="size-[30px] rounded-full relative overflow-hidden bg-gray-200">
                                {/* <Image
                                    src={'https://www.dnd5eapi.co/api/images/monsters/' + monster.index + '.png'}
                                    alt="Picture of the monster"
                                    fill
                                    className="object-cover"
                                /> */}
                            </div>
                        </TableCell>
                        {/* MONSTER NAME */}
                        <TableCell className="font-medium">{monster.name}</TableCell>
                        {/* EDIT */}
                        <TableCell>
                            <SquarePen size={iconSize} />
                        </TableCell>
                        {/* INFO */}
                        <TableCell>
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Search size={iconSize} />
                                </HoverCardTrigger>
                                <HoverCardContent className="max-h-[300px] w-[365px]">
                                    <ScrollArea className="h-[300px]">
                                        <div>
                                        <h1 className="text-lg font-bold">Monster Name</h1>
                                        </div>
                                        {/* Size and Type, Alignment */}

                                        {/* AC, HP, Speed */}

                                        {/* Stats */}
                                        <div className='flex items-center gap-2'>
                                            <div className="flex flex-col">
                                                <span>STR</span>
                                                <span>21(+5)</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>STR</span>
                                                <span>21(+5)</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>STR</span>
                                                <span>21(+5)</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>STR</span>
                                                <span>21(+5)</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>STR</span>
                                                <span>21(+5)</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>STR</span>
                                                <span>21(+5)</span>
                                            </div>
                                        </div>

                                        {/* Saving throws, Skills, Senses, Languages, Challenge rating, Proficiency bonus */}

                                        {/* Traits */}

                                        {/* Actions */}

                                        {/* Legendary Actions */}
                                    </ScrollArea>
                                </HoverCardContent>
                            </HoverCard>
                        </TableCell>
                        {/* ADD TO ENCOUNTER */}
                        <TableCell><DiamondPlus size={iconSize} /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default LibraryReference;