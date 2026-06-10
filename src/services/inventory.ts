import pb from '@/lib/pocketbase/client'

export interface InventoryItem {
  id: string
  name: string
  category: string
  brand?: string
  model?: string
  condition?: string
  functional_status?: string
  defects?: string
  accessories?: string
  city?: string
  accepts_shipping?: string
  imagined_price: number
  urgency?: string
  observations?: string
  priority_score: number
  status: string
  current_step?: string
  step_history?: any
  venda_data?: string
  venda_plataforma?: string
  venda_valor?: number
  comprador_nome?: string
  comprador_contato?: string
  doacao_data?: string
  donatario_nome?: string
  local_doacao?: string
}

export const getInventoryItems = async () => {
  return pb.collection('inventory_items').getFullList<InventoryItem>()
}

export const createInventoryItem = async (data: Partial<InventoryItem>) => {
  return pb.collection('inventory_items').create<InventoryItem>(data)
}

export const updateInventoryItem = async (
  id: string,
  data: Partial<InventoryItem>,
) => {
  return pb.collection('inventory_items').update<InventoryItem>(id, data)
}

export const deleteInventoryItem = async (id: string) => {
  return pb.collection('inventory_items').delete(id)
}
