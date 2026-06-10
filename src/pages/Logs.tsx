import { useEffect, useState, useMemo } from 'react'
import { Download, Search, FileDiff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getLogs, Log } from '@/services/logs'
import { format } from 'date-fns'

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [search, setSearch] = useState('')
  const [filterAgente, setFilterAgente] = useState('All')
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)

  useEffect(() => {
    getLogs().then(setLogs).catch(console.error)
  }, [])

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchSearch =
        (l.item_nome || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.detalhes || '').toLowerCase().includes(search.toLowerCase())
      const matchAgente = filterAgente === 'All' || l.agente === filterAgente
      return matchSearch && matchAgente
    })
  }, [logs, search, filterAgente])

  const exportCSV = () => {
    const header = 'Data,Agente,Ação,Item,Detalhes,Usuário\n'
    const rows = filteredLogs
      .map(
        (l) =>
          `${format(new Date(l.timestamp), 'dd/MM/yyyy HH:mm')},${l.agente},${l.acao},"${l.item_nome}","${l.detalhes}",${l.usuario}`,
      )
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'logs.csv'
    a.click()
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], {
      type: 'application/json',
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'logs.json'
    a.click()
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Logs e Auditoria
          </h1>
          <p className="text-muted-foreground">
            Histórico de ações de usuários e agentes de IA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportCSV} className="shadow-sm">
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button variant="outline" onClick={exportJSON} className="shadow-sm">
            <Download className="w-4 h-4 mr-2" /> JSON
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar item ou detalhe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={filterAgente}
            onChange={(e) => setFilterAgente(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="All">Todos os Agentes/Usuários</option>
            <option value="Sistema">Sistema</option>
            <option value="Admin">Admin</option>
            <option value="Kai">Kai</option>
            <option value="Vera">Vera</option>
            <option value="Leo">Leo</option>
            <option value="Max">Max</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3">Data/Hora</th>
                <th className="px-4 py-3">Agente/Usuário</th>
                <th className="px-4 py-3">Ação</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Detalhes</th>
                <th className="px-4 py-3 text-right">Info</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border/50 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-semibold">
                      {log.agente || log.usuario}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">
                    {log.acao}
                  </td>
                  <td className="px-4 py-3">{log.item_nome || '-'}</td>
                  <td
                    className="px-4 py-3 text-muted-foreground truncate max-w-[200px]"
                    title={log.detalhes}
                  >
                    {log.detalhes}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(log.acao === 'Editou' ||
                      log.acao === 'Vendeu' ||
                      log.acao === 'Doou') &&
                      log.valor_antes && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FileDiff className="w-4 h-4 mr-1" /> Diff
                        </Button>
                      )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Nenhum log encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Diferença de Alteração</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 py-4">
              <p className="text-sm font-medium text-muted-foreground">
                Item:{' '}
                <span className="text-foreground">{selectedLog.item_nome}</span>
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                Campo Alterado:{' '}
                <span className="text-foreground font-mono">
                  {selectedLog.campo_alterado}
                </span>
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md">
                  <p className="text-xs font-bold text-red-500 uppercase mb-2">
                    Valor Anterior
                  </p>
                  <p className="text-sm line-through text-red-600 dark:text-red-400">
                    {selectedLog.valor_antes}
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                  <p className="text-xs font-bold text-green-500 uppercase mb-2">
                    Novo Valor
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {selectedLog.valor_depois}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
