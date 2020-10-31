export interface Property {
  name: string
  type: 'string' | 'text' | 'number'
}

export interface Category {
  name: string
  properties?: Property[]
}
