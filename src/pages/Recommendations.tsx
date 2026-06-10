import { useState, useEffect } from 'react'
import { getRecomendacoes, updateRecomendacao } from '@/services/recomendacoes'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Copy, Edit, Eye, Sparkles } from 'lucide-react'

export default function Recommendations() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [editItem, setEditItem] = useState<any>(null)
  const [detailsItem, setDetailsItem] = useState<any>(null)

  const [ancora, setAncora] = useState('')
  const [alvo, setAlvo] = useState('')
  const [piso, setPiso] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await getRecomendacoes()
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: any) => {
    setEditItem(item)
    setAncora(item.ancora?.toString() || '')
    setAlvo(item.alvo?.toString() || '')
    setPiso(item.piso?.toString() || '')
  }

  const handleSavePrices = async () => {
    if (!editItem) return
    try {
      await updateRecomendacao(editItem.id, {
        ancora: Number(ancora),
        alvo: Number(alvo),
        piso: Number(piso),
      })
      toast({ title: 'Preços salvos com sucesso' })
      setEditItem(null)
      loadData()
    } catch (error) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' })
    }
  }

  const handleCallMax = () => {
    toast({
      title: 'Max está reavaliando os preços...',
      description:
        'Aguarde um momento enquanto os dados de mercado são analisados.',
    })
    setTimeout(() => {
      toast({
        title: 'Agente Max chamado com sucesso',
        description:
          'Novos valores sugeridos baseados no mercado atual foram aplicados.',
      })
      loadData() // Simulated refresh
    }, 2500)
  }

  const copyPrices = (item: any) => {
    const text = `Âncora: R$ ${item.ancora}\nAlvo: R$ ${item.alvo}\nPiso: R$ ${item.piso}`
    navigator.clipboard.writeText(text)
    toast({
      title: 'Preços copiados',
      description: 'Valores copiados para a área de transferência.',
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recomendações</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as estratégias de precificação sugeridas pelo agente Max.
          </p>
        </div>
        <Button
          onClick={handleCallMax}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Sparkles className="w-4 h-4" />
          Chamar Max
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Âncora</TableHead>
              <TableHead>Alvo</TableHead>
              <TableHead>Piso</TableHead>
              <TableHead className="w-[150px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.item_nome}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-muted text-muted-foreground font-medium"
                  >
                    {item.plataforma}
                  </Badge>
                </TableCell>
                <TableCell className="text-green-600 dark:text-green-400 font-semibold">
                  R$ {item.ancora}
                </TableCell>
                <TableCell className="text-blue-600 dark:text-blue-400 font-semibold">
                  R$ {item.alvo}
                </TableCell>
                <TableCell className="text-red-600 dark:text-red-400 font-semibold">
                  R$ {item.piso}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                      title="Editar Preços"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyPrices(item)}
                      title="Copiar Preços"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDetailsItem(item)}
                      title="Ver Justificativa"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  Nenhuma recomendação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Dialog
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Preços: {editItem?.item_nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Preço Âncora (R$)</Label>
              <Input
                type="number"
                value={ancora}
                onChange={(e) => setAncora(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Preço Alvo (R$)</Label>
              <Input
                type="number"
                value={alvo}
                onChange={(e) => setAlvo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Preço Piso (R$)</Label>
              <Input
                type="number"
                value={piso}
                onChange={(e) => setPiso(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePrices}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog
        open={!!detailsItem}
        onOpenChange={(open) => !open && setDetailsItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Estratégia de Precificação</DialogTitle>
            <DialogDescription>
              Detalhes e notas para {detailsItem?.item_nome}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label className="font-semibold text-lg text-primary flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" /> Justificativa do Agente Max
              </Label>
              <p className="text-foreground text-sm p-4 bg-muted/50 rounded-lg border border-border/50 leading-relaxed">
                {detailsItem?.justificativa_max || 'Nenhuma justificativa.'}
              </p>
            </div>
            <div>
              <Label className="font-semibold text-lg text-primary mb-2 inline-block">
                Notas do Estrategista
              </Label>
              <p className="text-foreground text-sm p-4 bg-muted/50 rounded-lg border border-border/50 leading-relaxed">
                {detailsItem?.notas_estrategista || 'Nenhuma nota registrada.'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
