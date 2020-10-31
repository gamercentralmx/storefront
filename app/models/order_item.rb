class OrderItem < ApplicationRecord
  belongs_to :product
  belongs_to :order

  def total
    qty * product.price
  end
end
