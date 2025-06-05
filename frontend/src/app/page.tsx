import EncounterTable from "@/components/EncounterTable";

export default function Home() {
  return (
    <div className="grid grid-cols-4 gap-4 h-[calc(100vh-84px)]">
      {/* BATTLE LOG */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        <h1 className="text-2xl font-light mb-4">Battle Log</h1>
        <div className="relative overflow-hidden bg-gray-200">
          
        </div>
      </div>
      {/* ENCOUNTER TABLE */}
      <div className="bg-primary-foreground p-4 rounded-lg col-span-2">
        <h1 className="text-2xl font-light mb-4">Combatants by Initiative</h1>
        <EncounterTable />
      </div>

      {/* COMBATANT INFO */}
      <div className="bg-primary-foreground p-4 rounded-lg">
        {/* <h1>No Combatant Selected</h1> */}
        <h1 className="text-2xl font-light mb-4">Selected Combatant</h1>
        {/* COLLAPSIBLE */}
        <div className="relative overflow-hidden bg-gray-200">
          {/* Image and Name */}
          <h2 className="text-xl font-bold">Name</h2>
          {/* Type */}
          <p>Type</p>
        </div>
          {/* AC, HP, Speed */}

        {/* STATS */}

        {/* Saving Throws, Skills, Senses, Damage Immunities, Languages, Challenge Rating, Proficiency Bonus */}

        {/* TRAITS */}

        {/* ACTIONS */}

        {/* LEGENDARY ACTIONS */}
      </div>
    </div>
  );
}
