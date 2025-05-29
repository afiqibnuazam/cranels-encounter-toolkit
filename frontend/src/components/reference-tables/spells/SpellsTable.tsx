import { SquarePen, Search } from "lucide-react";
import { useFetchData } from "@/hooks/useFetchData";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface Spell {
    index: string;
    name: string;
    level: number;
    // url: string;
}

const SpellsTable = () => {
    const { data: spells, loading, error } = useFetchData<Spell>('/spells');

    const iconSize = 18;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                Loading spells...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[600px] text-red-500">
                {error}
            </div>
        );
    }

    if (spells?.length === 0) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                No spells available or failed to load.
            </div>
        );
    }

    return (
        <Table>
            <TableBody>
                {spells?.map((spell) => (
                    <TableRow key={spell.index} className="h-16">
                        {/* SPELL NAME */}
                        <TableCell className="font-medium">{spell.name}</TableCell>
                        {/* EDIT */}
                        <TableCell>
                            <SquarePen size={iconSize} />
                        </TableCell>
                        {/* INFO */}
                        <TableCell>
                            <Search size={iconSize} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default SpellsTable