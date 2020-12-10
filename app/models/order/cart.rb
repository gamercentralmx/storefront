class Order::Cart
  attr_reader :order, :order_item, :out_of_stock_products

  def initialize(order)
    @order = order
    @out_of_stock_products = []
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

  def hold_items!
    order.order_items.each do |item|
      find_or_create_hold_for(item)
    end
  end

  def items_available?
    out_of_stock = order.order_items.select { |item| item.product.stock.zero? && item.stock_hold.blank? }

    return true if out_of_stock.empty?

    out_of_stock.each do |item|
      product = item.product
      delete! product
      out_of_stock_products << "<li>#{product.name}</li>"
    end

    false
  end

  private

  def find_or_create_hold_for(item)
    StockHold.find_or_create(
      order: order,
      order_item: item,
      product: item.product,
      qty: item.qty
    )
  end
end
