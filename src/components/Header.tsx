import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Menu, Sun, Moon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from 'next-themes'

const navLinks = [
  { label: 'Dashboard', path: '/' },
  { label: 'Inventário', path: '/inventario' },
  { label: 'Recomendações', path: '/recomendacoes' },
  { label: 'Anúncios', path: '/anuncios' },
]

export function Header() {
  const location = useLocation()
  const { user, logout } = useAuth() as any
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b border-border/10 md:pl-24">
      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[240px] bg-card border-r-border"
          >
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-lg font-medium transition-colors',
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation - Simplified to show context only, since sidebar is main nav */}
      <nav className="hidden md:flex items-center gap-8">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          {navLinks.find((l) => l.path === location.pathname)?.label ||
            'Painel Administrativo'}
        </h2>
      </nav>

      {/* User Profile */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:text-foreground"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-foreground leading-none">
            {user?.name || 'Admin'}
          </p>
          <button
            onClick={() => {
              if (logout) logout()
            }}
            className="text-xs text-muted-foreground hover:text-red-500 transition-colors mt-1 font-medium"
          >
            Sair (Logout)
          </button>
        </div>
        <Avatar className="h-10 w-10 border border-border ring-2 ring-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            DS
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
