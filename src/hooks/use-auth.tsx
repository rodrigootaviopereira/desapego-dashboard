import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import pb from '@/lib/pocketbase/client'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  login: (username: string, pass: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(
    pb.authStore.isValid ? pb.authStore.record : null,
  )
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(pb.authStore.isValid ? record : null)
      setIsAuthenticated(pb.authStore.isValid)
    })

    if (pb.authStore.isValid) {
      pb.collection('users')
        .authRefresh()
        .catch(() => pb.authStore.clear())
        .finally(() => setLoading(false))
    } else {
      if (pb.authStore.record) pb.authStore.clear()
      setLoading(false)
    }
    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (username: string, pass: string) => {
    try {
      // Allow login via email or username since admin was seeded with both
      await pb.collection('users').authWithPassword(username, pass)
      return true
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    pb.authStore.clear()
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
