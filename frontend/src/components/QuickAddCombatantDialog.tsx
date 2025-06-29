"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEncounter } from "@/context/EncounterContext";
import { toast } from "sonner";
import { rollD20 } from "@/lib/dice";
import { D20Icon } from "@/components/icons/DiceIcons";
import { renderUnitType, UNIT_TYPES, UnitType } from "@/types";

interface QuickAddCombatantDialogProps {
    children: React.ReactNode;
}

export function QuickAddCombatantDialog({ children }: QuickAddCombatantDialogProps) {
    const { addCombatant, isRunning } = useEncounter();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        max_hit_points: '',
        armor_class: '',
        initiative: '',
        unit_type: 'enemy_npc' as UnitType
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.max_hit_points || !formData.armor_class) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (isRunning && !formData.initiative) {
            toast.error("Initiative is required when encounter is active");
            return;
        }

        const combatantData = {
            name: formData.name,
            current_hit_points: parseInt(formData.max_hit_points),
            max_hit_points: parseInt(formData.max_hit_points),
            temporary_hit_points: 0,
            armor_class: parseInt(formData.armor_class),
            initiative: isRunning ? parseInt(formData.initiative) || 0 : 0,
            unit_type: formData.unit_type,
            dexterity: 10, // Default dexterity for initiative calculations
            effects: [], // Initialize empty effects array
        };

        addCombatant(combatantData);

        // Reset form and close dialog
        setFormData({
            name: '',
            max_hit_points: '',
            armor_class: '',
            initiative: '',
            unit_type: 'enemy_npc'
        });
        setIsOpen(false);
        toast.success("Combatant added successfully!");
    };

    const rollInitiative = () => {
        const roll = rollD20();
        setFormData(prev => ({ ...prev, initiative: roll.toString() }));
    };

    const handleCancel = () => {
        setFormData({
            name: '',
            max_hit_points: '',
            armor_class: '',
            initiative: '',
            unit_type: 'enemy_npc'
        });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Quick Add Combatant</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="gap-1">Name<span className="text-destructive">*</span></Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Combatant name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit_type" className="gap-1">Type<span className="text-destructive">*</span></Label>
                            <Select
                                value={formData.unit_type}
                                onValueChange={(value: UnitType) =>
                                    setFormData(prev => ({ ...prev, unit_type: value }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNIT_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {renderUnitType(type as UnitType)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="max_hp" className="gap-1">Max HP<span className="text-destructive">*</span></Label>
                            <Input
                                id="max_hp"
                                type="number"
                                min="1"
                                value={formData.max_hit_points}
                                onChange={(e) => setFormData(prev => ({ ...prev, max_hit_points: e.target.value }))}
                                placeholder="Hit points"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ac" className="gap-1">Armor Class<span className="text-destructive">*</span></Label>
                            <Input
                                id="ac"
                                type="number"
                                min="1"
                                value={formData.armor_class}
                                onChange={(e) => setFormData(prev => ({ ...prev, armor_class: e.target.value }))}
                                placeholder="AC"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="initiative" className="gap-1">
                            Initiative {isRunning && <span className="text-destructive">*</span>}
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="initiative"
                                type="number"
                                value={formData.initiative}
                                onChange={(e) => setFormData(prev => ({ ...prev, initiative: e.target.value }))}
                                placeholder={isRunning ? "Required" : "Optional"}
                                required={isRunning}
                                disabled={!isRunning}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={rollInitiative}
                                disabled={!isRunning}
                                className="cursor-pointer"
                                title="Roll initiative"
                                aria-label="Roll initiative"
                            >
                                <D20Icon />
                            </Button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleCancel} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" className="cursor-pointer">
                            Add Combatant
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 