class PaymentMethod < ApplicationRecord
  belongs_to :user

  enum kind: {
    card: 'card'
  }
end
