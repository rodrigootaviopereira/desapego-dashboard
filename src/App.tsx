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
import Workflow from './pages/Workflow'
import Logs from './pages/Logs'
import Config from './pages/Config'
import Reports from './pages/Reports'
import ApiAdmin from './pages/ApiAdmin'
import WebhooksAdmin from './pages/WebhooksAdmin'
import ApiDocs from './pages/ApiDocs'

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
              <Route path="/fluxo" element={<Workflow />} />
              <Route path="/relatorios" element={<Reports />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/configuracao" element={<Config />} />
              <Route path="/admin/api" element={<ApiAdmin />} />
              <Route path="/admin/webhooks" element={<WebhooksAdmin />} />
              <Route path="/api/docs" element={<ApiDocs />} />
              <Route path="*" element={<Dashboard />} />
            </Route>
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </BrowserRouter>
)

export default App
