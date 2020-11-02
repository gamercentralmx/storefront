class OrdersController < ApplicationController
  def checkout
    @order = Order.find_by(uid: params[:id])
  end

  def update
    @order = Order.find_by(uid: params[:id])

    if @order.update(order_params)
      render json: @order
    else
      render json: @order.errors.full_errors, status: :unprocessable_entity
    end
  end

  private

  def order_params
    params.require(:order).permit(:status)
  end
end
