"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Monster, formatAbilityScore, formatArmorClass, formatSpeed, getChallengeRatingString } from '@/types/monster';

interface MonsterPreviewProps {
    monster: Monster;
}

const MonsterPreview = ({ monster }: MonsterPreviewProps) => {
    const formatDescription = (desc: string | string[]): string => {
        return Array.isArray(desc) ? desc.join(' ') : desc;
    };

    const renderAbilityScores = () => (
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

    const renderDamageInfo = () => {
        const hasVulnerabilities = monster.damage_vulnerabilities && monster.damage_vulnerabilities.length > 0;
        const hasResistances = monster.damage_resistances && monster.damage_resistances.length > 0;
        const hasImmunities = monster.damage_immunities && monster.damage_immunities.length > 0;
        const hasConditionImmunities = monster.condition_immunities && monster.condition_immunities.length > 0;

        if (!hasVulnerabilities && !hasResistances && !hasImmunities && !hasConditionImmunities) {
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
                        <strong>Condition Immunities:</strong> {monster.condition_immunities!.map(c => typeof c === 'string' ? c : c.name).join(', ')}
                    </div>
                )}
            </div>
        );
    };

    const renderSpecialAbilities = () => {
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

    const renderActions = () => {
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

    const renderLegendaryActions = () => {
        if (!monster.legendary_actions || monster.legendary_actions.length === 0) return null;

        return (
            <div className="space-y-2">
                <h4 className="font-semibold text-sm">Legendary Actions</h4>
                <div className="text-xs text-muted-foreground mb-2">
                    The {monster.name.toLowerCase()} can take 3 legendary actions, choosing from the options below.
                </div>
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monster Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {/* Header */}
                    <div>
                        <h3 className="text-lg font-bold">{monster.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                            {monster.size} {monster.type}
                            {monster.subtype && ` (${monster.subtype})`}
                            {monster.alignment && `, ${monster.alignment}`}
                        </p>
                    </div>

                    <Separator />

                    {/* Basic Stats */}
                    <div className="space-y-1 text-sm">
                        <div><strong>Armor Class:</strong> {formatArmorClass(monster.armor_class)}</div>
                        <div><strong>Hit Points:</strong> {monster.hit_points} {monster.hit_dice && `(${monster.hit_dice})`}</div>
                        {monster.speed && (
                            <div><strong>Speed:</strong> {formatSpeed(monster.speed)}</div>
                        )}
                    </div>

                    <Separator />

                    {/* Ability Scores */}
                    {renderAbilityScores()}

                    <Separator />

                    {/* Damage Info */}
                    {renderDamageInfo()}

                    {/* Senses and Languages */}
                    <div className="space-y-1 text-sm">
                        {monster.senses && (
                            <div><strong>Senses:</strong> {typeof monster.senses === 'string' ? monster.senses : 'passive Perception 10'}</div>
                        )}
                        {monster.languages && (
                            <div><strong>Languages:</strong> {monster.languages}</div>
                        )}
                        <div>
                            <strong>Challenge:</strong> {getChallengeRatingString(monster.challenge_rating)}
                            {monster.xp && ` (${monster.xp.toLocaleString()} XP)`}
                        </div>
                        {monster.proficiency_bonus && (
                            <div><strong>Proficiency Bonus:</strong> +{monster.proficiency_bonus}</div>
                        )}
                    </div>

                    {(monster.special_abilities || monster.actions || monster.legendary_actions) && (
                        <>
                            <Separator />

                            {/* Special Abilities */}
                            {renderSpecialAbilities()}

                            {/* Actions */}
                            {renderActions()}

                            {/* Legendary Actions */}
                            {renderLegendaryActions()}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MonsterPreview;
