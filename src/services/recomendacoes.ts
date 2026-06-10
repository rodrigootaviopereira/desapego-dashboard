import pb from '@/lib/pocketbase/client'

export interface Recomendacao {
  id: string
  item_id: string
  item_nome: string
  plataforma: string
  ancora: number
  alvo: number
  piso: number
  justificativa_max: string
  notas_estrategista: string
  data: string
  created: string
  updated: string
  expand?: any
}

export const getRecomendacoes = () =>
  pb
    .collection('recomendacoes')
    .getFullList<Recomendacao>({ expand: 'item_id' })
export const updateRecomendacao = (id: string, data: Partial<Recomendacao>) =>
  pb.collection('recomendacoes').update<Recomendacao>(id, data)
