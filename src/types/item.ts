export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  condition: string;
  functional_status: string;
  defects: string;
  accessories: string;
  city: string;
  accepts_shipping: string;
  imagined_price: number;
  urgency: string;
  observations: string;
  priority_score: number;
  status: "disponivel" | "reservado" | "vendido" | "doado";
  current_step: string;
  created: string;
  updated: string;
}

export type ItemStatus = InventoryItem["status"];
