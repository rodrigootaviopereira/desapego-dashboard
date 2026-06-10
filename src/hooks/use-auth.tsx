import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  user: { name: string } | null
  login: (username: string, pass: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    const auth = localStorage.getItem('desapego-auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      setUser({ name: 'Admin Squad' })
    }
  }, [])

  const login = (username: string, pass: string) => {
    if (username === 'admin' && pass === 'desapego') {
      setIsAuthenticated(true)
      setUser({ name: 'Admin Squad' })
      localStorage.setItem('desapego-auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('desapego-auth')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
