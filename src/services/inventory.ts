import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface InventoryItem extends RecordModel {
  name: string
  category: string
  brand: string
  model: string
  condition: string
  functional_status: string
  defects: string
  accessories: string
  city: string
  accepts_shipping: string
  imagined_price: number
  urgency: string
  observations: string
  priority_score: number
  status: string
}

export const getInventoryItems = async () => {
  return pb.collection<InventoryItem>('inventory_items').getFullList({
    sort: '-created',
  })
}

export const createInventoryItem = async (data: Partial<InventoryItem>) => {
  return pb.collection<InventoryItem>('inventory_items').create(data)
}

export const updateInventoryItem = async (
  id: string,
  data: Partial<InventoryItem>,
) => {
  return pb.collection<InventoryItem>('inventory_items').update(id, data)
}

export const deleteInventoryItem = async (id: string) => {
  return pb.collection('inventory_items').delete(id)
}
