class OrderItem < ApplicationRecord
  belongs_to :product
  belongs_to :order

  def total
    qty * product.price
  end

  def total_in_currency
    total.to_f / 100
  end
end
