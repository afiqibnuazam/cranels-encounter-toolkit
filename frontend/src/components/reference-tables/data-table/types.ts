import { ColumnDef } from "@tanstack/react-table";

export type ReferencePaneTab = "monsters" | "characters" | "spells" | "encounters";
export type GroupState = "none" | "type" | "challenge_rating" | "source" | "unit_type" | "level" | "school" | "tags";

export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    loading?: boolean
    error?: string | null
    tab: ReferencePaneTab
    activeTab?: string
    // New infinite scroll props
    hasNextPage?: boolean;
    fetchNextPage?: () => void;
    isFetchingNextPage?: boolean;
    enableVirtualization?: boolean;
}

export interface ButtonConfig {
    icon: React.ReactNode;
    tooltip: string;
    variant: "default" | "outline";
}