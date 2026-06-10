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
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

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

  return (
    <aside
      id="sidebar"
      className="hidden md:flex flex-col items-center w-20 py-6 bg-background border-r border-border/10 h-screen fixed left-0 top-0 z-50 transition-colors duration-300"
    >
      <div className="mb-8">
        <Link
          to="/"
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-xl shadow-sm hover:scale-105 transition-transform"
        >
          DS
        </Link>
      </div>

      <nav className="flex flex-col gap-4 w-full items-center overflow-y-auto custom-scrollbar flex-1 pb-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'text-primary bg-primary/10 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-l-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border/50 w-full flex justify-center">
        <Button
          id="theme-toggle"
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-12 h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Toggle Theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </aside>
  )
}
