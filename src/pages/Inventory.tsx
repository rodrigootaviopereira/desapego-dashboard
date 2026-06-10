import { useState, useMemo } from 'react'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MOCK_INVENTORY, Item } from '@/lib/mock-data'
import { InventoryForm } from '@/components/inventory/InventoryForm'
import { cn } from '@/lib/utils'

export default function Inventory() {
  const [items, setItems] = useState<Item[]>(MOCK_INVENTORY)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  const handleOpenForm = (item?: Item) => {
    setEditingItem(item || null)
    setIsFormOpen(true)
  }

  const handleSaveForm = (savedItem: Item) => {
    if (editingItem) {
      setItems(items.map((i) => (i.id === savedItem.id ? savedItem : i)))
    } else {
      setItems([savedItem, ...items])
    }
    setIsFormOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este item?')) {
      setItems(items.filter((i) => i.id !== id))
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchCategory =
        filterCategory === 'All' || item.categoria === filterCategory
      const matchStatus = filterStatus === 'All' || item.status === filterStatus

      let matchPriority = true
      if (filterPriority === 'Alta') matchPriority = item.score >= 8
      if (filterPriority === 'Media')
        matchPriority = item.score >= 5 && item.score < 8
      if (filterPriority === 'Baixa') matchPriority = item.score < 5

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
        <Button
          onClick={() => handleOpenForm()}
          className="w-full sm:w-auto h-10 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </Button>
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
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="All">Todos Status</option>
            <option value="Disponível">Disponível</option>
            <option value="Reservado">Reservado</option>
            <option value="Vendido">Vendido</option>
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
                const isHighPriority = item.score >= 8
                const isAvailable = item.status === 'Disponível'
                const destino = item.preco > 0 ? 'Venda' : 'Doação'

                return (
                  <tr
                    key={item.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td
                      className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate"
                      title={item.nome}
                    >
                      {item.nome}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.categoria}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.estado}
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
                      R$ {item.preco.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-md text-xs font-semibold shadow-sm inline-block',
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
                        {item.score}
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
    </div>
  )
}
