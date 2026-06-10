import { useState, useEffect } from 'react'
import { getPromptsVenda, updatePromptVenda } from '@/services/prompts_venda'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Copy,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  MapPin,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SalesAds() {
  const [adsList, setAdsList] = useState<any[]>([])
  const [selectedAdId, setSelectedAdId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await getPromptsVenda()
      setAdsList(res)
      if (res.length > 0) {
        handleSelectAd(res[0].id, res)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAd = (id: string, list = adsList) => {
    setSelectedAdId(id)
    const ad = list.find((a) => a.id === id)
    if (ad) {
      setTitle(ad.titulo || '')
      setDesc(ad.descricao || '')
    }
  }

  const currentAd = adsList.find((a) => a.id === selectedAdId)

  const handleCallLeo = () => {
    toast({
      title: 'Leo está otimizando seu anúncio...',
      description: 'Aplicando técnicas de copywriting focadas em conversão.',
    })
    setTimeout(() => {
      setTitle((prev) => `🔥 ${prev} [Oferta Imperdível]`)
      setDesc(
        (prev) =>
          `${prev}\n\n👉 Aproveite esta oportunidade única! Item de alta qualidade com preço especial. Mande uma mensagem agora!`,
      )
      toast({
        title: 'Agente Leo chamado com sucesso',
        description: 'Seu anúncio foi reescrito com gatilhos mentais.',
      })
    }, 2000)
  }

  const handleCopy = () => {
    const text = `${title}\n\n${desc}`
    navigator.clipboard.writeText(text)
    toast({
      title: 'Anúncio copiado para a área de transferência',
      description: 'Pronto para colar no seu marketplace favorito.',
    })
  }

  const handleOpenOLX = () => {
    window.open('https://www.olx.com.br', '_blank')
  }

  const handleSave = async () => {
    if (!currentAd) return
    try {
      await updatePromptVenda(currentAd.id, { titulo: title, descricao: desc })
      toast({
        title: 'Item editado com sucesso',
        description: 'O rascunho do seu anúncio foi salvo.',
      })
      loadData()
    } catch (e) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' })
    }
  }

  if (loading) return null

  return (
    <div className="p-6 max-w-[1600px] mx-auto h-[calc(100vh-80px)] flex flex-col animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Editor de Anúncios
          </h1>
          <p className="text-muted-foreground mt-2">
            Crie e otimize suas listagens com a ajuda do agente Leo.
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Select value={selectedAdId} onValueChange={(v) => handleSelectAd(v)}>
            <SelectTrigger className="w-[280px] bg-background">
              <SelectValue placeholder="Selecione um anúncio" />
            </SelectTrigger>
            <SelectContent>
              {adsList.map((ad) => (
                <SelectItem key={ad.id} value={ad.id}>
                  {ad.item_nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleCallLeo}
            className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Sparkles className="w-4 h-4" />
            Chamar Leo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Left: Editor */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold">Título do Anúncio</label>
              <span className="text-xs text-muted-foreground">
                {title.length} / 100
              </span>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="text-lg font-medium"
            />
          </div>

          <div className="space-y-3 flex-1 flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold">Descrição</label>
              <span className="text-xs text-muted-foreground">
                {desc.length} / 2000
              </span>
            </div>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={2000}
              className="flex-1 resize-none text-base leading-relaxed bg-background"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold">Fotos</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm font-medium">
                Clique ou arraste fotos aqui
              </p>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Checklist de Qualidade
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="c1"
                  checked={title.length > 20}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <label
                  htmlFor="c1"
                  className="text-sm font-medium cursor-pointer"
                >
                  Título chamativo (mín 20 chars)
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="c2"
                  checked={desc.length > 100}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <label
                  htmlFor="c2"
                  className="text-sm font-medium cursor-pointer"
                >
                  Descrição detalhada (mín 100 chars)
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="c3" checked={false} />
                <label
                  htmlFor="c3"
                  className="text-sm font-medium cursor-pointer"
                >
                  Fotos nítidas e boa iluminação adicionadas
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={handleSave} size="lg" className="w-full">
              Salvar Alterações
            </Button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="bg-accent/50 rounded-2xl p-6 overflow-y-auto custom-scrollbar flex items-start justify-center border shadow-inner">
          <div className="w-full max-w-[400px] bg-background rounded-xl shadow-lg border overflow-hidden flex flex-col animate-fade-in">
            {/* Header Mock */}
            <div className="bg-[#6e0ad6] p-4 flex items-center justify-between text-white">
              <span className="font-extrabold text-2xl tracking-tighter">
                OLX
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Abrir OLX"
                  className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/20"
                  onClick={handleOpenOLX}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Copiar Anúncio"
                  className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/20"
                  onClick={handleCopy}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Image mock */}
            <div className="h-[280px] bg-muted flex items-center justify-center border-b relative">
              <img
                src="https://img.usecurling.com/p/400/300?q=tech&color=gray"
                alt="Produto Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                1 / 1
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground">R$ 1.500</h2>
                <h3 className="text-[17px] leading-snug font-normal text-foreground mt-2 line-clamp-2">
                  {title || 'Título do seu anúncio aparecerá aqui'}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                <MapPin className="w-4 h-4" />
                <span>Maringá, PR</span>
              </div>

              <div className="pt-5 border-t">
                <h4 className="font-semibold text-lg mb-3">Descrição</h4>
                <p className="text-[15px] text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {desc || 'Escreva uma descrição atrativa...'}
                </p>
              </div>

              <div className="pt-6">
                <Button className="w-full bg-[#6e0ad6] hover:bg-[#5b08b3] text-white rounded-full py-6 text-lg font-semibold shadow-md">
                  Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
