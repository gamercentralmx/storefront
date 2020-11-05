class PaymentIntent < ApplicationRecord
  belongs_to :payment_method
  belongs_to :user
  has_one :order

  before_create :create_stripe_payment_intent!

  DEFAULT_PAYMENT_METHOD_OPTIONS = {
    card: {
      installments: {
        enabled: true
      }
    }
  }

  def self.find_or_create_by(user_id:, payment_method_id:, amount:, idempotency_key:)
    where(
      user_id: user_id,
      payment_method: payment_method_id,
      amount: amount,
      idempotency_key: idempotency_key
    ).first_or_create
  end

  def stripe_payment_intent
    @stripe_payment_intent ||= Stripe::PaymentIntent.retrieve(stripe_id)
  end

  def payment_plan
    payment_method_options.dig('card', 'installments', 'plan')
  end

  private

  def create_stripe_payment_intent!
    return if stripe_id.present?

    intent = Stripe::PaymentIntent.create(
      {
        amount: amount,
        currency: 'mxn',
        customer: user.stripe_id,
        payment_method: payment_method.stripe_id,
        payment_method_options: DEFAULT_PAYMENT_METHOD_OPTIONS
      }, {
        idempotency_key: idempotency_key
      }
    )

    self.stripe_id = intent.id
    self.payment_method_options = intent.payment_method_options
  end

  def available_plans
    @payment_intent.payment_method_options.card.installments.available_plans
  end
end
