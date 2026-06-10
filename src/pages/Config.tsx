import { useEffect, useState } from 'react'
import {
  Bot,
  Settings2,
  RotateCcw,
  ActivitySquare,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getAgentes, updateAgente, Agente } from '@/services/agentes'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export default function Config() {
  const [agentes, setAgentes] = useState<Agente[]>([])
  const [editing, setEditing] = useState<Agente | null>(null)
  const [formData, setFormData] = useState<Partial<Agente>>({})

  const load = async () => {
    try {
      const data = await getAgentes()
      setAgentes(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleEdit = (a: Agente) => {
    setEditing(a)
    let comp = []
    try {
      if (typeof a.comportamentos === 'string') {
        comp = JSON.parse(a.comportamentos)
      } else {
        comp = a.comportamentos || []
      }
    } catch {
      /* intentionally ignored */
    }

    setFormData({
      tom: a.tom,
      comportamentos: comp,
      instrucoes_especiais: a.instrucoes_especiais,
      status: a.status,
    })
  }

  const handleSave = async () => {
    if (!editing) return
    try {
      const payload = {
        ...formData,
        comportamentos: JSON.stringify(formData.comportamentos || []),
      }
      await updateAgente(editing.id, payload)
      toast.success(`Agente ${editing.nome} atualizado com sucesso!`)
      setEditing(null)
      load()
    } catch (e) {
      toast.error('Erro ao atualizar agente')
    }
  }

  const toggleBehavior = (b: string) => {
    const current = (formData.comportamentos as string[]) || []
    if (current.includes(b)) {
      setFormData({
        ...formData,
        comportamentos: current.filter((x) => x !== b),
      })
    } else {
      setFormData({ ...formData, comportamentos: [...current, b] })
    }
  }

  const resetToDefault = () => {
    if (!editing) return
    setFormData({
      ...formData,
      instrucoes_especiais: '',
    })
    toast.info('Instruções resetadas no formulário (salve para confirmar).')
  }

  const allBehaviors = [
    'Criativo',
    'Objetivo',
    'Analítica',
    'Persuasivo',
    'Detalalhista',
    'Estratégico',
    'Prático',
    'Focada em valor',
  ]

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Configuração de Agentes
        </h1>
        <p className="text-muted-foreground">
          Personalize o comportamento da equipe de IA do Desapego Squad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agentes.map((agente) => (
          <div
            key={agente.id}
            className="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {agente.nome}
                    {agente.status ? (
                      <CheckCircle
                        className="w-4 h-4 text-green-500"
                        title="Ativo"
                      />
                    ) : (
                      <XCircle
                        className="w-4 h-4 text-red-500"
                        title="Inativo"
                      />
                    )}
                  </h3>
                  <p className="text-sm font-medium text-primary">
                    {agente.persona}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(agente)}
              >
                <Settings2 className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {agente.role_description}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Tom de Voz
                </p>
                <p className="text-sm font-semibold">{agente.tom || '-'}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Vocabulário
                </p>
                <p className="text-sm font-semibold">
                  {agente.vocabulario || '-'}
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border/50 flex gap-2">
              <Button
                variant="outline"
                className="w-full shadow-sm"
                onClick={() => handleEdit(agente)}
              >
                Editar Persona
              </Button>
              <Button
                variant="outline"
                className="w-full shadow-sm gap-2"
                asChild
              >
                <Link to="/logs">
                  <ActivitySquare className="w-4 h-4" /> Histórico
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Persona: {editing?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                className="w-4 h-4 accent-primary cursor-pointer"
                checked={!!formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked })
                }
              />
              <label
                htmlFor="active"
                className="text-sm font-medium cursor-pointer"
              >
                {formData.status ? 'Agente Ativo' : 'Agente Inativo'}
              </label>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Tom de Voz
              </label>
              <select
                className="w-full p-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary/50"
                value={formData.tom || ''}
                onChange={(e) =>
                  setFormData({ ...formData, tom: e.target.value })
                }
              >
                <option value="Sério">Sério</option>
                <option value="Profissional">Profissional</option>
                <option value="Entusiasmado">Entusiasmado</option>
                <option value="Direto">Direto</option>
                <option value="Amigável">Amigável</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Comportamentos (Múltiplos)
              </label>
              <div className="flex flex-wrap gap-2">
                {allBehaviors.map((b) => {
                  const active = (
                    formData.comportamentos as string[]
                  )?.includes(b)
                  return (
                    <span
                      key={b}
                      onClick={() => toggleBehavior(b)}
                      className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold transition-colors ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                      {b}
                    </span>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Instruções Especiais / Prompt Customizado
              </label>
              <textarea
                rows={4}
                className="w-full p-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary/50"
                placeholder="Ex: Focar sempre na margem de lucro de 20%..."
                value={formData.instrucoes_especiais || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    instrucoes_especiais: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                className="text-muted-foreground"
                onClick={resetToDefault}
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Resetar
              </Button>
              <Button onClick={handleSave}>Salvar Alterações</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
