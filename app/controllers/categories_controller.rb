class CategoriesController < ApplicationController
  def show
    @category = Category.find_by!(slug: params[:id])
    @products = @category.products.published

    return unless params[:sort].present?

    sorting = Product::SORTINGS[params[:sort]]

    @products = @products.order(sorting)
  end
end
