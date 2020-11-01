export default class PaymentMethods {
  static async save (token: stripe.Token) {
    return $.ajax({ url: '/payment_methods', method: 'POST', data: { payment_method: { token } } })
  }
}
