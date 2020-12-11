class Order::Shipping
  attr_reader :order, :total_weight, :cost

  SHIPPING_METHODS = {
    'estafeta' => 'ShippingMethod::Estafeta'
  }

  def initialize(order, shipping_method = 'estafeta')
    @order = order
    @total_weight = order.order_items.map(&:product_weight).sum
    @shipping_method = SHIPPING_METHODS[shipping_method].constantize.new(total_weight)
  end

  def calculate!
    @cost = @shipping_method.calculate_cost!
  end
end
