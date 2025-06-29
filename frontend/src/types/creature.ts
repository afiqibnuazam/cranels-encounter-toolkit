"use client"

import { SpellSummary } from './spell';

// ===== ENUMS =====

export enum CreatureSize {
    Tiny = 'tiny',
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    Huge = 'huge',
    Gargantuan = 'gargantuan',
}

export enum CreatureType {
    Aberration = 'aberration',
    Beast = 'beast',
    Celestial = 'celestial',
    Construct = 'construct',
    Dragon = 'dragon',
    Elemental = 'elemental',
    Fey = 'fey',
    Fiend = 'fiend',
    Giant = 'giant',
    Humanoid = 'humanoid',
    Monstrosity = 'monstrosity',
    Ooze = 'ooze',
    Plant = 'plant',
    Undead = 'undead',
}

export enum CreatureAlignment {
    LawfulGood = 'lawful good',
    NeutralGood = 'neutral good',
    ChaoticGood = 'chaotic good',
    LawfulNeutral = 'lawful neutral',
    Neutral = 'neutral',
    ChaoticNeutral = 'chaotic neutral',
    LawfulEvil = 'lawful evil',
    NeutralEvil = 'neutral evil',
    ChaoticEvil = 'chaotic evil',
    Unaligned = 'unaligned',
    Any = 'any alignment',
    AnyEvil = 'any evil alignment',
    AnyGood = 'any good alignment',
    AnyChaotic = 'any chaotic alignment',
    AnyLawful = 'any lawful alignment',
    AnyNonGood = 'any non-good alignment',
    AnyNonLawful = 'any non-lawful alignment',
    TypicallyChaoticNeutral = 'typically chaotic neutral',
    TypicallyNeutralGood = 'typically neutral good',
    TypicallyLawfulGood = 'typically lawful good',
    TypicallyChaoticEvil = 'typically chaotic evil',
    TypicallyNeutralEvil = 'typically neutral evil',
    TypicallyChaoticGood = 'typically chaotic good',
    TypicallyNeutral = 'typically neutral',
    TypicallyLawfulEvil = 'typically lawful evil',
    TypicallyLawfulNeutral = 'typically lawful neutral',
    AnyNeutral = 'any neutral alignment',
    AnyNonChaotic = 'any non-chaotic alignment',
}

export enum ArmorType {
    None = 'none',
    NaturalArmor = 'natural',
    MageArmor = 'mage',
    Padded = 'padded',
    Leather = 'leather',
    StuddedLeather = 'studded leather',
    Hide = 'hide',
    ChainShirt = 'chain shirt',
    ScaleMail = 'scale mail',
    Breastplate = 'breastplate',
    HalfPlate = 'half plate',
    RingMail = 'ring mail',
    ChainMail = 'chain mail',
    Splint = 'splint',
    Plate = 'plate',
    Shield = 'shield',
    Other = 'other',
}

export enum Sense {
    Blindsight = 'blindsight',
    Darkvision = 'darkvision',
    Tremorsense = 'tremorsense',
    Truesight = 'truesight',
    PassivePerception = 'passive perception',
}

export enum AbilityScore {
    Strength = 'str',
    Dexterity = 'dex',
    Constitution = 'con',
    Intelligence = 'int',
    Wisdom = 'wis',
    Charisma = 'cha',
}

export enum Skill {
    Acrobatics = 'acrobatics',
    AnimalHandling = 'animal handling',
    Arcana = 'arcana',
    Athletics = 'athletics',
    Deception = 'deception',
    History = 'history',
    Insight = 'insight',
    Intimidation = 'intimidation',
    Investigation = 'investigation',
    Medicine = 'medicine',
    Nature = 'nature',
    Perception = 'perception',
    Performance = 'performance',
    Persuasion = 'persuasion',
    Religion = 'religion',
    SleightOfHand = 'sleight of hand',
    Stealth = 'stealth',
    Survival = 'survival',
}

export const UNIT_TYPES = [
    'monster',
    'player_character',
    'allied_npc',
    'enemy_npc',
] as const;

export type UnitType = typeof UNIT_TYPES[number];

// ===== SHARED INTERFACES =====

export interface CreatureArmorClass {
    type?: ArmorType | string;
    value: number;
    desc?: string;
}

export interface CreatureSpeed {
    walk?: string;
    burrow?: string;
    climb?: string;
    fly?: string;
    swim?: string;
    hover?: boolean;
}

export interface CreatureProficiency {
    value: number;
    proficiency: {
        index: string;
        name: string;
    };
}

