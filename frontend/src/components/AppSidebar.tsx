import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar'
import { ChevronUp, Home, User2 } from 'lucide-react';
import { Props } from 'next/script';
import LibraryReference from './LibraryReference';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const items = [
    {
        title: "Dashboard",
        url: "#",
        icon: Home,
    },
];

const AppSidebar = (props: Props) => {
    return (
        // 370-375px width
        <Tabs defaultValue='monsters'>
            <Sidebar >
                <SidebarHeader>
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
                    {/* Monsters Table */}

                    {/* Characters Table */}
                    {/* Spells Table */}
                    {/* Encounters Table */}
                </SidebarHeader>
                <SidebarSeparator />
                <SidebarContent>
                    <SidebarGroup>
                        <TabsContent value='monsters'>
                            <LibraryReference />
                        </TabsContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarSeparator />
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <User2 /> John Doe <ChevronUp className='ml-auto' />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Account</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </Tabs>
    );
};

export default AppSidebar;