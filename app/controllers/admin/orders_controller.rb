module Admin
  class OrdersController < BaseController
    def index
      @orders = Order.all
    end

    def new
      @order = Order.new
    end
  end
end
