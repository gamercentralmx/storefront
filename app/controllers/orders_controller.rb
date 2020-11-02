class OrdersController < ApplicationController
  before_action :authenticate_user!, only: [:show, :update]
  before_action :find_order!, only: [:show, :update]
  before_action :validate_owner, only: [:show, :update]

  def checkout
    @order = Order.find_by(uid: params[:id])

    redirect_to order_path(@order.uid) unless @order.pending?
    store_location_for(:user, checkout_order_path(@order.uid)) unless user_signed_in?
  end

  def update
    @order.user_id = current_user.id

    if @order.update(order_params)
      render json: @order
    else
      render json: @order.errors.full_errors, status: :unprocessable_entity
    end
  end

  private

  def find_order!
    @order = Order.find_by(uid: params[:id])
  end

  def validate_owner!
    return if user.is_admin? or owner?

    redirect_to root_path, alert: 'La pagina que intentas accessar no existe.'
  end

  def owner?
    @order.user_id.present? and @order.user_id == current_user.id
  end

  def order_params
    params.require(:order).permit(:status)
  end
end
