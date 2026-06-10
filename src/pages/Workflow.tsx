import { useEffect, useState } from 'react'
import { Check, HandHeart, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  getInventoryItems,
  updateInventoryItem,
  InventoryItem,
} from '@/services/inventory'
import { createLog } from '@/services/logs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'

const STEPS = [
  'Catalogar',
  'Fotografar',
  'Escrever Anúncio',
  'Precificar',
  'Publicar',
  'Negociar',
  'Finalizar',
]

export default function Workflow() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [selectedItemId, setSelectedItemId] = useState('')
  const { user } = useAuth() as any

  const loadItems = async () => {
    try {
      const data = await getInventoryItems()
      setItems(
        data.filter(
          (i) => i.status === 'disponivel' || i.status === 'reservado',
        ),
      )
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])
  useRealtime('inventory_items', () => {
    loadItems()
  })

  const selectedItem = items.find((i) => i.id === selectedItemId)
  const currentStepIdx = selectedItem
    ? STEPS.indexOf(selectedItem.current_step || 'Catalogar')
    : -1

  const advanceStep = async (stepName: string) => {
    if (!selectedItem) return
    try {
      await updateInventoryItem(selectedItem.id, { current_step: stepName })
      await createLog({
        timestamp: new Date().toISOString(),
        agente: 'Admin',
        acao: 'Avançou Fluxo',
        item_id: selectedItem.id,
        item_nome: selectedItem.name,
        detalhes: `Avançou para a etapa: ${stepName}`,
        usuario: user?.name || 'Admin',
      })
      toast.success(`Avançou para ${stepName}`)
    } catch (e) {
      toast.error('Erro ao avançar etapa')
    }
  }

  const [vendaData, setVendaData] = useState({
    data: '',
    plataforma: '',
    valor: '',
    nome: '',
    contato: '',
    obs: '',
  })
  const handleVenda = async () => {
    if (!selectedItem) return
    if (!vendaData.data || !vendaData.plataforma || !vendaData.valor) {
      toast.error('Preencha os campos obrigatórios')
      return
    }
    try {
      await updateInventoryItem(selectedItem.id, {
        venda_data: new Date(vendaData.data).toISOString(),
        venda_plataforma: vendaData.plataforma,
        venda_valor: Number(vendaData.valor),
        comprador_nome: vendaData.nome,
        comprador_contato: vendaData.contato,
        observations: (selectedItem.observations || '') + ' | ' + vendaData.obs,
        status: 'vendido',
        current_step: 'Finalizar',
      })
      await createLog({
        timestamp: new Date().toISOString(),
        agente: 'Admin',
        acao: 'Vendeu',
        item_id: selectedItem.id,
        item_nome: selectedItem.name,
        detalhes: `Vendido por R$${vendaData.valor} via ${vendaData.plataforma}`,
        usuario: user?.name || 'Admin',
        campo_alterado: 'status',
        valor_antes: selectedItem.status,
        valor_depois: 'vendido',
      })
      toast.success('Venda registrada com sucesso!')
      setSelectedItemId('')
    } catch (e) {
      toast.error('Erro ao registrar venda')
    }
  }

  const [doacaoData, setDoacaoData] = useState({
    data: '',
    nome: '',
    local: '',
    obs: '',
  })
  const handleDoacao = async () => {
    if (!selectedItem) return
    if (!doacaoData.data || !doacaoData.nome) {
      toast.error('Preencha os campos obrigatórios')
      return
    }
    try {
      await updateInventoryItem(selectedItem.id, {
        doacao_data: new Date(doacaoData.data).toISOString(),
        donatario_nome: doacaoData.nome,
        local_doacao: doacaoData.local,
        observations:
          (selectedItem.observations || '') + ' | ' + doacaoData.obs,
        status: 'doado',
        current_step: 'Finalizar',
      })
      await createLog({
        timestamp: new Date().toISOString(),
        agente: 'Admin',
        acao: 'Doou',
        item_id: selectedItem.id,
        item_nome: selectedItem.name,
        detalhes: `Doado para ${doacaoData.nome}`,
        usuario: user?.name || 'Admin',
        campo_alterado: 'status',
        valor_antes: selectedItem.status,
        valor_depois: 'doado',
      })
      toast.success('Doação registrada com sucesso!')
      setSelectedItemId('')
    } catch (e) {
      toast.error('Erro ao registrar doação')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fluxo de Item</h1>
        <p className="text-muted-foreground">
          Acompanhe e avance o ciclo de vida dos seus desapegos.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
        <label className="block text-sm font-medium mb-2">
          Selecione um Item Ativo
        </label>
        <select
          className="w-full md:w-1/2 p-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary/50"
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
        >
          <option value="">-- Selecione --</option>
          {items.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} ({i.category}) - R${i.imagined_price}
            </option>
          ))}
        </select>
      </div>

      {selectedItem && (
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
              <p className="text-muted-foreground">
                Categoria: {selectedItem.category} | Prioridade:{' '}
                {selectedItem.priority_score}
              </p>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary font-semibold rounded-full capitalize">
              {selectedItem.status}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between relative pt-4 pb-20">
            <div className="hidden md:block absolute top-10 left-0 w-full h-1 bg-border/50 -z-10" />

            {STEPS.map((step, idx) => {
              const isPast = idx < Math.max(0, currentStepIdx)
              const isCurrent = idx === Math.max(0, currentStepIdx)
              const isPublished = step === 'Publicar' && isPast

              let colorClass = 'bg-muted text-muted-foreground border-border'
              if (isPast)
                colorClass = isPublished
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'bg-green-500 border-green-600 text-white'
              if (isCurrent)
                colorClass =
                  'bg-yellow-500 border-yellow-600 text-white ring-4 ring-yellow-500/20'

              return (
                <div
                  key={step}
                  className="flex flex-row md:flex-col items-center gap-3 w-full md:w-auto relative z-10 group min-w-[120px]"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold shadow-sm transition-all',
                      colorClass,
                    )}
                  >
                    {isPast ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium whitespace-nowrap',
                      isCurrent ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {step}
                  </span>

                  {isCurrent && idx < STEPS.length - 1 && (
                    <div className="md:absolute top-[80px] w-full flex justify-center animate-fade-in-down">
                      <Button
                        size="sm"
                        onClick={() => advanceStep(STEPS[idx + 1])}
                        className="shadow-sm"
                      >
                        Concluir
                      </Button>
                    </div>
                  )}

                  {isCurrent && step === 'Negociar' && (
                    <div className="md:absolute top-[130px] w-full flex justify-center animate-fade-in-down">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toast.info(
                            'Anotação de oferta adicionada aos detalhes',
                          )
                        }
                        className="shadow-sm"
                      >
                        Registrar Oferta
                      </Button>
                    </div>
                  )}

                  {isCurrent && step === 'Finalizar' && (
                    <div className="md:absolute top-[80px] w-full flex flex-col md:flex-row gap-2 justify-center animate-fade-in-down">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm gap-1"
                          >
                            <Banknote className="w-3 h-3" /> Vender
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Registrar Venda</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Data da Venda *
                                </label>
                                <input
                                  type="date"
                                  className="w-full mt-1 p-2 border rounded-md"
                                  value={vendaData.data}
                                  onChange={(e) =>
                                    setVendaData({
                                      ...vendaData,
                                      data: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Plataforma *
                                </label>
                                <input
                                  type="text"
                                  placeholder="Ex: OLX"
                                  className="w-full mt-1 p-2 border rounded-md"
                                  value={vendaData.plataforma}
                                  onChange={(e) =>
                                    setVendaData({
                                      ...vendaData,
                                      plataforma: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Valor Obtido (R$) *
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                className="w-full mt-1 p-2 border rounded-md"
                                value={vendaData.valor}
                                onChange={(e) =>
                                  setVendaData({
                                    ...vendaData,
                                    valor: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Comprador
                                </label>
                                <input
                                  type="text"
                                  className="w-full mt-1 p-2 border rounded-md"
                                  value={vendaData.nome}
                                  onChange={(e) =>
                                    setVendaData({
                                      ...vendaData,
                                      nome: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Contato
                                </label>
                                <input
                                  type="text"
                                  className="w-full mt-1 p-2 border rounded-md"
                                  value={vendaData.contato}
                                  onChange={(e) =>
                                    setVendaData({
                                      ...vendaData,
                                      contato: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Observações
                              </label>
                              <textarea
                                className="w-full mt-1 p-2 border rounded-md"
                                value={vendaData.obs}
                                onChange={(e) =>
                                  setVendaData({
                                    ...vendaData,
                                    obs: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <Button className="w-full" onClick={handleVenda}>
                              Confirmar Venda
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-purple-500 hover:bg-purple-600 text-white shadow-sm gap-1"
                          >
                            <HandHeart className="w-3 h-3" /> Doar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Registrar Doação</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <label className="text-sm font-medium">
                                Data da Doação *
                              </label>
                              <input
                                type="date"
                                className="w-full mt-1 p-2 border rounded-md"
                                value={doacaoData.data}
                                onChange={(e) =>
                                  setDoacaoData({
                                    ...doacaoData,
                                    data: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Quem Recebeu *
                              </label>
                              <input
                                type="text"
                                className="w-full mt-1 p-2 border rounded-md"
                                value={doacaoData.nome}
                                onChange={(e) =>
                                  setDoacaoData({
                                    ...doacaoData,
                                    nome: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Local
                              </label>
                              <input
                                type="text"
                                className="w-full mt-1 p-2 border rounded-md"
                                value={doacaoData.local}
                                onChange={(e) =>
                                  setDoacaoData({
                                    ...doacaoData,
                                    local: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Observações
                              </label>
                              <textarea
                                className="w-full mt-1 p-2 border rounded-md"
                                value={doacaoData.obs}
                                onChange={(e) =>
                                  setDoacaoData({
                                    ...doacaoData,
                                    obs: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <Button className="w-full" onClick={handleDoacao}>
                              Confirmar Doação
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
