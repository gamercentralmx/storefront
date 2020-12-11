class Order::Cart
  attr_reader :order, :out_of_stock_products

  def initialize(order)
    @order = order
    @out_of_stock_products = []
  end

  def perform(method, product, *attrs)
    order_item = order.order_items.find_by(product_id: product.id)

    value = __send__(method, order_item, product, *attrs)

    order.calculate_shipping!

    value
  end

  def add!(order_item, product, qty = 1)
    return false if no_more_stock? product, order_item

    if order_item.present?
      order_item.add! qty
    else
      order_item = order.order_items.create(product_id: product.id, qty: qty)
      order_item.valid?
    end
  end

  def subtract!(order_item, _product, qty = 1)
    if order_item.qty > 1
      order_item.subtract! qty
    else
      order_item.destroy
    end
  end

  def delete!(order_item, _product)
    return if order_item.nil?

    order_item.destroy
  end

  def hold_items!
    order.order_items.each { |item| generate_product_hold! item }
  end

  def items_available?
    out_of_stock = order.order_items.select { |item| item_out_of_stock? item }

    return true if out_of_stock.empty?

    out_of_stock.each { |item| remove_item_from_cart! item }

    false
  end

  private

  def remove_item_from_cart!(item)
    product = item.product

    perform :delete!, product

    out_of_stock_products << "<li>#{product.name}</li>"
  end

  def item_out_of_stock?(item)
    item.product.stock.zero? && (item.stock_hold.blank? || item.stock_hold.expired?)
  end

  def no_more_stock?(product, order_item)
    product.stock.zero? or order_item&.qty == product.stock
  end

  def generate_product_hold!(item)
    StockHold.find_or_create(
      order: order,
      order_item: item,
      product: item.product,
      qty: item.qty
    )
  end
end
