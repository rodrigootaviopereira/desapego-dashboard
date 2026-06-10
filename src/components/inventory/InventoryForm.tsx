import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Item } from '@/lib/mock-data'

interface InventoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Item) => void
  initialData?: Item | null
}

const defaultItem: Partial<Item> = {
  nome: '',
  categoria: 'Gibis',
  marcaModelo: '',
  estado: 'Novo',
  funciona: 'Sim',
  defeitos: '',
  acessorios: '',
  cidade: '',
  aceitaEnvio: 'Sim',
  preco: 0,
  urgencia: 'Média',
  observacoes: '',
  status: 'Disponível',
  score: 5,
}

export function InventoryForm({
  isOpen,
  onClose,
  onSave,
  initialData,
}: InventoryFormProps) {
  const [formData, setFormData] = useState<Partial<Item>>(defaultItem)

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || defaultItem)
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'preco' || name === 'score' ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: formData.id || `item-${Date.now()}`,
    } as Item)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-3xl rounded-xl border border-border shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-bold">
            {initialData ? 'Editar Item' : 'Novo Item'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form
            id="inventory-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome *</label>
              <input
                required
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Gibis">Gibis</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Instrumentos">Instrumentos</option>
                <option value="Livros">Livros</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Marca ou Modelo</label>
              <input
                name="marcaModelo"
                value={formData.marcaModelo}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="Novo">Novo</option>
                <option value="Como novo">Como novo</option>
                <option value="Bom">Bom</option>
                <option value="Regular">Regular</option>
                <option value="Ruim">Ruim</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Funciona?</label>
              <select
                name="funciona"
                value={formData.funciona}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
                <option value="Parcialmente">Parcialmente</option>
                <option value="N/A">N/A</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Aceita Envio?</label>
              <select
                name="aceitaEnvio"
                value={formData.aceitaEnvio}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
                <option value="Só local">Só local</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cidade</label>
              <input
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Preço Imaginado (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Urgência</label>
              <select
                name="urgencia"
                value={formData.urgencia}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Score (Prioridade 1-10)
              </label>
              <input
                type="number"
                min="1"
                max="11"
                name="score"
                value={formData.score}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Defeitos</label>
              <textarea
                name="defeitos"
                rows={2}
                value={formData.defeitos}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Acessórios</label>
              <textarea
                name="acessorios"
                rows={2}
                value={formData.acessorios}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Observações</label>
              <textarea
                name="observacoes"
                rows={2}
                value={formData.observacoes}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-muted/20">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="inventory-form">
            Salvar Item
          </Button>
        </div>
      </div>
    </div>
  )
}
