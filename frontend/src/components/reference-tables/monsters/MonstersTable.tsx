
import { columns } from "./monsters-columns";
import { ReferencePaneDataTable } from "../data-table/DataTable";
import { useMonsters } from "@/hooks/useQueries";

const MonstersTable = () => {
    const { data: monsters, isLoading, error } = useMonsters();

    return (
        <ReferencePaneDataTable
            columns={columns}
            data={monsters || []}
            loading={isLoading}
            error={error?.message || null}
            tab="monsters"
        />
    );
}

export default MonstersTable;