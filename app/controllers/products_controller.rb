class ProductsController < ApplicationController
  def show
    @product = Product.published.find_by!(slug: params[:id])
  end
end
