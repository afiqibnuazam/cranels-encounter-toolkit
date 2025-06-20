"use client"

import { GripVertical, Heart, ShieldHalf, X, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEncounterState, useEncounter } from "@/context/EncounterContext"
import { cn } from "@/lib/utils"
import { QuickAddCombatantDialog } from "./QuickAddCombatantDialog"

const EncounterTable = () => {
    const { combatants, isRunning, currentTurn, selectedCombatantId } = useEncounterState();
    const { removeCombatant, setSelectedCombatant } = useEncounter();

    const handleRemoveCombatant = (id: string) => () => {
        removeCombatant(id);
    };

    const handleCombatantClick = (id: string) => {
        setSelectedCombatant(id);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead className="w-[240px]">Name</TableHead>
                    <TableHead className="w-[80px]">
                        <div className="flex items-center justify-center">
                            <Heart color="white" fill="white" />
                        </div>
                    </TableHead>
                    <TableHead className="w-[40px] text-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="half-fill" x1="0" x2="1" y1="0" y2="0">
                                    <stop offset="50%" stopColor="white" /> {/* Half-filled color */}
                                    <stop offset="50%" stopColor="transparent" /> {/* Transparent for the other half */}
                                </linearGradient>
                            </defs>
                            <ShieldHalf color="white" fill="url(#half-fill)" />
                        </svg>
                    </TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {combatants.map((combatant, index) => {
                    const isCurrentTurn = isRunning && index === currentTurn;
                    const isSelected = selectedCombatantId === combatant.id;
                    
                    return (
                        <TableRow 
                            key={`${combatant.id}-${index}`}
                            className={cn(
                                "transition-colors",
                                !isCurrentTurn && !isSelected && "hover:bg-secondary/20",
                                isCurrentTurn && "bg-primary/20 border-l-4 border-l-primary",
                                isSelected && "bg-secondary/50 border-l-4 border-l-secondary"
                            )}
                            onClick={() => handleCombatantClick(combatant.id)}
                        >
                            <TableCell><GripVertical className="cursor-grab" /></TableCell>
                            <TableCell className="text-center">{combatant.initiative}</TableCell>
                            <TableCell className={cn(
                                isCurrentTurn && "font-bold"
                            )}>{combatant.name}</TableCell>
                            <TableCell className="text-center">{combatant.current_hit_points} / {combatant.max_hit_points}</TableCell>
                            <TableCell className="text-center">{combatant.armor_class}</TableCell>
                            <TableCell>None</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <X 
                                    className="cursor-pointer hover:text-red-500" 
                                    onClick={handleRemoveCombatant(combatant.id)} 
                                />
                            </TableCell>
                        </TableRow>
                    );
                })}
                
                {/* Quick Add Combatant Row */}
                <TableRow className="border-t-2">
                    <TableCell colSpan={7}>
                        <QuickAddCombatantDialog>
                            <Button
                                variant="ghost"
                                className="w-full h-8 text-muted-foreground cursor-pointer"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Combatant
                            </Button>
                        </QuickAddCombatantDialog>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default EncounterTable
