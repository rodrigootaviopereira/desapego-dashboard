import { useState } from 'react'
import { X, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createInventoryItem, InventoryItem } from '@/services/inventory'
import { toast } from 'sonner'

interface BulkImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onImportDone: () => void
}

export function BulkImportDialog({
  isOpen,
  onClose,
  onImportDone,
}: BulkImportDialogProps) {
  const [preview, setPreview] = useState<Partial<InventoryItem>[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isImporting, setIsImporting] = useState(false)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      try {
        let data: any[] = []
        if (selected.name.endsWith('.json')) {
          data = JSON.parse(content)
        } else if (selected.name.endsWith('.csv')) {
          const lines = content.split('\n')
          const headers = lines[0]
            .split(',')
            .map((h) => h.trim().replace(/"/g, ''))
          data = lines
            .slice(1)
            .filter((l) => l.trim())
            .map((line) => {
              const values = line
                .split(',')
                .map((v) => v.trim().replace(/"/g, ''))
              const obj: any = {}
              headers.forEach((h, i) => {
                obj[h] = values[i] || ''
              })
              return obj
            })
        }

        const valid: Partial<InventoryItem>[] = []
        const errs: string[] = []
        data.forEach((row, i) => {
          if (!row.name || !row.category || !row.condition) {
            errs.push(`Linha ${i + 1}: Faltando nome, category ou condition.`)
          } else {
            valid.push({
              name: row.name,
              category: row.category,
              brand: row.brand || '',
              model: row.model || '',
              condition: row.condition,
              functional_status: row.functional_status || 'Sim',
              defects: row.defects || '',
              accessories: row.accessories || '',
              city: row.city || '',
              accepts_shipping: row.accepts_shipping || 'Sim',
              imagined_price: Number(row.imagined_price) || 0,
              urgency: row.urgency || 'Média',
              observations: row.observations || '',
              status: row.status || 'disponivel',
              priority_score: Number(row.priority_score) || 5,
            })
          }
        })
        setPreview(valid)
        setErrors(errs)
      } catch (err) {
        toast.error('Erro ao processar o arquivo')
        setErrors(['Erro fatal ao ler o conteúdo do arquivo.'])
      }
    }
    reader.readAsText(selected)
  }

  const handleImport = async () => {
    setIsImporting(true)
    let successCount = 0
    let errCount = 0
    for (const item of preview) {
      try {
        await createInventoryItem(item)
        successCount++
      } catch (e) {
        errCount++
      }
    }
    setIsImporting(false)
    toast.success(
      `${successCount} itens importados com sucesso. ${errCount} erros.`,
    )
    onImportDone()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-4xl rounded-xl border border-border shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-bold">Importar Itens em Massa</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-lg p-10 bg-muted/10 hover:bg-muted/30 transition-colors">
            <input
              type="file"
              id="bulk-file"
              accept=".csv,.json"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="bulk-file"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Clique para selecionar um arquivo
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Suporta arquivos .csv e .json
                </p>
              </div>
            </label>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm space-y-2">
              <div className="font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Erros Encontrados
              </div>
              <ul className="list-disc list-inside pl-4">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {preview.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-4 h-4" /> {preview.length} itens
                prontos para importar
              </h3>
              <div className="overflow-x-auto border border-border/50 rounded-lg">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2">Nome</th>
                      <th className="px-4 py-2">Categoria</th>
                      <th className="px-4 py-2">Condição</th>
                      <th className="px-4 py-2">Preço Est.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-t border-border/50">
                        <td className="px-4 py-2 max-w-[200px] truncate">
                          {row.name}
                        </td>
                        <td className="px-4 py-2">{row.category}</td>
                        <td className="px-4 py-2">{row.condition}</td>
                        <td className="px-4 py-2">R$ {row.imagined_price}</td>
                      </tr>
                    ))}
                    {preview.length > 5 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-2 text-center text-muted-foreground text-xs italic"
                        >
                          + {preview.length - 5} outros itens...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-muted/20">
          <Button variant="outline" onClick={onClose} disabled={isImporting}>
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={preview.length === 0 || isImporting}
          >
            {isImporting ? 'Importando...' : 'Confirmar Importação'}
          </Button>
        </div>
      </div>
    </div>
  )
}
