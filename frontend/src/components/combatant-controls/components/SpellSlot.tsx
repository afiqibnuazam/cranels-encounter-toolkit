import { cn } from "@/lib/utils";
import { Square, Squircle } from "lucide-react";

interface SpellSlotProps {
    spellLevel: number;
    totalSlots: number;
    usedSlots: number;
}

export default function SpellSlot({ spellLevel, totalSlots, usedSlots }: SpellSlotProps) {
    // Roman numerals for spell levels (1-indexed)
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

    // Calculate available slots
    const availableSlots = Math.max(0, totalSlots - usedSlots);

    // Don't render if there are no spell slots for this level
    if (totalSlots === 0) return null;

    return (
        <div className="relative">
            {/* Roman numeral label on top border */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-accent">
                <span className="font-heading">{romanNumerals[spellLevel]}</span>
            </div>
            {/* Spell slot container */}
            <div className="w-10 h-10 border-2 border-gray-800 bg-primary-foreground rounded flex flex-wrap items-center justify-center p-1 gap-0.5 shadow-md">
                {/* Spell slot squares - render based on total slots */}
                {Array.from({ length: totalSlots }).map((_, slotIndex) => (
                    // <div
                    //     key={slotIndex}
                    //     className={cn(
                    //         "w-[10px] h-[10px] rounded-xs border-2 border-primary",
                    //         slotIndex < usedSlots
                    //             ? 'bg-primary-foreground' // Used slot (empty)
                    //             : 'bg-primary' // Available slot (filled)
                    //     )}
                    // />
                    <Square
                        key={slotIndex}
                        size={12}
                        className={cn(
                            slotIndex < usedSlots
                                ? 'fill-primary-foreground'
                                : 'fill-primary'
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
