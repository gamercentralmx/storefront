module Admin
  class ProductsController < BaseController
    def index
      @products = Product.all
    end

    def new
      @categories = Category.all
    end

    def create
      @category = Category.find(params[:product][:category_id])
      @products = Product.new(product_params)
    end

    private

    def product_params
      params.permit(:product).permit(:name, :description, metadata: @category.property_names)
    end
  end
end
