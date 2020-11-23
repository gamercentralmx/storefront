class ProductsController < ApplicationController
  def show
    @product = Product.where(published: true).find_by!(slug: params[:id])
  end
end
