/**
 * Comprehensive TypeScript interface for Spell entity
 * Based on the Laravel migration: 2025_05_14_131809_create_spells_table.php
 */

// Import shared types
import { AbilityScore } from './monster';

// ===== ENUMS =====

// Spell levels from 0 (cantrips) to 9
export const SPELL_LEVEL_LABELS: Record<SpellLevel, string> = {
    0: 'Cantrip',
    1: '1st Level',
    2: '2nd Level',
    3: '3rd Level',
    4: '4th Level',
    5: '5th Level',
    6: '6th Level',
    7: '7th Level',
    8: '8th Level',
    9: '9th Level',
};

export type SpellLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Spell schools of magic
export const SPELL_SCHOOLS = [
    'Abjuration',
    'Conjuration',
    'Divination',
    'Enchantment',
    'Evocation',
    'Illusion',
    'Necromancy',
    'Transmutation'
] as const;

export type SpellSchool = typeof SPELL_SCHOOLS[number];

// Spell casting times
export const STANDARD_CASTING_TIMES = [
    "1 action",
    "1 bonus action",
    "1 reaction",
    "1 minute",
    "10 minutes",
    "1 hour",
    "8 hours",
    "12 hours",
    "24 hours",
] as const;

export type StandardCastingTime = typeof STANDARD_CASTING_TIMES[number];
export type SpellCastingTime =
    | StandardCastingTime
    | string;

// Spell components

// Spell range types
export type SpellRangeBase = "Self" | "Touch" | "Ranged" | "Sight" | "Unlimited";
export type SpellRangeUnit = "feet" | "mile";

// Spell attack types
export const ATTACK_TYPES = [
    "melee",
    "ranged"
] as const;

export type AttackTypes = typeof ATTACK_TYPES[number];
export type AttackType = AttackTypes;

// Spell durations
export const STANDARD_DURATIONS = [
    "Instantaneous",
    "1 Minute",
    "10 Minutes",
    "1 Hour",
    "8 Hours",
    "24 Hours",
    "Until Dispelled",
] as const;

export type StandardDuration = typeof STANDARD_DURATIONS[number];
export type SpellDuration =
    | StandardDuration
    | string;


// Spell components enum
export const SPELL_COMPONENTS = [
    'V', // Verbal
    'S', // Somatic
    'M'  // Material
] as const;

export type SpellComponent = typeof SPELL_COMPONENTS[number];

// Area of effect types
export type AreaOfEffectType =
    | 'sphere'
    | 'cube'
    | 'line'
    | 'cone'
    | 'cylinder'
    | 'square'
    | 'hemisphere';

// Damage types enum
export type DamageType =
    | 'acid'
    | 'bludgeoning'
    | 'cold'
    | 'fire'
    | 'force'
    | 'lightning'
    | 'necrotic'
    | 'piercing'
    | 'poison'
    | 'psychic'
    | 'radiant'
    | 'slashing'
    | 'thunder';

// DC save results enum
export type DCSaveResult =
    | 'none'
    | 'half'
    | 'other';

// D&D 5e classes enum for reference
export type DnDClass =
    | 'barbarian'
    | 'bard'
    | 'cleric'
    | 'druid'
    | 'fighter'
    | 'monk'
    | 'paladin'
    | 'ranger'
    | 'rogue'
    | 'sorcerer'
    | 'warlock'
    | 'wizard'
    | 'artificer';


// ===== INTERFACES =====

export interface SpellRangeInput {
  base: SpellRangeBase;
  distance?: number;      // Only if base is Ranged
  unit?: SpellRangeUnit;  // Only if base is Ranged
}

export interface SpellDamage {
    damage_type?: DamageType;
    damage_at_slot_level?: { [slotLevel: string]: string }; // e.g., { "1": "3d6", "2": "4d6" }
    damage_at_character_level?: { [characterLevel: string]: string }; // For cantrips
}

export interface AreaOfEffect {
    type: AreaOfEffectType;
    size?: number;       // Radius, length, width, etc.
    radius?: number;     // For spheres, cylinders
    length?: number;     // For lines, cones
    width?: number;      // For lines
    height?: number;     // For cylinders
}

export interface DifficultyClass {
    dc_type?: AbilityScore;
    dc_success?: DCSaveResult;
}

export interface HealingScale {
    [slotLevel: string]: string; // e.g., { "1": "1d4+4", "2": "2d4+4" }
}

export interface SpellClass {
    index: string;   // e.g., 'wizard'
    name: string;    // e.g., 'Wizard'
    url?: string;    // API URL reference
}

export interface SpellSubclass {
    index: string;   // e.g., 'evocation'
    name: string;    // e.g., 'School of Evocation'
    url?: string;    // API URL reference
}

