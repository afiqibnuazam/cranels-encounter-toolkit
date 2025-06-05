"use client"

import { AuthenticationProvider } from "@/components/providers/AuthenticationProvider";
import { EncounterProvider } from "@/components/providers/EncounterProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryProvider>
                <AuthenticationProvider>
                    <EncounterProvider>
                        {children}
                    </EncounterProvider>
                </AuthenticationProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}