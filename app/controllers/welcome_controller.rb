class WelcomeController < ApplicationController
  def index
    @featured = Product.featured
  end
end
