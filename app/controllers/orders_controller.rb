class OrdersController < ApplicationController
  before_action :authenticate_user!, only: [:index, :show, :update, :confirm]
  before_action :find_order!, only: [:show, :update, :confirm]
  before_action :validate_owner!, only: [:show, :update, :confirm]

  def index
    @orders = current_user.orders.not_pending.created_desc
  end

  def checkout
    @order = Order.find_by(uid: params[:id])

    redirect_to order_path(@order.uid) unless @order.pending?
    store_location_for(:user, checkout_order_path(@order.uid)) unless user_signed_in?
  end

  def update
    @order.user_id = current_user.id

    if @order.update(order_params)
      @order.transition_to_paid! if order_params[:status] == 'paid'
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
    return if @order.user_id.nil?
    return if current_user.is_admin? || owner?

    redirect_to root_path, alert: 'La pagina que intentas accessar no existe.'
  end

  def owner?
    @order.user_id == current_user.id
  end

  def order_params
    params.require(:order).permit(:status, :payment_method_id, :payment_intent_id, :address_id, :invoice_info_id)
  end
end
