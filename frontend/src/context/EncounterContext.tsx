"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { useAuthentication } from './AuthenticationContext';
import { EncounterStatus, UnitType } from '@/types';
import { useCreateEncounter } from '@/hooks/useMutations';
import { getAbilityModifier } from '@/types/monster';

// Utility function to generate index from name
function generateIndexFromName(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Types - Keep local state simple, add DB fields when saving
export interface Combatant {
    id?: number; // Database ID - only assigned when saved to backend
    encounter_id?: number; // Only set when saved to DB
    
    index: string; // Primary identifier - generated from name
    initiative: number;
    name: string;
    current_hit_points: number;
    max_hit_points: number;
    temporary_hit_points: number;
    armor_class: number;
    
    // Combat state tracking
    used_spell_slots?: Record<string, number>; // Traditional spell slots (by level)
    used_spell_casts?: Record<string, number>; // Individual spell usage tracking (by spell name/index)
    action_used?: boolean;
    bonus_action_used?: boolean;
    reaction_used?: boolean;
    legendary_actions_used?: number;
    effects?: Effect[];
    
    // From the related Monster/Unit
    unit_type: UnitType;
    source_type?: 'srd' | 'custom';
    source_id?: number;
    dexterity?: number;
}

// Additional interfaces for the combat data
interface Effect {
    id: number;
    name: string;
    desc?: string;
    concentration: boolean;
    duration?: number;
    condition_id?: number;
}

interface EncounterState {
    combatants: Combatant[];
    isRunning: boolean;
    currentTurn: number;
    round: number;
    status: EncounterStatus;
    // Track if this encounter has been saved to DB
    encounterId?: number; // If set, this encounter exists in DB
    isSaved: boolean;
    // Track manually selected combatant for info display
    selectedCombatantId?: string;
}

type EncounterAction =
    | { type: 'ADD_COMBATANT'; payload: Combatant }
    | { type: 'REMOVE_COMBATANT'; payload: string } // Using index
    | { type: 'UPDATE_COMBATANT'; payload: { index: string; updates: Partial<Combatant> } }
    | { type: 'UPDATE_INITIATIVES'; payload: { index: string; initiative: number }[] }
    | { type: 'REORDER_COMBATANTS'; payload: { fromIndex: number; toIndex: number } }
    | { type: 'START_ENCOUNTER' }
    | { type: 'END_ENCOUNTER' }
    | { type: 'NEXT_TURN' }
    | { type: 'MARK_AS_SAVED'; payload: { encounterId: number } }
    | { type: 'RESET_ENCOUNTER' }
    | { type: 'RESET_TO_DRAFT' }
    | { type: 'SET_SELECTED_COMBATANT'; payload: string | undefined }
    | { type: 'CLEAR_SELECTED_COMBATANT' }
    | { type: 'LOAD_FROM_STORAGE'; payload: EncounterState };

// Initial state
const initialState: EncounterState = {
    combatants: [],
    isRunning: false,
    currentTurn: 0,
    round: 0,
    status: 'draft',
    encounterId: undefined,
    isSaved: false,
    selectedCombatantId: undefined
};

// Create context
const EncounterStateContext = createContext<EncounterState | undefined>(undefined);
const EncounterDispatchContext = createContext<React.Dispatch<EncounterAction> | undefined>(undefined);

// Reducer
function encounterReducer(state: EncounterState, action: EncounterAction): EncounterState {
    switch (action.type) {
        case 'ADD_COMBATANT':
            return {
                ...state,
                combatants: [...state.combatants, action.payload],
                isSaved: false // Mark as unsaved when modified
            };

        case 'REMOVE_COMBATANT':
            return {
                ...state,
                combatants: state.combatants.filter(c => c.index !== action.payload),
                isSaved: false
            };

        case 'UPDATE_COMBATANT':
            return {
                ...state,
                combatants: state.combatants.map(c =>
                    c.index === action.payload.index
                        ? { ...c, ...action.payload.updates }
                        : c
                ),
                isSaved: false
            };

        case 'UPDATE_INITIATIVES':
            return {
                ...state,
                combatants: state.combatants.map(c => {
                    const initiativeUpdate = action.payload.find(update => update.index === c.index);
                    return initiativeUpdate ? { ...c, initiative: initiativeUpdate.initiative } : c;
                }),
                isSaved: false
            };

        case 'REORDER_COMBATANTS':
            const newCombatants = [...state.combatants];
            const [movedCombatant] = newCombatants.splice(action.payload.fromIndex, 1);
            newCombatants.splice(action.payload.toIndex, 0, movedCombatant);

            // Adjust currentTurn if encounter is running
            let newCurrentTurn = state.currentTurn;
            if (state.isRunning) {
                const currentCombatantIndex = state.combatants[state.currentTurn]?.index;
                if (currentCombatantIndex) {
                    newCurrentTurn = newCombatants.findIndex(c => c.index === currentCombatantIndex);
                }
            }

            return {
                ...state,
                combatants: newCombatants,
                currentTurn: newCurrentTurn,
                isSaved: false
            };

        case 'START_ENCOUNTER':
            // Sort by initiative (descending), with dexterity modifier as tiebreaker
            const sortedCombatants = [...state.combatants].sort((a, b) => {
                // First, compare initiative values
                if (b.initiative !== a.initiative) {
                    return b.initiative - a.initiative;
                }
                
                // If initiative is tied, compare dexterity modifiers
                const aDexMod = getAbilityModifier(a.dexterity || 10);
                const bDexMod = getAbilityModifier(b.dexterity || 10);
                
                if (bDexMod !== aDexMod) {
                    return bDexMod - aDexMod;
                }
                
                // If both initiative and dex modifier are tied, maintain original order
                return 0;
            });
            return {
                ...state,
                combatants: sortedCombatants,
                isRunning: true,
                currentTurn: 0,
                round: 1,
                status: 'active',
            };

        case 'NEXT_TURN':
            const nextTurn = (state.currentTurn + 1) % state.combatants.length;
            return {
                ...state,
                currentTurn: nextTurn,
                round: nextTurn === 0 ? state.round + 1 : state.round
            };

        case 'END_ENCOUNTER':
            return {
                ...state,
                isRunning: false,
                currentTurn: 0,
                round: 1,
                status: 'completed',
            };

        case 'MARK_AS_SAVED':
            return {
                ...state,
                encounterId: action.payload.encounterId,
                isSaved: true
            };

        case 'RESET_ENCOUNTER':
            return initialState;

        case 'RESET_TO_DRAFT':
            return {
                ...state,
                isRunning: false,
                currentTurn: 0,
                round: 0,
                status: 'draft',
                selectedCombatantId: undefined,
                // Reset all combatant initiatives to 0
                combatants: state.combatants.map(combatant => ({
                    ...combatant,
                    initiative: 0
                }))
            };

        case 'SET_SELECTED_COMBATANT':
            return {
                ...state,
                selectedCombatantId: action.payload
            };

        case 'CLEAR_SELECTED_COMBATANT':
            return {
                ...state,
                selectedCombatantId: undefined
            };

        case 'LOAD_FROM_STORAGE':
            return action.payload;

        default:
            return state;
    }
}

// localStorage key
const ENCOUNTER_STORAGE_KEY = 'cranels-encounter-state';

// Load state from localStorage
function loadStateFromStorage(): EncounterState {
    if (typeof window === 'undefined') return initialState;
    
    try {
        const stored = localStorage.getItem(ENCOUNTER_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Validate the structure and merge with defaults
            return {
                ...initialState,
                ...parsed,
                // Ensure indexes are strings and regenerate if missing
                combatants: (parsed.combatants || []).map((c: Combatant) => ({
                    ...c,
                    index: c.index || generateIndexFromName(c.name)
                }))
            };
        }
    } catch (error) {
        console.warn('Failed to load encounter from localStorage:', error);
    }
    
    return initialState;
}

// Save state to localStorage
function saveStateToStorage(state: EncounterState) {
    if (typeof window === 'undefined') return;
    
    try {
        localStorage.setItem(ENCOUNTER_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn('Failed to save encounter to localStorage:', error);
    }
}

// Clear localStorage
function clearStoredState() {
    if (typeof window === 'undefined') return;
    
    try {
        localStorage.removeItem(ENCOUNTER_STORAGE_KEY);
    } catch (error) {
        console.warn('Failed to clear stored encounter:', error);
    }
}

// Provider component
export function EncounterProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(encounterReducer, initialState);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage after hydration
    useEffect(() => {
        const storedState = loadStateFromStorage();
        if (storedState !== initialState) {
            // If there's stored data, load it
            dispatch({ type: 'LOAD_FROM_STORAGE', payload: storedState });
        }
        setIsHydrated(true);
    }, []);

    // Auto-save to localStorage whenever state changes (but only after hydration)
    useEffect(() => {
        if (isHydrated) {
            saveStateToStorage(state);
        }
    }, [state, isHydrated]);

    return (
        <EncounterStateContext.Provider value={state}>
            <EncounterDispatchContext.Provider value={dispatch}>
                {children}
            </EncounterDispatchContext.Provider>
        </EncounterStateContext.Provider>
    );
}

// Custom hooks to use the context
export function useEncounterState() {
    const context = useContext(EncounterStateContext);
    if (context === undefined) {
        throw new Error('useEncounterState must be used within an EncounterProvider');
    }
    return context;
}

export function useEncounterDispatch() {
    const context = useContext(EncounterDispatchContext);
    if (context === undefined) {
        throw new Error('useEncounterDispatch must be used within an EncounterProvider');
    }
    return context;
}

// Helper hook for common operations
export function useEncounter() {
    const state = useEncounterState();
    const dispatch = useEncounterDispatch();
    const { authToken } = useAuthentication(); // Your auth context
    const saveEncounterMutation = useCreateEncounter();

    const addCombatant = (combatant: Omit<Combatant, 'index'>) => {
        let finalName = combatant.name;

        // Check for uniqueness - characters, allied NPCs, and enemy NPCs should only appear once
        if (combatant.unit_type === 'player_character' ||
            combatant.unit_type === 'allied_npc' ||
            combatant.unit_type === 'enemy_npc') {

            const existingUniqueUnit = state.combatants.find(c =>
                (c.unit_type === 'player_character' ||
                    c.unit_type === 'allied_npc' ||
                    c.unit_type === 'enemy_npc') &&
                c.name === combatant.name
            );

            if (existingUniqueUnit) {
                const unitTypeLabel = combatant.unit_type === 'player_character' ? 'Character' :
                    combatant.unit_type === 'allied_npc' ? 'Allied NPC' : 'Enemy NPC';
                console.warn(`${unitTypeLabel} "${combatant.name}" is already in the encounter.`);
                return; // Don't add duplicate unique units
            }
        } else {
            // For monsters, handle duplicate naming with numbering
            const baseName = combatant.name;
            const escapedBaseName = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Find all combatants with this base name (exact match or numbered versions)
            const relatedCombatants = state.combatants.filter(c => {
                return c.name === baseName || c.name.match(new RegExp(`^${escapedBaseName} \\d+$`));
            });

            if (relatedCombatants.length > 0) {
                // If this is the second instance (first duplicate), rename the existing one to "Name 1"
                if (relatedCombatants.length === 1 && relatedCombatants[0].name === baseName) {
                    const newName1 = `${baseName} 1`;
                    dispatch({
                        type: 'UPDATE_COMBATANT',
                        payload: {
                            index: relatedCombatants[0].index,
                            updates: { 
                                name: newName1,
                                index: generateIndexFromName(newName1)
                            }
                        }
                    });
                    finalName = `${baseName} 2`;
                } else {
                    // Extract all existing numbers
                    const existingNumbers = relatedCombatants
                        .map(c => {
                            if (c.name === baseName) return 1; // Base name represents number 1
                            const match = c.name.match(new RegExp(`^${escapedBaseName} (\\d+)$`));
                            return match ? parseInt(match[1], 10) : null;
                        })
                        .filter(num => num !== null) as number[];

                    // Find the next available number
                    const maxNumber = Math.max(...existingNumbers);
                    const nextNumber = maxNumber + 1;
                    finalName = `${baseName} ${nextNumber}`;
                }
            }
        }

        const newCombatant: Combatant = {
            ...combatant,
            name: finalName,
            index: generateIndexFromName(finalName), // Generate index from final name
            temporary_hit_points: combatant.temporary_hit_points || 0
        };
        dispatch({ type: 'ADD_COMBATANT', payload: newCombatant });
    };

    const removeCombatant = (index: string) => {
        dispatch({ type: 'REMOVE_COMBATANT', payload: index });
    };

    const updateCombatant = (index: string, updates: Partial<Combatant>) => {
        dispatch({ type: 'UPDATE_COMBATANT', payload: { index, updates } });
    };

    const updateInitiatives = (initiatives: { index: string; initiative: number }[]) => {
        dispatch({ type: 'UPDATE_INITIATIVES', payload: initiatives });
    };

    const reorderCombatants = (fromIndex: number, toIndex: number) => {
        dispatch({ type: 'REORDER_COMBATANTS', payload: { fromIndex, toIndex } });
    };

    const startEncounter = () => {
        dispatch({ type: 'START_ENCOUNTER' });
    };

    const nextTurn = () => {
        dispatch({ type: 'NEXT_TURN' });
    };

    const endEncounter = () => {
        dispatch({ type: 'END_ENCOUNTER' });
    };

    // Save encounter to database
    const saveEncounter = async (saveData: { name: string; notes?: string; folder_name?: string }) => {
        if (!authToken) {
            throw new Error('Must be logged in to save encounter');
        }

        try {
            // Convert local combatants to database format
            const dbCombatants = state.combatants.map(combatant => ({
                index: combatant.index,
                unit_type: combatant.unit_type,
                initiative: combatant.initiative,
                name: combatant.name,
                current_hit_points: combatant.current_hit_points,
                max_hit_points: combatant.max_hit_points,
                temporary_hit_points: combatant.temporary_hit_points || 0,
                armor_class: combatant.armor_class,
                used_spell_slots: combatant.used_spell_slots,
                used_spell_casts: combatant.used_spell_casts,
                action_used: combatant.action_used,
                bonus_action_used: combatant.bonus_action_used,
                reaction_used: combatant.reaction_used,
                legendary_actions_used: combatant.legendary_actions_used,
                // Map to polymorphic relationship
                combatantable_type: combatant.source_type === 'srd' ? 'App\\Models\\SrdMonster' : 'App\\Models\\Unit',
                combatantable_id: combatant.source_id || null,
            }));

            const encounterData = {
                name: saveData.name,
                notes: saveData.notes,
                folder_name: saveData.folder_name,
                status: state.status,
                current_round: state.round,
                current_turn_index: state.isRunning && state.combatants.length > 0 ? state.combatants[state.currentTurn]?.index : null,
                combatants: dbCombatants
            };

            const savedEncounter = await saveEncounterMutation.mutateAsync(encounterData);
            dispatch({ type: 'MARK_AS_SAVED', payload: { encounterId: savedEncounter.id } });

            return savedEncounter;
        } catch (error) {
            console.error('Error saving encounter:', error);
            throw error;
        }
    };

    const resetEncounter = () => {
        dispatch({ type: 'RESET_ENCOUNTER' });
        clearStoredState(); // Clear localStorage when resetting
    };

    const resetToDraft = () => {
        dispatch({ type: 'RESET_TO_DRAFT' });
    };

    const setSelectedCombatant = (id: string | undefined) => {
        dispatch({ type: 'SET_SELECTED_COMBATANT', payload: id });
    };

    const clearSelectedCombatant = () => {
        dispatch({ type: 'CLEAR_SELECTED_COMBATANT' });
    };

    // TODO: transfer to useQueries.ts
    const useSpellSlot = async (combatantIndex: string, spellLevel: number) => {
        try {
            // For now, only update local state until backend is saved
            const combatant = state.combatants.find(c => c.index === combatantIndex);
            if (!combatant) return;

            // If combatant is saved to DB and has an ID, call API
            if (combatant.id) {
                const response = await fetch(`/api/combatants/${combatant.id}/use-spell-slot`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ spell_level: spellLevel })
                });
                
                if (!response.ok) {
                    console.error('Failed to update spell slot on server');
                    return;
                }
            }

            // Update local state
            dispatch({
                type: 'UPDATE_COMBATANT',
                payload: {
                    index: combatantIndex,
                    updates: {
                        used_spell_slots: {
                            ...combatant.used_spell_slots,
                            [spellLevel.toString()]: (combatant.used_spell_slots?.[spellLevel.toString()] || 0) + 1
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Failed to use spell slot:', error);
        }
    };

    // TODO: transfer to useQueries.ts
    const restoreSpellSlot = async (combatantIndex: string, spellLevel: number) => {
        try {
            // For now, only update local state until backend is saved
            const combatant = state.combatants.find(c => c.index === combatantIndex);
            if (!combatant) return;

            // If combatant is saved to DB and has an ID, call API
            if (combatant.id) {
                const response = await fetch(`/api/combatants/${combatant.id}/restore-spell-slot`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ spell_level: spellLevel })
                });
                
                if (!response.ok) {
                    console.error('Failed to update spell slot on server');
                    return;
                }
            }

            // Update local state
            const currentUsed = combatant.used_spell_slots?.[spellLevel.toString()] || 0;
            if (currentUsed > 0) {
                dispatch({
                    type: 'UPDATE_COMBATANT',
                    payload: {
                        index: combatantIndex,
                        updates: {
                            used_spell_slots: {
                                ...combatant.used_spell_slots,
                                [spellLevel.toString()]: currentUsed - 1
                            }
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Failed to restore spell slot:', error);
        }
    };

    // TODO: transfer to useQueries.ts
    const useSpellCast = async (combatantIndex: string, spellIndexOrName: string) => {
        try {
            const combatant = state.combatants.find(c => c.index === combatantIndex);
            if (!combatant) return;

            // If combatant is saved to DB and has an ID, call API
            if (combatant.id) {
                const response = await fetch(`/api/combatants/${combatant.id}/use-spell-cast`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ spell_index: spellIndexOrName })
                });
                
                if (!response.ok) {
                    console.error('Failed to update spell cast on server');
                    return;
                }
            }

            // Update local state
            dispatch({
                type: 'UPDATE_COMBATANT',
                payload: {
                    index: combatantIndex,
                    updates: {
                        used_spell_casts: {
                            ...combatant.used_spell_casts,
                            [spellIndexOrName]: (combatant.used_spell_casts?.[spellIndexOrName] || 0) + 1
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Failed to use spell cast:', error);
        }
    };

    // TODO: transfer to useQueries.ts
    const restoreSpellCast = async (combatantIndex: string, spellIndexOrName: string) => {
        try {
            const combatant = state.combatants.find(c => c.index === combatantIndex);
            if (!combatant) return;

            // If combatant is saved to DB and has an ID, call API
            if (combatant.id) {
                const response = await fetch(`/api/combatants/${combatant.id}/restore-spell-cast`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ spell_index: spellIndexOrName })
                });
                
                if (!response.ok) {
                    console.error('Failed to update spell cast on server');
                    return;
                }
            }

            // Update local state
            const currentUsed = combatant.used_spell_casts?.[spellIndexOrName] || 0;
            if (currentUsed > 0) {
                dispatch({
                    type: 'UPDATE_COMBATANT',
                    payload: {
                        index: combatantIndex,
                        updates: {
                            used_spell_casts: {
                                ...combatant.used_spell_casts,
                                [spellIndexOrName]: currentUsed - 1
                            }
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Failed to restore spell cast:', error);
        }
    };

    return {
        ...state,
        addCombatant,
        removeCombatant,
        updateCombatant,
        updateInitiatives,
        reorderCombatants,
        startEncounter,
        nextTurn,
        endEncounter,
        saveEncounter,
        resetEncounter,
        resetToDraft,
        setSelectedCombatant,
        clearSelectedCombatant,
        canSave: !state.isSaved && state.combatants.length > 0,
        needsAuth: !authToken && !state.isSaved,
        useSpellSlot,
        restoreSpellSlot,
        useSpellCast,
        restoreSpellCast,
    };
}
