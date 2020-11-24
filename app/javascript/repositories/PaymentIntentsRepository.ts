import { PaymentPlan } from 'definitions/PaymentIntent'

interface PaymentIntentData {
  payment_method_id?: number
  amount?: number
  idempotency_key?: string
  selected_plan?: PaymentPlan
}

export default class PaymentIntentsRepository {
  static async create (payment_intent: PaymentIntentData) {
    return $.ajax({ url: '/intentos_de_pago', method: 'POST', data: { payment_intent } })
  }

  static async confirm (payment_intent_id: number, payment_intent: PaymentIntentData) {
    return $.ajax({ url: `/intentos_de_pago/${payment_intent_id}/confirmacion`, method: 'PUT', data: { payment_intent } })
  }
}
