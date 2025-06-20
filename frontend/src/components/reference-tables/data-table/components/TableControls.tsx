import React from "react";
import { Table as TanstackTable } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowDownAZ } from "lucide-react";
import { ReferencePaneTab, ButtonConfig } from "../types";

interface TableControlsProps<TData> {
    table: TanstackTable<TData>;
    tab: ReferencePaneTab;
    buttonProps: ButtonConfig;
    onCycleGroup: () => void;
}

export function TableControls<TData>({
    table,
    tab,
    buttonProps,
    onCycleGroup,
}: TableControlsProps<TData>) {
    return (
        <div className="flex items-center pb-2 space-x-1">
            <Input
                placeholder="Filter..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm rounded-none"
            />

            {(tab === "monsters" || tab === "characters" || tab === "spells") && (
                <>
                    {tab !== "spells" && (
                        <Button
                            variant="outline"
                            className="hover:bg-secondary hover:text-primary rounded-none"
                        >
                            <ArrowDownAZ />
                        </Button>
                    )}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={buttonProps.variant}
                                className="hover:bg-secondary hover:text-primary cursor-pointer rounded-none"
                                onClick={onCycleGroup}
                            >
                                {buttonProps.icon}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{buttonProps.tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </>
            )}
        </div>
    );
}