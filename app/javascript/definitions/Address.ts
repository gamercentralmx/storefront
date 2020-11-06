import { BusinessType } from './BusinessType'

export interface Address {
  id?: number
  name: string
  street: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  country: string
  tax_id?: string
  business_name?: string
  business_type?: BusinessType
}
