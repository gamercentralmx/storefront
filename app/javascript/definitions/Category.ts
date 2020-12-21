export interface Property {
  name: string
  type: string
}

export interface Category {
  id?: number
  name: string
  created_at?: Date
  updated_at?: Date
  parent_id?: number
  properties: Property[]
}
