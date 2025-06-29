"use client"

// Import specific types instead of using star imports
import type {
    BaseCreature,
    CreatureSummary,
    CreateCreatureRequest,
    UpdateCreatureRequest,
} from './creature';

// Import UnitType and isUnit function with explicit names
import { 
    UnitType,
    isUnit as isUnitCreature 
} from './creature';


// ===== UNIT INTERFACES =====
export interface Unit extends BaseCreature {
    user_id: number;
    unit_type: UnitType | string;
    class?: string;
    level?: string;
    cloned_from?: string;
}

export interface UnitSummary extends CreatureSummary {
    user_id?: number;
    unit_type?: UnitType | string;
    class?: string;
    level?: string;
}

// ===== API RESPONSE INTERFACES =====
export interface UnitApiResponse {
    results: Unit[];
    count: number;
    next?: string;
    previous?: string;
}

export type UnitDetailApiResponse = Unit;

// ===== FORM INTERFACES =====
export interface CreateUnitRequest extends CreateCreatureRequest {
    user_id: number;
    unit_type: UnitType | string;
    class?: string;
    level?: string;
    cloned_from?: string;
}

export interface UpdateUnitRequest extends Partial<CreateUnitRequest> {
    id: number;
}

// ===== TYPE GUARDS =====
// Use the imported function from creature.ts to avoid conflict
export const isUnit = isUnitCreature;

export function isUnitSummary(obj: unknown): obj is UnitSummary {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'index' in obj &&
        'name' in obj &&
        typeof (obj as UnitSummary).id === 'number' &&
        typeof (obj as UnitSummary).index === 'string' &&
        typeof (obj as UnitSummary).name === 'string'
    );
}

export function isUnitApiResponse(obj: unknown): obj is UnitApiResponse {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'results' in obj &&
        'count' in obj &&
        Array.isArray((obj as UnitApiResponse).results) &&
        typeof (obj as UnitApiResponse).count === 'number'
    );
}

