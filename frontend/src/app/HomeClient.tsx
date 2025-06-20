"use client"

import EncounterControls from "@/components/EncounterControls";
import EncounterTable from "@/components/EncounterTable";
import CombatantInfo from "@/components/CombatantInfo";
import { useEncounterState } from "@/context/EncounterContext";

export default function HomeClient() {
    const { isRunning } = useEncounterState();

    return (
        <div className="h-[calc(100vh-84px)]">
            <div className="relative h-full grid grid-cols-4 gap-4">
                {/* BATTLE LOG */}
                <div className="bg-primary-foreground p-4 rounded-md h-full">
                    <div className="relative flex flex-col h-full">
                        <h1 className="text-2xl font-light mb-4">Battle Log</h1>
                        <div className="relative overflow-hidden bg-gray-200">

                        </div>
                    </div>
                </div>

                {/* ENCOUNTER TABLE */}
                <div className="bg-primary-foreground p-4 rounded-md col-span-2">
                    <h1 className="text-2xl font-light mb-4">Combatants by Initiative</h1>
                    <EncounterControls />
                    <EncounterTable />
                </div>

                {/* COMBATANT INFO */}
                <div className="bg-primary-foreground p-4 rounded-md h-full">
                    <div className="relative flex flex-col h-full">
                        <CombatantInfo />
                    </div>
                </div>
            </div>
        </div>
    );
} 