export interface CreatureSenses {
    [Sense.Blindsight]?: string;
    [Sense.Darkvision]?: string;
    [Sense.Tremorsense]?: string;
    [Sense.Truesight]?: string;
    [Sense.PassivePerception]?: number;
    // Support database format with underscore
    blindsight?: string;
    darkvision?: string;
    tremorsense?: string;
    truesight?: string;
    passive_perception?: number;
}

export interface CreatureForm {
    index: string;
    name: string;
}

export interface CreatureConditionImmunity {
    index: string;
    name: string;
}

// ===== USAGE INTERFACE (DRY principle) =====

export interface CreatureUsage {
    type: 'at will' | 'per day' | 'recharge after rest' | 'recharge on roll' | 'at_will' | 'per_day' | 'recharge_after_rest' | 'recharge_on_roll';
    rest_types?: string[];
    times?: number;
}

// ===== DAMAGE AND ATTACK INTERFACES (DRY principle) =====

export interface CreatureDamage {
    damage_dice: string;
    damage_type: {
        index: string;
        name: string;
    } | string;
}

export interface CreatureDC {
    dc_type: {
        index: string;
        name: string;
    };
    dc_value: number;
    success_type: string;
}

export interface CreatureAttack {
    name: string;
    dc?: CreatureDC;
    damage?: CreatureDamage;
}

// ===== ACTION OPTIONS INTERFACE (DRY principle) =====

export interface CreatureActionOptions {
    desc: string;
    choose: number;
    type: string;
}

export interface CreatureActionOption {
    desc?: string;
    choose?: number;
    type?: string;
}

// ===== BASE ACTION INTERFACE (DRY principle) =====

export interface BaseActionInterface {
    name: string;
    desc: string;
    action_options?: CreatureActionOptions;
    actions?: {
        action_name: string;
        count: number;
        type: 'melee' | 'ranged' | 'ability' | 'magic';
    }[];
    options?: CreatureActionOption;
    multiattack_type?: string;
    attack_bonus?: number;
    dc?: CreatureDC;
    attacks?: CreatureAttack[];
    damage?: CreatureDamage[];
}

// ===== SPECIFIC ACTION INTERFACES =====

export interface CreatureAbility {
    name: string;
    desc: string[];
    attack_bonus?: number;
    damage?: CreatureDamage;
    dc?: CreatureDC;
    spellcasting?: CreatureSpellcasting;
    usage?: CreatureUsage;
}

export interface CreatureAction extends BaseActionInterface {}

export interface CreatureLegendaryAction extends BaseActionInterface {}

export interface CreatureReaction extends BaseActionInterface {}

// ===== SPELLCASTING INTERFACES =====

export interface CreatureSpell {
    name: string;
    level?: number;
    usage?: CreatureUsage;
}

export interface CreatureSpellcasting {
    level?: number;
    ability: string;
    dc?: number;
    modifier?: number;
    components_required?: string[];
    school?: string;
    slots?: Record<string, number>;
    spells?: CreatureSpell[];
}

export interface SpellcastingProfile {
    id: number;
    ability: string;
    level?: number;
    dc?: number;
    modifier?: number;
    components_required?: string[];
    school?: string;
    slots?: Record<string, number>;
    srd_spells?: SpellSummary[];
    spells?: SpellSummary[];
}

// ===== BASE CREATURE INTERFACE =====

export interface BaseCreature {
    id: number;
    index: string;
    name: string;
    desc?: string[];

    // Basic Info
    size: CreatureSize | string;
    type?: CreatureType | string;
    subtype?: string;
    forms?: CreatureForm[];
    alignment?: CreatureAlignment | string;

    // Combat Stats
    armor_class?: CreatureArmorClass[] | number;
    hit_points: number;
    hit_dice?: string;
    hit_points_roll?: string;
    speed?: CreatureSpeed;

    // Ability Scores
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;

    // Proficiencies and Skills
    proficiencies?: CreatureProficiency[];

    // Resistances and Immunities
    damage_vulnerabilities?: string[];
    damage_resistances?: string[];
    damage_immunities?: string[];
    condition_immunities?: CreatureConditionImmunity[];

    // Senses and Languages
    senses?: CreatureSenses;
    languages?: string;

    // Challenge and XP
    challenge_rating?: number;
    proficiency_bonus?: number;
    xp?: number;

    // Abilities and Actions
    special_abilities?: CreatureAbility[];
    actions?: CreatureAction[];
    legendary_actions?: CreatureLegendaryAction[];
    reactions?: CreatureReaction[];

