import { useInfiniteQuery } from "@tanstack/react-query";
import { monstersApi, spellsApi } from "@/lib/api";
import { useAuthentication } from "@/context/AuthenticationContext";
import { useMemo } from "react";


// INFINITE MONSTER HOOK
export function useInfiniteMonsters() {
    const { authToken } = useAuthentication();

    // const query = useInfiniteQuery({
    //     queryKey: ["monsters-infinite", authToken],
    //     queryFn: ({ pageParam = 1 }) =>
    //         monstersApi.getMonstersInfinite({ page: pageParam, per_page: 50 }, authToken || undefined),
    //     getNextPageParam: (lastPage) => lastPage.next_page,
    //     initialPageParam: 1,
    //     refetchOnMount: true,
    //     staleTime: 10 * 60 * 1000, // 10 minutes
    // });
    const query = useInfiniteQuery({
        queryKey: ["monsters-infinite", authToken],
        queryFn: ({ pageParam }) =>
            monstersApi.getMonstersInfinite({ page: pageParam, per_page: 50 }, authToken || undefined),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.next_page,
    });

    return {
        allMonsters: useMemo(
            () => (query.data ? query.data.pages.flatMap((page) => page.data) : []),
            [query.data]
        ),
        isLoading: query.isLoading,
        error: query.error,
        hasNextPage: query.hasNextPage,
        fetchNextPage: query.fetchNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
    };
}

// INFINITE SPELL HOOKS
export function useInfiniteSrdSpells() {
    return useInfiniteQuery({
        queryKey: ['srd-spells-infinite'],
        queryFn: ({ pageParam = 1 }) => 
            spellsApi.getSrdSpellsInfinite({ page: pageParam, per_page: 50 }),
        getNextPageParam: (lastPage) => lastPage.next_page,
        initialPageParam: 1,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useInfiniteCustomSpells() {
    const { authToken } = useAuthentication();
    
    return useInfiniteQuery({
        queryKey: ['custom-spells-infinite', authToken],
        queryFn: ({ pageParam = 1 }) => 
            spellsApi.getCustomSpellsInfinite({ 
                page: pageParam, 
                per_page: 50, 
                authToken: authToken! 
            }),
        getNextPageParam: (lastPage) => lastPage.next_page,
        initialPageParam: 1,
        enabled: !!authToken,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useInfiniteSpells() {
    const srdQuery = useInfiniteSrdSpells();
    const customQuery = useInfiniteCustomSpells();

    return {
        srdSpells: useMemo(() => 
            srdQuery.data ? srdQuery.data.pages.flatMap(page => page.data) : []
        , [srdQuery.data]),
        
        customSpells: useMemo(() => 
            customQuery.data ? customQuery.data.pages.flatMap(page => page.data) : []
        , [customQuery.data]),

        allSpells: useMemo(() => {
            const srd = srdQuery.data ? srdQuery.data.pages.flatMap(page => page.data) : [];
            const custom = customQuery.data ? customQuery.data.pages.flatMap(page => page.data) : [];
            return [...srd, ...custom].sort((a, b) => a.name.localeCompare(b.name));
        }, [srdQuery.data, customQuery.data]),

        // SRD query states
        srdIsLoading: srdQuery.isLoading,
        srdError: srdQuery.error,
        srdHasNextPage: srdQuery.hasNextPage,
        srdFetchNextPage: srdQuery.fetchNextPage,
        srdIsFetchingNextPage: srdQuery.isFetchingNextPage,

        // Custom query states  
        customIsLoading: customQuery.isLoading,
        customError: customQuery.error,
        customHasNextPage: customQuery.hasNextPage,
        customFetchNextPage: customQuery.fetchNextPage,
        customIsFetchingNextPage: customQuery.isFetchingNextPage,

        // Combined states
        isLoading: srdQuery.isLoading || customQuery.isLoading,
        error: srdQuery.error || customQuery.error,
        hasNextPage: srdQuery.hasNextPage || customQuery.hasNextPage,
    };
}