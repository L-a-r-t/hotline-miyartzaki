import { useContext, useEffect } from "react"
import { AuthContext } from "../context/auth"
import { useRouter } from "next/navigation"

export default function useAuth() {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (user === "loading") return
    if (user === null) {
      router.push("/login")
      return
    }
    if (!user.displayName) {
      router.push("/login/onboarding")
      return
    }
  }, [user, router])

  return user
}
