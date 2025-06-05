import { ReferencePaneDataTable } from "../data-table/DataTable";
import { columns } from "./encounters-columns";
import { useEncounters } from "@/hooks/useQueries";

const EncountersTable = () => {
    const { data: encounters, isLoading, error } = useEncounters();

    return (
        <ReferencePaneDataTable
            columns={columns}
            data={encounters || []}
            loading={isLoading}
            error={error?.message || null}
            tab="encounters"
        />
    );
}

export default EncountersTable