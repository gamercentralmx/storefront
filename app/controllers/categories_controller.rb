class CategoriesController < ApplicationController
  def show
    @category = Category.find_by!(slug: params[:id])
    @products = @category.products.published
    @sorting = Product::SORTINGS['Menor Precio']

    @sorting = Product::SORTINGS[params[:sort]] if params[:sort].present?
    @products = @products.order(@sorting)
  end
end
