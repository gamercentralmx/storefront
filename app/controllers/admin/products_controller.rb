module Admin
  class ProductsController < BaseController
    before_action :find_product!, only: [:edit, :update, :destroy, :publish, :unpublish, :delete_picture]
    before_action :set_categories!, only: [:new, :edit]

    def index
      @products = Product.includes(:category).all.order(created_at: :desc)

      respond_to do |format|
        format.html
        format.json
      end
    end

    def create
      @category = Category.find(params[:product][:category_id])
      @product = Product.new(product_params)

      set_features

      if @product.save
        attach_pictures

        flash[:notice] = 'Se ha creado el producto de manera exitosa'
        render json: @product, status: :created
      else
        render json: @product.errors.full_messages, status: :unprocessable_entity
      end
    end

    def update
      @category = @product.category

      set_features

      respond_to do |format|
        if @product.update(product_params)
          attach_pictures

          format.html { redirect_to admin_products_path, notice: 'Producto actualizado con exito.' }
          format.json { render json: @product }
        else
          format.html { redirect_to admin_products_path, alert: 'Hubo un problema al actualizar el producto.' }
          format.json { render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @product.destroy

      redirect_to admin_products_path, notice: "El producto \"#{@product.name}\" ha sido eliminada"
    end

    def publish
      @product.publish!

      redirect_to admin_products_path, notice: "El producto \"#{@product.name}\" ha sido publicado con éxito"
    end

    def unpublish
      @product.unpublish!

      redirect_to admin_products_path, notice: "El producto \"#{@product.name}\" ha sido ocultado con éxito"
    end

    def delete_picture
      @picture = @product.pictures.find(params[:picture_id])

      @picture.purge

      respond_to do |format|
        format.html { redirect_to admin_product_path(@product.id), notice: 'La imagen ha sido borrada con exito' }
        format.json { render json: { message: 'La imagen ha sido borrada exitosamente' } }
      end
    end

    private

    def attach_pictures
      @product.attach_pictures(params[:product][:pictures_data]) if params[:product][:pictures_data].present?
      @product.attach_cover_picture(params[:product][:cover_picture]) if params[:product][:cover_picture].present?
    end

    def set_features
      @product.features = params[:product][:features] if params[:product][:features].present?
    end

    def find_product!
      @product = Product.find(params[:id])
    end

    def set_categories!
      @categories = Category.all
    end

    def product_params
      params.require(:product).permit(
        :name,
        :description,
        :price,
        :cost,
        :stock,
        :weight,
        :category_id,
        :features,
        :featured,
        metadata: @category.property_names
      )
    end
  end
end
