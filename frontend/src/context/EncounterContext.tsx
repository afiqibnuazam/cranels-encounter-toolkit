"use client"

import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface Combatant {
    index: string;
    name: string;
    hit_points: number;
    armor_class: {
        type: string;
        value: number;
    }[];
}

interface EncounterState {
    combatants: Combatant[];
}

type EncounterAction = 
    | { type: 'ADD_COMBATANT'; payload: Combatant }
    | { type: 'REMOVE_COMBATANT'; payload: number };

// Initial state
const initialState: EncounterState = {
    combatants: []
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
                combatants: [...state.combatants, action.payload]
            };
        case 'REMOVE_COMBATANT':
            return {
                ...state,
                combatants: state.combatants.filter((_, index) => index !== action.payload)
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
