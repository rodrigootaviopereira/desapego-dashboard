import pb from '@/lib/pocketbase/client'

export interface Agente {
  id: string
  slug: string
  nome: string
  persona?: string
  role_description?: string
  comportamentos?: any
  vocabulario?: string
  tom?: string
  status: boolean
  instrucoes_especiais?: string
}

export const getAgentes = async () =>
  pb.collection('agentes').getFullList<Agente>()
export const updateAgente = async (id: string, data: Partial<Agente>) =>
  pb.collection('agentes').update<Agente>(id, data)
