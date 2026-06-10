import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { Activity, ShieldCheck, Clock } from 'lucide-react'

export default function ApiAdmin() {
  const [logs, setLogs] = useState<any[]>([])
  const [keys, setKeys] = useState<any[]>([])

  useEffect(() => {
    pb.collection('api_logs')
      .getFullList({ sort: '-created', limit: 100 })
      .then(setLogs)
      .catch(() => {})
    pb.collection('api_keys')
      .getFullList()
      .then(setKeys)
      .catch(() => {})
  }, [])

  const totalCalls = logs.length
  const successRate =
    totalCalls > 0
      ? (
          (logs.filter((l) => l.status_code >= 200 && l.status_code < 300)
            .length /
            totalCalls) *
          100
        ).toFixed(1)
      : 0
  const avgTime =
    totalCalls > 0
      ? (
          logs.reduce((acc, curr) => acc + curr.response_time_ms, 0) /
          totalCalls
        ).toFixed(0)
      : 0

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">API Admin</h1>
        <p className="text-muted-foreground">
          Monitoramento da infraestrutura de API REST.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Total Chamadas (Recentes)
            </p>
            <p className="text-2xl font-bold">{totalCalls}</p>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
            <p className="text-2xl font-bold">{successRate}%</p>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Tempo Médio Resposta
            </p>
            <p className="text-2xl font-bold">{avgTime} ms</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold mb-4 text-lg">Chaves de API Ativas</h3>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="pb-2">Agente</th>
                <th className="pb-2">Client ID (Key)</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} className="border-b border-border/50">
                  <td className="py-2 font-medium">{k.agent_name}</td>
                  <td className="py-2 font-mono text-xs text-muted-foreground">
                    {k.key}
                  </td>
                  <td className="py-2 text-right">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-xs">
                      Ativa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold mb-4 text-lg">Logs Recentes</h3>
          <div className="space-y-3">
            {logs.slice(0, 5).map((l) => (
              <div
                key={l.id}
                className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${l.status_code >= 400 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
                  >
                    {l.status_code}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {l.method} {l.endpoint}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {l.response_time_ms}ms
                </span>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum log registrado ainda.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
