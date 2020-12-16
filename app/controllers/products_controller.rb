class ProductsController < ApplicationController
  def show
    @product = Product.published.find_by!(slug: params[:id])
    @related = Product::Related.new(@product).products
  end
end
