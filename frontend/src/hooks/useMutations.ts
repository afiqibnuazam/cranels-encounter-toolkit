import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthentication } from '@/context/AuthenticationContext';
import { Monster } from '@/types/monster';
import { Spell } from '@/types/spell';
import { Character } from '@/components/reference-tables/characters/characters-columns';
import { Encounter } from '@/components/reference-tables/encounters/encounters-columns';
import { monstersApi, spellsApi, charactersApi, encountersApi } from '@/lib/api';

// MONSTER MUTATIONS
export function useCreateMonster() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (monsterData: Partial<Monster>) => {
            if (!authToken) throw new Error('Authentication required');
            return monstersApi.createMonster(monsterData, authToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['custom-monsters'] });
        },
    });
}

export function useUpdateMonster() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, monsterData }: { id: string; monsterData: Partial<Monster> }) => {
            if (!authToken) throw new Error('Authentication required');
            return monstersApi.updateMonster(id, monsterData, authToken);
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['custom-monsters'] });
            queryClient.invalidateQueries({ queryKey: ['monster-detail', id] });
        },
    });
}

export function useDeleteMonster() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            if (!authToken) throw new Error('Authentication required');
            return monstersApi.deleteMonster(id, authToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['custom-monsters'] });
        },
    });
}


// SPELL MUTATIONS
export function useCreateSpell() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (spellData: Partial<Spell>) => {
            if (!authToken) throw new Error('Authentication required');
            return spellsApi.createSpell(spellData, authToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['custom-spells'] });
        },
    });
}

export function useUpdateSpell() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, spellData }: { id: string; spellData: Partial<Spell> }) => {
            if (!authToken) throw new Error('Authentication required');
            return spellsApi.updateSpell(id, spellData, authToken);
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['custom-spells'] });
            queryClient.invalidateQueries({ queryKey: ['spell-detail', id] });
        },
    });
}

export function useDeleteSpell() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            if (!authToken) throw new Error('Authentication required');
            return spellsApi.deleteSpell(id, authToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['custom-spells'] });
        },
    });
}


// CHARACTER MUTATIONS
export function useCreateCharacter() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (characterData: Partial<Character>) => {
            if (!authToken) throw new Error('Authentication required');
            return charactersApi.createCharacter(characterData, authToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['characters'] });
        },
    });
}

export function useUpdateCharacter() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, characterData }: { id: string; characterData: Partial<Character> }) => {
            if (!authToken) throw new Error('Authentication required');
            return charactersApi.updateCharacter(id, characterData, authToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['characters'] });
        },
    });
}

export function useDeleteCharacter() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            if (!authToken) throw new Error('Authentication required');
            return charactersApi.deleteCharacter(id, authToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['characters'] });
        },
    });
}


// ENCOUNTER MUTATIONS
export function useCreateEncounter() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (encounterData: Partial<Encounter> | {
            name: string;
            status: 'draft' | 'active' | 'completed';
            current_round: number;
            current_turn_index?: string | null;
            combatants: Array<{
                index: string;
                unit_type: string;
                initiative: number;
                name: string;
                current_hit_points: number;
                max_hit_points: number;
                temporary_hit_points: number;
                armor_class: number;
                used_spell_slots?: Record<string, number>;
                action_used?: boolean;
                bonus_action_used?: boolean;
                reaction_used?: boolean;
                legendary_actions_used?: number;
                combatantable_type?: string;
                combatantable_id?: number | null;
            }>;
        }) => {
            if (!authToken) throw new Error('Must be logged in to save encounter');
            return encountersApi.createEncounter(encounterData, authToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['encounters'] });
        },
    });
}

export function useUpdateEncounter() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, encounterData }: { id: string; encounterData: Partial<Encounter> }) => {
            if (!authToken) throw new Error('Authentication required');
            return encountersApi.updateEncounter(id, encounterData, authToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['encounters'] });
        },
    });
}

export function useDeleteEncounter() {
    const { authToken } = useAuthentication();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            if (!authToken) throw new Error('Authentication required');
            return encountersApi.deleteEncounter(id, authToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['encounters'] });
        },
    });
}