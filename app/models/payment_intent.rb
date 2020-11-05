class PaymentIntent < ApplicationRecord
  belongs_to :payment_method
  belongs_to :user

  before_create :create_stripe_payment_intent

  DEFAULT_PAYMENT_METHOD_OPTIONS = {
    card: {
      installments: {
        enabled: true
      }
    }
  }

  def find_or_create_by(user:, payment_method:, amount:, idempotency_key:)
    where(
      user_id: user.id,
      payment_method: payment_method.id,
      amount: amount,
      idempotency_key: idempotency_key
    ).first_or_create
  end

  private

  def create_stripe_payment_intent
    return if stripe_id.present?

    intent = Stripe::PaymentIntent.create({
      amount: amount,
      currency: 'mxn',
      customer: user.stripe_id,
      payment_method: payment_method.stripe_id,
      payment_method_options: DEFAULT_PAYMENT_METHOD_OPTIONS
    }, { idempotency_key: idempotency_key })

    self.stripe_id = intent.id
  end

  def available_plans
    @payment_intent.payment_method_options.card.installments.available_plans
  end
end
