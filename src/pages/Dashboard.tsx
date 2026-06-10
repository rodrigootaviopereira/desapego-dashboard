import { useEffect, useState } from 'react'
import {
  Target,
  ClipboardList,
  PenTool,
  LineChart,
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { getInventoryItems, InventoryItem } from '@/services/inventory'
import { useRealtime } from '@/hooks/use-realtime'

export default function Dashboard() {
  const [items, setItems] = useState<InventoryItem[]>([])

  const loadData = async () => {
    try {
      const data = await getInventoryItems()
      setItems(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('inventory_items', () => {
    loadData()
  })

  const totalItems = items.length
  const available = items.filter((i) => i.status === 'disponivel').length
  const reserved = items.filter((i) => i.status === 'reservado').length
  const soldOrDonated = items.filter(
    (i) => i.status === 'vendido' || i.status === 'doado',
  ).length
  const urgent = items.filter((i) => i.urgency === 'Alta').length
  const totalValue = items.reduce(
    (acc, curr) => acc + (curr.imagined_price || 0),
    0,
  )
  const totalFaturado = items
    .filter((i) => i.status === 'vendido')
    .reduce((acc, curr) => acc + (curr.venda_valor || 0), 0)

  const categories = [
    'Gibis',
    'Eletrônicos',
    'Instrumentos',
    'Livros',
    'Outros',
  ]
  const chartData = categories.map((cat) => ({
    category: cat,
    count: items.filter((i) => i.category === cat).length,
  }))

  const top5Items = [...items]
    .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
    .slice(0, 5)

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard KPIs</h1>
        <p className="text-muted-foreground">
          Visão geral do inventário do Desapego Squad.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        <div className="p-6 bg-card border border-border/50 rounded-xl shadow-sm flex flex-col items-center text-center justify-center gap-2 group hover:border-primary/50 transition-colors">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg group-hover:scale-110 transition-transform">
            <ClipboardList className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Total de Itens
          </p>
          <h3 className="text-2xl font-bold">{totalItems}</h3>
        </div>

        <div className="p-6 bg-card border border-border/50 rounded-xl shadow-sm flex flex-col items-center text-center justify-center gap-2 group hover:border-primary/50 transition-colors">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-lg group-hover:scale-110 transition-transform">
            <CheckCircle className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Disponíveis
          </p>
          <h3 className="text-2xl font-bold">{available}</h3>
        </div>

        <div className="p-6 bg-card border border-border/50 rounded-xl shadow-sm flex flex-col items-center text-center justify-center gap-2 group hover:border-primary/50 transition-colors">
          <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Reservados
          </p>
          <h3 className="text-2xl font-bold">{reserved}</h3>
        </div>

        <div className="p-6 bg-card border border-border/50 rounded-xl shadow-sm flex flex-col items-center text-center justify-center gap-2 group hover:border-primary/50 transition-colors">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg group-hover:scale-110 transition-transform">
            <PenTool className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Vendidos ou Doados
          </p>
          <h3 className="text-2xl font-bold">{soldOrDonated}</h3>
        </div>

        <div className="p-6 bg-card border border-border/50 rounded-xl shadow-sm flex flex-col items-center text-center justify-center gap-2 group hover:border-primary/50 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full -z-10" />
          <div className="p-3 bg-red-500/10 text-red-500 rounded-lg group-hover:scale-110 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Itens Urgentes
          </p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold">{urgent}</h3>
            {urgent > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-green-500 text-white rounded-full shadow-sm animate-pulse">
                Ação Imediata
              </span>
            )}
          </div>
        </div>

        <div className="p-6 bg-card border border-border/50 rounded-xl shadow-sm flex flex-col items-center text-center justify-center gap-2 group hover:border-primary/50 transition-colors">
          <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-lg group-hover:scale-110 transition-transform">
            <LineChart className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Valor Total Estimado
          </p>
          <h3 className="text-2xl font-bold text-primary">
            R${' '}
            {totalValue.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </div>

        <div className="p-6 bg-card border border-border/50 rounded-xl shadow-sm flex flex-col items-center text-center justify-center gap-2 group hover:border-primary/50 transition-colors">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Valor Total Faturado
          </p>
          <h3 className="text-2xl font-bold text-emerald-500">
            R${' '}
            {totalFaturado.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-card border border-border/50 rounded-xl shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Distribuição por Categoria
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ChartContainer
              config={{ count: { color: 'hsl(var(--primary))' } }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div className="p-6 bg-card border border-border/50 rounded-xl shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Top 5 Score (Prioridade)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Item</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {top5Items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td
                      className="px-4 py-4 font-medium text-foreground max-w-[200px] truncate"
                      title={item.name}
                    >
                      {item.name}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground whitespace-nowrap">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {item.priority_score}
                      </span>
                    </td>
                  </tr>
                ))}
                {top5Items.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      Nenhum item cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
