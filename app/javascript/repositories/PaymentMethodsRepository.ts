import { PaymentIntent } from 'definitions/PaymentIntent'
import { PaymentMethod } from 'definitions/PaymentMethod'

export default class PaymentMethodsRepository {
  static async all (): Promise<PaymentMethod[]> {
    return $.ajax({ url: '/payment_methods' })
  }

  static async save (token: stripe.Token): Promise<PaymentMethod> {
    return $.ajax({ url: '/payment_methods', method: 'POST', data: { payment_method: { token } } })
  }

  static async makeDefault (id: number): Promise<PaymentMethod> {
    return $.ajax({ url: `/payment_methods/${id}/make_default`, method: 'PUT' })
  }

  static async installments (id: number, amount: number): Promise<PaymentIntent> {
    return $.ajax({ url: `/payment_methods/${id}/installments?amount=${amount}`  })
  }
}
