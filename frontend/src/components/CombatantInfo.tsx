"use client"

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
    LocalCombatant,
    useEncounterState,
    useEncounter
} from '@/context/EncounterContext';
import { useMonster } from '@/hooks/useQueries';
import {
    Monster,
    formatSpeed,
    formatSenses,
    formatAbilityScore,
    getChallengeRatingString,
    formatArmorClass
} from '@/types/monster';

const CombatantInfo = () => {
    const { combatants, isRunning, currentTurn, selectedCombatantId } = useEncounterState();
    const { clearSelectedCombatant } = useEncounter();
    const [selectedCombatant, setSelectedCombatant] = useState<LocalCombatant | null>(null);

    // Determine which combatant to display
    const displayCombatantId = selectedCombatantId || (isRunning && combatants.length > 0 && currentTurn < combatants.length ? combatants[currentTurn].id : undefined);

    // Find the combatant to display
    useEffect(() => {
        if (displayCombatantId) {
            const combatant = combatants.find(c => c.id === displayCombatantId);
            setSelectedCombatant(combatant || null);
        } else {
            setSelectedCombatant(null);
        }
    }, [displayCombatantId, combatants]);

    // Fetch monster data if it's a monster
    const { data: fullMonster, isLoading, error } = useMonster(
        selectedCombatant?.index || '',
        selectedCombatant?.source_type,
        !!selectedCombatant?.index
    );

    const handleClose = () => {
        clearSelectedCombatant();
    };

    const isManuallySelected = selectedCombatantId && selectedCombatantId !== (isRunning && combatants.length > 0 && currentTurn < combatants.length ? combatants[currentTurn].id : undefined);

    // Determine header text based on state
    const getHeaderText = () => {
        if (isManuallySelected) return "Selected Combatant";
        if (isRunning) return "Active Combatant";
        return "Combatant Info";
    };

    const formatDescription = (desc: string | string[]): string => {
        return Array.isArray(desc) ? desc.join(' ') : desc;
    };

    const renderAbilityScores = (monster: Monster) => (
        <div className="grid grid-cols-6 gap-2 text-center text-xs">
            <div>
                <div className="font-semibold">STR</div>
                <div>{formatAbilityScore(monster.strength)}</div>
            </div>
            <div>
                <div className="font-semibold">DEX</div>
                <div>{formatAbilityScore(monster.dexterity)}</div>
            </div>
            <div>
                <div className="font-semibold">CON</div>
                <div>{formatAbilityScore(monster.constitution)}</div>
            </div>
            <div>
                <div className="font-semibold">INT</div>
                <div>{formatAbilityScore(monster.intelligence)}</div>
            </div>
            <div>
                <div className="font-semibold">WIS</div>
                <div>{formatAbilityScore(monster.wisdom)}</div>
            </div>
            <div>
                <div className="font-semibold">CHA</div>
                <div>{formatAbilityScore(monster.charisma)}</div>
            </div>
        </div>
    );

    const renderDamageInfo = (monster: Monster) => {
        const hasResistances = monster.damage_resistances && monster.damage_resistances.length > 0;
        const hasImmunities = monster.damage_immunities && monster.damage_immunities.length > 0;
        const hasVulnerabilities = monster.damage_vulnerabilities && monster.damage_vulnerabilities.length > 0;
        const hasConditionImmunities = monster.condition_immunities && monster.condition_immunities.length > 0;

        if (!hasResistances && !hasImmunities && !hasVulnerabilities && !hasConditionImmunities) {
            return null;
        }

        return (
            <div className="space-y-1 text-sm">
                {hasVulnerabilities && (
                    <div>
                        <strong>Damage Vulnerabilities:</strong> {monster.damage_vulnerabilities!.join(', ')}
                    </div>
                )}
                {hasResistances && (
                    <div>
                        <strong>Damage Resistances:</strong> {monster.damage_resistances!.join(', ')}
                    </div>
                )}
                {hasImmunities && (
                    <div>
                        <strong>Damage Immunities:</strong> {monster.damage_immunities!.join(', ')}
                    </div>
                )}
                {hasConditionImmunities && (
                    <div>
                        <strong>Condition Immunities:</strong> {monster.condition_immunities!.map(c => c.name).join(', ')}
                    </div>
                )}
            </div>
        );
    };

    const renderProficiencies = (monster: Monster) => {
        if (!monster.proficiencies || monster.proficiencies.length === 0) return null;

        const savingThrows: string[] = [];
        const skills: string[] = [];

        monster.proficiencies.forEach(prof => {
            if (prof.proficiency.name.startsWith('Saving Throw:')) {
                const ability = prof.proficiency.name.replace('Saving Throw: ', '');
                savingThrows.push(`${ability} +${prof.value}`);
            } else if (prof.proficiency.name.startsWith('Skill:')) {
                const skill = prof.proficiency.name.replace('Skill: ', '');
                skills.push(`${skill} +${prof.value}`);
            }
        });

        return (
            <div className="space-y-1 text-sm">
                {savingThrows.length > 0 && (
                    <div><strong>Saving Throws:</strong> {savingThrows.join(', ')}</div>
                )}
                {skills.length > 0 && (
                    <div><strong>Skills:</strong> {skills.join(', ')}</div>
                )}
            </div>
        );
    };

    const renderSpecialAbilities = (monster: Monster) => {
        if (!monster.special_abilities || monster.special_abilities.length === 0) return null;

        return (
            <div className="space-y-2">
                <h4 className="font-semibold text-lg text-primary">Special Abilities</h4>
                {monster.special_abilities.map((ability, index) => (
                    <div key={index} className="text-sm">
                        <div className="font-semibold">{ability.name}</div>
                        <div className="text-muted-foreground">
                            {formatDescription(ability.desc)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderActions = (monster: Monster) => {
        if (!monster.actions || monster.actions.length === 0) return null;

        return (
            <div className="space-y-2">
                <h4 className="font-semibold text-lg text-primary">Actions</h4>
                {monster.actions.map((action, index) => (
                    <div key={index} className="text-sm">
                        <div className="font-semibold">{action.name}</div>
                        <div className="text-muted-foreground">
                            {formatDescription(action.desc)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderLegendaryActions = (monster: Monster) => {
        if (!monster.legendary_actions || monster.legendary_actions.length === 0) return null;

        return (
            <div className="space-y-2">
                <h4 className="font-semibold text-lg text-primary">Legendary Actions</h4>
                {monster.legendary_actions.map((action, index) => (
                    <div key={index} className="text-sm">
                        <div className="font-semibold">{action.name}</div>
                        <div className="text-muted-foreground">
                            {formatDescription(action.desc)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (!selectedCombatant) {
        return (
            <>
                <h1 className="text-2xl font-light">{getHeaderText()}</h1>
                <div className="h-full flex items-center justify-center text-muted-foreground">
                    <p>No combatant selected</p>
                </div>
            </>
        );
    }

    // Show basic combatant info even if it's not a monster or if loading fails
    const showMonsterDetails = fullMonster && !isLoading && !error;

    return (
        <div className="h-full">
            {/* Header */}
            <div className="pb-2">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-light">{getHeaderText()}</h1>
                    {isManuallySelected && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            title="Return to current turn"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                {selectedCombatant && (
                    <div className="flex-1">
                        <h3 className="text-3xl text-primary font-bold">{selectedCombatant.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                            {showMonsterDetails && fullMonster.size && `${fullMonster.size} `}
                            {showMonsterDetails && fullMonster.type}
                            {showMonsterDetails && fullMonster.alignment && `, ${fullMonster.alignment}`}
                            {!showMonsterDetails && selectedCombatant.unit_type && selectedCombatant.unit_type.replace('_', ' ')}
                        </p>
                        <div className="text-sm"><strong>Current HP:</strong> {selectedCombatant.current_hit_points} / {selectedCombatant.max_hit_points}</div>
                    </div>
                )}
            </div>
            <ScrollArea className="h-[512px] pr-4">
                <div className="space-y-3">
                    {/* Combatant Details */}
                    <Separator />

                    {isLoading && (
                        <div className="text-center text-sm text-muted-foreground py-4">
                            Loading combatant details...
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-sm text-destructive py-4">
                            Error loading details: {error.message}
                        </div>
                    )}

                    {/* Basic combat stats */}
                    <div className="space-y-1 text-sm">
                        <div><strong>Armor Class:</strong> {formatArmorClass(fullMonster?.armor_class)}</div>
                        {selectedCombatant.temporary_hit_points > 0 && (
                            <div><strong>Temporary HP:</strong> {selectedCombatant.temporary_hit_points}</div>
                        )}
                        {showMonsterDetails && fullMonster.speed && (
                            <div><strong>Speed:</strong> {formatSpeed(fullMonster.speed)}</div>
                        )}
                    </div>

                    {showMonsterDetails && (
                        <>
                            <Separator />

                            {/* Ability Scores */}
                            {renderAbilityScores(fullMonster)}

                            <Separator />

                            {/* Proficiencies */}
                            {renderProficiencies(fullMonster)}

                            {/* Damage Info */}
                            {renderDamageInfo(fullMonster)}

                            {/* Senses and Languages */}
                            <div className="space-y-1 text-sm">
                                {fullMonster.senses && (
                                    <div><strong>Senses:</strong> {formatSenses(fullMonster.senses)}</div>
                                )}
                                {fullMonster.languages && (
                                    <div><strong>Languages:</strong> {fullMonster.languages}</div>
                                )}
                                <div>
                                    <strong>Challenge:</strong> {getChallengeRatingString(fullMonster.challenge_rating)}
                                    {fullMonster.xp && ` (${fullMonster.xp.toLocaleString()} XP)`}
                                </div>
                            </div>

                            {(fullMonster.special_abilities || fullMonster.actions || fullMonster.legendary_actions) && (
                                <>
                                    <Separator />

                                    {/* Special Abilities */}
                                    {renderSpecialAbilities(fullMonster)}

                                    <Separator />

                                    {/* Actions */}
                                    {renderActions(fullMonster)}

                                    <Separator />

                                    {/* Legendary Actions */}
                                    {renderLegendaryActions(fullMonster)}
                                </>
                            )}
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default CombatantInfo;
