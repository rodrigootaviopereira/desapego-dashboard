import { useState, useMemo, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Upload, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InventoryForm } from '@/components/inventory/InventoryForm'
import { BulkImportDialog } from '@/components/inventory/BulkImportDialog'
import { cn } from '@/lib/utils'
import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  InventoryItem,
} from '@/services/inventory'
import { useRealtime } from '@/hooks/use-realtime'
import { toast } from 'sonner'

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [quickFilter, setQuickFilter] = useState('Todos')
  const [showDeleted, setShowDeleted] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  const loadData = async () => {
    try {
      const data = await getInventoryItems()
      setItems(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('inventory_items', () => {
    loadData()
  })

  const handleOpenForm = (item?: InventoryItem) => {
    setEditingItem(item || null)
    setIsFormOpen(true)
  }

  const handleSaveForm = async (savedItem: Partial<InventoryItem>) => {
    try {
      if (editingItem && savedItem.id) {
        await updateInventoryItem(savedItem.id, savedItem)
        toast.success('Item atualizado com sucesso!')
      } else {
        await createInventoryItem(savedItem)
        toast.success('Item criado com sucesso!')
      }
      setIsFormOpen(false)
    } catch (e) {
      toast.error('Erro ao salvar item')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja mover para a lixeira?')) {
      try {
        await updateInventoryItem(id, { deletado: true })
        toast.success('Item movido para a lixeira')
        setSelectedIds((prev) => prev.filter((x) => x !== id))
      } catch (e) {
        toast.error('Erro ao deletar item')
      }
    }
  }

  const handleRestore = async (id: string) => {
    try {
      await updateInventoryItem(id, { deletado: false })
      toast.success('Item restaurado com sucesso')
      setSelectedIds((prev) => prev.filter((x) => x !== id))
    } catch (e) {
      toast.error('Erro ao restaurar item')
    }
  }

  const handleBulkAction = async (
    action: 'delete' | 'restore' | 'urgent' | 'available',
  ) => {
    if (!confirm(`Confirmar ação em lote para ${selectedIds.length} itens?`))
      return
    try {
      await Promise.all(
        selectedIds.map((id) => {
          if (action === 'delete')
            return updateInventoryItem(id, { deletado: true })
          if (action === 'restore')
            return updateInventoryItem(id, { deletado: false })
          if (action === 'urgent')
            return updateInventoryItem(id, {
              urgency: 'Alta',
              priority_score: 9,
            })
          if (action === 'available')
            return updateInventoryItem(id, { status: 'disponivel' })
        }),
      )
      toast.success('Ação em lote realizada com sucesso')
      setSelectedIds([])
    } catch (e) {
      toast.error('Erro ao executar ação em lote')
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchDeleted = showDeleted ? item.deletado === true : !item.deletado
      if (!matchDeleted) return false

      const matchSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      if (!matchSearch) return false

      if (quickFilter === 'Disponíveis') return item.status === 'disponivel'
      if (quickFilter === 'Urgentes') return item.urgency === 'Alta'
      if (quickFilter === 'Score 8+') return item.priority_score >= 8
      if (quickFilter === 'Sem preço')
        return item.imagined_price === 0 || !item.imagined_price

      return true
    })
  }, [items, searchTerm, quickFilter, showDeleted])

  const toggleAll = () => {
    if (selectedIds.length === filteredItems.length) setSelectedIds([])
    else setSelectedIds(filteredItems.map((i) => i.id))
  }

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventário</h1>
          <p className="text-muted-foreground">
            Gerencie todos os itens do Desapego Squad.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsBulkOpen(true)}
            className="flex-1 sm:flex-none h-10 shadow-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button
            onClick={() => handleOpenForm()}
            className="flex-1 sm:flex-none h-10 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl shadow-sm p-4 space-y-4">
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          {['Todos', 'Disponíveis', 'Urgentes', 'Score 8+', 'Sem preço'].map(
            (qf) => (
              <Button
                key={qf}
                variant={quickFilter === qf ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQuickFilter(qf)}
              >
                {qf}
              </Button>
            ),
          )}
          <div className="flex-1" />
          <Button
            variant={showDeleted ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => {
              setShowDeleted(!showDeleted)
              setSelectedIds([])
            }}
          >
            {showDeleted ? 'Sair da Lixeira' : 'Ver Lixeira'}
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    className="rounded"
                    onChange={toggleAll}
                    checked={
                      selectedIds.length === filteredItems.length &&
                      filteredItems.length > 0
                    }
                  />
                </th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3 text-right">Preço</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Prioridade</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isHighPriority = item.priority_score >= 8
                const isAvailable = item.status === 'disponivel'

                return (
                  <tr
                    key={item.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleOne(item.id)}
                      />
                    </td>
                    <td
                      className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate"
                      title={item.name}
                    >
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      R${' '}
                      {item.imagined_price
                        ? item.imagined_price.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })
                        : '0,00'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-md text-xs font-semibold shadow-sm inline-block capitalize',
                          isAvailable
                            ? 'bg-green-500 text-white'
                            : 'bg-secondary text-secondary-foreground',
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center w-8 h-8 rounded-full font-bold',
                          isHighPriority
                            ? 'bg-green-500/20 text-green-500 ring-2 ring-green-500/50'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {item.priority_score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {!showDeleted ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenForm(item)}
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRestore(item.id)}
                          className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Nenhum item encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="text-sm text-muted-foreground pt-2">
          Mostrando {filteredItems.length} itens {showDeleted && '(Lixeira)'}
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-popover border border-border shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 z-50 animate-slide-up">
          <span className="text-sm font-semibold">
            {selectedIds.length} selecionados
          </span>
          <div className="w-px h-6 bg-border" />
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction('restore')}
            className={showDeleted ? '' : 'hidden'}
          >
            Restaurar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction('available')}
            className={!showDeleted ? '' : 'hidden'}
          >
            Disponível
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction('urgent')}
            className={!showDeleted ? '' : 'hidden'}
          >
            Urgente
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleBulkAction('delete')}
            className={!showDeleted ? '' : 'hidden'}
          >
            Deletar
          </Button>
        </div>
      )}

      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveForm}
        initialData={editingItem}
      />
      <BulkImportDialog
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onImportDone={loadData}
      />
    </div>
  )
}
