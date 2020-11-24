module Admin
  class ProductsController < BaseController
    def index
      @products = Product.includes(:category).all

      respond_to do |format|
        format.html
        format.json
      end
    end

    def new
      @categories = Category.all
    end

    def create
      @category = Category.find(params[:product][:category_id])
      @product = Product.new(product_params)

      @product.features = params[:product][:features]

      if @product.save
        @product.attach_pictures(params[:product][:pictures_data])
        flash[:notice] = 'Se ha creado el producto de manera exitosa'
        render json: @product, status: :created
      else
        render json: @product.errors.full_messages, status: :unprocessable_entity
      end
    end

    def destroy
      @product = Product.find(params[:id])

      @product.destroy

      redirect_to admin_products_path, notice: "El producto \"#{@product.name}\" ha sido eliminada"
    end

    def publish
      @product = Product.find(params[:id])

      @product.publish!

      redirect_to admin_products_path, notice: "El producto \"#{@product.name}\" ha sido publicado con éxito"
    end

    def unpublish
      @product = Product.find(params[:id])

      @product.unpublish!

      redirect_to admin_products_path, notice: "El producto \"#{@product.name}\" ha sido ocultado con éxito"
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
        :features,
        metadata: @category.property_names,
      )
    end
  end
end
