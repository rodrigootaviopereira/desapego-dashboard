import { useState, useMemo, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InventoryForm } from '@/components/inventory/InventoryForm'
import { BulkImportDialog } from '@/components/inventory/BulkImportDialog'
import { cn } from '@/lib/utils'
import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  InventoryItem,
} from '@/services/inventory'
import { useRealtime } from '@/hooks/use-realtime'
import { toast } from 'sonner'

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')

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
    if (confirm('Tem certeza que deseja deletar este item?')) {
      try {
        await deleteInventoryItem(id)
        toast.success('Item deletado com sucesso!')
      } catch (e) {
        toast.error('Erro ao deletar item')
      }
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchCategory =
        filterCategory === 'All' || item.category === filterCategory
      const matchStatus = filterStatus === 'All' || item.status === filterStatus

      let matchPriority = true
      if (filterPriority === 'Alta') matchPriority = item.priority_score >= 8
      if (filterPriority === 'Media')
        matchPriority = item.priority_score >= 5 && item.priority_score < 8
      if (filterPriority === 'Baixa') matchPriority = item.priority_score < 5

      return matchSearch && matchCategory && matchStatus && matchPriority
    })
  }, [items, searchTerm, filterCategory, filterStatus, filterPriority])

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
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="All">Todas Categorias</option>
            <option value="Gibis">Gibis</option>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Instrumentos">Instrumentos</option>
            <option value="Livros">Livros</option>
            <option value="Outros">Outros</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 capitalize"
          >
            <option value="All">Todos Status</option>
            <option value="disponivel">Disponível</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
            <option value="doado">Doado</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="All">Todas Prioridades</option>
            <option value="Alta">Alta (Score 8+)</option>
            <option value="Media">Média (Score 5-7)</option>
            <option value="Baixa">Baixa (Score &lt; 5)</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Destino</th>
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
                const destino = item.imagined_price > 0 ? 'Venda' : 'Doação'

                return (
                  <tr
                    key={item.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td
                      className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate"
                      title={item.name}
                    >
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.condition}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-md text-xs font-medium',
                          destino === 'Venda'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-purple-500/10 text-purple-500',
                        )}
                      >
                        {destino}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      R${' '}
                      {item.imagined_price.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
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
                    </td>
                  </tr>
                )
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
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
          Mostrando {filteredItems.length} de {items.length} itens
        </div>
      </div>

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
