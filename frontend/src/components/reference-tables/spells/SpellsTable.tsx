import { ReferencePaneDataTable } from "../data-table/DataTable";
import { columns } from "./spells-columns";
import { useSpells } from "@/hooks/useQueries";


const SpellsTable = () => {
    const { allSpells: spells, isLoading, error } = useSpells();

    return (
        <ReferencePaneDataTable
            columns={columns}
            data={spells || []}
            loading={isLoading}
            error={error?.message || null}
            tab="spells"
        />
    )
}

export default SpellsTable