import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { AuthUser, UserRole } from '../../domain/types'
import { services } from '../../services/serviceContainer'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  setRole: (email: string, role: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    services.auth
      .getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser)
      })
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        const nextUser = await services.auth.signIn(email, password)
        setUser(nextUser)
      },
      register: async (email, password) => {
        const nextUser = await services.auth.register(email, password)
        setUser(nextUser)
      },
      signOut: async () => {
        await services.auth.signOut()
        setUser(null)
      },
      setRole: async (email, role) => {
        await services.auth.setRole(email, role)
        setUser((currentUser) =>
          currentUser?.email === email ? { ...currentUser, role } : currentUser,
        )
      },
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

