class PaymentMethod < ApplicationRecord
  belongs_to :user

  enum kind: {
    card: 'card'
  }

  def make_default!
    Stripe::Customer.update(user.stripe_id, { default_source: stripe_id })

    user.update(default_source: stripe_id)
  end
end