// ===== MAIN SPELL INTERFACE =====
// Base interface for D&D 5e Spell
export interface Spell {
    // Primary key and user association
    id: number;
    user_id: number;

    // Basic spell identification
    index: string;           // e.g., 'fireball', 'magic-missile', 'healing-word'
    name: string;            // e.g., 'Fireball', 'Magic Missile', 'Healing Word'
    level: number;           // 0-9 (cantrips are level 0)
    school: SpellSchool;     // School of magic

    // Spell properties
    ritual: boolean;         // Can be cast as a ritual
    concentration: boolean;  // Requires concentration

    // Casting mechanics
    casting_time?: string;   // e.g., '1 action', '1 bonus action', '1 reaction', '1 minute', '10 minutes', '1 hour', '8 hours'
    duration?: string;       // e.g., 'instantaneous', '1 minute', '10 minutes', '1 hour', '8 hours', '24 hours', 'until dispelled'
    range?: string;          // e.g., 'self', 'touch', '30 feet', '60 feet', '120 feet', '10 miles'
    attack_type?: AttackType; // e.g., 'melee', 'ranged', null

    // Spell description and effects
    desc?: string[];         // Array of description paragraphs
    higher_level?: string[]; // Optional extra effects when cast at higher levels

    // Components and materials
    components?: SpellComponent[]; // ['V', 'S', 'M'] - Verbal, Somatic, Material
    material?: string;       // Optional material component description

    // Area effects and damage
    area_of_effect?: AreaOfEffect; // Shape and size of spell effect
    damage?: SpellDamage;    // Damage scaling information
    dc?: DifficultyClass;    // Difficulty Class for saving throws
    heal_at_slot_level?: HealingScale; // Healing scaling information

    // Class and subclass associations
    classes?: SpellClass[];      // Applicable classes
    subclasses?: SpellSubclass[]; // Subclass references

    // Source tracking
    source?: string;         // e.g., 'Basic Rules (2014)', 'Player's Handbook (2014)'
    cloned_from?: string;    // SRD index of the original spell if this is a clone

    // Timestamps
    created_at: string;      // ISO date string
    updated_at: string;      // ISO date string
}

// ===== SIMPLIFIED INTERFACES =====
// Simplified spell interface for lists/tables - matches backend summary response
export interface SpellSummary {
    id: number;
    index: string;
    name: string;
    level: number;
    school?: SpellSchool;
    source?: string;
    data_source?: 'srd' | 'custom'; // To distinguish between SRD and custom spells
    tags?: string[]; // For filtering
}

// ===== API RESPONSE INTERFACES =====

export interface SpellApiResponse {
    data: Spell[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

export interface SingleSpellApiResponse {
    data: Spell;
}


// Form interfaces for creating/editing spells
export interface CreateSpellRequest {
    index: string;
    name: string;
    level: number;
    school: SpellSchool;
    ritual?: boolean;
    concentration?: boolean;
    casting_time?: string;
    duration?: string;
    range?: string;
    attack_type?: AttackType;
    desc?: string[];
    higher_level?: string[];
    components?: SpellComponent[];
    material?: string;
    area_of_effect?: AreaOfEffect;
    damage?: SpellDamage;
    dc?: DifficultyClass;
    heal_at_slot_level?: HealingScale;
    classes?: SpellClass[];
    subclasses?: SpellSubclass[];
    source?: string;
    cloned_from?: string;
}

export interface UpdateSpellRequest extends Partial<CreateSpellRequest> {
    id: number;
}

// Type guards for runtime type checking
export const isSpell = (obj: unknown): obj is Spell => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof (obj as Record<string, unknown>).id === 'number' &&
        typeof (obj as Record<string, unknown>).user_id === 'number' &&
        typeof (obj as Record<string, unknown>).index === 'string' &&
        typeof (obj as Record<string, unknown>).name === 'string' &&
        typeof (obj as Record<string, unknown>).level === 'number' &&
        typeof (obj as Record<string, unknown>).school === 'string' &&
        typeof (obj as Record<string, unknown>).ritual === 'boolean' &&
        typeof (obj as Record<string, unknown>).concentration === 'boolean'
    );
};

export const isSpellSummary = (obj: unknown): obj is SpellSummary => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof (obj as Record<string, unknown>).id === 'number' &&
        typeof (obj as Record<string, unknown>).index === 'string' &&
        typeof (obj as Record<string, unknown>).name === 'string' &&
        typeof (obj as Record<string, unknown>).level === 'number' &&
        typeof (obj as Record<string, unknown>).school === 'string' &&
        typeof (obj as Record<string, unknown>).ritual === 'boolean' &&
        typeof (obj as Record<string, unknown>).concentration === 'boolean'
    );
};
