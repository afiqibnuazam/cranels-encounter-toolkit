import { Monster, MonsterSummary } from "@/types/monster";
import { Spell, SpellSummary } from "@/types/spell";
import { Character } from "@/components/reference-tables/characters/characters-columns";
import { Encounter } from "@/components/reference-tables/encounters/encounters-columns";
import { get } from "http";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Generic fetch function with auth support
async function apiRequest<T>(
    endpoint: string,
    authToken?: string
): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText}`);
    }

    return response.json();
}

// Monster API functions
export const monstersApi = {
    getSrdMonsters: (): Promise<MonsterSummary[]> => {
        return apiRequest<MonsterSummary[]>('/srd-monsters');
    },

    getCustomMonsters: (authToken: string): Promise<MonsterSummary[]> => {
        return apiRequest<MonsterSummary[]>('/monsters', authToken);
    },

    getSrdMonsterById: (index: string): Promise<Monster> => {
        return apiRequest<Monster>(`/srd-monsters/${index}`);
    },

    getCustomMonsterById: (index: string, authToken: string): Promise<Monster> => {
        return apiRequest<Monster>(`/monsters/${index}`, authToken);
    },

    // Get a specific monster by ID (could be SRD or custom)
    getMonsterById: async (index: string, authToken: string): Promise<Monster> => {
        try {
            // Try SRD first
            return await apiRequest<Monster>(`/srd-monsters/${index}`);
        } catch (error) {
            // If SRD fails and user is authenticated, try custom
            if (authToken) {
                return apiRequest<Monster>(`/monsters/${index}`, authToken);
            }
            throw error;
        }
    },
};

// Spell API functions
export const spellsApi = {
    getSrdSpells: (): Promise<SpellSummary[]> => {
        return apiRequest<SpellSummary[]>('/srd-spells');
    },

    getCustomSpells: (authToken: string): Promise<SpellSummary[]> => {
        return apiRequest<SpellSummary[]>('/spells', authToken);
    },

    getSrdSpellById: (index: string): Promise<Spell> => {
        return apiRequest<Spell>(`/srd-spells/${index}`);
    },

    getCustomSpellById: (index: string, authToken: string): Promise<Spell> => {
        return apiRequest<Spell>(`/spells/${index}`, authToken);
    },

    // Get a specific spell by ID (could be SRD or custom)
    getSpellById: async (index: string, authToken: string): Promise<Spell> => {
        try {
            // Try SRD first
            return await apiRequest<Spell>(`/srd-spells/${index}`);
        } catch (error) {
            // If SRD fails and user is authenticated, try custom
            if (authToken) {
                return apiRequest<Spell>(`/spells/${index}`, authToken);
            }
            throw error;
        }
    },
};

// Character API functions (for authenticated users)
export const charactersApi = {
    getAll: (authToken: string): Promise<Character[]> => {
        return apiRequest<Character[]>('/characters', authToken);
    },
};

// Encounter API functions (for authenticated users)
export const encountersApi = {
    getAll: (authToken: string): Promise<Encounter[]> => {
        return apiRequest<Encounter[]>('/encounters', authToken);
    },
};
