import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { prefetchInfiniteMonsters, prefetchMonsters, prefetchSpells } from "@/lib/prefetch";
import HomeClient from "./HomeClient";

export default async function Home() {
    const queryClient = new QueryClient();

    // Prefetch monster data on the server
    await prefetchInfiniteMonsters(queryClient);
    await prefetchSpells(queryClient);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <HomeClient />
        </HydrationBoundary>
    );
}
