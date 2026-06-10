import { Code2 } from 'lucide-react'

export default function ApiDocs() {
  return (
    <div className="space-y-6 animate-fade-in pb-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">API Reference</h1>
        <p className="text-muted-foreground">
          Documentação técnica dos endpoints públicos.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="POST"
          path="/api/auth/token"
          desc="Gera um JWT de acesso válido por 24h usando client_id e client_secret."
        />
        <EndpointCard
          method="GET"
          path="/api/items"
          desc="Lista todos os itens disponíveis. Aceita filtros na querystring."
        />
        <EndpointCard
          method="POST"
          path="/api/items/{id}/mark-sold"
          desc="Marca um item como vendido e dispara o webhook 'item_sold'."
        />
        <EndpointCard
          method="POST"
          path="/api/items/{id}/mark-donated"
          desc="Marca um item como doado e dispara o webhook 'item_donated'."
        />
        <EndpointCard
          method="POST"
          path="/api/webhooks/register"
          desc="Registra um novo endpoint para escutar eventos em tempo real."
        />
      </div>
    </div>
  )
}

function EndpointCard({
  method,
  path,
  desc,
}: {
  method: string
  path: string
  desc: string
}) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`px-2 py-1 text-xs font-bold rounded text-white ${method === 'POST' ? 'bg-green-600' : 'bg-blue-600'}`}
        >
          {method}
        </span>
        <span className="font-mono text-sm font-semibold">{path}</span>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}
