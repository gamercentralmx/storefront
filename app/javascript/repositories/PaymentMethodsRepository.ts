import { PaymentIntent } from 'definitions/PaymentIntent'
import { PaymentMethod } from 'definitions/PaymentMethod'

export default class PaymentMethodsRepository {
  static async all (): Promise<PaymentMethod[]> {
    return $.ajax({ url: '/metodos_de_pago' })
  }

  static async save (token: stripe.Token): Promise<PaymentMethod> {
    return $.ajax({ url: '/metodos_de_pago', method: 'POST', data: { payment_method: { token } } })
  }

  static async makeDefault (id: number): Promise<PaymentMethod> {
    return $.ajax({ url: `/metodos_de_pago/${id}/make_default`, method: 'PUT' })
  }
}
