class PaymentIntent < ApplicationRecord
  belongs_to :payment_method
  belongs_to :user
end
