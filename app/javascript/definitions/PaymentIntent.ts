export interface PaymentPlan {
  count: number
  interval: string
  type: string
}

export interface Installments {
  available_plans: PaymentPlan[]
  enabled: boolean
  plan: PaymentPlan
}

export interface Card {
  installments: Installments
  network?: any
  request_three_d_secure: string
}

export interface PaymentMethodOptions {
  card: Card
}


export interface PaymentIntent {
  id: number
  payment_method_id: number
  user_id: number
  amount: number
  amount_received: number
  idempotency_key: string
  status: string
  payment_method_options: PaymentMethodOptions
  stripe_id: string
  created_at: Date
  updated_at: Date
}


