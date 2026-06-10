import pb from '@/lib/pocketbase/client'

export interface Log {
  id: string
  timestamp: string
  agente?: string
  acao: string
  item_id?: string
  item_nome?: string
  detalhes?: string
  usuario?: string
  campo_alterado?: string
  valor_antes?: string
  valor_depois?: string
  created: string
}

export const getLogs = async () =>
  pb.collection('logs').getFullList<Log>({ sort: '-timestamp' })

export const createLog = async (data: Partial<Log>) =>
  pb.collection('logs').create<Log>(data)
