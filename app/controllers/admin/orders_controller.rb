module Admin
  class OrdersController < BaseController
    def index
      @orders = Order.all
    end

    def create
      @order = Order.new(order_params)

      if @order.save
        flash[:notice] = 'Se ha creado la orden de manera exitosa'
        render json: @order, status: :created
      else
        render json: @order.errors.full_messages, status: :unprocessable_entity
      end
    end

    private

    def order_params
      params.require(:order).permit(:user_id, order_items_attributes: %i[qty product_id])
    end
  end
end
