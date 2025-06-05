import "./globals.css";
import type { Metadata } from "next";

import { IM_Fell_English_SC, Roboto } from "next/font/google";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const imFell = IM_Fell_English_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-im-fell",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
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

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${imFell.variable} ${roboto.variable} antialiased flex`}
      >
        <Providers>
          <main className="w-full">
            <Navbar />
            <div className="px-4">
              {children}
            </div>
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
