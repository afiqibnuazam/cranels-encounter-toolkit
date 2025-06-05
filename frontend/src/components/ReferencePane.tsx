import React from 'react'
import { SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import MonstersTable from './reference-tables/monsters/MonstersTable'
import CharactersTable from './reference-tables/characters/CharactersTable'
import SpellsTable from './reference-tables/spells/SpellsTable'
import EncountersTable from './reference-tables/encounters/EncountersTable'
import { useAuthentication } from '@/context/AuthenticationContext'
import Link from 'next/link'
import { Plus } from 'lucide-react'


const ReferencePane = () => {
    const { authToken } = useAuthentication();

    return (
        <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <Tabs defaultValue="monsters" className="h-full flex flex-col">
                <SheetHeader className="h-16">
                    <SheetTitle className="text-2xl">Reference Pane</SheetTitle>
                    {/* <SheetDescription>
                    </SheetDescription> */}
                </SheetHeader>
                <div className="px-2 flex flex-col gap-2">
                    <TabsContent value="monsters">Add Combatant</TabsContent>
                    <TabsContent value="characters">Add Combatant</TabsContent>
                    <TabsContent value="spells">Reference Spells</TabsContent>
                    <TabsContent value="encounters">Load Encounter</TabsContent>

                    <TabsList className="rounded-none">
                        <TabsTrigger value="monsters" className="rounded-non">Monsters</TabsTrigger>
                        <TabsTrigger value="characters" className="rounded-none">Characters</TabsTrigger>
                        <TabsTrigger value="spells" className="rounded-none">Spells</TabsTrigger>
                        <TabsTrigger value="encounters" className="rounded-none">Encounters</TabsTrigger>
                    </TabsList>

                    <TabsContent value="monsters">
                        <MonstersTable />
                        {/* Quick Add */}
                    </TabsContent>
                    <TabsContent value="characters">
                        {authToken ? (
                            <CharactersTable />
                        ) : (
                            <div className="items-center text-center text-sm text-muted-foreground">
                                <p>Please <Link href="/auth" className="text-blue-500">sign in</Link> to view your characters.</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="spells">
                        <SpellsTable />
                    </TabsContent>
                    <TabsContent value="encounters">
                        {authToken ? (
                            <EncountersTable />
                        ) : (
                            <div className="items-center text-center text-sm text-muted-foreground">
                                <p>Please <Link href="/auth" className="text-blue-500">sign in</Link> to view your encounters.</p>
                            </div>
                        )}
                    </TabsContent>
                </div>
                <SheetFooter className="flex items-end h-16">
                    <TabsContent value="monsters">
                        {authToken ? (
                            <Button className="w-24">
                                Add New
                            </Button>
                        ) : (
                            <span><Link href="/auth" className="text-blue-500">Sign in</Link> to add custom monsters</span>
                        )}
                    </TabsContent>
                    <TabsContent value="characters">
                        {authToken ? (
                            <Button className="w-24">
                                Add New
                            </Button>
                        ) : (
                            <span><Link href="/auth" className="text-blue-500">Sign in</Link> to add custom characters</span>
                        )}
                    </TabsContent>
                    <TabsContent value="spells">
                        {authToken ? (
                            <Button className="w-24">
                                Add New
                            </Button>
                        ) : (
                            <span><Link href="/auth" className="text-blue-500">Sign in</Link> to add custom spells</span>
                        )}
                    </TabsContent>
                    <TabsContent value="encounters">
                        {authToken ? (
                            <Button className="w-32">
                                Save Encounter
                            </Button>
                        ) : (
                            <span><Link href="/auth" className="text-blue-500">Sign in</Link> to save encounter</span>
                        )}
                    </TabsContent>
                </SheetFooter>
            </Tabs>
        </SheetContent>
    )
}

export default ReferencePane