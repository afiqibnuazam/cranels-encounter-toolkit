// Export all type definitions for the D&D 5e Encounter Toolkit

// Export base creature types and utilities
export * from './creature';

// Export specific types with explicit imports to avoid conflicts
export type { 
    Monster, 
    MonsterSummary, 
    MonsterApiResponse, 
    CreateMonsterRequest, 
    UpdateMonsterRequest 
} from './monster';

export type { 
    Unit, 
    UnitSummary, 
    UnitApiResponse, 
    CreateUnitRequest, 
    UpdateUnitRequest 
} from './unit';

// Export spell types
export * from './spell';

// Export specific functions to avoid conflicts
export { isMonster, isMonsterSummary, isMonsterApiResponse } from './monster';
export { isUnit, isUnitSummary, isUnitApiResponse } from './unit';

// Encounter types
export * from './encounter';

// Character types (to be added in the future)
// export * from './character';

// Common types (to be added in the future)
// export * from './common';
