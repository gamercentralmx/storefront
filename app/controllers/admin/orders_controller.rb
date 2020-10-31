module Admin
  class OrdersController < BaseController
    def index
      @orders = Order.all
    end
  end
end
