module Admin
  class OrdersController < BaseController
    def index
      @orders = Order.all.order(created_at: :desc)
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

    def update
      @order = Order.find(params[:id])

      respond_to do |format|
        if @order.update(order_params)
          format.html { redirect_to request.referer, notice: "Orden #{@order.id} actualizada con éxito" }
          format.json { render json: @order }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @order.errors.full_messages, status: :unprocessable_entity }
        end
      end
    end

    private

    def order_params
      params.require(:order).permit(:user_id, :status, order_items_attributes: %i[qty product_id])
    end
  end
end
