import { Monster, MonsterSummary } from "@/types/monster";
import { Spell, SpellSummary } from "@/types/spell";
import { Character } from "@/components/reference-tables/characters/characters-columns";
import { Encounter } from "@/components/reference-tables/encounters/encounters-columns";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Generic fetch function with auth support
async function apiRequest<T>(
    endpoint: string,
    options?: {
        method?: string;
        body?: unknown;
        authToken?: string;
    }
): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (options?.authToken) {
        headers["Authorization"] = `Bearer ${options.authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method: options?.method || 'GET',
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle Laravel API response format for mutations
    if (options?.method && options.method !== 'GET' && data.status !== undefined) {
        if (!data.status) {
            throw new Error(data.message || 'API request failed');
        }
        return data.data || data;
    }
    
    return data;
}

// Pagination Types
export interface PaginationParams {
    page?: number;
    per_page?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
    next_page: number | null;
}

// Monster API functions
export const monstersApi = {
    // Get all monsters for server-side prefetching (no pagination)
    getAllMonsters: (authToken?: string): Promise<MonsterSummary[]> => {
        return apiRequest<MonsterSummary[]>('/monsters/all', authToken ? { authToken } : undefined);
    },

    // Get monsters with pagination (combined SRD and custom)
    getMonstersInfinite: (params: PaginationParams = {}, authToken?: string): Promise<PaginatedResponse<MonsterSummary>> => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.per_page) searchParams.append('per_page', params.per_page.toString());
        
        const url = `/monsters${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
        return apiRequest<PaginatedResponse<MonsterSummary>>(url, authToken ? { authToken } : undefined);
    },

    // Get all monsters (SRD and custom)
    getSrdMonsters: (): Promise<MonsterSummary[]> => {
        return apiRequest<MonsterSummary[]>('/srd-monsters/all');
    },

    // Get a specific monster by ID (SRD or custom)
    getSrdMonsterById: (index: string): Promise<Monster> => {
        return apiRequest<Monster>(`/srd-monsters/${index}`);
    },

    getCustomMonsterById: (index: string, authToken: string): Promise<Monster> => {
        return apiRequest<Monster>(`/monsters/${index}`, { authToken });
    },

    // Get a specific monster by ID (could be SRD or custom)
    getMonsterById: async (index: string, authToken: string): Promise<Monster> => {
        try {
            // Try SRD first
            return await apiRequest<Monster>(`/srd-monsters/${index}`);
        } catch (error) {
            // If SRD fails and user is authenticated, try custom
            if (authToken) {
                return apiRequest<Monster>(`/monsters/${index}`, { authToken });
            }
            throw error;
        }
    },

    // MUTATION FUNCTIONS
    createMonster: (monsterData: Partial<Monster>, authToken: string): Promise<Monster> => {
        return apiRequest<Monster>('/monsters', {
            method: 'POST',
            body: monsterData,
            authToken,
        });
    },

    updateMonster: (id: string, monsterData: Partial<Monster>, authToken: string): Promise<Monster> => {
        return apiRequest<Monster>(`/monsters/${id}`, {
            method: 'PUT',
            body: monsterData,
            authToken,
        });
    },

    deleteMonster: (id: string, authToken: string): Promise<void> => {
        return apiRequest<void>(`/monsters/${id}`, {
            method: 'DELETE',
            authToken,
        });
    },
};

