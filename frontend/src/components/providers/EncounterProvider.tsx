"use client"

import { EncounterProvider as Provider } from "@/context/EncounterContext"

export function EncounterProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <Provider>{children}</Provider>
}
