import React from 'react'
import { SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import LibraryReference from '@/components/LibraryReference'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import MonstersTable from './reference-tables/monsters/MonstersTable'
import CharactersTable from './reference-tables/characters/CharactersTable'
import SpellsTable from './reference-tables/spells/SpellsTable'
import EncountersTable from './reference-tables/encounters/EncountersTable'


const ReferencePane = () => {
    return (
        <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <Tabs defaultValue='monsters'>
                <SheetHeader>
                    <SheetTitle>Reference Pane</SheetTitle>
                    <SheetDescription>

                    </SheetDescription>
                </SheetHeader>
                <div className="px-2 flex flex-col gap-2">
                    <TabsContent value="monsters">Add Combatant</TabsContent>
                    <TabsContent value="characters">Add Combatant</TabsContent>
                    <TabsContent value="spells">Reference Spells</TabsContent>
                    <TabsContent value="encounters">Load Encounter</TabsContent>
                    <TabsList>
                        <TabsTrigger value='monsters'>Monsters</TabsTrigger>
                        <TabsTrigger value='characters'>Characters</TabsTrigger>
                        <TabsTrigger value='spells'>Spells</TabsTrigger>
                        <TabsTrigger value='encounters'>Encounters</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[600px] w-full">
                        <TabsContent value="monsters">
                            <MonstersTable />
                        </TabsContent>
                        <TabsContent value="characters">
                            <CharactersTable />
                        </TabsContent>
                        <TabsContent value="spells">
                            <SpellsTable />
                        </TabsContent>
                        <TabsContent value="encounters">
                            <EncountersTable />
                        </TabsContent>
                    </ScrollArea>
                </div>
                <SheetFooter className="flex items-end">
                    <TabsContent value="monsters">
                        <Button className="w-24">
                            Add New
                        </Button>
                    </TabsContent>
                    <TabsContent value="characters">
                        <Button className="w-24">
                            Add New
                        </Button>
                    </TabsContent>
                    <TabsContent value="spells">
                        <Button className="w-24">
                            Add New
                        </Button>
                    </TabsContent>
                    <TabsContent value="encounters">
                        <Button className="w-32">
                            Save Encounter
                        </Button>
                    </TabsContent>

                </SheetFooter>
            </Tabs>
        </SheetContent>
    )
}

export default ReferencePane