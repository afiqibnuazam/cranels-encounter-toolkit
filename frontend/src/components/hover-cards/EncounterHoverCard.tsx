import { Search } from 'lucide-react'
import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { EncounterSummary } from '@/types';

interface EncounterHoverCardProps {
    encounter: EncounterSummary;
}

export default function EncounterHoverCard({ encounter }: EncounterHoverCardProps) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Search size={18} />
            </HoverCardTrigger>
            <HoverCardContent className="w-[365px]">
                <ScrollArea className="h-[300px] pr-4">
                    <div>
                        <h1 className="text-lg font-bold">{encounter.name}</h1>
                        {encounter.notes && (
                            <p className="text-sm mt-2">{encounter.notes}</p>
                        )}
                        <div className="mt-4 space-y-1">
                            <p className="text-sm"><strong>Status:</strong> {encounter.status || "Draft"}</p>
                        </div>
                    </div>
                </ScrollArea>
            </HoverCardContent>
        </HoverCard>
    )
}
