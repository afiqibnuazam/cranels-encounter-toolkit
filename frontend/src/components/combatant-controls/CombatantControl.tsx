import React, { useEffect, useState } from 'react';
import SpellSlot from './components/SpellSlot';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useEncounterState, useEncounter, Combatant } from '@/context/EncounterContext';
import HealthBar from './components/HealthBar';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';
import { useMonster, useCharacter } from '@/hooks/useQueries';
import { ActionIcon, BonusActionIcon, InitiativeIcon, ReactionIcon } from '../icons/CombatIcons';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';

export default function CombatantControl() {
    const { combatants, isRunning, currentTurn, selectedCombatantId } = useEncounterState();
    const { nextTurn } = useEncounter();
    const [selectedCombatant, setSelectedCombatant] = useState<Combatant | null>(null);

    // Determine which combatant to display - priority to selected, then current turn
    const displayCombatantIndex = selectedCombatantId || (isRunning && combatants.length > 0 && currentTurn < combatants.length ? combatants[currentTurn].index : undefined);

    useEffect(() => {
        if (displayCombatantIndex) {
            const combatant = combatants.find(c => c.index === displayCombatantIndex);
            setSelectedCombatant(combatant || null);
        } else {
            setSelectedCombatant(null);
        }
    }, [displayCombatantIndex, combatants]);

    // Fetch monster data if it's a monster
    const { data: fullMonster } = useMonster(
        selectedCombatant?.index || '',
        selectedCombatant?.source_type,
        !!selectedCombatant?.index && selectedCombatant?.unit_type === 'monster'
    );

    // Fetch character data if it's a character
    const { data: fullCharacter } = useCharacter(
        selectedCombatant?.index || '',
        !!selectedCombatant?.index && selectedCombatant?.unit_type !== 'monster'
    );

    const fullData = fullMonster || fullCharacter;

    // The active combatant is the one being displayed (which could be selected or current turn)
    const activeCombatant = selectedCombatant;

    // Get spell slot data from fetched data (total available slots)
    const primarySpellcastingProfile = (fullData && 'spellcasting_profiles' in fullData ? fullData.spellcasting_profiles?.[0] : undefined);

    // Get total slots from Monster/Unit template
    const totalSlots = primarySpellcastingProfile?.slots || {};

    // Get used slots from Combatant instance
    const usedSlots = activeCombatant?.used_spell_slots || {};

    // Convert to display format
    const spellSlotsByLevel: { level: number; total: number; used: number }[] = [];

    for (let level = 1; level <= 9; level++) {
        const levelKey = level.toString();
        const totalSlotsForLevel = totalSlots[levelKey] || 0;
        const usedSlotsForLevel = usedSlots[levelKey] || 0;

        if (totalSlotsForLevel > 0) {
            spellSlotsByLevel.push({
                level,
                total: totalSlotsForLevel,
                used: Math.min(usedSlotsForLevel, totalSlotsForLevel)
            });
        }
    }

    // Get conditions/effects count
    const activeConditionsCount = activeCombatant?.effects?.length || 0;
    const isConcentrating = activeCombatant?.effects?.some(effect => effect.concentration) || false;

    // Check if the displayed combatant is the one whose turn it currently is
    const isCurrentTurn = isRunning && combatants.length > 0 && currentTurn >= 0 && 
                         activeCombatant?.index === combatants[currentTurn]?.index;
    
    // Check if the displayed combatant is manually selected (and not just the current turn)
    const isSelectedCombatant = selectedCombatantId && !isCurrentTurn;

    return (
        <div className="relative h-full">
            {/* Circular element on the left */}
            <Avatar className={cn(
                "w-40 h-40 absolute top-0 left-0 border-4",
                isCurrentTurn && "border-primary",
                isSelectedCombatant && "border-accent"
            )}>
                <AvatarImage src={fullData && 'image_url' in fullData ? fullData.image_url as string : undefined} />
                <AvatarFallback>
                    {activeCombatant ? activeCombatant.name.slice(0, 2).toUpperCase() : "N/A"}
                </AvatarFallback>
            </Avatar>

            {/* Three rectangular sections on the right */}
            <div className="h-full flex flex-col">

                {/* Row 1: Spell Slots + Condition Indicator */}
                <div className="relative h-[30%] w-full flex">
                    <div className="w-40" />
                    <div className="w-[calc(100%-160px)] flex items-center justify-between pb-2">
                        {/* Spell Slots */}
                        <div className="flex gap-1">
                            {spellSlotsByLevel.map((slotData) => (
                                <SpellSlot
                                    key={slotData.level}
                                    spellLevel={slotData.level - 1} // Convert to 0-indexed for roman numerals
                                    totalSlots={slotData.total}
                                    usedSlots={slotData.used}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center gap-2">
                            {/* Concentrating Indicator */}
                            {isConcentrating && (
                                <div className="w-10 h-10 bg-blue-600 border-2 border-blue-400 rounded-full flex items-center justify-center">
                                    <Eye />
                                </div>
                            )}

                            {/* Active Condition Indicator */}
                            {combatants.length > 0 && (
                                <div className="w-10 h-10 bg-blue-600 border-2 border-blue-400 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">{activeConditionsCount}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 2: HP Bar */}
                <div className="h-[35%] flex">
                    <div className="w-[80px]" />
                    <div className="w-[80px] bg-primary-foreground" />
                    <div className="w-[calc(100%-160px)] bg-primary-foreground flex flex-col items-center p-2 rounded-tr-md">
                        <HealthBar
                            currentHealth={activeCombatant?.current_hit_points || 0}
                            maxHealth={activeCombatant?.max_hit_points || 0}
                            tempHealth={activeCombatant?.temporary_hit_points || 0}
                        />
                    </div>
                </div>

                {/* Row 3: Action Buttons */}
                <div className="h-[35%] flex">
                    <div className="w-[80px]" />
                    <div className="w-[80px] bg-primary-foreground" />
                    <div className="w-[calc(100%-160px)] bg-primary-foreground flex items-center justify-between p-2 rounded-br-md">
                        <div className="flex gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        disabled={!isCurrentTurn}
                                        className="cursor-pointer"
                                        variant="secondary"
                                        size="icon"
                                    >
                                        <ActionIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Action
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        disabled={!isCurrentTurn}
                                        className="cursor-pointer"
                                        variant="secondary"
                                        size="icon"
                                    >
                                        <BonusActionIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Bonus Action
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        disabled={!isRunning}
                                        className="cursor-pointer"
                                        variant="secondary"
                                        size="icon"
                                    >
                                        <ReactionIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Reaction
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        disabled={!isCurrentTurn}
                                        className="cursor-pointer"
                                        variant="secondary"
                                    >
                                        Legendary Action
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Legendary Action (end of other creatures&apos; turns)
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        disabled={!isCurrentTurn}
                                        className="cursor-pointer"
                                        variant="secondary"
                                    >
                                        Mythic Action
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Mythic Action (creature&apos;s turn)
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={nextTurn}
                                    disabled={!isRunning || !isCurrentTurn}
                                    variant={isRunning && isCurrentTurn ? "default" : "secondary"}
                                    className="cursor-pointer"
                                >
                                    <InitiativeIcon className="w-5 h-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                End Turn
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}
