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
      @product = Product.new(product_params)

      if @product.save
        render json: @product, status: :created
      else
        render json: @product.errors.full_messages, status: :unprocessable_entity
      end
    end

    def destroy
      @product = Product.find(params[:id])

      @product.destroy

      redirect_to admin_products_path, notice: "La categoria \"#{@product.name}\" ha sido eliminada"
    end

    private

    def product_params
      params.require(:product).permit(
        :name,
        :description,
        :price,
        :cost,
        :stock,
        :category_id,
        metadata: @category.property_names)
    end
  end
end
