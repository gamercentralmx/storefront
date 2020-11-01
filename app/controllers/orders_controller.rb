class OrdersController < ApplicationController
  def checkout
    @order = Order.find_by(uid: params[:id])
  end
end
