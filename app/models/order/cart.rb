class Order::Cart
  attr_reader :order, :order_item

  def initialize(order)
    @order = order
  end

  def add!(product, qty = 1)
    @order_item = order.order_items.find_by(product_id: product.id)

    return false if product.stock.zero?

    if order_item.present?
      order_item.increment! :qty, 1
    else
      @order_item = order.order_items.create(product_id: product.id, qty: qty)

      @order_item.valid?
    end
  end

  def subtract!(product, qty = 1)
    @order_item = order.order_items.find_by(product_id: product.id)

    if order_item.qty > 1
      order_item.decrement! :qty, 1
    else
      order_item.destroy
    end
  end

  def delete!(product)
    @order_item = order.order_items.find_by(product_id: product.id)

    return if order_item.nil?

    order_item.destroy
  end
end
