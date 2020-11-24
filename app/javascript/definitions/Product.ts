export interface Product {
  id: number
  category_id: number
  name: string
  description: string
  metadata: any
  cost: number
  price: number
  stock: number
  category_name: string
  pictures: string[]
  created_at: Date
  updated_at: Date
}
