// ===== ENUMS =====

export enum MonsterSize {
    Tiny = 'tiny',
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    Huge = 'huge',
    Gargantuan = 'gargantuan',
}

// export const SIZES = [

// ]

export enum MonsterType {
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

export enum MonsterAlignment {
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
}

export enum ArmorType {
    Natural = 'natural',
    Light = 'light',
    Medium = 'medium',
    Heavy = 'heavy',
    Shield = 'shield',
    None = 'none',
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

// ===== INTERFACES =====

export interface MonsterArmorClass {
    type?: ArmorType | string;
    value: number;
    desc?: string;
}

export interface MonsterSpeed {
    walk?: number;
    fly?: number;
    swim?: number;
    burrow?: number;
    climb?: number;
    hover?: boolean;
}

export interface MonsterProficiency {
    proficiency: {
        index: string;
        name: string;
        url?: string;
    };
    value: number;
}

export interface MonsterSenses {
    [Sense.Blindsight]?: string;
    [Sense.Darkvision]?: string;
    [Sense.Tremorsense]?: string;
    [Sense.Truesight]?: string;
    [Sense.PassivePerception]?: number;
}

export interface MonsterAbility {
    name: string;
    desc: string[];
    attack_bonus?: number;
    damage_dice?: string;
    damage_bonus?: number;
    dc?: {
        dc_type: {
            index: string;
            name: string;
        };
        dc_value: number;
        success_type: string;
    };
    spellcasting?: MonsterSpellcasting;
}

export interface MonsterAction {
    name: string;
    desc: string[];
    attack_bonus?: number;
    damage_dice?: string;
    damage_bonus?: number;
    dc?: {
        dc_type: {
            index: string;
            name: string;
        };
        dc_value: number;
        success_type: string;
    };
    usage?: {
        type: string;
        times?: number;
        rest_types?: string[];
    };
}

export interface MonsterLegendaryAction {
    name: string;
    desc: string[];
    attack_bonus?: number;
    damage_dice?: string;
    damage_bonus?: number;
    dc?: {
        dc_type: {
            index: string;
            name: string;
        };
        dc_value: number;
        success_type: string;
    };
}

export interface MonsterReaction {
    name: string;
    desc: string[];
    dc?: {
        dc_type: {
            index: string;
            name: string;
        };
        dc_value: number;
        success_type: string;
    };
}

export interface MonsterSpellcasting {
    level?: number;
    ability: {
        index: string;
        name: string;
    };
    dc?: number;
    modifier?: number;
    components_required?: string[];
    school?: string;
    slots?: Record<string, number>;
    spells?: MonsterSpell[];
}

export interface MonsterSpell {
    name: string;
    level?: number;
    url?: string;
    usage?: {
        type: string;
        times?: number;
        rest_types?: string[];
    };
}

export interface MonsterForm {
    index: string;
    name: string;
    url?: string;
}

export interface MonsterConditionImmunity {
    index: string;
    name: string;
    url?: string;
}

// ===== MAIN MONSTER INTERFACE =====

export interface Monster {
    id: number;
    index: string;
    name: string;
    desc?: string[];
    image?: string;

    // Basic Info
    size: MonsterSize | string;
    type?: MonsterType | string;
    subtype?: string;
    forms?: MonsterForm[];
    alignment?: MonsterAlignment | string;

    // Combat Stats
    armor_class?: MonsterArmorClass[] | number;
    hit_points: number;
    hit_dice?: string;
    hit_points_roll?: string;
    speed?: MonsterSpeed;

    // Ability Scores
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;

    // Proficiencies and Skills
    proficiencies?: MonsterProficiency[];

    // Resistances and Immunities
    damage_vulnerabilities?: string[];
    damage_resistances?: string[];
    damage_immunities?: string[];
    condition_immunities?: MonsterConditionImmunity[];

    // Senses and Languages
    senses?: MonsterSenses;
    languages?: string;

    // Challenge and XP
    challenge_rating?: number;
    proficiency_bonus?: number;
    xp?: number;

    // Abilities and Actions
    special_abilities?: MonsterAbility[];
    actions?: MonsterAction[];
    legendary_actions?: MonsterLegendaryAction[];
    reactions?: MonsterReaction[];

