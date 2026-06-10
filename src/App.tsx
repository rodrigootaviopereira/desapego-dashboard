import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Recommendations from './pages/Recommendations'
import SalesAds from './pages/SalesAds'
import Tips from './pages/Tips'
import ComingSoon from './pages/ComingSoon'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventario" element={<Inventory />} />
              <Route path="/recomendacoes" element={<Recommendations />} />
              <Route path="/anuncios" element={<SalesAds />} />
              <Route path="/dicas" element={<Tips />} />
              <Route path="/fluxo" element={<ComingSoon />} />
              <Route path="/logs" element={<ComingSoon />} />
              <Route path="/configuracao" element={<ComingSoon />} />
              <Route path="*" element={<Dashboard />} />
            </Route>
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </BrowserRouter>
)

export default App
