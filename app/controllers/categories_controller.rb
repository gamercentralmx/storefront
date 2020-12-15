class CategoriesController < ApplicationController
  def show
    @category = Category.find_by!(slug: params[:id])
    @products = @category.products.published
    @products = @products.search(params[:search]) if params[:search].present?

    @sorting = Product::SORTINGS['Menor Precio']
    @sorting = Product::SORTINGS[params[:sort]] if params[:sort].present?

    @products = @products.order(@sorting)
  end
end
