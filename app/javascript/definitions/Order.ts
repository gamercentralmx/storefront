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
  total_in_currency: number
  shipping_cost_in_currency: number
  products_total_in_currency: number
}
