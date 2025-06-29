"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronUp, ChevronDown, Dices } from "lucide-react"
import { Combatant } from "@/context/EncounterContext"
import { getAbilityModifier } from "@/types/monster"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { rollD20 } from "@/lib/dice"

interface InitiativeRoll {
    index: string
    name: string
    initiative: number
    dexterityModifier: number
    dexterity: number
}

interface InitiativeDialogProps {
    combatants: Combatant[]
    onConfirm: (initiatives: { index: string; initiative: number }[]) => void
    children: React.ReactNode
}

// Helper function to calculate dexterity modifier from actual dexterity score
const getDexterityModifier = (combatant: Combatant): number => {
    // Use actual dexterity score if available, otherwise default to 10 (modifier of 0)
    const dexterity = combatant.dexterity || 10;
    return getAbilityModifier(dexterity);
}

export function InitiativeDialog({ combatants, onConfirm, children }: InitiativeDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [initiatives, setInitiatives] = useState<InitiativeRoll[]>([])

    // Auto-roll initiatives when dialog opens - maintain original order
    useEffect(() => {
        if (isOpen && combatants.length > 0) {
            const initialRolls = combatants.map(combatant => {
                const dexMod = getDexterityModifier(combatant)
                const roll = rollD20()
                return {
                    index: combatant.index,
                    name: combatant.name,
                    initiative: roll + dexMod,
                    dexterityModifier: dexMod,
                    dexterity: combatant.dexterity || 10
                }
            })
            // Don't sort - maintain original order from EncounterTable
            setInitiatives(initialRolls)
        }
    }, [isOpen, combatants])

    const handleInitiativeChange = (index: string, newValue: number) => {
        setInitiatives(prev =>
            prev.map(init =>
                init.index === index
                    ? { ...init, initiative: Math.max(1, Math.min(30, newValue)) }
                    : init
            )
            // Don't sort - maintain original order
        )
    }

    const handleRerollSingle = (index: string) => {
        setInitiatives(prev =>
            prev.map(init => {
                if (init.index === index) {
                    const roll = rollD20()
                    return { ...init, initiative: roll + init.dexterityModifier }
                }
                return init
            })
            // Don't sort - maintain original order
        )
    }

    const handleRerollAll = () => {
        setInitiatives(prev =>
            prev.map(init => {
                const roll = rollD20()
                return { ...init, initiative: roll + init.dexterityModifier }
            })
            // Don't sort - maintain original order
        )
    }

    const handleConfirm = () => {
        const initiativeUpdates = initiatives.map(init => ({
            index: init.index,
            initiative: init.initiative
        }))
        onConfirm(initiativeUpdates)
    }


    return (
        <Dialog onOpenChange={setIsOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        {children}
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    Start Encounter
                </TooltipContent>
            </Tooltip>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Dices className="h-5 w-5" />
                        Roll Initiative
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Roll initiative for all combatants in the encounter. You can adjust the initiative values manually if needed.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            Initiative has been rolled for all combatants
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRerollAll}
                            className="flex items-center gap-1 cursor-pointer"
                        >
                            <Dices className="h-3 w-3" />
                            Reroll All
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {initiatives.map((init) => (
                            <div key={init.index} className="flex items-center gap-2 p-2 border rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{init.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Dex Mod: {init.dexterityModifier >= 0 ? '+' : ''}{init.dexterityModifier}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 cursor-pointer"
                                        onClick={() => handleInitiativeChange(init.index, init.initiative + 1)}
                                    >
                                        <ChevronUp className="h-3 w-3" />
                                    </Button>

                                    <Input
                                        type="number"
                                        value={init.initiative}
                                        onChange={(e) => handleInitiativeChange(init.index, parseInt(e.target.value) || 1)}
                                        className="w-16 h-8 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        min={1}
                                        max={30}
                                    />

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 cursor-pointer"
                                        onClick={() => handleInitiativeChange(init.index, init.initiative - 1)}
                                    >
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 cursor-pointer"
                                        onClick={() => handleRerollSingle(init.index)}
                                        title="Reroll initiative"
                                    >
                                        <Dices className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="destructive" className="cursor-pointer">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleConfirm} className="hover:cursor-pointer">
                        Start Encounter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
