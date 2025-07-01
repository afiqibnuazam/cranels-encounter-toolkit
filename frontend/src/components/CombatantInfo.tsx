"use client"

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
    Combatant,
    useEncounterState,
    useEncounter
} from '@/context/EncounterContext';
import { useMonster, useCharacter } from '@/hooks/useQueries';
import {
    BaseCreature,
    formatSpeed,
    formatSenses,
    formatAbilityScore,
    getChallengeRatingString,
    formatArmorClass,
    formatUsage,
    getAbilityScoreName,
    SpellcastingProfile,
} from '@/types/creature';
import { SpellSummary, SPELL_COMPONENT_DESCRIPTIONS, SpellComponent } from '@/types/spell';
import SpellHoverCard from './hover-cards/SpellHoverCard';
import { getOrdinalSuffix } from '@/lib/utils';

const CombatantInfo = () => {
    const { combatants, isRunning, currentTurn, selectedCombatantId } = useEncounterState();
    const { clearSelectedCombatant } = useEncounter();
    const [selectedCombatant, setSelectedCombatant] = useState<Combatant | null>(null);

    // Determine which combatant to display
    const displayCombatantIndex = selectedCombatantId || (isRunning && combatants.length > 0 && currentTurn < combatants.length ? combatants[currentTurn].index : undefined);

    // Find the combatant to display
    useEffect(() => {
        if (displayCombatantIndex) {
            const combatant = combatants.find(c => c.index === displayCombatantIndex);
            setSelectedCombatant(combatant || null);
        } else {
            setSelectedCombatant(null);
        }
    }, [displayCombatantIndex, combatants]);

    // Fetch monster data if it's a monster
    const { data: fullMonster, isLoading: isLoadingMonster, error: errorMonster } = useMonster(
        selectedCombatant?.index || '',
        selectedCombatant?.source_type,
        !!selectedCombatant?.index && selectedCombatant?.unit_type === 'monster'
    );

    // Fetch character data if it's a character
    const { data: fullCharacter, isLoading: isLoadingCharacter, error: errorCharacter } = useCharacter(
        selectedCombatant?.index || '',
        !!selectedCombatant?.index && selectedCombatant?.unit_type !== 'monster'
    );

    // Combine loading and error states
    const isLoading = isLoadingMonster || isLoadingCharacter;
    const error = errorMonster || errorCharacter;
    const fullData = fullMonster || fullCharacter;

    const handleClose = () => {
        clearSelectedCombatant();
    };

    const isManuallySelected = selectedCombatantId && selectedCombatantId !== (isRunning && combatants.length > 0 && currentTurn < combatants.length ? combatants[currentTurn].index : undefined);

    // Determine header text based on state
    const getHeaderText = () => {
        if (isManuallySelected) return "Selected Combatant";
        if (isRunning) return "Active Combatant";
        return "Combatant Info";
    };

    const formatDescription = (desc: string | string[]): string => {
        return Array.isArray(desc) ? desc.join(' ') : desc;
    };

    const renderAbilityScores = (creature: BaseCreature) => (
        <div className="grid grid-cols-6 gap-2 text-center text-xs">
            <div>
                <div className="font-semibold">STR</div>
                <div>{formatAbilityScore(creature.strength)}</div>
            </div>
            <div>
                <div className="font-semibold">DEX</div>
                <div>{formatAbilityScore(creature.dexterity)}</div>
            </div>
            <div>
                <div className="font-semibold">CON</div>
                <div>{formatAbilityScore(creature.constitution)}</div>
            </div>
            <div>
                <div className="font-semibold">INT</div>
                <div>{formatAbilityScore(creature.intelligence)}</div>
            </div>
            <div>
                <div className="font-semibold">WIS</div>
                <div>{formatAbilityScore(creature.wisdom)}</div>
            </div>
            <div>
                <div className="font-semibold">CHA</div>
                <div>{formatAbilityScore(creature.charisma)}</div>
            </div>
        </div>
    );

    const renderDamageInfo = (creature: BaseCreature) => {
        const hasResistances = creature.damage_resistances && creature.damage_resistances.length > 0;
        const hasImmunities = creature.damage_immunities && creature.damage_immunities.length > 0;
        const hasVulnerabilities = creature.damage_vulnerabilities && creature.damage_vulnerabilities.length > 0;
        const hasConditionImmunities = creature.condition_immunities && creature.condition_immunities.length > 0;

        if (!hasResistances && !hasImmunities && !hasVulnerabilities && !hasConditionImmunities) {
            return null;
        }

        return (
            <div className="space-y-1 text-sm">
                {hasVulnerabilities && (
                    <div>
                        <strong>Damage Vulnerabilities:</strong> {creature.damage_vulnerabilities!.join(', ')}
                    </div>
                )}
                {hasResistances && (
                    <div>
                        <strong>Damage Resistances:</strong> {creature.damage_resistances!.join(', ')}
                    </div>
                )}
                {hasImmunities && (
                    <div>
                        <strong>Damage Immunities:</strong> {creature.damage_immunities!.join(', ')}
                    </div>
                )}
                {hasConditionImmunities && (
                    <div>
                        <strong>Condition Immunities:</strong> {creature.condition_immunities!.map(c => c.name).join(', ')}
                    </div>
                )}
            </div>
        );
    };

    const renderProficiencies = (creature: BaseCreature) => {
        if (!creature.proficiencies || creature.proficiencies.length === 0) return null;

        const savingThrows: string[] = [];
        const skills: string[] = [];

        creature.proficiencies.forEach(prof => {
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

    const renderSpecialAbilities = (creature: BaseCreature) => {
        if (!creature.special_abilities || creature.special_abilities.length === 0) return null;

        return (
            <div className="space-y-2">
                <h4 className="font-semibold text-lg text-primary">Traits</h4>
                {creature.special_abilities.map((ability, index) => {

                    if (ability.spellcasting && creature.spellcasting_profiles && creature.spellcasting_profiles.length > 0) {
                        // Use the first spellcasting profile for spellcasting abilities
                        const profile = creature.spellcasting_profiles[0];
                        return renderSpellcasting(profile, index, creature, ability.name);
                    }

                    // Format ability name with usage
                    let abilityName = ability.name;
                    if (ability.usage) {
                        const usageText = formatUsage(ability.usage);
                        abilityName = usageText ? `${ability.name} (${usageText})` : ability.name;
                    }

                    // Render normal ability
                    return (
                        <div key={index} className="text-sm">
                            <div className="font-semibold">{abilityName}</div>
                            <div className="text-muted-foreground">
                                {formatDescription(ability.desc)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderSpellcasting = (profile: SpellcastingProfile, index: number, creature: BaseCreature, customName?: string) => {
        // Combine SRD spells and custom spells
        const allSpells = [...(profile.srd_spells || []), ...(profile.spells || [])];

        if (allSpells.length === 0) return null;

        // Check if this is innate spellcasting (has spells with creature_usage)
        const isInnateSpellcasting = allSpells.some(spell => spell.creature_usage);

        // Format components description for innate spellcasting
        const formatComponentsText = () => {
            if (!profile.components_required || profile.components_required.length === 0) {
                return 'requiring no components';
            }

            if (profile.components_required.length === 1) {
                const component = profile.components_required[0] as SpellComponent;
                const componentName = SPELL_COMPONENT_DESCRIPTIONS[component].toLowerCase();
                return `requiring only ${componentName} components`;
            }

            if (profile.components_required.length === 2) {
                const allComponents: SpellComponent[] = ['V', 'S', 'M'];
                const missing = allComponents.find(c => !profile.components_required!.includes(c)) as SpellComponent;
                const missingName = SPELL_COMPONENT_DESCRIPTIONS[missing].toLowerCase();
                return `requiring no ${missingName} components`;
            }

            // All three components required
            return 'requiring verbal, somatic, and material components';
        };

        // For innate spellcasting, use the original description from special_abilities
        if (isInnateSpellcasting) {
            // Check if there's only one spell total
            const totalSpells = allSpells.length;

            if (totalSpells === 1) {
                // Single spell innate spellcasting - display differently
                const spell = allSpells[0];
                const usageText = spell.creature_usage ?
                    (spell.creature_usage.type === 'at will' || spell.creature_usage.type === 'at_will' ?
                        'at will' :
                        spell.creature_usage.type === 'per day' || spell.creature_usage.type === 'per_day' ?
                            `${spell.creature_usage.times || 1}/day` :
                            formatUsage(spell.creature_usage) || 'once'
                    ) : 'once';

                customName = customName + ` (${usageText})`;

                return (
                    <div key={index} className="text-sm">
                        <div className="font-semibold">{customName || 'Innate Spellcasting'}</div>
                        <div className="text-muted-foreground">
                            The {creature.name.toLowerCase()} can innately cast{' '}
                            <SpellHoverCard spell={spell}>
                                <span className="italic underline decoration-dashed underline-offset-2 hover:decoration-primary cursor-pointer">
                                    {spell.name}
                                </span>
                            </SpellHoverCard>
                            {spell.notes && (
                                <span className="text-muted-foreground"> ({spell.notes})</span>
                            )}
                            , {formatComponentsText()}.
                            Its innate spellcasting ability is {getAbilityScoreName(profile.ability)}
                            {profile.dc ? ` (spell save DC ${profile.dc})` : ''}.
                        </div>
                    </div>
                );
            }

            return (
                <div key={index} className="text-sm">
                    <div className="font-semibold">{customName || 'Innate Spellcasting'}</div>
                    <div className="text-muted-foreground mb-2">
                        The {creature.name.toLowerCase()}&apos;s innate spellcasting ability is {getAbilityScoreName(profile.ability)}
                        {profile.dc ? ` (spell save DC ${profile.dc}` : ''}
                        {profile.modifier ? `, +${profile.modifier} to hit with spell attacks)` : ')'}.
                        The {creature.name.toLowerCase()} can innately cast the following spells, {formatComponentsText()}:
                    </div>

                    {/* Group spells by usage type for innate spellcasting */}
                    {(() => {
                        const spellsByUsage: Record<string, SpellSummary[]> = {};

                        allSpells.forEach(spell => {
                            if (spell.creature_usage) {
                                let usageKey = '';
                                if (spell.creature_usage.type === 'at will' || spell.creature_usage.type === 'at_will') {
                                    usageKey = 'At will';
                                } else if (spell.creature_usage.type === 'per day' || spell.creature_usage.type === 'per_day') {
                                    const times = spell.creature_usage.times || 1;
                                    usageKey = times === 1 ? '1/day each' : `${times}/day each`;
                                } else {
                                    usageKey = formatUsage(spell.creature_usage) || 'Other';
                                }

                                if (!spellsByUsage[usageKey]) {
                                    spellsByUsage[usageKey] = [];
                                }
                                spellsByUsage[usageKey].push(spell);
                            }
                        });

                        // Define the order of usage types
                        const usageOrder = ['At will'];
                        const dayUsages: string[] = [];
                        const otherUsages: string[] = [];

                        // Collect and sort day-based usages by frequency (highest first)
                        Object.keys(spellsByUsage).forEach(key => {
                            if (key.includes('/day each')) {
                                dayUsages.push(key);
                            } else if (!usageOrder.includes(key)) {
                                otherUsages.push(key);
                            }
                        });

                        // Sort day usages by number (descending: 3/day, 2/day, 1/day)
                        dayUsages.sort((a, b) => {
                            const aNum = parseInt(a.split('/')[0]) || 0;
                            const bNum = parseInt(b.split('/')[0]) || 0;
                            return bNum - aNum;
                        });

                        const sortedUsageKeys = [
                            ...usageOrder.filter(key => spellsByUsage[key]),
                            ...dayUsages,
                            ...otherUsages
                        ];

                        return sortedUsageKeys.map(usageKey => {
                            const spells = spellsByUsage[usageKey];
                            if (!spells || spells.length === 0) return null;

                            return (
                                <div key={usageKey} className="mb-1">
                                    <span className="font-medium">{usageKey}:</span>
                                    <span className="ml-1">
                                        {spells.map((spell, spellIndex) => (
                                            <span key={spellIndex}>
                                                <SpellHoverCard spell={spell}>
                                                    <span className="italic underline decoration-dashed underline-offset-2 hover:decoration-primary cursor-pointer">
                                                        {spell.name}
                                                    </span>
                                                </SpellHoverCard>
                                                {spell.notes && (
                                                    <span className="text-muted-foreground"> ({spell.notes})</span>
                                                )}
                                                {spellIndex < spells.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </span>
                                </div>
                            );
                        });
                    })()}
                </div>
            );
        }

        // Traditional spellcasting - group by spell level
        const spellsByLevel = allSpells.reduce((acc: Record<number, SpellSummary[]>, spell: SpellSummary) => {
            const level = spell.level || 0;
            if (!acc[level]) acc[level] = [];
            acc[level].push(spell);
            return acc;
        }, {} as Record<number, SpellSummary[]>);

        // Use the utility function for ability name
        const abilityName = getAbilityScoreName(profile.ability);

        return (
            <div key={index} className="text-sm">
                <div className="font-semibold">{customName || 'Spellcasting'}</div>
                <div className="text-muted-foreground mb-2">
                    The {creature.name.toLowerCase()} is a {profile.level ? `${profile.level}${getOrdinalSuffix(profile.level)}-level` : '1st-level'} spellcaster.
                    Its spellcasting ability is {abilityName} (spell save DC {profile.dc || 'Unknown'}{profile.modifier !== undefined && profile.modifier >= 0 ? `, +${profile.modifier}` : profile.modifier !== undefined ? `, ${profile.modifier}` : ''} to hit with spell attacks).
                    The {creature.name.toLowerCase()} has the following {profile.school || 'cleric'} spells prepared:
                </div>

                {/* Render spells by level for traditional spellcasting */}
                {Object.keys(spellsByLevel)
                    .map(Number)
                    .sort((a, b) => a - b)
                    .map(level => {
                        const spells = spellsByLevel[level];
                        const levelSlots = profile.slots?.[level.toString()];

                        if (!spells || spells.length === 0) return null;

                        return (
                            <div key={level} className="mb-1">
                                <span className="font-medium">
                                    {level === 0 ? 'Cantrips (at will)' : `${level}${getOrdinalSuffix(level)} level${levelSlots ? ` (${levelSlots} slots)` : ''}`}:
                                </span>
                                <span className="ml-1">
                                    {spells.map((spell, spellIndex) => (
                                        <span key={spellIndex}>
                                            <SpellHoverCard spell={spell}>
                                                <span className="italic underline decoration-dashed underline-offset-2 hover:decoration-primary cursor-pointer">
                                                    {spell.name}
                                                </span>
                                            </SpellHoverCard>
                                            {spell.notes && (
                                                <span className="text-muted-foreground"> ({spell.notes})</span>
                                            )}
                                            {spellIndex < spells.length - 1 && ', '}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        );
                    })}
            </div>
        );
    };

    const renderActions = (creature: BaseCreature) => {
        if (!creature.actions || creature.actions.length === 0) return null;

        return (
            <div className="space-y-2">
                <h4 className="font-semibold text-lg text-primary">Actions</h4>
                {creature.actions.map((action, index) => (
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

    const renderLegendaryActions = (creature: BaseCreature) => {
        if (!creature.legendary_actions || creature.legendary_actions.length === 0) return null;

        return (
            <div className="space-y-2">
                <h4 className="font-semibold text-lg text-primary">Legendary Actions</h4>
                {creature.legendary_actions.map((action, index) => (
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

    const renderReactions = (creature: BaseCreature) => {
        if (!creature.reactions || creature.reactions.length === 0) return null;

        return (
            <div className="space-y-2">
                <h4 className="font-semibold text-lg text-primary">Reactions</h4>
                {creature.reactions.map((action, index) => (
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

    // Show creature details if we have full data
    const showCreatureDetails = fullData && !isLoading && !error;

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
                            {showCreatureDetails && 'size' in fullData && fullData.size && `${fullData.size} `}
                            {showCreatureDetails && 'type' in fullData && fullData.type}
                            {showCreatureDetails && 'subtype' in fullData && fullData.subtype && ` (${fullData.subtype})`}
                            {showCreatureDetails && 'alignment' in fullData && fullData.alignment && `, ${fullData.alignment}`}
                            {!showCreatureDetails && selectedCombatant.unit_type && selectedCombatant.unit_type.replace('_', ' ')}
                        </p>
                        <div className="text-sm"><strong>Current HP:</strong> {selectedCombatant.current_hit_points} / {selectedCombatant.max_hit_points}</div>
                    </div>
                )}
            </div>
            <ScrollArea className="h-[calc(100vh-256px)] pr-4">
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
                        <div><strong>Armor Class:</strong> {formatArmorClass(fullData && 'armor_class' in fullData ? fullData.armor_class : undefined)}</div>
                        {selectedCombatant.temporary_hit_points > 0 && (
                            <div><strong>Temporary HP:</strong> {selectedCombatant.temporary_hit_points}</div>
                        )}
                        {showCreatureDetails && fullData && 'speed' in fullData && fullData.speed && (
                            <div><strong>Speed:</strong> {formatSpeed(fullData.speed)}</div>
                        )}
                    </div>

                    {showCreatureDetails && fullData && 'strength' in fullData && (
                        <>
                            <Separator />

                            {/* Ability Scores */}
                            {renderAbilityScores(fullData as BaseCreature)}

                            <Separator />

                            {/* Proficiencies */}
                            {renderProficiencies(fullData as BaseCreature)}

                            {/* Damage Info */}
                            {renderDamageInfo(fullData as BaseCreature)}

                            {/* Senses and Languages */}
                            <div className="space-y-1 text-sm">
                                {fullData && 'senses' in fullData && fullData.senses && (
                                    <div><strong>Senses:</strong> {formatSenses(fullData.senses)}</div>
                                )}
                                {fullData && 'languages' in fullData && fullData.languages && (
                                    <div><strong>Languages:</strong> {fullData.languages}</div>
                                )}
                                {fullData && 'challenge_rating' in fullData && fullData.challenge_rating !== undefined && (
                                    <div>
                                        <strong>Challenge:</strong> {getChallengeRatingString(fullData.challenge_rating)}
                                        {fullData && 'xp' in fullData && fullData.xp && ` (${fullData.xp.toLocaleString()} XP)`}
                                    </div>
                                )}
                            </div>

                            {((fullData && 'special_abilities' in fullData && fullData.special_abilities) ||
                                (fullData && 'actions' in fullData && fullData.actions) ||
                                (fullData && 'legendary_actions' in fullData && fullData.legendary_actions) ||
                                (fullData && 'reactions' in fullData && fullData.reactions)) && (
                                    <>
                                        <Separator />

                                        {/* Special Abilities */}
                                        {renderSpecialAbilities(fullData as BaseCreature)}

                                        {/* Actions */}
                                        {fullData && 'actions' in fullData && fullData.actions && fullData.actions.length > 0 && (
                                            <>
                                                <Separator />
                                                {renderActions(fullData as BaseCreature)}
                                            </>
                                        )}

                                        {/* Legendary Actions */}
                                        {fullData && 'legendary_actions' in fullData && fullData.legendary_actions && fullData.legendary_actions.length > 0 && (
                                            <>
                                                <Separator />
                                                {renderLegendaryActions(fullData as BaseCreature)}
                                            </>
                                        )}

                                        {/* Reactions */}
                                        {fullData && 'reactions' in fullData && fullData.reactions && fullData.reactions.length > 0 && (
                                            <>
                                                <Separator />
                                                {renderReactions(fullData as BaseCreature)}
                                            </>
                                        )}
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
