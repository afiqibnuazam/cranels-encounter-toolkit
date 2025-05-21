import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EncounterProvider } from "@/components/providers/EncounterProvider";
import { cookies } from "next/headers";
import { AuthenticationProvider } from "@/components/providers/AuthenticationProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cranel's Encounter Toolkit",
  description: "A web-based encounter initiative tracker for D&D campaigns.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthenticationProvider>
            <EncounterProvider>
              <SidebarProvider defaultOpen={defaultOpen}>
                {/* <AppSidebar /> */}
                <main className="w-full">
                  <Navbar />
                  <div className="px-4">
                    {children}
                  </div>
                  <Toaster />
                </main>
              </SidebarProvider>
            </EncounterProvider>
          </AuthenticationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
