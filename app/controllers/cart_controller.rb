class CartController < ApplicationController
  before_action :store_location!
  before_action :authenticate_user!
  before_action :find_current_order
  before_action :set_cart
  before_action :check_out_of_stock, only: [:index, :checkout]
  before_action :find_product, only: [:add, :subtract, :destroy]

  def index; end

  def add
    respond_to do |format|
      if @cart.perform :add!, @product, qty
        format.html { redirect_to cart_index_path, notice: 'Producto agregado al carrito con exito.' }
        format.json { render json: { message: 'Producto agregado al carrito con exito.' } }
      else
        format.html { redirect_to request.referrer, alert: 'El producto ya no se encuentra disponible.' }
        format.json { render json: { stock: @product.stock }, status: :unprocessable_entity }
      end
    end
  end

  def subtract
    @cart.perform :subtract!, @product, qty

    redirect_to cart_index_path, notice: 'Producto actualizado en el carrito con exito.'
  end

  def destroy
    @cart.perform :delete!, @product

    redirect_to cart_index_path, notice: 'Producto eliminado del carrito con exito.'
  end

  def checkout
    return redirect_to cart_index_path if @order.order_items.empty?

    @cart.hold_items!
  end

  private

  def check_out_of_stock
    return if @cart.items_available?

    @order.reload

    redirect_to cart_index_path, alert: <<-HTML
      Los siguientes productos en tu carrito ya no estan disponibles:

      <ul>
        #{@cart.out_of_stock_products.join("\n")}
      </ul>
    HTML
  end

  def set_cart
    @cart = Order::Cart.new(@order)
  end

  def store_location!
    return if user_signed_in?

    store_location_for(:user, request.url)
  end

  def find_product
    @product = Product.find(params[:product_id])
  end

  def find_current_order
    @order = current_user.orders.current
  end

  def qty
    params[:qty] || 1
  end
end
