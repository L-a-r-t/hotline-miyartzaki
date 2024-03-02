"use client"

import getUserData from "@/api/client/getUserData"
import { auth } from "@/config/firebase"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { User, onAuthStateChanged } from "firebase/auth"
import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext<AuthContextValue>(null as any)

export type AuthContextValue = {
  user: User | null | "loading"
  isAdmin: boolean | null
  setUser: (user: User | null) => void
}

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null | "loading">("loading")
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (!u) return
      getUserData().then((userData) => {
        if (!userData) return
        setIsAdmin(userData.isAdmin ?? false)
      })
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, isAdmin }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthContext.Provider>
  )
}
