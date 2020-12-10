class OrderItem < ApplicationRecord
  belongs_to :product
  belongs_to :order
  has_one :stock_hold, dependent: :destroy

  def total
    qty * product.price
  end

  def total_in_currency
    total.to_f / 100
  end

  def add!(qty)
    increment! :qty, qty
    stock_hold.increment! :qty, qty if stock_hold.present? and not stock_hold.expired?

    true
  end

  def subtract!(qty)
    decrement! :qty, qty
    stock_hold.decrement! :qty, qty if stock_hold.present? and not stock_hold.expired?

    true
  end

  def serialize
    {
      qty: qty,
      product: product.serialize
    }
  end
end
