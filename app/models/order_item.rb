class OrderItem < ApplicationRecord
  belongs_to :product
  belongs_to :order
  has_one :stock_hold, dependent: :destroy

  before_destroy :delete_holds

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

  def confirm!
    product.decrement! :stock, qty

    stock_hold.update(confirmed_at: Time.current)
  end

  def serialize
    {
      qty: qty,
      product: product.serialize
    }
  end

  private

  def delete_holds
    StockHold.where(order_item_id: id).delete_all
  end
end
