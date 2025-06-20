"use client"

import { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import {
    Monster,
    MonsterSummary,
    formatArmorClass,
    formatSpeed,
    formatSenses,
    formatAbilityScore,
    getChallengeRatingString
} from '@/types/monster';
import { useMonster } from '@/hooks/useQueries';

interface MonsterHoverCardProps {
    monster: MonsterSummary;
}

const MonsterHoverCard = ({ monster }: MonsterHoverCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: fullMonster, isLoading, error } = useMonster(monster.index, monster.data_source, isOpen);


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
                        <strong>Damage Vulnerabilities:</strong> {monster.damage_vulnerabilities!.map(v => v.name).join(', ')}
                    </div>
                )}
                {hasResistances && (
                    <div>
                        <strong>Damage Resistances:</strong> {monster.damage_resistances!.map(r => r.name).join(', ')}
                    </div>
                )}
                {hasImmunities && (
                    <div>
                        <strong>Damage Immunities:</strong> {monster.damage_immunities!.map(i => i.name).join(', ')}
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
                <h4 className="font-semibold text-sm">Special Abilities</h4>
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
                <h4 className="font-semibold text-sm">Actions</h4>
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
                <h4 className="font-semibold text-sm">Legendary Actions</h4>
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

    // TODO: Fix UI
    return (
        <HoverCard
            open={isOpen} 
            onOpenChange={setIsOpen}
            openDelay={100}
        >
            <HoverCardTrigger asChild>
                <Search size={18} className="hover:text-primary" />
            </HoverCardTrigger>
            <HoverCardContent
                className="w-[400px]"
            >
                <ScrollArea className="h-[400px]" onWheel={(e) => e.stopPropagation()}>
                    <div className="space-y-3">
                        {/* Header */}
                        <div>
                            <h3 className="text-lg font-bold">{monster.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                                {fullMonster?.size} {fullMonster?.type}{fullMonster?.alignment && `, ${fullMonster.alignment}`}
                            </p>
                        </div>

                        <Separator />

                        {isLoading && (
                            <div className="text-center text-sm text-muted-foreground py-4">
                                Loading monster details...
                            </div>
                        )}

                        {error && (
                            <div className="text-center text-sm text-destructive py-4">
                                Error: {error.message}
                            </div>
                        )}

                        {!isLoading && !error && (
                            <>
                                {/* Basic Stats */}
                                <div className="space-y-1 text-sm">
                                    <div><strong>Armor Class:</strong> {formatArmorClass(fullMonster?.armor_class)}</div>
                                    <div><strong>Hit Points:</strong> {fullMonster?.hit_points}</div>
                                    {fullMonster?.speed && (
                                        <div><strong>Speed:</strong> {formatSpeed(fullMonster.speed)}</div>
                                    )}
                                </div>

                                {fullMonster && (
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

                                                {/* Actions */}
                                                {renderActions(fullMonster)}

                                                {/* Legendary Actions */}
                                                {renderLegendaryActions(fullMonster)}
                                            </>
                                        )}
                                    </>
                                )}

                                {/* Source */}
                                {monster.source && (
                                    <>
                                        <Separator />
                                        <div className="flex justify-end">
                                            <span className="text-xs px-2 py-1 rounded border text-muted-foreground">
                                                {monster.source}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </ScrollArea>
            </HoverCardContent>
        </HoverCard>
    );
};

export default MonsterHoverCard;
