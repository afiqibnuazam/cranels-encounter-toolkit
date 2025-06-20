import { QueryClient } from "@tanstack/react-query";
import { monstersApi, spellsApi } from "./api";

// Server-side prefetch function for monsters
export async function prefetchMonsters(queryClient: QueryClient, authToken?: string) {
    await queryClient.prefetchQuery({
        queryKey: ["get-monsters", authToken],
        queryFn: () => monstersApi.getAllMonsters(authToken),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

// Server-side prefetch function for infinite monsters (TODO: Need to double check this)
export async function prefetchInfiniteMonsters(queryClient: QueryClient, authToken?: string) {
    await queryClient.prefetchInfiniteQuery({
        queryKey: ["monsters-infinite", authToken],
        queryFn: () => monstersApi.getMonstersInfinite({ page: 0, per_page: 50 }, authToken),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.next_page,
    });
}


// Server-side prefetch function for spells (TODO: Need to double check this)
export async function prefetchSpells(queryClient: QueryClient, authToken?: string) {
    await queryClient.prefetchQuery({
        queryKey: ["get-spells", authToken],
        queryFn: () => spellsApi.getAllSpells(authToken),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
} 