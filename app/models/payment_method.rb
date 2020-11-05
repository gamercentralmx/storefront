class PaymentMethod < ApplicationRecord
  belongs_to :user
  has_many :orders, dependent: :nullify
  has_many :payment_intents, dependent: :nullify

  enum kind: {
    card: 'card'
  }

  before_destroy :delete_on_stripe

  def make_default!
    Stripe::Customer.update(user.stripe_id, { default_source: stripe_id })

    user.update(default_source: stripe_id)
  end

  private

  def delete_on_stripe
    Stripe::Customer.delete_source(user.stripe_id, stripe_id)
  end
end
