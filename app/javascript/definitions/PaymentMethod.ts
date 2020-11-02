export interface PaymentMethod {
  id: number
  user_id: number
  stripe_id: string
  kind: string
  metadata: any
  created_at: Date
  updated_at: Date
}