    // Spellcasting
    spellcasting_profiles?: SpellcastingProfile[];

    // Metadata
    source?: string;
}

// ===== SPECIFIC CREATURE TYPES =====

export interface SrdMonster extends BaseCreature {
    image?: string;
    image_url?: string;
}

export interface Unit extends BaseCreature {
    user_id: number;
    unit_type: UnitType | string;
    class?: string;
    level?: string;
    cloned_from?: string;
}

// ===== SUMMARY INTERFACES =====

export interface CreatureSummary {
    id: number;
    index: string;
    name: string;
    image_url?: string;
    type?: string;
    challenge_rating?: number;
    source?: string;
    data_source?: 'srd' | 'custom';
}

// ===== API RESPONSE INTERFACES =====

export interface CreatureApiResponse {
    results: BaseCreature[];
    count: number;
    next?: string;
    previous?: string;
}

export type CreatureDetailApiResponse = BaseCreature;

// ===== FORM INTERFACES =====

export interface CreateCreatureRequest {
    index: string;
    name: string;
    desc?: string[];
    size: CreatureSize | string;
    type?: string;
    subtype?: string;
    alignment?: CreatureAlignment | string;
    armor_class?: CreatureArmorClass[] | number;
    hit_points: number;
    hit_dice?: string;
    hit_points_roll?: string;
    speed?: CreatureSpeed;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    proficiencies?: CreatureProficiency[];
    damage_vulnerabilities?: string[];
    damage_resistances?: string[];
    damage_immunities?: string[];
    condition_immunities?: CreatureConditionImmunity[];
    senses?: CreatureSenses;
    languages?: string;
    challenge_rating?: number;
    proficiency_bonus?: number;
    xp?: number;
    special_abilities?: CreatureAbility[];
    actions?: CreatureAction[];
    legendary_actions?: CreatureLegendaryAction[];
    reactions?: CreatureReaction[];
    source?: string;
}

export interface UpdateCreatureRequest extends Partial<CreateCreatureRequest> {
    id: number;
}

// ===== TYPE GUARDS =====

export function isBaseCreature(obj: unknown): obj is BaseCreature {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'index' in obj &&
        'name' in obj &&
        'hit_points' in obj &&
        'strength' in obj &&
        'dexterity' in obj &&
        'constitution' in obj &&
        'intelligence' in obj &&
        'wisdom' in obj &&
        'charisma' in obj &&
        typeof (obj as BaseCreature).id === 'number' &&
        typeof (obj as BaseCreature).index === 'string' &&
        typeof (obj as BaseCreature).name === 'string' &&
        typeof (obj as BaseCreature).hit_points === 'number' &&
        typeof (obj as BaseCreature).strength === 'number' &&
        typeof (obj as BaseCreature).dexterity === 'number' &&
        typeof (obj as BaseCreature).constitution === 'number' &&
        typeof (obj as BaseCreature).intelligence === 'number' &&
        typeof (obj as BaseCreature).wisdom === 'number' &&
        typeof (obj as BaseCreature).charisma === 'number'
    );
}

export function isSrdMonster(obj: unknown): obj is SrdMonster {
    return isBaseCreature(obj);
}

export function isUnit(obj: unknown): obj is Unit {
    return (
        isBaseCreature(obj) &&
        'user_id' in obj &&
        'unit_type' in obj &&
        typeof (obj as Unit).user_id === 'number' &&
        typeof (obj as Unit).unit_type === 'string'
    );
}

export function isCreatureSummary(obj: unknown): obj is CreatureSummary {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'index' in obj &&
        'name' in obj &&
        typeof (obj as CreatureSummary).id === 'number' &&
        typeof (obj as CreatureSummary).index === 'string' &&
        typeof (obj as CreatureSummary).name === 'string'
    );
}

export function isCreatureApiResponse(obj: unknown): obj is CreatureApiResponse {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'results' in obj &&
        'count' in obj &&
        Array.isArray((obj as CreatureApiResponse).results) &&
        typeof (obj as CreatureApiResponse).count === 'number'
    );
}

// ===== UTILITY FUNCTIONS =====

export function renderUnitType(type: UnitType): string {
    switch (type) {
        case UNIT_TYPES[0]:
            return "Monster";
        case UNIT_TYPES[1]:
            return "Player Character";
        case UNIT_TYPES[2]:
            return "Allied NPC";
        case UNIT_TYPES[3]:
            return "Enemy NPC";
    }
}

export function getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

