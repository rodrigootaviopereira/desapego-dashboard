import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuth } from '@/hooks/use-auth'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Megaphone,
  Lightbulb,
  ArrowRightLeft,
  ScrollText,
  Settings,
  LogOut,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Inventário', path: '/inventario' },
  { icon: Sparkles, label: 'Recomendações', path: '/recomendacoes' },
  { icon: Megaphone, label: 'Anúncios', path: '/anuncios' },
  { icon: Lightbulb, label: 'Dicas', path: '/dicas' },
  { icon: ArrowRightLeft, label: 'Fluxo', path: '/fluxo' },
  { icon: ScrollText, label: 'Logs', path: '/logs' },
  { icon: Settings, label: 'Configuração', path: '/configuracao' },
]

export default function Layout() {
  const { isAuthenticated, loading, logout } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <Sidebar />

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/50 bg-card sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold shadow-sm">
            DS
          </div>
          <span className="font-bold text-lg tracking-tight">
            Desapego Squad
          </span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 pt-10 flex flex-col">
            <SheetTitle className="sr-only">Navegação</SheetTitle>
            <nav className="flex flex-col gap-2 w-full px-4 overflow-y-auto flex-1 pb-4 mt-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 group font-medium text-sm',
                      isActive
                        ? 'text-primary bg-primary/10 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t border-border/50">
              <Button
                variant="ghost"
                onClick={() => logout()}
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="truncate">Sair</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
