import { columns } from "./monsters-columns";
import { ReferencePaneDataTable } from "../data-table/DataTable";
import { useMonsters } from "@/hooks/useQueries";
import { useInfiniteMonsters, usePrefetchedMonsters } from "@/hooks/useInfiniteQueries";

interface MonstersTableProps {
    activeTab: string;
}

const MonstersTable = ({ activeTab }: MonstersTableProps) => {
    // Use prefetched data for better performance and immediate search/filter
    const {
        allMonsters,
        isLoading,
        error,
        // hasNextPage,
        // fetchNextPage,
        // isFetchingNextPage,
    } = useMonsters();
    // } = usePrefetchedMonsters();
    // } = useInfiniteMonsters();

    // Fallback to regular query if infinite query is not available
    const fallback = useMonsters();

    // const handleFetchNextPage = () => {
    //     if (hasNextPage) {
    //         fetchNextPage();
    //     }
    // };
    // Use prefetched data if available, otherwise fallback to regular data
    const data = allMonsters?.length > 0 ? allMonsters : (fallback.data || []);
    const loading = isLoading || fallback.isLoading;
    const errorMessage = error?.message || fallback.error?.message || null;

    return (
        <ReferencePaneDataTable
            columns={columns}
            data={data}
            loading={loading}
            error={errorMessage}
            tab="monsters"
            activeTab={activeTab}
            // hasNextPage={hasNextPage}
            // fetchNextPage={handleFetchNextPage}
            // fetchNextPage={fetchNextPage}
            // isFetchingNextPage={isFetchingNextPage}
            // enableInfiniteScroll={true} // Enable infinite scroll
            enableVirtualization={false} // Disable virtualization since all data is loaded
        />
    );
}

export default MonstersTable;