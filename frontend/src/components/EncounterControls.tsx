"use client";

import { Button } from "@/components/ui/button";
import { useEncounter } from "@/context/EncounterContext";
import {
    Play,
    Square,
    SkipForward,
    Save,
    Eraser,
    RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { InitiativeDialog } from "./InitiativeDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SaveEncounterDialog } from "./SaveEncounterDialog";

const EncounterControls = () => {
    const {
        combatants,
        status,
        isRunning,
        currentTurn,
        round,
        canSave,
        startEncounter,
        endEncounter,
        nextTurn,
        resetEncounter,
        resetToDraft,
        updateInitiatives,
    } = useEncounter();

    const handleStartEncounter = () => {
        if (combatants.length === 0) {
            toast.error("Add combatants before starting the encounter");
            return;
        }
    };

    const handleInitiativeConfirm = (
        initiatives: { index: string; initiative: number }[]
    ) => {
        updateInitiatives(initiatives);
        startEncounter();
        toast.success("Encounter started!");
    };

    const handleEndEncounter = () => {
        endEncounter();
        toast.success("Encounter ended!");
    };

    const handleNextTurn = () => {
        nextTurn();
        const currentCombatant = combatants[currentTurn];
        toast.info(`${currentCombatant?.name}'s turn`);
    };

    const handleResetEncounter = () => {
        resetEncounter();
        toast.success("Encounter cleared");
    };

    const handleResetToDraft = () => {
        resetToDraft();
        toast.success("Encounter reset to draft mode");
    };

    return (
        <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
            {/* Status Display */}
            <div className="flex items-center gap-2 mr-4">
                {combatants.length > 0 && (
                    <>
                        <span className="text-sm font-medium">Status:</span>
                        <Badge
                            variant="secondary"
                            className={cn(
                                "rounded-sm",
                                status === "draft"
                                    ? "bg-blue-100 text-blue-800"
                                    : status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                            )}
                        >
                            {status.toUpperCase()}
                        </Badge>
                    </>
                )}
                {isRunning && (
                    <span className="text-sm text-muted-foreground">Round {round}</span>
                )}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-2 ml-auto">
                {/* Start/End Encounter */}
                {status === "draft" && (
                    <InitiativeDialog
                        combatants={combatants}
                        onConfirm={handleInitiativeConfirm}
                    >
                        <Button
                            onClick={handleStartEncounter}
                            disabled={combatants.length === 0}
                            className="cursor-pointer"
                            size="icon"
                        >
                            <Play size={16} />
                        </Button>
                    </InitiativeDialog>
                )}

                {status === "active" && (
                    <>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleNextTurn}
                                    variant="default"
                                    className="cursor-pointer"
                                    size="icon"
                                >
                                    <SkipForward size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Next Turn</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleEndEncounter}
                                    variant="destructive"
                                    className="cursor-pointer"
                                    size="icon"
                                >
                                    <Square size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>End Encounter</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleResetToDraft}
                                    variant="outline"
                                    className="cursor-pointer"
                                    size="icon"
                                >
                                    <RotateCcw size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reset to Draft</TooltipContent>
                        </Tooltip>
                    </>
                )}

                {/* Save Encounter */}
                <SaveEncounterDialog>
                    <Button
                        disabled={!canSave}
                        variant="outline"
                        className="cursor-pointer"
                        size="icon"
                    >
                        <Save size={16} />
                    </Button>
                </SaveEncounterDialog>

                {/* Clear/Reset Encounter */}
                <AlertDialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button
                                    disabled={combatants.length === 0}
                                    variant="outline"
                                    className="cursor-pointer"
                                    size="icon"
                                >
                                    <Eraser size={16} />
                                </Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Clear Encounter</TooltipContent>
                    </Tooltip>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Clear Encounter</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to clear the encounter? All combatants
                                will be removed.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleResetEncounter}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                            >
                                Clear
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default EncounterControls;
