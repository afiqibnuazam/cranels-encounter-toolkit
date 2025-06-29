"use client"

import { Moon, PanelLeftIcon, Sun, User } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from 'next-themes'
import ReferencePane from './ReferencePane'
import { Sheet, SheetTrigger } from './ui/sheet'
import { Avatar, AvatarFallback } from './ui/avatar'
import { useAuthentication } from '@/context/AuthenticationContext'
import { usePathname } from 'next/navigation'
import { D20Icon } from './icons/DiceIcons'

const Navbar = () => {

    const { theme, setTheme } = useTheme();
    const { logout, authToken } = useAuthentication();
    const pathName = usePathname();

    const hideReferencePane = pathName === '/auth';

    return (
        <nav className="p-4 grid grid-cols-4 sticky top-0 bg-background z-10">
            {/* LEFT */}
            <div className="flex items-center justify-start gap-4">
                {!hideReferencePane && (
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button><PanelLeftIcon /></Button>
                        </SheetTrigger>
                        <ReferencePane />
                    </Sheet>
                )}
                <Link href="/" className="text-lg font-bold">
                    <h1>Cranel&apos;s Encounter Toolkit</h1>
                </Link>
            </div>

            {/* MIDDLE */}
            {/* TODO: Make this work */}
            <div className="col-span-2 flex items-center justify-center">
                <div className="cursor-pointer hover:text-primary hover:scale-110 transition-all duration-300" title="Dice Roller">
                    <D20Icon size={32} />
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-end gap-4">
                {/* THEME MENU */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {authToken ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem>
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={logout}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link href="/auth" className="text-sm font-medium">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar