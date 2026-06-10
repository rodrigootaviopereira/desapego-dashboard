import { useState, useEffect } from 'react'
import { getDicas, updateDica } from '@/services/dicas'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  Check,
  Target,
  ClipboardList,
  PenTool,
  BarChart,
  Info,
  Filter,
} from 'lucide-react'

const AgentIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'Kai':
      return <Target className="w-5 h-5 text-purple-500" />
    case 'Vera':
      return <ClipboardList className="w-5 h-5 text-green-500" />
    case 'Leo':
      return <PenTool className="w-5 h-5 text-orange-500" />
    case 'Max':
      return <BarChart className="w-5 h-5 text-blue-500" />
    default:
      return <Info className="w-5 h-5" />
  }
}

export default function Tips() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [filterAgent, setFilterAgent] = useState('Todos')
  const [filterStatus, setFilterStatus] = useState('Todos')

  const [applyItem, setApplyItem] = useState<any>(null)
  const [resultado, setResultado] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await getDicas()
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!applyItem) return
    try {
      await updateDica(applyItem.id, {
        aplicada: true,
        resultado,
      })
      toast({
        title: 'Dica marcada como aplicada',
        description: 'Resultado registrado com sucesso.',
      })
      setApplyItem(null)
      setResultado('')
      loadData()
    } catch (error) {
      toast({ title: 'Erro ao aplicar dica', variant: 'destructive' })
    }
  }

  const handleQuickApply = async (id: string) => {
    try {
      await updateDica(id, {
        aplicada: true,
        resultado: 'Aplicada rapidamente via atalho.',
      })
      toast({ title: 'Dica marcada como aplicada' })
      loadData()
    } catch (error) {
      toast({ title: 'Erro ao aplicar', variant: 'destructive' })
    }
  }

  const filteredData = data.filter((item) => {
    if (filterAgent !== 'Todos' && item.agente !== filterAgent) return false
    if (filterStatus === 'Aplicada' && !item.aplicada) return false
    if (filterStatus === 'Pendente' && item.aplicada) return false
    return true
  })

  const totalTips = data.length
  const appliedTips = data.filter((d) => d.aplicada).length
  const appliedPercent =
    totalTips > 0 ? Math.round((appliedTips / totalTips) * 100) : 0

  // Most productive agent
  const agentCounts = data.reduce(
    (acc, tip) => {
      acc[tip.agente] = (acc[tip.agente] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const mostProductive =
    Object.keys(agentCounts).length > 0
      ? Object.entries(agentCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      : '-'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dicas Estratégicas
        </h1>
        <p className="text-muted-foreground mt-2">
          Central de insights gerados pelos agentes do Squad para otimizar suas
          vendas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
          <span className="text-muted-foreground font-medium text-sm uppercase tracking-wider mb-2">
            Total de Dicas
          </span>
          <span className="text-5xl font-extrabold tracking-tighter">
            {totalTips}
          </span>
        </div>
        <div className="bg-card border rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/5 rounded-bl-full" />
          <span className="text-muted-foreground font-medium text-sm uppercase tracking-wider mb-2">
            % Aplicadas
          </span>
          <span className="text-5xl font-extrabold tracking-tighter text-green-600 dark:text-green-400">
            {appliedPercent}%
          </span>
        </div>
        <div className="bg-card border rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-bl-full" />
          <span className="text-muted-foreground font-medium text-sm uppercase tracking-wider mb-2">
            Agente Destacado
          </span>
          <div className="flex items-center gap-3">
            <AgentIcon name={mostProductive} />
            <span className="text-4xl font-extrabold tracking-tighter">
              {mostProductive}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-card border rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground font-medium mr-4">
          <Filter className="w-5 h-5" />
          Filtros
        </div>
        <div className="w-full sm:w-56">
          <Select value={filterAgent} onValueChange={setFilterAgent}>
            <SelectTrigger>
              <SelectValue placeholder="Agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Agentes</SelectItem>
              <SelectItem value="Max">Max (Mercado)</SelectItem>
              <SelectItem value="Leo">Leo (Anúncios)</SelectItem>
              <SelectItem value="Vera">Vera (Operações)</SelectItem>
              <SelectItem value="Kai">Kai (Performance)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-56">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Status</SelectItem>
              <SelectItem value="Pendente">Pendentes</SelectItem>
              <SelectItem value="Aplicada">Aplicadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Agente</TableHead>
              <TableHead className="w-[140px]">Tipo</TableHead>
              <TableHead>Dica</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.id}
                className={item.aplicada ? 'bg-muted/20' : ''}
              >
                <TableCell>
                  <div className="flex items-center gap-3 font-semibold text-foreground/80">
                    <AgentIcon name={item.agente} />
                    {item.agente}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-medium">
                    {item.tipo}
                  </Badge>
                </TableCell>
                <TableCell
                  className="max-w-[400px] truncate text-muted-foreground"
                  title={item.texto}
                >
                  {item.texto}
                </TableCell>
                <TableCell>
                  {item.aplicada ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-200 shadow-none font-semibold">
                      Aplicada
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="shadow-none font-semibold"
                    >
                      Pendente
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-center">
                    {!item.aplicada && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuickApply(item.id)}
                        title="Aplicar Rápido"
                        className="hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setApplyItem(item)}
                      title="Ver Detalhes"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  Nenhuma dica encontrada para os filtros aplicados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Apply Modal */}
      <Dialog
        open={!!applyItem}
        onOpenChange={(open) => !open && setApplyItem(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AgentIcon name={applyItem?.agente || ''} />
              Dica: {applyItem?.agente}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-primary/5 p-5 rounded-xl border border-primary/10">
              <p className="text-sm font-semibold uppercase tracking-wider mb-2 text-primary">
                Sugestão Recomendada
              </p>
              <p className="text-foreground text-[15px] leading-relaxed font-medium">
                {applyItem?.texto}
              </p>
            </div>

            {applyItem?.aplicada ? (
              <div className="bg-green-50 dark:bg-green-950/20 p-5 rounded-xl border border-green-200 dark:border-green-900/50">
                <p className="text-sm font-semibold uppercase tracking-wider mb-2 text-green-700 dark:text-green-400">
                  Resultado Alcançado
                </p>
                <p className="text-green-800 dark:text-green-300 font-medium">
                  {applyItem.resultado ||
                    'Nenhum resultado registrado detalhadamente.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  Resultado da Aplicação (Opcional)
                </Label>
                <Textarea
                  placeholder="Ex: Dobrou os cliques, vendi o item em 2 dias..."
                  value={resultado}
                  onChange={(e) => setResultado(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setApplyItem(null)}>
              Fechar
            </Button>
            {!applyItem?.aplicada && (
              <Button
                onClick={handleApply}
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
              >
                Aplicar Sugestão
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
