class OrderItem < ApplicationRecord
  belongs_to :product
  belongs_to :order

  def total
    qty * product.price
  end

  def total_in_currency
    total.to_f / 100
  end

  def serialize
    {
      qty: qty,
      product: product.serialize
    }
  end
end