export function formatAbilityScore(score: number): string {
    const modifier = getAbilityModifier(score);
    const sign = modifier >= 0 ? '+' : '-';
    return `${score} (${sign}${Math.abs(modifier)})`;
}

export function getChallengeRatingString(cr?: number): string {
    if (cr === undefined || cr === null) return '—';
    
    const epsilon = 0.0001;
    
    if (Math.abs(cr - 0.125) < epsilon) return '1/8';
    if (Math.abs(cr - 0.25) < epsilon) return '1/4';
    if (Math.abs(cr - 0.5) < epsilon) return '1/2';
    return cr.toString();
}

export function getProficiencyBonus(challengeRating?: number): number {
    if (!challengeRating) return 2;
    if (challengeRating >= 29) return 9;
    if (challengeRating >= 25) return 8;
    if (challengeRating >= 21) return 7;
    if (challengeRating >= 17) return 6;
    if (challengeRating >= 13) return 5;
    if (challengeRating >= 9) return 4;
    if (challengeRating >= 5) return 3;
    return 2;
}

export function getArmorClassValue(ac?: CreatureArmorClass[] | number): number {
    if (typeof ac === 'number') return ac;
    if (Array.isArray(ac) && ac.length > 0) return ac[0].value;
    return 10;
}

export function formatArmorClass(ac?: CreatureArmorClass[] | number): string {
    if (typeof ac === 'number') return ac.toString();
    if (Array.isArray(ac) && ac.length > 0) {
        const armor = ac[0];
        if (armor.type && armor.type !== ArmorType.None) {
            return `${armor.value} (${armor.type})`;
        }
        return armor.value.toString();
    }
    return '10';
}

export function formatSpeed(speed?: CreatureSpeed): string {
    if (!speed) return '30 ft.';

    const parts: string[] = [];
    if (speed.walk) parts.push(`${speed.walk}`);
    if (speed.fly) {
        const flyStr = speed.hover ? `fly ${speed.fly} (hover)` : `fly ${speed.fly}`;
        parts.push(flyStr);
    }
    if (speed.swim) parts.push(`swim ${speed.swim}`);
    if (speed.burrow) parts.push(`burrow ${speed.burrow}`);
    if (speed.climb) parts.push(`climb ${speed.climb}`);

    return parts.length > 0 ? parts.join(', ') : '30 ft.';
}

export function formatSenses(senses?: CreatureSenses): string {
    if (!senses) return '';

    const parts: string[] = [];
    
    // Handle both enum format and database format
    const blindsight = senses[Sense.Blindsight] || senses.blindsight;
    const darkvision = senses[Sense.Darkvision] || senses.darkvision;
    const tremorsense = senses[Sense.Tremorsense] || senses.tremorsense;
    const truesight = senses[Sense.Truesight] || senses.truesight;
    const passivePerception = senses[Sense.PassivePerception] || senses.passive_perception;
    
    if (blindsight) parts.push(`Blindsight ${blindsight}`);
    if (darkvision) parts.push(`Darkvision ${darkvision}`);
    if (tremorsense) parts.push(`Tremorsense ${tremorsense}`);
    if (truesight) parts.push(`Truesight ${truesight}`);
    if (passivePerception) parts.push(`Passive Perception ${passivePerception}`);

    return parts.join(', ');
}

// ===== USAGE FORMATTING UTILITY =====

export function formatUsage(usage?: CreatureUsage): string {
    if (!usage) return '';
    
    switch (usage.type) {
        case 'at_will':
        case 'at will':
            return 'At will';
        case 'per_day':
        case 'per day':
            return usage.times ? `${usage.times}/day` : '1/day';
        case 'recharge_after_rest':
        case 'recharge after rest':
            const restType = usage.rest_types?.[0] || 'long';
            return `Recharges after a ${restType} rest`;
        case 'recharge_on_roll':
        case 'recharge on roll':
            return 'Recharge 5-6';
        default:
            return '';
    }
}

// ===== ABILITY SCORE UTILITIES =====

export const ABILITY_SCORE_NAMES: Record<string, string> = {
    'str': 'Strength',
    'dex': 'Dexterity', 
    'con': 'Constitution',
    'int': 'Intelligence',
    'wis': 'Wisdom',
    'cha': 'Charisma',
} as const;

export function getAbilityScoreName(abilityCode: string): string {
    return ABILITY_SCORE_NAMES[abilityCode.toLowerCase()] || abilityCode.toUpperCase();
}

export function isValidAbilityScore(ability: string): ability is keyof typeof ABILITY_SCORE_NAMES {
    return ability.toLowerCase() in ABILITY_SCORE_NAMES;
}
