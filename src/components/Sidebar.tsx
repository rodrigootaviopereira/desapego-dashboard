import { Link, useLocation } from 'react-router-dom'
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
  Sun,
  Moon,
  LogOut,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

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

export function Sidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col w-64 py-6 bg-card border-r border-border/50 h-screen fixed left-0 top-0 z-40 transition-colors duration-300 shadow-sm">
      <div className="mb-8 px-6 flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-xl shadow-sm hover:scale-105 transition-transform"
        >
          DS
        </Link>
        <span className="font-bold text-lg tracking-tight text-foreground truncate">
          Desapego Squad
        </span>
      </div>

      <nav className="flex flex-col gap-2 w-full px-4 overflow-y-auto custom-scrollbar flex-1 pb-4">
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
              title={item.label}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 px-4 border-t border-border/50 w-full flex flex-col gap-2">
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Sun className="h-5 w-5 mr-3 flex-shrink-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 mr-3 flex-shrink-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="truncate">Tema</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => logout()}
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
          <span className="truncate">Sair</span>
        </Button>
      </div>
    </aside>
  )
}
