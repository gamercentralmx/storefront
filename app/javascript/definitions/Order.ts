import { Product } from './Product'

export interface OrderItem {
  qty: number
  product: Product
}

export interface Order {
  id: string
  status: string
  created_at: Date
  updated_at: Date
  order_items: OrderItem[]
}
