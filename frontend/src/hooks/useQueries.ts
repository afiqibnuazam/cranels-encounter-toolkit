import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { monstersApi, spellsApi, charactersApi, encountersApi } from "@/lib/api";
import { Monster, MonsterSummary } from "@/types/monster";
import { Spell, SpellSummary } from "@/types/spell";
import { Character } from "@/components/reference-tables/characters/characters-columns";
import { Encounter } from "@/components/reference-tables/encounters/encounters-columns";
import { useAuthentication } from "@/context/AuthenticationContext";
import { useMemo } from "react";


// Query key factories
export const queryKeys = {
    monsters: {
        all: (authToken?: string) => ['monsters', { authToken: !!authToken }] as const,
        detail: (id: string, authToken?: string) => ['monsters', id, { authToken: !!authToken }] as const,
    },
    spells: {
        all: (authToken?: string) => ['spells', { authToken: !!authToken }] as const,
        detail: (id: string, authToken?: string) => ['spells', id, { authToken: !!authToken }] as const,
    },
    characters: {
        all: (authToken: string) => ['characters', { authToken }] as const,
    },
    encounters: {
        all: (authToken: string) => ['encounters', { authToken }] as const,
    },
};

// MONSTER HOOKS
// export function useMonsters() {
//     const { authToken } = useAuthentication();

//     const results = useQueries({
//         queries: [
//             {
//                 queryKey: ['srd-monsters'],
//                 queryFn: () => monstersApi.getSrdMonsters(),
//                 staleTime: 10 * 60 * 1000,
//             },
//             {
//                 queryKey: ['custom-monsters', authToken],
//                 queryFn: () => monstersApi.getCustomMonsters(authToken!),
//                 enabled: !!authToken,
//                 staleTime: 5 * 60 * 1000,
//             }
//         ]
//     });

//     const [srdQuery, customQuery] = results;

//     return {
//         data: useMemo(() => {
//             const srdMonsters = srdQuery.data || [];
//             const customMonsters = customQuery.data || [];
//             return [...srdMonsters, ...customMonsters].sort((a, b) => a.name.localeCompare(b.name));
//         }, [srdQuery.data, customQuery.data]),

//         isLoading: results.some(result => result.isLoading),
//         error: results.find(result => result.error)?.error || null,
//         isError: results.some(result => result.isError),
//     };
// }
export function useMonsters() {
    const { authToken } = useAuthentication();
    
    const query = useQuery({
        queryKey: ["get-monsters", authToken],
        queryFn: () => monstersApi.getAllMonsters(authToken || undefined),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        allMonsters: query.data || [],
        isLoading: query.isLoading,
        error: query.error,
    };
}

export function useMonster(
    index: string,
    dataSource?: 'srd' | 'custom',
    enabled: boolean = true
): UseQueryResult<Monster, Error> {
    const { authToken } = useAuthentication();

    return useQuery({
        // queryKey: queryKeys.monsters.detail(id, authToken ?? undefined),
        queryKey: ['monster-detail', index, dataSource, !!authToken],
        queryFn: () => {
            if (dataSource === 'srd') {
                return monstersApi.getSrdMonsterById(index);
            } else if (dataSource === 'custom') {
                return monstersApi.getCustomMonsterById(index, authToken!);
            }

            return monstersApi.getMonsterById(index, authToken!);
        },
        enabled: enabled && !!index,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

// SPELL HOOKS
export function useSpells() {
    const { authToken } = useAuthentication();

    const query = useQuery({
        queryKey: ["get-spells", authToken],
        queryFn: () => spellsApi.getAllSpells(authToken || undefined),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        allSpells: query.data || [],
        isLoading: query.isLoading,
        error: query.error,
    };
}

export function useSpell(
    index: string,
    dataSource?: 'srd' | 'custom',
    enabled: boolean = true
): UseQueryResult<Spell, Error> {
    const { authToken } = useAuthentication();

    return useQuery({
        // queryKey: queryKeys.spells.detail(id, authToken ?? undefined),
        queryKey: ['spell-detail', index, dataSource, !!authToken],
        queryFn: () => {
            if (dataSource === 'srd') {
                return spellsApi.getSrdSpellById(index);
            } else if (dataSource === 'custom') {
                return spellsApi.getCustomSpellById(index, authToken!);
            }

            return spellsApi.getSpellById(index, authToken!);
        },
        enabled: enabled && !!index,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

// CHARACTER HOOKS (authenticated users only)
export function useCharacters(): UseQueryResult<Character[], Error> {
    const { authToken } = useAuthentication();

    return useQuery({
        queryKey: queryKeys.characters.all(authToken!),
        queryFn: () => charactersApi.getAll(authToken!),
        enabled: !!authToken,
        staleTime: 2 * 60 * 1000, // 2 minutes (more dynamic data)
    });
}

// ENCOUNTER HOOKS (authenticated users only)
export function useEncounters(): UseQueryResult<Encounter[], Error> {
    const { authToken } = useAuthentication();

    return useQuery({
        queryKey: queryKeys.encounters.all(authToken!),
        queryFn: () => encountersApi.getAll(authToken!),
        enabled: !!authToken,
        staleTime: 2 * 60 * 1000, // 2 minutes (more dynamic data)
    });
}
