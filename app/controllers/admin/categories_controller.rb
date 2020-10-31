module Admin
  class CategoriesController < BaseController
    def index
      @categories = Category.all
    end

    def create
      @category = Category.new(category_params)

      if @category.save
        render json: @category, status: :created
      else
        rende json: @category.errors.full_messages, status: :unprocessable_entity
      end
    end

    def destroy
      @category = Category.find(params[:id])

      @category.destroy

      redirect_to admin_categories_path, notice: "La categoria \"#{@category.name}\" ha sido eliminada"
    end

    private

    def category_params
      params.require(:category).permit(:name, properties: %i[name type])
    end
  end
end
