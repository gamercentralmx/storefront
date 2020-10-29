module Admin
  class BaseController < ApplicationController
    before_action :authenticate_user!
    before_action :validate_admin!

    layout 'admin'

    def validate_admin!
      return if current_user.is_admin?

      redirect_to root_path, alert: 'La pagina que estas buscando no existe'
    end
  end
end
