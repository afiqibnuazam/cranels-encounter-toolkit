"use client"

import { AuthenticationProvider as Provider } from "@/context/AuthenticationContext"

export function AuthenticationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <Provider>{children}</Provider>
}