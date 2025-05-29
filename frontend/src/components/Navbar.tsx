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
import { SidebarTrigger, useSidebar } from './ui/sidebar'
import ReferencePane from './ReferencePane'
import { Sheet, SheetTrigger } from './ui/sheet'
import { Avatar, AvatarFallback } from './ui/avatar'
import { useAuthentication } from '@/context/AuthenticationContext'
import { usePathname } from 'next/navigation'

const Navbar = () => {

    const { theme, setTheme } = useTheme();
    const { toggleSidebar } = useSidebar()
    const { logout, authToken } = useAuthentication();
    const pathName = usePathname();
    
    const hideReferencePane = pathName === '/auth';

    return (
        <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-10">
            {/* LEFT */}
            {/* <SidebarTrigger /> */}
            {/* <Button variant={"outline"} onClick={toggleSidebar}>
                Custom Button
            </Button> */}
            <div className="flex items-center gap-4">
                {!hideReferencePane && (
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button><PanelLeftIcon /></Button>
                        </SheetTrigger>
                        <ReferencePane />
                    </Sheet>
                )}
                <Link href="/" className="text-lg font-bold">
                    Cranel Encounter Toolkit
                </Link>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
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
                            <Button>
                                <Avatar className='cusror-pointer'>
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                            </Button>
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