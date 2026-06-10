import pb from '@/lib/pocketbase/client'

export interface PromptVenda {
  id: string
  item_id: string
  item_nome: string
  titulo: string
  descricao: string
  fotos: string[]
  status: 'rascunho' | 'publicado' | 'arquivado'
  agente_leo: string
  notas_copywriter: string
  data: string
  created: string
  updated: string
  expand?: any
}

export const getPromptsVenda = () =>
  pb.collection('prompts_venda').getFullList<PromptVenda>({ expand: 'item_id' })
export const updatePromptVenda = (id: string, data: Partial<PromptVenda>) =>
  pb.collection('prompts_venda').update<PromptVenda>(id, data)
