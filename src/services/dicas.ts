import pb from '@/lib/pocketbase/client'

export interface Dica {
  id: string
  agente: 'Vera' | 'Leo' | 'Max' | 'Kai'
  tipo: string
  texto: string
  resultado: string
  item_id: string
  data: string
  aplicada: boolean
  created: string
  updated: string
  expand?: any
}

export const getDicas = () =>
  pb.collection('dicas').getFullList<Dica>({ expand: 'item_id' })
export const updateDica = (id: string, data: Partial<Dica>) =>
  pb.collection('dicas').update<Dica>(id, data)
