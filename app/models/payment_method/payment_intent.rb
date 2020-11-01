class PaymentMethod::PaymentIntent
  attr_reader :user, :payment_method, :amount, :payment_intent

  def initialize(user, payment_method, amount)
    @user = user
    @amount = amount
    @payment_method = payment_method
  end

  def create
    @payment_intent = Stripe::PaymentIntent.create(
      amount: amount,
      currency: 'mxn',
      customer: user.stripe_id,
      payment_method: payment_method.stripe_id,
      payment_method_options: {
        card: {
          installments: {
            enabled: true
          }
        }
      }
    )
  end

  def id
    @payment_intent.id
  end

  def available_plans
    @payment_intent.payment_method_options.card.installments.available_plans
  end
end