// Spell API functions
export const spellsApi = {
    // Get all spells for server-side prefetching (no pagination)
    getAllSpells: (authToken?: string): Promise<SpellSummary[]> => {
        return apiRequest<SpellSummary[]>('/spells/all', authToken ? { authToken } : undefined);
    },

    // Get spells with pagination (SRD and custom)
    getSpellsInfinite: (params: PaginationParams = {}, authToken?: string): Promise<PaginatedResponse<SpellSummary>> => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.per_page) searchParams.append('per_page', params.per_page.toString());
        
        const url = `/spells${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
        return apiRequest<PaginatedResponse<SpellSummary>>(url, authToken ? { authToken } : undefined);
    },

    // Get all spells (SRD and custom)
    getSrdSpells: (): Promise<SpellSummary[]> => {
        return apiRequest<SpellSummary[]>('/srd-spells/all');
    },

    // Get a specific spell by ID (SRD or custom)
    getSrdSpellById: (index: string): Promise<Spell> => {
        return apiRequest<Spell>(`/srd-spells/${index}`);
    },

    getCustomSpellById: (index: string, authToken: string): Promise<Spell> => {
        return apiRequest<Spell>(`/spells/${index}`, { authToken });
    },

    // Get a specific spell by ID (could be SRD or custom)
    getSpellById: async (index: string, authToken: string): Promise<Spell> => {
        try {
            // Try SRD first
            return await apiRequest<Spell>(`/srd-spells/${index}`);
        } catch (error) {
            // If SRD fails and user is authenticated, try custom
            if (authToken) {
                return apiRequest<Spell>(`/spells/${index}`, { authToken });
            }
            throw error;
        }
    },

    // MUTATION FUNCTIONS
    createSpell: (spellData: Partial<Spell>, authToken: string): Promise<Spell> => {
        return apiRequest<Spell>('/spells', {
            method: 'POST',
            body: spellData,
            authToken,
        });
    },

    updateSpell: (id: string, spellData: Partial<Spell>, authToken: string): Promise<Spell> => {
        return apiRequest<Spell>(`/spells/${id}`, {
            method: 'PUT',
            body: spellData,
            authToken,
        });
    },

    deleteSpell: (id: string, authToken: string): Promise<void> => {
        return apiRequest<void>(`/spells/${id}`, {
            method: 'DELETE',
            authToken,
        });
    },
};

// Character API functions (for authenticated users)
export const charactersApi = {
    getAll: (authToken: string): Promise<Character[]> => {
        return apiRequest<Character[]>('/characters', { authToken });
    },

    getById: (index: string, authToken: string): Promise<Character> => {
        return apiRequest<Character>(`/characters/${index}`, { authToken });
    },

    // MUTATION FUNCTIONS
    createCharacter: (characterData: Partial<Character>, authToken: string): Promise<Character> => {
        return apiRequest<Character>('/characters', {
            method: 'POST',
            body: characterData,
            authToken,
        });
    },

    updateCharacter: (id: string, characterData: Partial<Character>, authToken: string): Promise<Character> => {
        return apiRequest<Character>(`/characters/${id}`, {
            method: 'PUT',
            body: characterData,
            authToken,
        });
    },

    deleteCharacter: (id: string, authToken: string): Promise<void> => {
        return apiRequest<void>(`/characters/${id}`, {
            method: 'DELETE',
            authToken,
        });
    },
};

// Encounter API functions (for authenticated users)
export const encountersApi = {
    getAll: (authToken: string): Promise<Encounter[]> => {
        return apiRequest<Encounter[]>('/encounters', { authToken });
    },

    getFolderNames: (authToken: string): Promise<string[]> => {
        return apiRequest<string[]>('/encounters/folders', { authToken });
    },

    // MUTATION FUNCTIONS
    createEncounter: (encounterData: Partial<Encounter>, authToken: string): Promise<Encounter> => {
        return apiRequest<Encounter>('/encounters', {
            method: 'POST',
            body: encounterData,
            authToken,
        });
    },

    updateEncounter: (id: string, encounterData: Partial<Encounter>, authToken: string): Promise<Encounter> => {
        return apiRequest<Encounter>(`/encounters/${id}`, {
            method: 'PUT',
            body: encounterData,
            authToken,
        });
    },

    deleteEncounter: (id: string, authToken: string): Promise<void> => {
        return apiRequest<void>(`/encounters/${id}`, {
            method: 'DELETE',
            authToken,
        });
    },
};