    // Metadata
    source?: string;
}

// ===== SIMPLIFIED INTERFACES =====

export interface MonsterSummary {
    id: number;
    index: string;
    name: string;
    image_url?: string;
    type?: string;
    challenge_rating?: number;
    source?: string;
    data_source?: 'srd' | 'custom'; // To distinguish between SRD and custom monsters
}

// ===== API RESPONSE INTERFACES =====

export interface MonsterApiResponse {
    results: Monster[];
    count: number;
    next?: string;
    previous?: string;
}

export type MonsterDetailApiResponse = Monster;

// ===== FORM INTERFACES =====

export interface CreateMonsterRequest {
    index: string;
    name: string;
    desc?: string[];
    image?: string;
    size: MonsterSize | string;
    type?: string;
    subtype?: string;
    alignment?: MonsterAlignment | string;
    armor_class?: MonsterArmorClass[] | number;
    hit_points: number;
    hit_dice?: string;
    hit_points_roll?: string;
    speed?: MonsterSpeed;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    proficiencies?: MonsterProficiency[];
    damage_vulnerabilities?: string[];
    damage_resistances?: string[];
    damage_immunities?: string[];
    condition_immunities?: MonsterConditionImmunity[];
    senses?: MonsterSenses;
    languages?: string;
    challenge_rating?: number;
    proficiency_bonus?: number;
    xp?: number;
    special_abilities?: MonsterAbility[];
    actions?: MonsterAction[];
    legendary_actions?: MonsterLegendaryAction[];
    reactions?: MonsterReaction[];
    source?: string;
}

export interface UpdateMonsterRequest extends Partial<CreateMonsterRequest> {
    id: number;
}

// ===== TYPE GUARDS =====

export function isMonster(obj: unknown): obj is Monster {
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
        typeof (obj as Monster).id === 'number' &&
        typeof (obj as Monster).index === 'string' &&
        typeof (obj as Monster).name === 'string' &&
        typeof (obj as Monster).hit_points === 'number' &&
        typeof (obj as Monster).strength === 'number' &&
        typeof (obj as Monster).dexterity === 'number' &&
        typeof (obj as Monster).constitution === 'number' &&
        typeof (obj as Monster).intelligence === 'number' &&
        typeof (obj as Monster).wisdom === 'number' &&
        typeof (obj as Monster).charisma === 'number'
    );
}

export function isMonsterSummary(obj: unknown): obj is MonsterSummary {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'index' in obj &&
        'name' in obj &&
        typeof (obj as MonsterSummary).id === 'number' &&
        typeof (obj as MonsterSummary).index === 'string' &&
        typeof (obj as MonsterSummary).name === 'string'
    );
}

export function isMonsterApiResponse(obj: unknown): obj is MonsterApiResponse {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'results' in obj &&
        'count' in obj &&
        Array.isArray((obj as MonsterApiResponse).results) &&
        typeof (obj as MonsterApiResponse).count === 'number'
    );
}

// ===== UTILITY FUNCTIONS =====

export function getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

export function formatAbilityScore(score: number): string {
    const modifier = getAbilityModifier(score);
    const sign = modifier >= 0 ? '+' : '-';
    return `${score} (${sign}${modifier})`;
}

export function getChallengeRatingString(cr?: number): string {
    if (cr === undefined || cr === null) return '—';
    if (cr === 0.125) return '1/8';
    if (cr === 0.25) return '1/4';
    if (cr === 0.5) return '1/2';
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

export function getArmorClassValue(ac?: MonsterArmorClass[] | number): number {
    if (typeof ac === 'number') return ac;
    if (Array.isArray(ac) && ac.length > 0) return ac[0].value;
    return 10;
}

export function formatArmorClass(ac?: MonsterArmorClass[] | number): string {
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

export function formatSpeed(speed?: MonsterSpeed): string {
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

export function formatSenses(senses?: MonsterSenses): string {
    if (!senses) return '';

    const parts: string[] = [];
    if (senses.blindsight) parts.push(`blindsight ${senses.blindsight}`);
    if (senses.darkvision) parts.push(`darkvision ${senses.darkvision}`);
    if (senses.tremorsense) parts.push(`tremorsense ${senses.tremorsense}`);
    if (senses.truesight) parts.push(`truesight ${senses.truesight}`);
    if (senses[Sense.PassivePerception]) parts.push(`passive Perception ${senses[Sense.PassivePerception]}`);

    return parts.join(', ');
}
