module Admin
  class CategoriesController < BaseController
    def index
      @categories = Category.all.by_order
    end

    def create
      @category = Category.new(category_params)

      if @category.save
        render json: @category, status: :created
      else
        rende json: @category.errors.full_messages, status: :unprocessable_entity
      end
    end

    def edit
      @category = Category.find(params[:id])
    end

    def update
      @category = Category.find(params[:id])

      respond_to do |format|
        if @category.update(category_params)
          format.html { redirect_to admin_categories_path, notice: 'Categoria actualizada con exito.' }
          format.json { render json: @category }
        else
          format.html { redirect_to admin_categories_path, alert: 'Hubo un problema al actualizar la categoria.' }
          format.json { render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity }
        end
      end
    end

    def destroy
      @category = Category.find(params[:id])

      @category.destroy

      redirect_to admin_categories_path, notice: "La categoria \"#{@category.name}\" ha sido eliminada"
    end

    private

    def category_params
      params.require(:category).permit(:name, :order, :visible, properties: %i[name type])
    end
  end
end
