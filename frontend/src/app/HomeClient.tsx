"use client"

import EncounterControls from "@/components/EncounterControls";
import EncounterTable from "@/components/EncounterTable";
import CombatantInfo from "@/components/CombatantInfo";
import CombatantControl from "@/components/combatant-controls/CombatantControl";

export default function HomeClient() {
    return (
        <div className="h-[calc(100vh-84px)]">
            <div className="relative h-full grid grid-cols-4 gap-4">
                {/* BATTLE LOG */}
                <div className="px-1 border-y-3 border-y-primary">
                    <div className="bg-primary-foreground p-3 h-full ">
                        <div className="relative flex flex-col h-full">
                            <div className="h-full">
                                <h1 className="text-2xl font-light mb-2">Battle Log</h1>
                                <div className="relative overflow-hidden bg-secondary/20 h-[calc(100vh-172px)] pr-4">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ENCOUNTER TABLE */}
                <div className="col-span-2">
                    <div className="h-full">
                        <div className="relative flex flex-col h-full gap-4">
                            <div className="bg-primary-foreground p-4 h-[calc(100%-176px)]">
                                <h1 className="text-2xl font-light mb-4">Combatants by Initiative</h1>
                                <EncounterControls />
                                <EncounterTable />
                            </div>
                            <div className="h-40">
                                <CombatantControl />
                            </div>
                        </div>
                    </div>
                </div>

                {/* COMBATANT INFO */}
                <div className="px-1 border-y-3 border-y-primary">
                    <div className="bg-primary-foreground p-3 h-full ">
                        <div className="relative flex flex-col h-full">
                            <CombatantInfo />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 