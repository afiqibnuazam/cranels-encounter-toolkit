import { ReferencePaneDataTable } from "../data-table/DataTable"
import { columns } from "./characters-columns";
import { useCharacters } from "@/hooks/useQueries";


const CharactersTable = () => {
    const { data: characters, isLoading, error } = useCharacters();

    return (
        <ReferencePaneDataTable
            columns={columns}
            data={characters || []}
            loading={isLoading}
            error={error?.message || null}
            tab="characters"
        />
    );
}

export default CharactersTable