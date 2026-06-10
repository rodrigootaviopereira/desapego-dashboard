import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const success = await login(username, password)
    setIsLoading(false)
    if (!success) setError(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-xl border border-border/50 shadow-lg animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-2xl">
            DS
          </div>
          <h1 className="text-2xl font-bold text-foreground">Desapego Squad</h1>
          <p className="text-muted-foreground mt-2">
            Acesse o painel administrativo
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Usuário ou E-mail
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              placeholder="Digite seu usuário"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              placeholder="Digite sua senha"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium animate-pulse">
              Credenciais inválidas. Tente novamente.
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
