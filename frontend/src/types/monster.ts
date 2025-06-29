"use client"

// Re-export everything from creature for backward compatibility
export * from './creature';

// Import the new creature types
import {
    BaseCreature,
    CreatureSize,
    CreatureType,
    CreatureAlignment,
    CreatureArmorClass,
    CreatureSpeed,
    CreatureProficiency,
    CreatureSenses,
    CreatureAbility,
    CreatureAction,
    CreatureLegendaryAction,
    CreatureReaction,
    CreatureSpellcasting,
    CreatureSpell,
    CreatureForm,
    CreatureConditionImmunity,
    CreatureSummary,
    CreatureApiResponse,
    CreateCreatureRequest,
    UpdateCreatureRequest,
    isBaseCreature,
} from './creature';

// ===== MONSTER-SPECIFIC ALIASES =====
// Keep the old Monster interfaces for backward compatibility

export type MonsterSize = CreatureSize;
export type MonsterType = CreatureType;
export type MonsterAlignment = CreatureAlignment;
export type MonsterArmorClass = CreatureArmorClass;
export type MonsterSpeed = CreatureSpeed;
export type MonsterProficiency = CreatureProficiency;
export type MonsterSenses = CreatureSenses;
export type MonsterAbility = CreatureAbility;
export type MonsterAction = CreatureAction;
export type MonsterLegendaryAction = CreatureLegendaryAction;
export type MonsterReaction = CreatureReaction;
export type MonsterSpellcasting = CreatureSpellcasting;
export type MonsterSpell = CreatureSpell;
export type MonsterForm = CreatureForm;
export type MonsterConditionImmunity = CreatureConditionImmunity;

// ===== MAIN MONSTER INTERFACE =====

export interface Monster extends BaseCreature {
    image_url?: string; // Keep the existing image_url field for API compatibility
}

// ===== SIMPLIFIED INTERFACES =====

export interface MonsterSummary extends CreatureSummary {
    // Monster summary is the same as creature summary
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

export interface CreateMonsterRequest extends CreateCreatureRequest {
    image?: string;
}

export interface UpdateMonsterRequest extends Partial<CreateMonsterRequest> {
    id: number;
}

// ===== TYPE GUARDS =====

export function isMonster(obj: unknown): obj is Monster {
    return isBaseCreature(obj);
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
