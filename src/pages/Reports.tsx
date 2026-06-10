import { useState, useEffect, useMemo } from 'react'
import {
  Download,
  TrendingUp,
  PackageCheck,
  Target,
  Clock,
  Coins,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getInventoryItems, InventoryItem } from '@/services/inventory'
import { format, differenceInDays } from 'date-fns'

export default function Reports() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    getInventoryItems().then((data) =>
      setItems(data.filter((i) => !i.deletado)),
    )
  }, [])

  const finalizedItems = useMemo(() => {
    let filtered = items.filter(
      (i) => i.status === 'vendido' || i.status === 'doado',
    )
    if (dateFrom) {
      filtered = filtered.filter((i) => {
        const d = new Date(i.venda_data || i.doacao_data || i.updated)
        return d >= new Date(dateFrom)
      })
    }
    if (dateTo) {
      filtered = filtered.filter((i) => {
        const d = new Date(i.venda_data || i.doacao_data || i.updated)
        return d <= new Date(dateTo)
      })
    }
    return filtered
  }, [items, dateFrom, dateTo])

  const stats = useMemo(() => {
    const sold = finalizedItems.filter((i) => i.status === 'vendido')
    const donated = finalizedItems.filter((i) => i.status === 'doado')
    const revenue = sold.reduce((acc, curr) => acc + (curr.venda_valor || 0), 0)
    const completionRate =
      items.length > 0 ? (finalizedItems.length / items.length) * 100 : 0

    let totalDays = 0
    let itemsWithDates = 0
    finalizedItems.forEach((i) => {
      if (i.created && (i.venda_data || i.doacao_data)) {
        totalDays += differenceInDays(
          new Date(i.venda_data || i.doacao_data!),
          new Date(i.created),
        )
        itemsWithDates++
      }
    })
    const avgTurnover =
      itemsWithDates > 0 ? (totalDays / itemsWithDates).toFixed(1) : 0

    return {
      sold: sold.length,
      donated: donated.length,
      revenue,
      completionRate: completionRate.toFixed(1),
      avgTurnover,
    }
  }, [finalizedItems, items.length])

  const exportCSV = () => {
    const header = 'Item,Status,Data,Valor,Plataforma,Comprador/Recebedor\n'
    const rows = finalizedItems
      .map((i) => {
        const date = i.venda_data
          ? i.venda_data
          : i.doacao_data
            ? i.doacao_data
            : i.updated
        const dest =
          i.status === 'vendido' ? i.comprador_nome : i.donatario_nome
        return `"${i.name}",${i.status},${format(new Date(date), 'dd/MM/yyyy')},${i.venda_valor || 0},"${i.venda_plataforma || ''}","${dest || ''}"`
      })
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'relatorio-desapegos.csv'
    a.click()
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise de performance e histórico de transações.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
            title="Data Início"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
            title="Data Fim"
          />
          <Button variant="outline" onClick={exportCSV} className="shadow-sm">
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
          <div className="p-3 bg-blue-500/10 rounded-full text-blue-500 mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Vendidos</p>
          <p className="text-2xl font-bold">{stats.sold}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
          <div className="p-3 bg-green-500/10 rounded-full text-green-500 mb-3">
            <Coins className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Valor Faturado
          </p>
          <p className="text-2xl font-bold">
            R${' '}
            {stats.revenue.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
          <div className="p-3 bg-purple-500/10 rounded-full text-purple-500 mb-3">
            <PackageCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Doados</p>
          <p className="text-2xl font-bold">{stats.donated}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
          <div className="p-3 bg-orange-500/10 rounded-full text-orange-500 mb-3">
            <Target className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Taxa Conclusão
          </p>
          <p className="text-2xl font-bold">{stats.completionRate}%</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
          <div className="p-3 bg-zinc-500/10 rounded-full text-zinc-500 mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Tempo Médio (dias)
          </p>
          <p className="text-2xl font-bold">{stats.avgTurnover}</p>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl shadow-sm p-4 overflow-x-auto">
        <h3 className="font-semibold mb-4 text-lg">Itens Finalizados</h3>
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3 text-right">Valor Final</th>
              <th className="px-4 py-3">Plataforma/Local</th>
              <th className="px-4 py-3">Destinatário</th>
            </tr>
          </thead>
          <tbody>
            {finalizedItems.map((item) => {
              const date = item.venda_data
                ? item.venda_data
                : item.doacao_data
                  ? item.doacao_data
                  : item.updated
              const isVendido = item.status === 'vendido'
              return (
                <tr
                  key={item.id}
                  className="border-b border-border/50 hover:bg-muted/30"
                >
                  <td
                    className="px-4 py-3 font-medium max-w-[200px] truncate"
                    title={item.name}
                  >
                    {item.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'px-2 py-1 rounded-md text-xs font-semibold capitalize',
                        isVendido
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-purple-500/10 text-purple-500',
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {format(new Date(date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {isVendido
                      ? `R$ ${item.venda_valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {isVendido ? item.venda_plataforma : item.local_doacao}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {isVendido ? item.comprador_nome : item.donatario_nome}
                  </td>
                </tr>
              )
            })}
            {finalizedItems.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Nenhuma transação no período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
