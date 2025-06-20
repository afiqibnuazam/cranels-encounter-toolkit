"use client"

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { useAuthentication } from './AuthenticationContext';

// Types - Keep local state simple, add DB fields when saving
export interface LocalCombatant {
    id: string; // Use UUID for local state (crypto.randomUUID())
    index?: string;
    initiative: number;
    name: string;
    current_hit_points: number;
    max_hit_points: number;
    temporary_hit_points: number; // Default to 0
    armor_class: string;
    unit_type?: 'monster' | 'player_character' | 'allied_npc' | 'enemy_npc'; // Optional, for filtering
    // Add source info for when we save to DB
    source_type?: 'srd' | 'custom';
    source_id?: number; // Reference to monster/character if applicable
    // Ability scores for initiative calculations
    dexterity?: number; // Dexterity score for initiative modifier
}

interface DatabaseCombatant extends Omit<LocalCombatant, 'id'> {
    // Additional fields needed when saving to database
    id: number; // Database ID (different from local UUID)
    encounter_id: number;
    combatantable_type: string;
    combatantable_id: number;
}

type EncounterStatus = 'draft' | 'active' | 'completed';

interface EncounterState {
    combatants: LocalCombatant[];
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
    | { type: 'ADD_COMBATANT'; payload: LocalCombatant }
    | { type: 'REMOVE_COMBATANT'; payload: string } // Using local UUID
    | { type: 'UPDATE_COMBATANT'; payload: { id: string; updates: Partial<LocalCombatant> } }
    | { type: 'UPDATE_INITIATIVES'; payload: { id: string; initiative: number }[] }
    | { type: 'START_ENCOUNTER' }
    | { type: 'END_ENCOUNTER' }
    | { type: 'NEXT_TURN' }
    | { type: 'MARK_AS_SAVED'; payload: { encounterId: number } }
    | { type: 'RESET_ENCOUNTER' }
    | { type: 'RESET_TO_DRAFT' }
    | { type: 'SET_SELECTED_COMBATANT'; payload: string | undefined }
    | { type: 'CLEAR_SELECTED_COMBATANT' };

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
                combatants: state.combatants.filter(c => c.id !== action.payload),
                isSaved: false
            };

        case 'UPDATE_COMBATANT':
            return {
                ...state,
                combatants: state.combatants.map(c =>
                    c.id === action.payload.id
                        ? { ...c, ...action.payload.updates }
                        : c
                ),
                isSaved: false
            };

        case 'UPDATE_INITIATIVES':
            return {
                ...state,
                combatants: state.combatants.map(c => {
                    const initiativeUpdate = action.payload.find(update => update.id === c.id);
                    return initiativeUpdate ? { ...c, initiative: initiativeUpdate.initiative } : c;
                }),
                isSaved: false
            };

        case 'START_ENCOUNTER':
            // Sort by initiative (descending)
            const sortedCombatants = [...state.combatants].sort((a, b) => b.initiative - a.initiative);
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

        default:
            return state;
    }
}

// Provider component
export function EncounterProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(encounterReducer, initialState);

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

    const addCombatant = (combatant: Omit<LocalCombatant, 'id'>) => {
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
            // For monsters and NPCs, handle duplicate naming with numbering
            const baseName = combatant.name;
            const escapedBaseName = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Find all combatants with this base name (exact match or numbered versions)
            const relatedCombatants = state.combatants.filter(c => {
                return c.name === baseName || c.name.match(new RegExp(`^${escapedBaseName} \\d+$`));
            });

            if (relatedCombatants.length > 0) {
                // If this is the second instance (first duplicate), rename the existing one to "Name 1"
                if (relatedCombatants.length === 1 && relatedCombatants[0].name === baseName) {
                    dispatch({
                        type: 'UPDATE_COMBATANT',
                        payload: {
                            id: relatedCombatants[0].id,
                            updates: { name: `${baseName} 1` }
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

        const newCombatant: LocalCombatant = {
            ...combatant,
            name: finalName,
            id: crypto.randomUUID(), // Generate UUID for local state
            temporary_hit_points: combatant.temporary_hit_points || 0
        };
        dispatch({ type: 'ADD_COMBATANT', payload: newCombatant });
    };

    const removeCombatant = (id: string) => {
        dispatch({ type: 'REMOVE_COMBATANT', payload: id });
    };

    const updateCombatant = (id: string, updates: Partial<LocalCombatant>) => {
        dispatch({ type: 'UPDATE_COMBATANT', payload: { id, updates } });
    };

    const updateInitiatives = (initiatives: { id: string; initiative: number }[]) => {
        dispatch({ type: 'UPDATE_INITIATIVES', payload: initiatives });
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
    const saveEncounter = async (encounterName: string) => {
        if (!authToken) {
            throw new Error('Must be logged in to save encounter');
        }

        try {
            // Convert local combatants to database format
            const dbCombatants = state.combatants.map(combatant => ({
                initiative: combatant.initiative,
                name: combatant.name,
                current_hit_points: combatant.current_hit_points,
                max_hit_points: combatant.max_hit_points,
                temporary_hit_points: combatant.temporary_hit_points,
                armor_class: combatant.armor_class,
                // Map to polymorphic relationship
                combatantable_type: combatant.source_type === 'srd' ? 'App\\Models\\SrdMonster' : 'App\\Models\\Unit',
                combatantable_id: combatant.source_id || null,
            }));

            // API call to save encounter
            const response = await fetch('/api/encounters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    name: encounterName,
                    status: state.status, // Include current status
                    current_round: state.round,
                    combatants: dbCombatants
                })
            });

            if (!response.ok) throw new Error('Failed to save encounter');

            const savedEncounter = await response.json();
            dispatch({ type: 'MARK_AS_SAVED', payload: { encounterId: savedEncounter.id } });

            return savedEncounter;
        } catch (error) {
            console.error('Error saving encounter:', error);
            throw error;
        }
    };

    const resetEncounter = () => {
        dispatch({ type: 'RESET_ENCOUNTER' });
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

    return {
        ...state,
        addCombatant,
        removeCombatant,
        updateCombatant,
        updateInitiatives,
        startEncounter,
        nextTurn,
        endEncounter,
        saveEncounter,
        resetEncounter,
        resetToDraft,
        setSelectedCombatant,
        clearSelectedCombatant,
        canSave: !state.isSaved && state.combatants.length > 0,
        needsAuth: !authToken && !state.isSaved
    };
}
