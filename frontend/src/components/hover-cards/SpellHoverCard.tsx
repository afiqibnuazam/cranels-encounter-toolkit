import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from "@/components/ui/hover-card"
import { ScrollArea } from "../ui/scroll-area"
import { Search } from "lucide-react"
import { SpellSummary } from "@/types/spell"
import { useState } from "react"
import { useSpell } from "@/hooks/useQueries"
import { Separator } from "../ui/separator"

interface SpellHoverCardProps {
    spell: SpellSummary;
    children?: React.ReactNode;
}

const SpellHoverCard = ({ spell, children }: SpellHoverCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: fullSpell, isLoading, error } = useSpell(spell.index, spell.data_source, isOpen);

    // TODO: Fix UI
    return (
        <HoverCard open={isOpen} onOpenChange={setIsOpen}>
            <HoverCardTrigger asChild>
                {children || <Search size={18} className="hover:text-primary" />}
            </HoverCardTrigger>
            <HoverCardContent className="w-[365px] py-4 pr-2 pl-4">
                <ScrollArea className="h-[300px] pr-4" onWheel={(e) => e.stopPropagation()}>
                    <div className="space-y-3">
                        {/* Header */}
                        <div>
                            <h1 className="text-xl text-primary font-bold">{spell.name}</h1>
                            <p className="text-sm text-muted-foreground">
                                {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} {spell.school}
                                {fullSpell?.ritual && ' (ritual)'}
                            </p>
                        </div>

                        <Separator />

                        {/* Basic Info */}
                        <div className="space-y-1 text-sm">
                            {fullSpell?.casting_time && (
                                <p><strong>Casting Time:</strong> {fullSpell?.casting_time}</p>
                            )}
                            {fullSpell?.range && (
                                <p><strong>Range:</strong> {fullSpell?.range}</p>
                            )}
                            {fullSpell?.concentration && (
                                <p><strong>Concentration:</strong> Yes</p>
                            )}
                        </div>

                        {/* Loading state */}
                        {isLoading && (
                            <p className="text-sm text-muted-foreground">Loading spell details...</p>
                        )}

                        <Separator />

                        {/* Full spell details if available */}
                        {fullSpell && !isLoading && (
                            <div className="space-y-2 text-sm">
                                {fullSpell.components && fullSpell.components.length > 0 && (
                                    <p><strong>Components:</strong> {fullSpell.components.join(', ')}</p>
                                )}
                                {fullSpell.material && (
                                    <p><strong>Material:</strong> {fullSpell.material}</p>
                                )}
                                {fullSpell.duration && (
                                    <p><strong>Duration:</strong> {fullSpell.duration}</p>
                                )}

                                <Separator className="!h-[2px]" />

                                {fullSpell.desc && fullSpell.desc.length > 0 && (
                                    <div>
                                        {fullSpell.desc.map((paragraph: string, index: number) => (
                                            <p key={index} className="mt-1 text-justify">{paragraph}</p>
                                        ))}
                                    </div>
                                )}
                                {fullSpell.higher_level && fullSpell.higher_level.length > 0 && (
                                    <div>
                                        <strong>At Higher Levels:</strong>
                                        {fullSpell.higher_level.map((paragraph: string, index: number) => (
                                            <p key={index} className="mt-1 text-justify">{paragraph}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </HoverCardContent>
        </HoverCard>
    )
}

export default SpellHoverCard